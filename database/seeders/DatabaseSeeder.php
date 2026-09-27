<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Asset;
use App\Models\AssetAssignment;
use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Candidate;
use App\Models\Certification;
use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\Expense;
use App\Models\Goal;
use App\Models\Interview;
use App\Models\JobOpening;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Loan;
use App\Models\OfferLetter;
use App\Models\OnboardingTask;
use App\Models\PayrollItem;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\PerformanceReview;
use App\Models\Promotion;
use App\Models\Resignation;
use App\Models\SalaryComponent;
use App\Models\SalaryStructure;
use App\Models\Shift;
use App\Models\ShiftAssignment;
use App\Models\Training;
use App\Models\User;
use App\Models\Warning;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Company & Structure ──────────────────────────────
        $company = Company::create([
            'name'     => 'Pixra Softtech Pvt Ltd',
            'email'    => 'info@pixrasofttech.com',
            'phone'    => '+92-42-35123456',
            'address'  => '14-B, Gulberg III, Lahore, Pakistan',
            'currency' => 'PKR',
            'timezone' => 'Asia/Karachi',
            'website'  => 'https://pixrasofttech.com',
            'industry' => 'Information Technology',
        ]);

        $lahoreBranch = Branch::create(['company_id' => $company->id, 'name' => 'Lahore HQ', 'city' => 'Lahore', 'address' => '14-B Gulberg III, Lahore', 'phone' => '+92-42-35123456']);
        $islandBranch = Branch::create(['company_id' => $company->id, 'name' => 'Islamabad Branch', 'city' => 'Islamabad', 'address' => 'Blue Area, Islamabad']);

        // Departments
        $devDept   = Department::create(['company_id' => $company->id, 'branch_id' => $lahoreBranch->id, 'name' => 'Development', 'code' => 'DEV']);
        $designDept= Department::create(['company_id' => $company->id, 'branch_id' => $lahoreBranch->id, 'name' => 'Design', 'code' => 'DES']);
        $mktDept   = Department::create(['company_id' => $company->id, 'branch_id' => $lahoreBranch->id, 'name' => 'Marketing', 'code' => 'MKT']);
        $hrDept    = Department::create(['company_id' => $company->id, 'branch_id' => $lahoreBranch->id, 'name' => 'Human Resources', 'code' => 'HR']);
        $finDept   = Department::create(['company_id' => $company->id, 'branch_id' => $lahoreBranch->id, 'name' => 'Finance', 'code' => 'FIN']);

        // Designations
        $cto     = Designation::create(['company_id' => $company->id, 'department_id' => $devDept->id,   'name' => 'Chief Technology Officer', 'level' => 'executive']);
        $senDev  = Designation::create(['company_id' => $company->id, 'department_id' => $devDept->id,   'name' => 'Senior Developer', 'level' => 'senior']);
        $fsDev   = Designation::create(['company_id' => $company->id, 'department_id' => $devDept->id,   'name' => 'Full Stack Developer', 'level' => 'mid']);
        $junDev  = Designation::create(['company_id' => $company->id, 'department_id' => $devDept->id,   'name' => 'Junior Developer', 'level' => 'junior']);
        $uiux    = Designation::create(['company_id' => $company->id, 'department_id' => $designDept->id,'name' => 'UI/UX Designer', 'level' => 'mid']);
        $hrMgr   = Designation::create(['company_id' => $company->id, 'department_id' => $hrDept->id,    'name' => 'HR Manager', 'level' => 'manager']);
        $mktMgr  = Designation::create(['company_id' => $company->id, 'department_id' => $mktDept->id,   'name' => 'Marketing Manager', 'level' => 'manager']);
        $finMgr  = Designation::create(['company_id' => $company->id, 'department_id' => $finDept->id,   'name' => 'Finance Manager', 'level' => 'manager']);

        // Shifts
        $morning = Shift::create(['company_id' => $company->id, 'name' => 'Morning', 'start_time' => '09:00', 'end_time' => '18:00', 'grace_period' => 15, 'break_duration' => 60, 'working_days' => [1,2,3,4,5], 'color' => '#4F46E5']);
        $evening = Shift::create(['company_id' => $company->id, 'name' => 'Evening', 'start_time' => '14:00', 'end_time' => '23:00', 'grace_period' => 10, 'break_duration' => 60, 'working_days' => [1,2,3,4,5], 'color' => '#7C3AED']);
        $night   = Shift::create(['company_id' => $company->id, 'name' => 'Night',   'start_time' => '22:00', 'end_time' => '07:00', 'grace_period' => 10, 'break_duration' => 60, 'is_night_shift' => true, 'working_days' => [1,2,3,4,5], 'color' => '#1D4ED8']);

        // Leave Types
        $annual   = LeaveType::create(['company_id' => $company->id, 'name' => 'Annual Leave',    'code' => 'AL', 'days_per_year' => 20, 'is_paid' => true,  'carry_forward' => true, 'max_carry_forward' => 5,  'color' => '#4F46E5']);
        $casual   = LeaveType::create(['company_id' => $company->id, 'name' => 'Casual Leave',    'code' => 'CL', 'days_per_year' => 10, 'is_paid' => true,  'carry_forward' => false,'color' => '#0891B2']);
        $sick     = LeaveType::create(['company_id' => $company->id, 'name' => 'Sick Leave',      'code' => 'SL', 'days_per_year' => 10, 'is_paid' => true,  'requires_document' => true, 'color' => '#DC2626']);
        $maternity= LeaveType::create(['company_id' => $company->id, 'name' => 'Maternity Leave', 'code' => 'ML', 'days_per_year' => 90, 'is_paid' => true,  'applicable_gender' => 'female', 'color' => '#DB2777']);
        $wfh      = LeaveType::create(['company_id' => $company->id, 'name' => 'Work From Home',  'code' => 'WFH','days_per_year' => 24, 'is_paid' => true,  'color' => '#059669']);
        $unpaid   = LeaveType::create(['company_id' => $company->id, 'name' => 'Unpaid Leave',    'code' => 'UL', 'days_per_year' => 30, 'is_paid' => false, 'color' => '#6B7280']);

        // Salary Components
        $houseAllow = SalaryComponent::create(['company_id' => $company->id, 'name' => 'House Allowance',      'code' => 'HOUSE', 'type' => 'allowance', 'calculation_type' => 'percentage', 'value' => 20]);
        $transpAllow= SalaryComponent::create(['company_id' => $company->id, 'name' => 'Transport Allowance',  'code' => 'TRANS', 'type' => 'allowance', 'calculation_type' => 'fixed',      'value' => 5000]);
        $medAllow   = SalaryComponent::create(['company_id' => $company->id, 'name' => 'Medical Allowance',    'code' => 'MED',   'type' => 'allowance', 'calculation_type' => 'fixed',      'value' => 3000]);
        $taxDed     = SalaryComponent::create(['company_id' => $company->id, 'name' => 'Income Tax',           'code' => 'TAX',   'type' => 'tax',       'calculation_type' => 'percentage', 'value' => 5, 'is_taxable' => true]);
        $lateDed    = SalaryComponent::create(['company_id' => $company->id, 'name' => 'Late Deduction',       'code' => 'LATE',  'type' => 'deduction', 'calculation_type' => 'fixed',      'value' => 500]);
        $salary_structure = SalaryStructure::create(['company_id' => $company->id, 'name' => 'Standard', 'description' => 'Default salary structure']);

        // ── Users & Employees ────────────────────────────────
        $adminUser = User::create([
            'name' => 'Super Admin', 'email' => 'admin@peopleflow.com',
            'password' => Hash::make('password'), 'role' => 'super_admin', 'company_id' => $company->id,
        ]);

        $hrUser = User::create([
            'name' => 'Sara Khan', 'email' => 'sara.hr@peopleflow.com',
            'password' => Hash::make('password'), 'role' => 'hr_manager', 'company_id' => $company->id,
        ]);

        $payrollUser = User::create([
            'name' => 'Bilal Accounts', 'email' => 'bilal@peopleflow.com',
            'password' => Hash::make('password'), 'role' => 'payroll_officer', 'company_id' => $company->id,
        ]);

        $empUser1 = User::create([
            'name' => 'Ali Ahmed', 'email' => 'ali@peopleflow.com',
            'password' => Hash::make('password'), 'role' => 'employee', 'company_id' => $company->id,
        ]);
        $empUser2 = User::create([
            'name' => 'Usman Khan', 'email' => 'usman@peopleflow.com',
            'password' => Hash::make('password'), 'role' => 'employee', 'company_id' => $company->id,
        ]);
        $empUser3 = User::create([
            'name' => 'Ahmed Raza', 'email' => 'ahmed@peopleflow.com',
            'password' => Hash::make('password'), 'role' => 'dept_manager', 'company_id' => $company->id,
        ]);
        $empUser4 = User::create([
            'name' => 'Fatima Malik', 'email' => 'fatima@peopleflow.com',
            'password' => Hash::make('password'), 'role' => 'employee', 'company_id' => $company->id,
        ]);
        $empUser5 = User::create([
            'name' => 'Hassan Butt', 'email' => 'hassan@peopleflow.com',
            'password' => Hash::make('password'), 'role' => 'employee', 'company_id' => $company->id,
        ]);

        // Employees
        $hrEmployee = Employee::create([
            'employee_id' => 'EMP-00001', 'user_id' => $hrUser->id,
            'company_id' => $company->id, 'branch_id' => $lahoreBranch->id,
            'department_id' => $hrDept->id, 'designation_id' => $hrMgr->id,
            'first_name' => 'Sara', 'last_name' => 'Khan', 'gender' => 'female',
            'email' => 'sara.hr@peopleflow.com', 'phone' => '+92-300-1234567',
            'joining_date' => '2022-01-15', 'employment_type' => 'full_time',
            'basic_salary' => 95000, 'status' => 'active',
            'payment_method' => 'bank', 'bank_name' => 'HBL', 'bank_account' => '12345678901',
        ]);

        $emp1 = Employee::create([
            'employee_id' => 'EMP-00002', 'user_id' => $empUser1->id,
            'company_id' => $company->id, 'branch_id' => $lahoreBranch->id,
            'department_id' => $devDept->id, 'designation_id' => $senDev->id,
            'first_name' => 'Ali', 'last_name' => 'Ahmed', 'gender' => 'male',
            'email' => 'ali@peopleflow.com', 'phone' => '+92-321-9876543',
            'joining_date' => '2021-03-01', 'employment_type' => 'full_time',
            'basic_salary' => 120000, 'status' => 'active',
            'payment_method' => 'bank', 'bank_name' => 'MCB', 'bank_account' => '98765432101',
        ]);

        $emp2 = Employee::create([
            'employee_id' => 'EMP-00003', 'user_id' => $empUser2->id,
            'company_id' => $company->id, 'branch_id' => $lahoreBranch->id,
            'department_id' => $devDept->id, 'designation_id' => $fsDev->id,
            'first_name' => 'Usman', 'last_name' => 'Khan', 'gender' => 'male',
            'email' => 'usman@peopleflow.com', 'phone' => '+92-333-5551234',
            'joining_date' => '2022-06-15', 'employment_type' => 'full_time',
            'basic_salary' => 90000, 'status' => 'active',
            'payment_method' => 'bank', 'bank_name' => 'UBL', 'bank_account' => '11223344550',
        ]);

        $emp3 = Employee::create([
            'employee_id' => 'EMP-00004', 'user_id' => $empUser3->id,
            'company_id' => $company->id, 'branch_id' => $lahoreBranch->id,
            'department_id' => $devDept->id, 'designation_id' => $cto->id,
            'first_name' => 'Ahmed', 'last_name' => 'Raza', 'gender' => 'male',
            'email' => 'ahmed@peopleflow.com', 'phone' => '+92-345-7778888',
            'joining_date' => '2020-01-10', 'employment_type' => 'full_time',
            'basic_salary' => 200000, 'status' => 'active',
            'payment_method' => 'bank', 'bank_name' => 'Standard Chartered', 'bank_account' => '55667788990',
        ]);

        $emp4 = Employee::create([
            'employee_id' => 'EMP-00005', 'user_id' => $empUser4->id,
            'company_id' => $company->id, 'branch_id' => $lahoreBranch->id,
            'department_id' => $designDept->id, 'designation_id' => $uiux->id,
            'first_name' => 'Fatima', 'last_name' => 'Malik', 'gender' => 'female',
            'email' => 'fatima@peopleflow.com', 'phone' => '+92-311-4445556',
            'joining_date' => '2023-02-20', 'employment_type' => 'full_time',
            'basic_salary' => 75000, 'status' => 'active',
            'payment_method' => 'bank', 'bank_name' => 'Meezan Bank', 'bank_account' => '44556677880',
        ]);

        $emp5 = Employee::create([
            'employee_id' => 'EMP-00006', 'user_id' => $empUser5->id,
            'company_id' => $company->id, 'branch_id' => $lahoreBranch->id,
            'department_id' => $devDept->id, 'designation_id' => $junDev->id,
            'first_name' => 'Hassan', 'last_name' => 'Butt', 'gender' => 'male',
            'email' => 'hassan@peopleflow.com', 'phone' => '+92-322-3334445',
            'joining_date' => '2024-01-05', 'employment_type' => 'full_time',
            'basic_salary' => 55000, 'status' => 'active',
            'payment_method' => 'bank', 'bank_name' => 'Habib Bank', 'bank_account' => '33445566770',
        ]);

        // Update departments with managers
        $devDept->update(['manager_id' => $emp3->id]);
        $hrDept->update(['manager_id' => $hrEmployee->id]);

        // Shift Assignments
        $employees = [$hrEmployee, $emp1, $emp2, $emp3, $emp4, $emp5];
        foreach ($employees as $emp) {
            ShiftAssignment::create(['employee_id' => $emp->id, 'shift_id' => $morning->id, 'effective_from' => $emp->joining_date]);
        }

        // ── Leave Balances ───────────────────────────────────
        $year = now()->year;
        foreach ($employees as $emp) {
            foreach ([$annual, $casual, $sick, $wfh] as $lt) {
                LeaveBalance::create([
                    'employee_id'   => $emp->id,
                    'leave_type_id' => $lt->id,
                    'year'          => $year,
                    'allocated'     => $lt->days_per_year,
                    'used'          => rand(0, (int)($lt->days_per_year * 0.4)),
                    'pending'       => rand(0, 2),
                ]);
            }
        }

        // ── Attendance (last 30 days) ────────────────────────
        $statuses = ['present','present','present','present','late','absent','present','present','present','half_day'];
        foreach ($employees as $emp) {
            for ($d = 30; $d >= 1; $d--) {
                $date = now()->subDays($d);
                if (in_array($date->dayOfWeek, [0, 6])) continue; // skip weekends
                $status = $statuses[array_rand($statuses)];
                $checkIn = $status === 'absent' ? null : '09:' . str_pad(rand(0, 45), 2, '0', STR_PAD_LEFT);
                $lateMin = $status === 'late' ? rand(10, 60) : 0;
                Attendance::create([
                    'employee_id'   => $emp->id,
                    'date'          => $date->format('Y-m-d'),
                    'check_in'      => $checkIn,
                    'check_out'     => $checkIn ? '18:00' : null,
                    'worked_minutes'=> $checkIn ? rand(420, 540) : 0,
                    'late_minutes'  => $lateMin,
                    'status'        => $status,
                    'method'        => 'manual',
                ]);
            }
        }

        // ── Leave Requests ───────────────────────────────────
        LeaveRequest::create(['employee_id' => $emp1->id, 'leave_type_id' => $annual->id, 'from_date' => now()->addDays(5), 'to_date' => now()->addDays(7), 'days' => 3, 'reason' => 'Family trip', 'status' => 'pending']);
        LeaveRequest::create(['employee_id' => $emp2->id, 'leave_type_id' => $casual->id, 'from_date' => now()->addDays(2), 'to_date' => now()->addDays(2), 'days' => 1, 'reason' => 'Personal work', 'status' => 'approved', 'approved_by' => $hrUser->id, 'approved_at' => now()]);
        LeaveRequest::create(['employee_id' => $emp4->id, 'leave_type_id' => $sick->id,   'from_date' => now()->subDays(3), 'to_date' => now()->subDays(2), 'days' => 2, 'reason' => 'Fever', 'status' => 'approved', 'approved_by' => $hrUser->id, 'approved_at' => now()]);
        LeaveRequest::create(['employee_id' => $emp5->id, 'leave_type_id' => $wfh->id,    'from_date' => now()->addDays(1), 'to_date' => now()->addDays(1), 'days' => 1, 'reason' => 'Work from home', 'status' => 'pending']);

        // ── Payroll ──────────────────────────────────────────
        $payrollRun = PayrollRun::create([
            'company_id'       => $company->id,
            'title'            => 'September 2026 Payroll',
            'month'            => 9,
            'year'             => 2026,
            'pay_date'         => '2026-09-30',
            'status'           => 'approved',
            'created_by'       => $payrollUser->id,
            'approved_by'      => $adminUser->id,
            'approved_at'      => now(),
            'employee_count'   => 6,
            'total_gross'      => 710000,
            'total_deductions' => 65000,
            'total_net'        => 645000,
        ]);

        $slipNum = 1;
        foreach ($employees as $idx => $emp) {
            $gross = $emp->basic_salary + ($emp->basic_salary * 0.2) + 5000 + 3000;
            $tax   = $gross * 0.05;
            $net   = $gross - $tax;
            $item  = PayrollItem::create([
                'payroll_run_id'    => $payrollRun->id,
                'employee_id'       => $emp->id,
                'basic_salary'      => $emp->basic_salary,
                'total_allowances'  => ($emp->basic_salary * 0.2) + 5000 + 3000,
                'overtime_pay'      => rand(0, 5000),
                'bonus'             => $idx === 0 ? 10000 : 0,
                'gross_salary'      => $gross,
                'total_deductions'  => $tax + 500,
                'tax_deduction'     => $tax,
                'loan_deduction'    => 0,
                'late_deduction'    => 500,
                'absence_deduction' => 0,
                'net_salary'        => $net,
                'working_days'      => 26,
                'present_days'      => rand(22, 26),
                'absent_days'       => rand(0, 2),
                'leave_days'        => rand(0, 2),
                'overtime_hours'    => rand(0, 8),
            ]);
            Payslip::create([
                'payroll_run_id'  => $payrollRun->id,
                'payroll_item_id' => $item->id,
                'employee_id'     => $emp->id,
                'slip_number'     => 'PSL-' . str_pad($slipNum++, 5, '0', STR_PAD_LEFT),
            ]);
        }

        // ── Loans ────────────────────────────────────────────
        Loan::create(['employee_id' => $emp2->id, 'type' => 'advance', 'amount' => 50000, 'installments' => 5, 'monthly_deduction' => 10000, 'paid_amount' => 10000, 'remaining_amount' => 40000, 'start_date' => now()->startOfMonth(), 'reason' => 'Home renovation', 'status' => 'active', 'approved_by' => $hrUser->id, 'approved_at' => now()]);
        Loan::create(['employee_id' => $emp5->id, 'type' => 'loan',    'amount' => 30000, 'installments' => 3, 'monthly_deduction' => 10000, 'paid_amount' => 0, 'remaining_amount' => 30000, 'start_date' => now()->addMonth()->startOfMonth(), 'reason' => 'Emergency', 'status' => 'approved', 'approved_by' => $hrUser->id, 'approved_at' => now()]);

        // ── Recruitment ──────────────────────────────────────
        $job1 = JobOpening::create(['company_id' => $company->id, 'department_id' => $devDept->id, 'title' => 'Backend Laravel Developer', 'location' => 'Lahore', 'employment_type' => 'full_time', 'salary_min' => 80000, 'salary_max' => 130000, 'vacancies' => 2, 'requirements' => 'Laravel, MySQL, REST APIs, 2+ years experience', 'deadline' => now()->addMonths(1), 'status' => 'published', 'created_by' => $hrUser->id]);
        $job2 = JobOpening::create(['company_id' => $company->id, 'department_id' => $designDept->id, 'title' => 'Senior UI/UX Designer', 'location' => 'Lahore', 'employment_type' => 'full_time', 'salary_min' => 70000, 'salary_max' => 110000, 'vacancies' => 1, 'requirements' => 'Figma, Adobe XD, 3+ years experience', 'deadline' => now()->addMonths(2), 'status' => 'published', 'created_by' => $hrUser->id]);

        $cand1 = Candidate::create(['job_opening_id' => $job1->id, 'name' => 'Zain Ali',    'email' => 'zain@mail.com', 'phone' => '+92-300-1111111', 'experience_years' => 3, 'expected_salary' => 100000, 'source' => 'LinkedIn', 'stage' => 'interview']);
        $cand2 = Candidate::create(['job_opening_id' => $job1->id, 'name' => 'Hamza Tariq', 'email' => 'hamza@mail.com','phone' => '+92-321-2222222', 'experience_years' => 2, 'expected_salary' => 85000,  'source' => 'Rozee.pk',  'stage' => 'shortlisted']);
        $cand3 = Candidate::create(['job_opening_id' => $job2->id, 'name' => 'Ayesha Noor', 'email' => 'ayesha@mail.com','phone' => '+92-333-3333333', 'experience_years' => 4, 'expected_salary' => 95000,  'source' => 'Referral',  'stage' => 'offer_sent']);

        Interview::create(['candidate_id' => $cand1->id, 'interviewer_id' => $empUser3->id, 'scheduled_at' => now()->addDays(2)->setTime(10, 0), 'type' => 'in_person', 'location' => 'Office - Conference Room A', 'status' => 'scheduled']);
        OfferLetter::create(['candidate_id' => $cand3->id, 'position' => 'Senior UI/UX Designer', 'salary' => 95000, 'joining_date' => now()->addDays(15), 'offer_expiry' => now()->addDays(7), 'status' => 'sent', 'sent_at' => now()]);

        // ── Onboarding Tasks ─────────────────────────────────
        $onboardTasks = ['Contract signed', 'CNIC uploaded', 'Bank details added', 'Laptop assigned', 'Email created', 'Orientation complete'];
        foreach ($onboardTasks as $i => $task) {
            OnboardingTask::create(['employee_id' => $emp5->id, 'task' => $task, 'is_completed' => $i < 3, 'completed_at' => $i < 3 ? now()->subDays(5) : null, 'sort_order' => $i + 1]);
        }

        // ── Performance ──────────────────────────────────────
        PerformanceReview::create([
            'employee_id' => $emp1->id, 'reviewer_id' => $empUser3->id,
            'period' => 'annual', 'review_year' => 2025,
            'quality_score' => 4, 'productivity_score' => 5, 'communication_score' => 4,
            'teamwork_score' => 5, 'attendance_score' => 4, 'technical_score' => 5,
            'overall_rating' => 4.5,
            'strengths' => 'Excellent technical skills, delivers on time',
            'improvements' => 'Can improve documentation',
            'manager_comments' => 'Strong performer. Ready for promotion.',
            'status' => 'submitted',
        ]);
        Goal::create(['employee_id' => $emp1->id, 'title' => 'Complete 5 major features', 'target' => 5, 'achieved' => 4, 'unit' => 'features', 'due_date' => now()->endOfYear(), 'year' => $year]);
        Goal::create(['employee_id' => $emp1->id, 'title' => 'Reduce bug count by 30%',   'target' => 30,'achieved' => 22,'unit' => '%',        'due_date' => now()->endOfYear(), 'year' => $year]);
        Goal::create(['employee_id' => $emp2->id, 'title' => 'Complete API documentation','target' => 100,'achieved' => 75,'unit' => '%',       'due_date' => now()->endOfYear(), 'year' => $year]);

        Promotion::create([
            'employee_id'        => $emp1->id,
            'from_designation_id'=> $fsDev->id,
            'to_designation_id'  => $senDev->id,
            'from_salary'        => 90000,
            'to_salary'          => 120000,
            'effective_date'     => now()->subMonths(6),
            'reason'             => 'Outstanding performance review 2025',
            'type'               => 'promotion',
            'approved_by'        => $adminUser->id,
        ]);

        Warning::create(['employee_id' => $emp5->id, 'issued_by' => $hrUser->id, 'type' => 'verbal', 'subject' => 'Repeated Late Arrival', 'description' => 'Employee was late 5 times in September 2026.', 'issue_date' => now()->subDays(10)]);

        // ── Training ─────────────────────────────────────────
        $training1 = Training::create(['company_id' => $company->id, 'title' => 'Laravel Advanced Workshop', 'trainer' => 'Ahmed Raza', 'start_date' => now()->addDays(10), 'end_date' => now()->addDays(11), 'location' => 'Training Room B', 'max_participants' => 10, 'status' => 'upcoming']);
        $training1->employees()->attach([$emp1->id, $emp2->id, $emp5->id]);

        Certification::create(['employee_id' => $emp1->id, 'name' => 'AWS Certified Developer', 'issuing_body' => 'Amazon Web Services', 'issue_date' => '2024-03-10', 'expiry_date' => '2027-03-10']);
        Certification::create(['employee_id' => $emp3->id, 'name' => 'PMP Certification',       'issuing_body' => 'PMI',                  'issue_date' => '2023-01-15', 'expiry_date' => '2026-01-15']);

        // ── Assets ───────────────────────────────────────────
        $laptop1 = Asset::create(['company_id' => $company->id, 'asset_id' => 'AST-00001', 'name' => 'HP EliteBook 840', 'category' => 'Laptop', 'brand' => 'HP', 'model' => 'EliteBook 840 G8', 'serial_number' => 'HP840G8-001', 'purchase_value' => 180000, 'purchase_date' => '2022-01-15', 'condition' => 'good', 'status' => 'assigned']);
        $laptop2 = Asset::create(['company_id' => $company->id, 'asset_id' => 'AST-00002', 'name' => 'Dell XPS 15',     'category' => 'Laptop', 'brand' => 'Dell','model' => 'XPS 15 9500',      'serial_number' => 'DXP15-002',   'purchase_value' => 220000, 'purchase_date' => '2021-03-01', 'condition' => 'good', 'status' => 'assigned']);
        $phone1  = Asset::create(['company_id' => $company->id, 'asset_id' => 'AST-00003', 'name' => 'iPhone 14',       'category' => 'Phone',  'brand' => 'Apple','model' => 'iPhone 14 Pro',    'serial_number' => 'IPHONE14-003','purchase_value' => 350000, 'purchase_date' => '2023-06-01', 'condition' => 'good', 'status' => 'assigned']);
        $monitor = Asset::create(['company_id' => $company->id, 'asset_id' => 'AST-00004', 'name' => 'LG 27" Monitor',  'category' => 'Monitor','brand' => 'LG',  'model' => '27UK850',           'serial_number' => 'LG27-004',    'purchase_value' => 55000,  'purchase_date' => '2022-05-10', 'condition' => 'good', 'status' => 'available']);

        AssetAssignment::create(['asset_id' => $laptop1->id, 'employee_id' => $emp1->id, 'assigned_date' => '2022-01-20', 'condition_on_assign' => 'new']);
        AssetAssignment::create(['asset_id' => $laptop2->id, 'employee_id' => $emp2->id, 'assigned_date' => '2022-06-15', 'condition_on_assign' => 'new']);
        AssetAssignment::create(['asset_id' => $phone1->id,  'employee_id' => $emp3->id, 'assigned_date' => '2023-06-05', 'condition_on_assign' => 'new']);

        // ── Expenses ─────────────────────────────────────────
        Expense::create(['employee_id' => $emp1->id, 'category' => 'Travel',  'amount' => 3500, 'expense_date' => now()->subDays(5), 'title' => 'Client visit fuel',          'status' => 'pending']);
        Expense::create(['employee_id' => $emp2->id, 'category' => 'Meals',   'amount' => 1800, 'expense_date' => now()->subDays(3), 'title' => 'Team lunch meeting',         'status' => 'approved', 'approved_by' => $hrUser->id, 'approved_at' => now()]);
        Expense::create(['employee_id' => $emp4->id, 'category' => 'Office',  'amount' => 2200, 'expense_date' => now()->subDays(7), 'title' => 'Design resources purchased', 'status' => 'reimbursed','approved_by' => $hrUser->id,'approved_at' => now()->subDays(2),'reimbursed_at' => now()]);

        // ── Announcements ────────────────────────────────────
        Announcement::create(['company_id' => $company->id, 'title' => 'Office Closed on September 27', 'content' => 'The office will remain closed on Monday, September 27, 2026 due to a public holiday. All employees may work from home if needed.', 'audience' => 'all', 'priority' => 'high', 'is_published' => true, 'created_by' => $hrUser->id]);
        Announcement::create(['company_id' => $company->id, 'title' => 'Q3 Performance Reviews Starting', 'content' => 'Q3 2026 performance reviews will begin from October 1st. Managers please prepare review forms for your team members.', 'audience' => 'all', 'priority' => 'medium', 'is_published' => true, 'created_by' => $hrUser->id]);
        Announcement::create(['company_id' => $company->id, 'title' => 'New Leave Policy Effective Oct 1', 'content' => 'A revised leave policy will be in effect from October 1, 2026. Please review the updated policy document in HR section.', 'audience' => 'department', 'audience_ids' => [$hrDept->id], 'priority' => 'medium', 'is_published' => true, 'created_by' => $hrUser->id]);
    }
}
