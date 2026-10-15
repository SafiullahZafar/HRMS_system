<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\ExitInterview;
use App\Models\OffboardingTask;
use App\Models\Resignation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class OffboardingController extends Controller
{

    public function index(): Response
    {
        $resignations = Resignation::with(['employee:id,first_name,last_name', 'offboardingTasks', 'approvedBy:id,name'])
            ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))
            ->orderByDesc('resignation_date')
            ->paginate(15);

        return Inertia::render('Offboarding/Index', [
            'resignations' => $resignations,
            'employees'    => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
            'summary' => [
                'pending'  => Resignation::whereHas('employee', fn($q) => $q->where('company_id',$this->companyId()))->where('status','pending')->count(),
                'accepted' => Resignation::whereHas('employee', fn($q) => $q->where('company_id',$this->companyId()))->where('status','accepted')->count(),
            ],
        ]);
    }

    public function storeResignation(Request $request)
    {
        $data = $request->validate(['employee_id' => 'required|exists:employees,id', 'resignation_date' => 'required|date', 'last_working_day' => 'required|date|after:resignation_date', 'reason' => 'nullable|string', 'notice_period_days' => 'nullable|integer', 'type' => 'in:resignation,termination']);
        $resignation = Resignation::create($data);

        // Create default offboarding tasks
        $tasks = ['Resignation approved','Laptop returned','Access card returned','Accounts cleared','Final salary processed','Experience letter generated'];
        foreach ($tasks as $i => $task) {
            OffboardingTask::create(['employee_id' => $data['employee_id'], 'resignation_id' => $resignation->id, 'task' => $task, 'sort_order' => $i + 1]);
        }

        return back()->with('success', 'Resignation submitted.');
    }

    public function approveResignation(Request $request, Resignation $resignation)
    {
        $resignation->update(['status' => 'accepted', 'approved_by' => Auth::id(), 'approved_at' => now()]);
        $resignation->employee->update(['status' => 'resigned']);
        return back()->with('success', 'Resignation accepted.');
    }

    public function exitInterviews(): Response
    {
        return Inertia::render('Offboarding/ExitInterviews', [
            'interviews' => ExitInterview::with(['employee:id,first_name,last_name','conductedBy:id,name'])->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('interview_date')->paginate(15),
            'employees'  => Employee::where('company_id', $this->companyId())->whereIn('status',['resigned','terminated'])->get(['id','first_name','last_name']),
        ]);
    }

    public function storeExitInterview(Request $request)
    {
        $data = $request->validate(['employee_id' => 'required|exists:employees,id', 'reason_for_leaving' => 'nullable|string', 'work_environment_rating' => 'nullable|integer|between:1,5', 'compensation_rating' => 'nullable|integer|between:1,5', 'would_return' => 'nullable|boolean', 'comments' => 'nullable|string', 'interview_date' => 'required|date']);
        $data['conducted_by'] = Auth::id();
        ExitInterview::create($data);
        return back()->with('success', 'Exit interview recorded.');
    }
}
