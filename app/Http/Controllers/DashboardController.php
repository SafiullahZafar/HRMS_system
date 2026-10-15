<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\JobOpening;
use App\Models\LeaveRequest;
use App\Models\PayrollRun;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index()
    {
        if (Auth::user()?->isSuperAdmin() && !session('current_company_id')) {
            return redirect()->route('super-admin.owners');
        }

        $companyId = $this->companyId();
        $today = now()->toDateString();

        $totalEmployees  = Employee::where('company_id', $companyId)->where('status', 'active')->count();
        $presentToday    = Attendance::whereHas('employee', fn($q) => $q->where('company_id', $companyId))->where('date', $today)->where('status', 'present')->count();
        $lateToday       = Attendance::whereHas('employee', fn($q) => $q->where('company_id', $companyId))->where('date', $today)->where('status', 'late')->count();
        $absentToday     = $totalEmployees - Attendance::whereHas('employee', fn($q) => $q->where('company_id', $companyId))->where('date', $today)->count();
        $onLeave         = Attendance::whereHas('employee', fn($q) => $q->where('company_id', $companyId))->where('date', $today)->where('status', 'leave')->count();
        $openPositions   = JobOpening::where('company_id', $companyId)->where('status', 'published')->count();
        $pendingLeaves   = LeaveRequest::whereHas('employee', fn($q) => $q->where('company_id', $companyId))->where('status', 'pending')->count();

        $latestPayroll = PayrollRun::where('company_id', $companyId)->latest()->first();
        $payrollThisMonth = $latestPayroll?->total_net ?? 0;

        // Attendance trend (last 7 days)
        $attendanceTrend = collect(range(6, 0))->map(function ($daysAgo) use ($companyId) {
            $date = now()->subDays($daysAgo);
            return [
                'date'    => $date->format('D'),
                'present' => Attendance::whereHas('employee', fn($q) => $q->where('company_id', $companyId))->where('date', $date->toDateString())->where('status', 'present')->count(),
                'absent'  => Attendance::whereHas('employee', fn($q) => $q->where('company_id', $companyId))->where('date', $date->toDateString())->where('status', 'absent')->count(),
                'late'    => Attendance::whereHas('employee', fn($q) => $q->where('company_id', $companyId))->where('date', $date->toDateString())->where('status', 'late')->count(),
            ];
        });

        // Employees by department
        $byDepartment = Employee::where('company_id', $companyId)
            ->where('status', 'active')
            ->with('department:id,name')
            ->get()
            ->groupBy('department.name')
            ->map(fn($g) => $g->count())
            ->map(fn($count, $name) => ['name' => $name ?? 'Unassigned', 'value' => $count])
            ->values();

        // Recent hires
        $recentHires = Employee::where('company_id', $companyId)
            ->with(['department:id,name', 'designation:id,name'])
            ->orderByDesc('joining_date')
            ->limit(5)
            ->get(['id','first_name','last_name','joining_date','department_id','designation_id','status']);

        // Pending leave requests
        $pendingLeaveRequests = LeaveRequest::with(['employee:id,first_name,last_name', 'leaveType:id,name,color'])
            ->whereHas('employee', fn($q) => $q->where('company_id', $companyId))
            ->where('status', 'pending')
            ->latest()
            ->limit(5)
            ->get();

        // Announcements
        $announcements = Announcement::where('company_id', $companyId)
            ->where('is_published', true)
            ->latest()
            ->limit(3)
            ->get(['id','title','content','priority','created_at']);

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalEmployees'  => $totalEmployees,
                'presentToday'    => $presentToday,
                'absentToday'     => max(0, $absentToday),
                'lateToday'       => $lateToday,
                'onLeave'         => $onLeave,
                'openPositions'   => $openPositions,
                'payrollThisMonth'=> $payrollThisMonth,
                'pendingRequests' => $pendingLeaves,
            ],
            'attendanceTrend'      => $attendanceTrend,
            'byDepartment'         => $byDepartment,
            'recentHires'          => $recentHires,
            'pendingLeaveRequests' => $pendingLeaveRequests,
            'announcements'        => $announcements,
        ]);
    }
}
