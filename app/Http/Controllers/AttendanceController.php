<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    private function companyId(): int { return Auth::user()->company_id; }

    public function index(Request $request): Response
    {
        $date = $request->date ?? now()->toDateString();

        $employees = Employee::with(['department:id,name', 'designation:id,name'])
            ->where('company_id', $this->companyId())
            ->where('status', 'active')
            ->get();

        $attendances = Attendance::where('date', $date)
            ->whereIn('employee_id', $employees->pluck('id'))
            ->get()
            ->keyBy('employee_id');

        $daily = $employees->map(function ($emp) use ($attendances) {
            $att = $attendances->get($emp->id);
            return [
                'employee'   => $emp,
                'attendance' => $att,
                'status'     => $att?->status ?? 'not_marked',
            ];
        });

        $summary = [
            'present' => $attendances->where('status', 'present')->count(),
            'absent'  => $attendances->where('status', 'absent')->count(),
            'late'    => $attendances->where('status', 'late')->count(),
            'leave'   => $attendances->where('status', 'leave')->count(),
            'wfh'     => $attendances->where('status', 'work_from_home')->count(),
        ];

        return Inertia::render('Attendance/Index', [
            'daily'       => $daily,
            'summary'     => $summary,
            'date'        => $date,
            'departments' => Department::where('company_id', $this->companyId())->get(['id','name']),
        ]);
    }

    public function markAttendance(Request $request)
    {
        $data = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date'        => 'required|date',
            'status'      => 'required|in:present,absent,late,half_day,leave,work_from_home',
            'check_in'    => 'nullable|date_format:H:i',
            'check_out'   => 'nullable|date_format:H:i',
            'notes'       => 'nullable|string',
        ]);

        Attendance::updateOrCreate(
            ['employee_id' => $data['employee_id'], 'date' => $data['date']],
            array_merge($data, ['approved_by' => Auth::id()])
        );

        return back()->with('success', 'Attendance marked.');
    }

    public function update(Request $request, Attendance $attendance)
    {
        $attendance->update($request->validate([
            'status'    => 'required|in:present,absent,late,half_day,leave,work_from_home',
            'check_in'  => 'nullable',
            'check_out' => 'nullable',
            'notes'     => 'nullable|string',
        ]));
        return back()->with('success', 'Attendance updated.');
    }

    public function timesheets(Request $request): Response
    {
        $month = $request->month ?? now()->month;
        $year  = $request->year  ?? now()->year;

        $employees = Employee::with('department:id,name')
            ->where('company_id', $this->companyId())
            ->where('status', 'active')
            ->get(['id','first_name','last_name','department_id']);

        $attendances = Attendance::whereIn('employee_id', $employees->pluck('id'))
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->get()
            ->groupBy('employee_id');

        $summary = $employees->map(function ($emp) use ($attendances) {
            $records = $attendances->get($emp->id, collect());
            return [
                'employee'       => $emp,
                'present_days'   => $records->whereIn('status', ['present', 'late'])->count(),
                'absent_days'    => $records->where('status', 'absent')->count(),
                'late_days'      => $records->where('status', 'late')->count(),
                'leave_days'     => $records->where('status', 'leave')->count(),
                'wfh_days'       => $records->where('status', 'work_from_home')->count(),
                'total_hours'    => round($records->sum('worked_minutes') / 60, 1),
                'overtime_hours' => round($records->sum('overtime_minutes') / 60, 1),
            ];
        });

        return Inertia::render('Attendance/Timesheets', [
            'summary' => $summary,
            'month'   => $month,
            'year'    => $year,
        ]);
    }

    public function shifts(): Response
    {
        return Inertia::render('Attendance/Shifts', [
            'shifts'      => Shift::where('company_id', $this->companyId())->withCount('assignments')->get(),
            'employees'   => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
        ]);
    }

    public function storeShift(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string',
            'start_time'    => 'required',
            'end_time'      => 'required',
            'grace_period'  => 'nullable|integer',
            'break_duration'=> 'nullable|integer',
            'working_days'  => 'nullable|array',
            'color'         => 'nullable|string',
        ]);
        Shift::create(array_merge($data, ['company_id' => $this->companyId()]));
        return back()->with('success', 'Shift created.');
    }

    public function overtime(): Response
    {
        $overtime = Attendance::with('employee:id,first_name,last_name')
            ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))
            ->where('overtime_minutes', '>', 0)
            ->orderByDesc('date')
            ->paginate(20);

        return Inertia::render('Attendance/Overtime', ['overtime' => $overtime]);
    }
}
