<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\PayrollRun;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    private function companyId(): int { return Auth::user()->company_id; }

    public function index(): Response
    {
        return Inertia::render('Reports/Index', [
            'overview' => [
                'totalEmployees'  => Employee::where('company_id', $this->companyId())->where('status','active')->count(),
                'newHiresThisYear'=> Employee::where('company_id', $this->companyId())->whereYear('joining_date', now()->year)->count(),
                'resignedThisYear'=> Employee::where('company_id', $this->companyId())->where('status','resigned')->whereYear('updated_at', now()->year)->count(),
                'payrollTotal'    => PayrollRun::where('company_id', $this->companyId())->whereYear('created_at', now()->year)->sum('total_net'),
            ],
        ]);
    }

    public function attendance(Request $request): Response
    {
        $month = $request->month ?? now()->month;
        $year  = $request->year  ?? now()->year;

        $employees = Employee::where('company_id', $this->companyId())->where('status','active')->with('department:id,name')->get(['id','first_name','last_name','department_id']);
        $records   = Attendance::whereIn('employee_id', $employees->pluck('id'))->whereMonth('date', $month)->whereYear('date', $year)->get();

        $report = $employees->map(function ($emp) use ($records) {
            $empRecords = $records->where('employee_id', $emp->id);
            return [
                'employee'     => $emp,
                'present'      => $empRecords->whereIn('status',['present','late'])->count(),
                'absent'       => $empRecords->where('status','absent')->count(),
                'late'         => $empRecords->where('status','late')->count(),
                'leaves'       => $empRecords->where('status','leave')->count(),
                'total_hours'  => round($empRecords->sum('worked_minutes') / 60, 1),
                'overtime'     => round($empRecords->sum('overtime_minutes') / 60, 1),
            ];
        });

        return Inertia::render('Reports/Attendance', ['report' => $report, 'month' => $month, 'year' => $year]);
    }

    public function leave(Request $request): Response
    {
        $year = $request->year ?? now()->year;
        $data = LeaveRequest::with(['employee:id,first_name,last_name','leaveType:id,name'])
            ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))
            ->whereYear('from_date', $year)
            ->get();

        return Inertia::render('Reports/Leave', ['data' => $data, 'year' => $year]);
    }

    public function payroll(Request $request): Response
    {
        $year = $request->year ?? now()->year;
        $runs = PayrollRun::where('company_id', $this->companyId())->whereYear('created_at', $year)->with('items.employee:id,first_name,last_name')->orderBy('month')->get();
        return Inertia::render('Reports/Payroll', ['runs' => $runs, 'year' => $year]);
    }

    public function employees(): Response
    {
        $data = Employee::with(['department:id,name','designation:id,name','branch:id,name'])
            ->where('company_id', $this->companyId())
            ->orderByDesc('joining_date')
            ->get();

        return Inertia::render('Reports/Employees', ['employees' => $data]);
    }
}
