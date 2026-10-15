<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Shift;
use App\Models\ShiftAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{

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

    public function bulkUpdate(Request $request)
    {
        $data = $request->validate([
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'required|integer|distinct|exists:employees,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,half_day,leave,work_from_home',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        $employees = Employee::where('company_id', $this->companyId())
            ->where('status', 'active')
            ->whereIn('id', $data['employee_ids'])
            ->get(['id']);

        if ($employees->count() !== count($data['employee_ids'])) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'employee_ids' => 'Select active employees from your company.',
            ]);
        }

        $attributes = [
            'status' => $data['status'],
            'check_in' => $data['status'] === 'absent' ? null : ($data['check_in'] ?? null),
            'check_out' => $data['status'] === 'absent' ? null : ($data['check_out'] ?? null),
            'notes' => $data['notes'] ?? null,
            'approved_by' => Auth::id(),
        ];

        DB::transaction(function () use ($employees, $data, $attributes) {
            foreach ($employees as $employee) {
                Attendance::updateOrCreate(
                    ['employee_id' => $employee->id, 'date' => $data['date']],
                    $attributes
                );
            }
        });

        return back()->with('success', 'Attendance updated for the selected employees.');
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
            'shifts'      => Shift::where('company_id', $this->companyId())
                ->withCount(['assignments as assignments_count' => fn ($query) => $query->whereNull('effective_to')->orWhereDate('effective_to', '>=', today())])
                ->with(['assignments' => fn ($query) => $query->whereNull('effective_to')->orWhereDate('effective_to', '>=', today())->with('employee:id,first_name,last_name')])
                ->get(),
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

    public function updateShift(Request $request, Shift $shift)
    {
        abort_unless($shift->company_id === $this->companyId(), 404);

        $shift->update($request->validate([
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'grace_period' => 'required|integer|min:0',
            'break_duration' => 'required|integer|min:0',
            'working_days' => 'required|array|min:1',
            'working_days.*' => 'required|integer|between:1,7',
            'color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ]));

        return back()->with('success', 'Shift updated.');
    }

    public function destroyShift(Shift $shift)
    {
        abort_unless($shift->company_id === $this->companyId(), 404);

        $shift->delete();

        return back()->with('success', 'Shift and its assignment records deleted.');
    }

    public function assignShift(Request $request, Shift $shift)
    {
        abort_unless($shift->company_id === $this->companyId(), 404);

        $data = $request->validate([
            'employee_ids' => 'required|array|min:1',
            'employee_ids.*' => 'required|integer|distinct|exists:employees,id',
            'effective_from' => 'required|date',
        ]);

        $employees = Employee::where('company_id', $this->companyId())
            ->where('status', 'active')
            ->whereIn('id', $data['employee_ids'])
            ->get();

        if ($employees->count() !== count($data['employee_ids'])) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'employee_ids' => 'Select active employees from your company.',
            ]);
        }

        foreach ($employees as $employee) {
            $currentAssignments = ShiftAssignment::where('employee_id', $employee->id)
                ->whereDate('effective_from', '<=', $data['effective_from'])
                ->where(fn ($query) => $query->whereNull('effective_to')->orWhereDate('effective_to', '>=', $data['effective_from']))
                ->get();

            if ($currentAssignments->contains('shift_id', $shift->id)) {
                continue;
            }

            foreach ($currentAssignments as $assignment) {
                $assignment->update(['effective_to' => \Illuminate\Support\Carbon::parse($data['effective_from'])->subDay()->toDateString()]);
            }

            ShiftAssignment::create([
                'employee_id' => $employee->id,
                'shift_id' => $shift->id,
                'effective_from' => $data['effective_from'],
            ]);
        }

        return back()->with('success', 'Shift assigned to the selected employees.');
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
