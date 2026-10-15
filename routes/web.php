<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\OffboardingController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PerformanceController;
use App\Http\Controllers\RecruitmentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SuperAdminController;
use Illuminate\Support\Facades\Route;

// Guest Authentication
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLogin'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
});

// Instant Demo Access (No credentials required)
Route::get('/demo', [LoginController::class, 'demo'])->name('demo');

// Logout (shared by both Owner and Demo sessions)
Route::post('/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth');

// Protected application routes
Route::middleware('auth')->group(function () {

    // ── Super Admin Section ─────────────────────────────────────
    Route::middleware('super-admin')->prefix('super-admin')->name('super-admin.')->group(function () {
        Route::get('/owners', [SuperAdminController::class, 'owners'])->name('owners');
        Route::post('/owners', [SuperAdminController::class, 'storeOwner'])->name('owners.store');
        Route::put('/owners/{user}', [SuperAdminController::class, 'updateOwner'])->name('owners.update');
        Route::delete('/owners/{user}', [SuperAdminController::class, 'destroyOwner'])->name('owners.destroy');
        Route::post('/switch-workspace/{company}', [SuperAdminController::class, 'switchWorkspace'])->name('switch-workspace');
        Route::post('/reset-workspace', [SuperAdminController::class, 'resetWorkspace'])->name('reset-workspace');
        Route::get('/demo-logs', [SuperAdminController::class, 'demoLogs'])->name('demo-logs');
        Route::delete('/demo-logs/clear', [SuperAdminController::class, 'clearDemoLogs'])->name('demo-logs.clear');
    });

    // ── Dashboard ───────────────────────────────────────────────
    Route::middleware('module-access:dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    });

    // ── Employees ───────────────────────────────────────────────
    Route::middleware('module-access:employees')->group(function () {
        Route::resource('employees', EmployeeController::class);
        Route::get('employees/{employee}/profile', [EmployeeController::class, 'profile'])->name('employees.profile');
        Route::get('departments', [EmployeeController::class, 'departments'])->name('departments.index');
        Route::post('departments', [EmployeeController::class, 'storeDepartment'])->name('departments.store');
        Route::put('departments/{department}', [EmployeeController::class, 'updateDepartment'])->name('departments.update');
        Route::delete('departments/{department}', [EmployeeController::class, 'destroyDepartment'])->name('departments.destroy');
        Route::get('designations', [EmployeeController::class, 'designations'])->name('designations.index');
        Route::post('designations', [EmployeeController::class, 'storeDesignation'])->name('designations.store');
        Route::get('org-chart', [EmployeeController::class, 'orgChart'])->name('org-chart');
    });

    // ── Attendance ──────────────────────────────────────────────
    Route::middleware('module-access:attendance')->group(function () {
        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::get('attendance/timesheets', [AttendanceController::class, 'timesheets'])->name('attendance.timesheets');
        Route::get('attendance/shifts', [AttendanceController::class, 'shifts'])->name('attendance.shifts');
        Route::post('attendance/shifts', [AttendanceController::class, 'storeShift'])->name('attendance.shifts.store');
        Route::put('attendance/shifts/{shift}', [AttendanceController::class, 'updateShift'])->name('attendance.shifts.update');
        Route::delete('attendance/shifts/{shift}', [AttendanceController::class, 'destroyShift'])->name('attendance.shifts.destroy');
        Route::post('attendance/shifts/{shift}/assign', [AttendanceController::class, 'assignShift'])->name('attendance.shifts.assign');
        Route::get('attendance/overtime', [AttendanceController::class, 'overtime'])->name('attendance.overtime');
        Route::post('attendance/mark', [AttendanceController::class, 'markAttendance'])->name('attendance.mark');
        Route::post('attendance/bulk', [AttendanceController::class, 'bulkUpdate'])->name('attendance.bulk');
        Route::put('attendance/{attendance}', [AttendanceController::class, 'update'])->name('attendance.update');
    });

    // ── Leave ───────────────────────────────────────────────────
    Route::middleware('module-access:leave')->group(function () {
        Route::get('leave', [LeaveController::class, 'index'])->name('leave.index');
        Route::get('leave/calendar', [LeaveController::class, 'calendar'])->name('leave.calendar');
        Route::get('leave/types', [LeaveController::class, 'types'])->name('leave.types');
        Route::post('leave/types', [LeaveController::class, 'storeType'])->name('leave.types.store');
        Route::get('leave/balances', [LeaveController::class, 'balances'])->name('leave.balances');
        Route::post('leave', [LeaveController::class, 'store'])->name('leave.store');
        Route::put('leave/{leaveRequest}/approve', [LeaveController::class, 'approve'])->name('leave.approve');
        Route::put('leave/{leaveRequest}/reject', [LeaveController::class, 'reject'])->name('leave.reject');
    });

    // ── Payroll ─────────────────────────────────────────────────
    Route::middleware('module-access:payroll')->group(function () {
        Route::get('payroll', [PayrollController::class, 'index'])->name('payroll.index');
        Route::get('payroll/salaries', [PayrollController::class, 'salaries'])->name('payroll.salaries');
        Route::get('payroll/components', [PayrollController::class, 'components'])->name('payroll.components');
        Route::get('payroll/loans', [PayrollController::class, 'loans'])->name('payroll.loans');
        Route::post('payroll/loans', [PayrollController::class, 'storeLoan'])->name('payroll.loans.store');
        Route::put('payroll/loans/{loan}/approve', [PayrollController::class, 'approveLoan'])->name('payroll.loans.approve');
        Route::get('payroll/payslips', [PayrollController::class, 'payslips'])->name('payroll.payslips');
        Route::post('payroll/run', [PayrollController::class, 'runPayroll'])->name('payroll.run');
        Route::put('payroll/{payrollRun}/approve', [PayrollController::class, 'approvePayroll'])->name('payroll.approve');
        Route::get('payroll/{payrollRun}', [PayrollController::class, 'show'])->name('payroll.show');
    });

    // ── Recruitment ─────────────────────────────────────────────
    Route::middleware('module-access:recruitment')->group(function () {
        Route::get('recruitment/jobs', [RecruitmentController::class, 'jobs'])->name('recruitment.jobs');
        Route::post('recruitment/jobs', [RecruitmentController::class, 'storeJob'])->name('recruitment.jobs.store');
        Route::put('recruitment/jobs/{job}', [RecruitmentController::class, 'updateJob'])->name('recruitment.jobs.update');
        Route::get('recruitment/candidates', [RecruitmentController::class, 'candidates'])->name('recruitment.candidates');
        Route::post('recruitment/candidates', [RecruitmentController::class, 'storeCandidate'])->name('recruitment.candidates.store');
        Route::put('recruitment/candidates/{candidate}/stage', [RecruitmentController::class, 'updateStage'])->name('recruitment.candidates.stage');
        Route::get('recruitment/interviews', [RecruitmentController::class, 'interviews'])->name('recruitment.interviews');
        Route::post('recruitment/interviews', [RecruitmentController::class, 'storeInterview'])->name('recruitment.interviews.store');
        Route::get('recruitment/offers', [RecruitmentController::class, 'offers'])->name('recruitment.offers');
        Route::post('recruitment/offers', [RecruitmentController::class, 'storeOffer'])->name('recruitment.offers.store');
        Route::get('recruitment/onboarding', [RecruitmentController::class, 'onboarding'])->name('recruitment.onboarding');
        Route::put('recruitment/onboarding/{task}/complete', [RecruitmentController::class, 'completeTask'])->name('recruitment.onboarding.complete');
    });

    // ── Performance ─────────────────────────────────────────────
    Route::middleware('module-access:performance')->group(function () {
        Route::get('performance', [PerformanceController::class, 'index'])->name('performance.index');
        Route::get('performance/goals', [PerformanceController::class, 'goals'])->name('performance.goals');
        Route::post('performance/goals', [PerformanceController::class, 'storeGoal'])->name('performance.goals.store');
        Route::put('performance/goals/{goal}', [PerformanceController::class, 'updateGoal'])->name('performance.goals.update');
        Route::get('performance/reviews', [PerformanceController::class, 'reviews'])->name('performance.reviews');
        Route::post('performance/reviews', [PerformanceController::class, 'storeReview'])->name('performance.reviews.store');
        Route::get('performance/promotions', [PerformanceController::class, 'promotions'])->name('performance.promotions');
        Route::post('performance/promotions', [PerformanceController::class, 'storePromotion'])->name('performance.promotions.store');
        Route::get('performance/warnings', [PerformanceController::class, 'warnings'])->name('performance.warnings');
        Route::post('performance/warnings', [PerformanceController::class, 'storeWarning'])->name('performance.warnings.store');
    });

    // ── Assets ──────────────────────────────────────────────────
    Route::middleware('module-access:assets')->group(function () {
        Route::resource('assets', AssetController::class);
        Route::post('assets/{asset}/assign', [AssetController::class, 'assign'])->name('assets.assign');
        Route::post('assets/{asset}/return', [AssetController::class, 'returnAsset'])->name('assets.return');
    });

    // ── Documents ───────────────────────────────────────────────
    Route::middleware('module-access:documents')->group(function () {
        Route::resource('documents', DocumentController::class)->only(['index', 'store', 'destroy']);
    });

    // ── Offboarding ─────────────────────────────────────────────
    Route::middleware('module-access:offboarding')->group(function () {
        Route::get('offboarding', [OffboardingController::class, 'index'])->name('offboarding.index');
        Route::post('offboarding/resignations', [OffboardingController::class, 'storeResignation'])->name('offboarding.resignations.store');
        Route::put('offboarding/resignations/{resignation}/approve', [OffboardingController::class, 'approveResignation'])->name('offboarding.resignations.approve');
        Route::get('offboarding/exit-interviews', [OffboardingController::class, 'exitInterviews'])->name('offboarding.exit-interviews');
        Route::post('offboarding/exit-interviews', [OffboardingController::class, 'storeExitInterview'])->name('offboarding.exit-interviews.store');
    });

    // ── Reports ─────────────────────────────────────────────────
    Route::middleware('module-access:reports')->group(function () {
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/attendance', [ReportController::class, 'attendance'])->name('reports.attendance');
        Route::get('reports/leave', [ReportController::class, 'leave'])->name('reports.leave');
        Route::get('reports/payroll', [ReportController::class, 'payroll'])->name('reports.payroll');
        Route::get('reports/employees', [ReportController::class, 'employees'])->name('reports.employees');
    });

    // ── Announcements ───────────────────────────────────────────
    Route::middleware('module-access:announcements')->group(function () {
        Route::resource('announcements', AnnouncementController::class)->only(['index', 'store', 'update', 'destroy']);
    });

    // ── Settings ────────────────────────────────────────────────
    Route::middleware('module-access:settings')->group(function () {
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('settings/company', [SettingController::class, 'updateCompany'])->name('settings.company');
        Route::get('settings/roles', [SettingController::class, 'roles'])->name('settings.roles');
    });
});
