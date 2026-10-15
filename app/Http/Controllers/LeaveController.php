<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{

    public function index(Request $request): Response
    {
        $query = LeaveRequest::with(['employee:id,first_name,last_name', 'leaveType:id,name,color', 'approvedBy:id,name'])
            ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()));

        if ($request->status) $query->where('status', $request->status);
        if ($request->employee_id) $query->where('employee_id', $request->employee_id);
        if ($request->leave_type_id) $query->where('leave_type_id', $request->leave_type_id);

        return Inertia::render('Leave/Index', [
            'requests'    => $query->orderByDesc('created_at')->paginate(15)->withQueryString(),
            'leaveTypes'  => LeaveType::where('company_id', $this->companyId())->where('is_active', true)->get(['id','name','color']),
            'employees'   => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
            'filters'     => $request->only(['status','employee_id','leave_type_id']),
            'summary'     => [
                'pending'  => LeaveRequest::whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->where('status','pending')->count(),
                'approved' => LeaveRequest::whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->where('status','approved')->count(),
                'rejected' => LeaveRequest::whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->where('status','rejected')->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employee_id'   => 'required|exists:employees,id',
            'leave_type_id' => 'required|exists:leave_types,id',
            'from_date'     => 'required|date',
            'to_date'       => 'required|date|after_or_equal:from_date',
            'day_type'      => 'in:full,half_morning,half_afternoon',
            'reason'        => 'nullable|string',
        ]);
        $data['days'] = $data['day_type'] !== 'full' ? 0.5 : (now()->parse($data['from_date'])->diffInDays($data['to_date']) + 1);
        LeaveRequest::create($data);
        return back()->with('success', 'Leave request submitted.');
    }

    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        $leaveRequest->update(['status' => 'approved', 'approved_by' => Auth::id(), 'approved_at' => now()]);
        // Update balance
        LeaveBalance::where(['employee_id' => $leaveRequest->employee_id, 'leave_type_id' => $leaveRequest->leave_type_id, 'year' => now()->year])
            ->increment('used', $leaveRequest->days);
        return back()->with('success', 'Leave approved.');
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        $leaveRequest->update(['status' => 'rejected', 'rejection_reason' => $request->reason, 'approved_by' => Auth::id()]);
        return back()->with('success', 'Leave rejected.');
    }

    public function calendar(): Response
    {
        $leaves = LeaveRequest::with(['employee:id,first_name,last_name', 'leaveType:id,name,color'])
            ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))
            ->whereIn('status', ['approved', 'pending'])
            ->whereYear('from_date', now()->year)
            ->get();

        return Inertia::render('Leave/Calendar', [
            'leaves'      => $leaves,
            'employees'   => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
            'departments' => \App\Models\Department::where('company_id', $this->companyId())->get(['id','name']),
        ]);
    }

    public function types(): Response
    {
        return Inertia::render('Leave/Types', [
            'leaveTypes' => LeaveType::where('company_id', $this->companyId())->get(),
        ]);
    }

    public function storeType(Request $request)
    {
        $data = $request->validate([
            'name'                => 'required|string',
            'code'                => 'required|string|max:20',
            'days_per_year'       => 'required|integer|min:0',
            'is_paid'             => 'boolean',
            'carry_forward'       => 'boolean',
            'max_carry_forward'   => 'nullable|integer',
            'applicable_gender'   => 'in:all,male,female',
            'available_in_probation' => 'boolean',
            'color'               => 'nullable|string',
        ]);
        LeaveType::create(array_merge($data, ['company_id' => $this->companyId()]));
        return back()->with('success', 'Leave type created.');
    }

    public function balances(Request $request): Response
    {
        $year = $request->year ?? now()->year;
        $balances = LeaveBalance::with(['employee:id,first_name,last_name', 'leaveType:id,name,color,code'])
            ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))
            ->where('year', $year)
            ->get();

        return Inertia::render('Leave/Balances', [
            'balances'   => $balances,
            'year'       => $year,
            'employees'  => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
            'leaveTypes' => LeaveType::where('company_id', $this->companyId())->get(['id','name','color']),
        ]);
    }
}
