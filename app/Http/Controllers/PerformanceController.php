<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Goal;
use App\Models\PerformanceReview;
use App\Models\Promotion;
use App\Models\Designation;
use App\Models\Department;
use App\Models\Warning;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceController extends Controller
{
    private function companyId(): int { return Auth::user()->company_id; }

    public function index(): Response
    {
        return Inertia::render('Performance/Index', [
            'reviews'    => PerformanceReview::with('employee:id,first_name,last_name')->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('created_at')->limit(10)->get(),
            'promotions' => Promotion::with(['employee:id,first_name,last_name', 'toDesignation:id,name'])->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('effective_date')->limit(5)->get(),
            'warnings'   => Warning::with('employee:id,first_name,last_name')->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('created_at')->limit(5)->get(),
        ]);
    }

    public function reviews(): Response
    {
        return Inertia::render('Performance/Reviews', [
            'reviews'   => PerformanceReview::with(['employee:id,first_name,last_name', 'reviewer:id,name'])->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('created_at')->paginate(15),
            'employees' => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
        ]);
    }

    public function storeReview(Request $request)
    {
        $data = $request->validate([
            'employee_id'          => 'required|exists:employees,id',
            'period'               => 'required|in:monthly,quarterly,annual',
            'review_year'          => 'required|integer',
            'quality_score'        => 'nullable|integer|between:1,5',
            'productivity_score'   => 'nullable|integer|between:1,5',
            'communication_score'  => 'nullable|integer|between:1,5',
            'teamwork_score'       => 'nullable|integer|between:1,5',
            'attendance_score'     => 'nullable|integer|between:1,5',
            'technical_score'      => 'nullable|integer|between:1,5',
            'strengths'            => 'nullable|string',
            'improvements'         => 'nullable|string',
            'manager_comments'     => 'nullable|string',
        ]);

        $scores = collect($data)->only(['quality_score','productivity_score','communication_score','teamwork_score','attendance_score','technical_score'])->filter()->values();
        $data['overall_rating'] = $scores->isNotEmpty() ? round($scores->avg(), 1) : null;
        $data['reviewer_id'] = Auth::id();

        PerformanceReview::create($data);
        return back()->with('success', 'Review submitted.');
    }

    public function goals(): Response
    {
        return Inertia::render('Performance/Goals', [
            'goals'     => Goal::with('employee:id,first_name,last_name')->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('created_at')->paginate(15),
            'employees' => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
        ]);
    }

    public function storeGoal(Request $request)
    {
        $data = $request->validate(['employee_id' => 'required|exists:employees,id', 'title' => 'required|string', 'target' => 'nullable|numeric', 'unit' => 'nullable|string', 'due_date' => 'nullable|date', 'description' => 'nullable|string']);
        $data['year'] = now()->year;
        Goal::create($data);
        return back()->with('success', 'Goal added.');
    }

    public function updateGoal(Request $request, Goal $goal)
    {
        $goal->update($request->validate(['achieved' => 'required|numeric', 'status' => 'nullable|in:active,completed,cancelled']));
        return back()->with('success', 'Goal updated.');
    }

    public function promotions(): Response
    {
        return Inertia::render('Performance/Promotions', [
            'promotions'   => Promotion::with(['employee:id,first_name,last_name','fromDesignation:id,name','toDesignation:id,name','fromDepartment:id,name','toDepartment:id,name'])->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('effective_date')->paginate(15),
            'employees'    => Employee::with(['designation:id,name','department:id,name'])->where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name','designation_id','department_id','basic_salary']),
            'designations' => Designation::where('company_id', $this->companyId())->get(['id','name']),
            'departments'  => Department::where('company_id', $this->companyId())->get(['id','name']),
        ]);
    }

    public function storePromotion(Request $request)
    {
        $data = $request->validate(['employee_id' => 'required|exists:employees,id', 'to_designation_id' => 'nullable|exists:designations,id', 'to_department_id' => 'nullable|exists:departments,id', 'from_salary' => 'required|numeric', 'to_salary' => 'required|numeric', 'effective_date' => 'required|date', 'type' => 'required|in:promotion,increment,transfer', 'reason' => 'nullable|string']);

        $employee = Employee::find($data['employee_id']);
        $data['from_designation_id'] = $employee->designation_id;
        $data['from_department_id']  = $employee->department_id;
        $data['approved_by'] = Auth::id();

        Promotion::create($data);
        $employee->update(['designation_id' => $data['to_designation_id'] ?? $employee->designation_id, 'department_id' => $data['to_department_id'] ?? $employee->department_id, 'basic_salary' => $data['to_salary']]);

        return back()->with('success', 'Promotion recorded.');
    }

    public function warnings(): Response
    {
        return Inertia::render('Performance/Warnings', [
            'warnings'  => Warning::with(['employee:id,first_name,last_name','issuedBy:id,name'])->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('issue_date')->paginate(15),
            'employees' => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
        ]);
    }

    public function storeWarning(Request $request)
    {
        $data = $request->validate(['employee_id' => 'required|exists:employees,id', 'type' => 'required|in:verbal,written,show_cause,suspension,final', 'subject' => 'required|string', 'description' => 'required|string', 'issue_date' => 'required|date']);
        $data['issued_by'] = Auth::id();
        Warning::create($data);
        return back()->with('success', 'Warning issued.');
    }
}
