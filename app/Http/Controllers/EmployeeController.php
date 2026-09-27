<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftAssignment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    private function companyId(): int { return Auth::user()->company_id; }

    public function index(Request $request): Response
    {
        $query = Employee::with(['department:id,name', 'designation:id,name', 'branch:id,name'])
            ->where('company_id', $this->companyId());

        if ($request->search) {
            $query->where(fn($q) => $q->where('first_name', 'like', "%{$request->search}%")
                ->orWhere('last_name', 'like', "%{$request->search}%")
                ->orWhere('employee_id', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"));
        }
        if ($request->department) $query->where('department_id', $request->department);
        if ($request->status) $query->where('status', $request->status);

        return Inertia::render('Employees/Index', [
            'employees'    => $query->orderByDesc('created_at')->paginate(15)->withQueryString(),
            'departments'  => Department::where('company_id', $this->companyId())->get(['id','name']),
            'filters'      => $request->only(['search','department','status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Employees/Create', [
            'departments'  => Department::where('company_id', $this->companyId())->get(['id','name']),
            'designations' => Designation::where('company_id', $this->companyId())->get(['id','name','department_id']),
            'branches'     => Branch::where('company_id', $this->companyId())->get(['id','name']),
            'shifts'       => Shift::where('company_id', $this->companyId())->where('is_active', true)->get(['id','name']),
            'managers'     => Employee::where('company_id', $this->companyId())->where('status', 'active')->get(['id','first_name','last_name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name'      => 'required|string|max:100',
            'last_name'       => 'required|string|max:100',
            'email'           => 'required|email|unique:employees,email',
            'phone'           => 'nullable|string|max:30',
            'gender'          => 'required|in:male,female,other',
            'department_id'   => 'required|exists:departments,id',
            'designation_id'  => 'nullable|exists:designations,id',
            'branch_id'       => 'nullable|exists:branches,id',
            'joining_date'    => 'required|date',
            'employment_type' => 'required',
            'basic_salary'    => 'required|numeric|min:0',
            'shift_id'        => 'nullable|exists:shifts,id',
        ]);

        // Generate employee ID
        $last = Employee::where('company_id', $this->companyId())->orderByDesc('id')->first();
        $nextNum = $last ? (intval(substr($last->employee_id, 4)) + 1) : 1;
        $empId = 'EMP-' . str_pad($nextNum, 5, '0', STR_PAD_LEFT);

        // Create user account
        $user = User::create([
            'name'       => $data['first_name'] . ' ' . $data['last_name'],
            'email'      => $data['email'],
            'password'   => Hash::make('password123'),
            'role'       => 'employee',
            'company_id' => $this->companyId(),
        ]);

        $employee = Employee::create(array_merge($data, [
            'employee_id' => $empId,
            'user_id'     => $user->id,
            'company_id'  => $this->companyId(),
        ]));

        if ($request->shift_id) {
            ShiftAssignment::create([
                'employee_id'    => $employee->id,
                'shift_id'       => $request->shift_id,
                'effective_from' => $employee->joining_date,
            ]);
        }

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee): Response
    {
        return $this->profile($employee);
    }

    public function profile(Employee $employee): Response
    {
        $employee->load([
            'department', 'designation', 'branch', 'manager',
            'attendances' => fn($q) => $q->latest()->limit(30),
            'leaveRequests.leaveType',
            'leaveBalances.leaveType',
            'payrollItems.payrollRun',
            'performanceReviews',
            'goals',
            'warnings',
            'promotions.fromDesignation', 'promotions.toDesignation',
            'documents',
            'assetAssignments.asset',
            'certifications',
            'onboardingTasks',
        ]);

        return Inertia::render('Employees/Profile', [
            'employee'     => $employee,
            'departments'  => Department::where('company_id', $this->companyId())->get(['id','name']),
            'designations' => Designation::where('company_id', $this->companyId())->get(['id','name']),
        ]);
    }

    public function edit(Employee $employee): Response
    {
        return Inertia::render('Employees/Edit', [
            'employee'     => $employee->load(['department', 'designation', 'branch']),
            'departments'  => Department::where('company_id', $this->companyId())->get(['id','name']),
            'designations' => Designation::where('company_id', $this->companyId())->get(['id','name','department_id']),
            'branches'     => Branch::where('company_id', $this->companyId())->get(['id','name']),
            'shifts'       => Shift::where('company_id', $this->companyId())->get(['id','name']),
            'managers'     => Employee::where('company_id', $this->companyId())->where('id', '!=', $employee->id)->get(['id','first_name','last_name']),
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $data = $request->validate([
            'first_name'     => 'required|string|max:100',
            'last_name'      => 'required|string|max:100',
            'phone'          => 'nullable|string',
            'department_id'  => 'nullable|exists:departments,id',
            'designation_id' => 'nullable|exists:designations,id',
            'basic_salary'   => 'nullable|numeric|min:0',
            'status'         => 'in:active,inactive,on_leave,terminated,resigned',
        ]);
        $employee->update($data);
        return back()->with('success', 'Employee updated.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect()->route('employees.index')->with('success', 'Employee archived.');
    }

    public function departments(): Response
    {
        return Inertia::render('Employees/Departments', [
            'departments'  => Department::with(['branch:id,name', 'manager:id,first_name,last_name'])
                ->withCount('employees')
                ->where('company_id', $this->companyId())
                ->get(),
            'branches'     => Branch::where('company_id', $this->companyId())->get(['id','name']),
            'managers'     => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
        ]);
    }

    public function storeDepartment(Request $request)
    {
        $data = $request->validate(['name' => 'required|string', 'code' => 'nullable|string', 'branch_id' => 'nullable|exists:branches,id', 'description' => 'nullable|string']);
        Department::create(array_merge($data, ['company_id' => $this->companyId()]));
        return back()->with('success', 'Department created.');
    }

    public function updateDepartment(Request $request, Department $department)
    {
        $department->update($request->validate(['name' => 'required|string', 'code' => 'nullable|string', 'manager_id' => 'nullable|exists:employees,id']));
        return back()->with('success', 'Department updated.');
    }

    public function destroyDepartment(Department $department)
    {
        $department->delete();
        return back()->with('success', 'Department deleted.');
    }

    public function designations(): Response
    {
        return Inertia::render('Employees/Designations', [
            'designations' => Designation::with('department:id,name')->withCount('employees')->where('company_id', $this->companyId())->get(),
            'departments'  => Department::where('company_id', $this->companyId())->get(['id','name']),
        ]);
    }

    public function storeDesignation(Request $request)
    {
        $data = $request->validate(['name' => 'required|string', 'department_id' => 'nullable|exists:departments,id', 'level' => 'nullable|string']);
        Designation::create(array_merge($data, ['company_id' => $this->companyId()]));
        return back()->with('success', 'Designation created.');
    }

    public function orgChart(): Response
    {
        $employees = Employee::with(['department:id,name', 'designation:id,name', 'manager:id,first_name,last_name'])
            ->where('company_id', $this->companyId())
            ->where('status', 'active')
            ->get(['id','first_name','last_name','manager_id','department_id','designation_id','photo']);

        return Inertia::render('Employees/OrgChart', ['employees' => $employees]);
    }
}
