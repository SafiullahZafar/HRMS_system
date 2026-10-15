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
use App\Models\Document;
use App\Models\Employee;
use App\Models\ExitInterview;
use App\Models\Expense;
use App\Models\Goal;
use App\Models\Interview;
use App\Models\JobOpening;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Loan;
use App\Models\OffboardingTask;
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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoWorkspaceSeeder extends Seeder
{
    /**
     * Seeds an isolated demo workspace ensuring at least 7 items for every module/page.
     */
    public function seed(int $companyId, int $demoUserId): void
    {
        DB::transaction(function () use ($companyId, $demoUserId) {
            // 1. Branch
            $branch = Branch::create([
                'company_id' => $companyId,
                'name'       => 'Demo Innovation Center',
                'city'       => 'Lahore',
                'address'    => 'Sector Y, DHA Phase 3, Lahore',
                'phone'      => '+92-42-37890123',
            ]);

            // 2. 7 Departments
            $deptsData = [
                ['name' => 'Engineering & Cloud',     'code' => 'ENG'],
                ['name' => 'Product & UX Design',     'code' => 'DES'],
                ['name' => 'Growth & Marketing',      'code' => 'MKT'],
                ['name' => 'People & Culture (HR)',   'code' => 'HR'],
                ['name' => 'Finance & Accounting',    'code' => 'FIN'],
                ['name' => 'Customer Operations',     'code' => 'OPS'],
                ['name' => 'Enterprise Sales',        'code' => 'SAL'],
            ];
            $departments = [];
            foreach ($deptsData as $d) {
                $departments[] = Department::create([
                    'company_id' => $companyId,
                    'branch_id'  => $branch->id,
                    'name'       => $d['name'],
                    'code'       => $d['code'],
                ]);
            }

            // 3. 7 Designations
            $desigsData = [
                ['dept' => 0, 'name' => 'Principal Cloud Architect',    'level' => 'executive'],
                ['dept' => 0, 'name' => 'Senior Full Stack Developer',   'level' => 'senior'],
                ['dept' => 1, 'name' => 'Lead Product Designer',         'level' => 'senior'],
                ['dept' => 2, 'name' => 'Performance Marketing Manager', 'level' => 'manager'],
                ['dept' => 3, 'name' => 'HR Operations Specialist',      'level' => 'mid'],
                ['dept' => 4, 'name' => 'Senior Financial Analyst',      'level' => 'senior'],
                ['dept' => 6, 'name' => 'Enterprise Solutions Manager',  'level' => 'manager'],
            ];
            $designations = [];
            foreach ($desigsData as $dg) {
                $designations[] = Designation::create([
                    'company_id'    => $companyId,
                    'department_id' => $departments[$dg['dept']]->id,
                    'name'          => $dg['name'],
                    'level'         => $dg['level'],
                ]);
            }

            // 4. 7 Shifts
            $shiftsData = [
                ['name' => 'Standard Day Shift', 'start' => '09:00', 'end' => '18:00', 'color' => '#2563EB', 'night' => false],
                ['name' => 'Early Bird Shift',   'start' => '07:30', 'end' => '16:30', 'color' => '#0891B2', 'night' => false],
                ['name' => 'Midday Peak Shift',  'start' => '11:00', 'end' => '20:00', 'color' => '#7C3AED', 'night' => false],
                ['name' => 'Evening Shift',      'start' => '14:00', 'end' => '23:00', 'color' => '#D97706', 'night' => false],
                ['name' => 'Overnight Ops',      'start' => '22:00', 'end' => '07:00', 'color' => '#475569', 'night' => true],
                ['name' => 'Flexible Hybrid',    'start' => '10:00', 'end' => '19:00', 'color' => '#059669', 'night' => false],
                ['name' => 'Weekend Support',    'start' => '09:00', 'end' => '17:00', 'color' => '#DB2777', 'night' => false],
            ];
            $shifts = [];
            foreach ($shiftsData as $s) {
                $shifts[] = Shift::create([
                    'company_id'     => $companyId,
                    'name'           => $s['name'],
                    'start_time'     => $s['start'],
                    'end_time'       => $s['end'],
                    'grace_period'   => 15,
                    'break_duration' => 60,
                    'is_night_shift' => $s['night'],
                    'working_days'   => [1, 2, 3, 4, 5],
                    'color'          => $s['color'],
                ]);
            }

            // 5. 7 Employees
            $employeesData = [
                ['first' => 'Tariq',   'last' => 'Mehmood', 'gender' => 'male',   'dept' => 0, 'desig' => 0, 'salary' => 220000, 'bank' => 'Standard Chartered', 'account' => 'PK64SCBL000011223344'],
                ['first' => 'Ayesha',  'last' => 'Rehman',  'gender' => 'female', 'dept' => 1, 'desig' => 2, 'salary' => 150000, 'bank' => 'Meezan Bank',        'account' => 'PK36MEZN000099887766'],
                ['first' => 'Hamza',   'last' => 'Siddiqui','gender' => 'male',   'dept' => 0, 'desig' => 1, 'salary' => 135000, 'bank' => 'HBL',                'account' => 'PK12HABB000055443322'],
                ['first' => 'Zainab',  'last' => 'Fatima',  'gender' => 'female', 'dept' => 3, 'desig' => 4, 'salary' => 95000,  'bank' => 'MCB Bank',           'account' => 'PK78MUCB000044332211'],
                ['first' => 'Bilal',   'last' => 'Aslam',   'gender' => 'male',   'dept' => 4, 'desig' => 5, 'salary' => 110000, 'bank' => 'Bank Alfalah',       'account' => 'PK55ALFH000088776655'],
                ['first' => 'Maryam',  'last' => 'Nawaz',   'gender' => 'female', 'dept' => 2, 'desig' => 3, 'salary' => 125000, 'bank' => 'Faysal Bank',         'account' => 'PK90FAYS000077665544'],
                ['first' => 'Danial',  'last' => 'Qureshi', 'gender' => 'male',   'dept' => 6, 'desig' => 6, 'salary' => 140000, 'bank' => 'Allied Bank',        'account' => 'PK21ABPA000066554433'],
            ];

            $employees = [];
            foreach ($employeesData as $idx => $ed) {
                $codeNum = str_pad($idx + 1, 3, '0', STR_PAD_LEFT);
                $emp = Employee::create([
                    'employee_id'     => "DEMO-{$companyId}-{$codeNum}",
                    'user_id'         => $idx === 0 ? $demoUserId : null,
                    'company_id'      => $companyId,
                    'branch_id'       => $branch->id,
                    'department_id'   => $departments[$ed['dept']]->id,
                    'designation_id'  => $designations[$ed['desig']]->id,
                    'first_name'      => $ed['first'],
                    'last_name'       => $ed['last'],
                    'gender'          => $ed['gender'],
                    'email'           => strtolower("{$ed['first']}.{$ed['last']}.demo{$companyId}@peopleflow.local"),
                    'phone'           => '+92-300-' . rand(1111111, 9999999),
                    'joining_date'    => Carbon::now()->subMonths(18 - ($idx * 2))->format('Y-m-d'),
                    'employment_type' => 'full_time',
                    'basic_salary'    => $ed['salary'],
                    'status'          => 'active',
                    'payment_method'  => 'bank',
                    'bank_name'       => $ed['bank'],
                    'bank_account'    => $ed['account'],
                ]);
                $employees[] = $emp;

                // Shift assignment
                ShiftAssignment::create([
                    'employee_id'    => $emp->id,
                    'shift_id'       => $shifts[$idx % count($shifts)]->id,
                    'effective_from' => $emp->joining_date,
                ]);
            }

            // 6. 7 Leave Types
            $leaveTypesData = [
                ['name' => 'Annual Vacation',    'code' => 'AL',  'days' => 20, 'paid' => true,  'cf' => true,  'color' => '#2563EB'],
                ['name' => 'Casual Emergency',   'code' => 'CL',  'days' => 10, 'paid' => true,  'cf' => false, 'color' => '#0891B2'],
                ['name' => 'Medical Sick Leave', 'code' => 'SL',  'days' => 12, 'paid' => true,  'cf' => false, 'color' => '#DC2626'],
                ['name' => 'Remote WFH Days',    'code' => 'WFH', 'days' => 24, 'paid' => true,  'cf' => false, 'color' => '#059669'],
                ['name' => 'Parental Leave',     'code' => 'PL',  'days' => 60, 'paid' => true,  'cf' => false, 'color' => '#DB2777'],
                ['name' => 'Pilgrimage Leave',   'code' => 'HL',  'days' => 15, 'paid' => true,  'cf' => false, 'color' => '#D97706'],
                ['name' => 'Bereavement Leave',  'code' => 'BL',  'days' => 5,  'paid' => true,  'cf' => false, 'color' => '#475569'],
            ];
            $leaveTypes = [];
            foreach ($leaveTypesData as $lt) {
                $leaveTypes[] = LeaveType::create([
                    'company_id'         => $companyId,
                    'name'               => $lt['name'],
                    'code'               => $lt['code'],
                    'days_per_year'      => $lt['days'],
                    'is_paid'            => $lt['paid'],
                    'carry_forward'      => $lt['cf'],
                    'max_carry_forward'  => $lt['cf'] ? 5 : 0,
                    'requires_document'  => $lt['code'] === 'SL',
                    'color'              => $lt['color'],
                ]);
            }

            // 7. Leave Balances for all 7 employees
            $currentYear = Carbon::now()->year;
            foreach ($employees as $emp) {
                foreach ($leaveTypes as $lt) {
                    LeaveBalance::create([
                        'employee_id'   => $emp->id,
                        'leave_type_id' => $lt->id,
                        'year'          => $currentYear,
                        'allocated'     => $lt->days_per_year,
                        'used'          => rand(1, 4),
                        'pending'       => rand(0, 1),
                    ]);
                }
            }

            // 8. 7 Leave Requests
            $leaveReasons = [
                ['days' => 3, 'reason' => 'Annual family trip to Northern Areas', 'status' => 'approved'],
                ['days' => 1, 'reason' => 'Urgent domestic maintenance',          'status' => 'approved'],
                ['days' => 2, 'reason' => 'Seasonal viral fever recovery',       'status' => 'approved'],
                ['days' => 1, 'reason' => 'Fiber internet maintenance at home',   'status' => 'pending'],
                ['days' => 4, 'reason' => 'Attending sister wedding ceremony',     'status' => 'pending'],
                ['days' => 2, 'reason' => 'Medical doctor appointment & tests',   'status' => 'rejected'],
                ['days' => 1, 'reason' => 'Personal emergency leave',             'status' => 'pending'],
            ];
            foreach ($leaveReasons as $i => $lr) {
                $emp = $employees[$i % count($employees)];
                $lt  = $leaveTypes[$i % count($leaveTypes)];
                LeaveRequest::create([
                    'employee_id'   => $emp->id,
                    'leave_type_id' => $lt->id,
                    'from_date'     => Carbon::now()->addDays($i - 2)->format('Y-m-d'),
                    'to_date'       => Carbon::now()->addDays($i - 2 + $lr['days'])->format('Y-m-d'),
                    'days'          => $lr['days'],
                    'reason'        => $lr['reason'],
                    'status'        => $lr['status'],
                    'approved_by'   => $lr['status'] === 'approved' ? $demoUserId : null,
                    'approved_at'   => $lr['status'] === 'approved' ? Carbon::now()->subDays(1) : null,
                ]);
            }

            // 9. 7 Days Attendance for each of the 7 Employees
            $statuses = ['present', 'present', 'present', 'late', 'present', 'present', 'half_day'];
            foreach ($employees as $emp) {
                for ($day = 7; $day >= 1; $day--) {
                    $date = Carbon::now()->subDays($day);
                    $st = $statuses[($day + $emp->id) % count($statuses)];
                    $checkIn = $st === 'absent' ? null : ($st === 'late' ? '09:35' : '08:55');
                    Attendance::create([
                        'employee_id'    => $emp->id,
                        'date'           => $date->format('Y-m-d'),
                        'check_in'       => $checkIn,
                        'check_out'      => $checkIn ? '18:05' : null,
                        'worked_minutes' => $checkIn ? 510 : 0,
                        'late_minutes'   => $st === 'late' ? 35 : 0,
                        'status'         => $st,
                        'method'         => 'biometric',
                    ]);
                }
            }

            // 10. 7 Salary Components
            $componentsData = [
                ['name' => 'House Rent Allowance',      'code' => 'HRA',     'type' => 'allowance', 'calc' => 'percentage', 'val' => 25],
                ['name' => 'Conveyance Allowance',      'code' => 'TRANS',   'type' => 'allowance', 'calc' => 'fixed',      'val' => 8000],
                ['name' => 'Medical Reimbursement',     'code' => 'MED',     'type' => 'allowance', 'calc' => 'fixed',      'val' => 5000],
                ['name' => 'Utility Support Allowance', 'code' => 'UTIL',    'type' => 'allowance', 'calc' => 'fixed',      'val' => 4000],
                ['name' => 'Performance Bonus',         'code' => 'BONUS',   'type' => 'allowance', 'calc' => 'fixed',      'val' => 12000],
                ['name' => 'Provident Fund',            'code' => 'PF_DED',  'type' => 'deduction', 'calc' => 'percentage', 'val' => 5],
                ['name' => 'Federal Income Tax',        'code' => 'TAX_DED', 'type' => 'tax',       'calc' => 'percentage', 'val' => 5],
            ];
            foreach ($componentsData as $c) {
                SalaryComponent::create([
                    'company_id'       => $companyId,
                    'name'             => $c['name'],
                    'code'             => $c['code'],
                    'type'             => $c['type'],
                    'calculation_type' => $c['calc'],
                    'value'            => $c['val'],
                    'is_taxable'       => $c['type'] === 'allowance',
                ]);
            }

            $salaryStructure = SalaryStructure::create([
                'company_id'  => $companyId,
                'name'        => 'Standard Executive Structure',
                'description' => 'Comprehensive base package for tech and corporate staff',
            ]);

            // 11. 1 Payroll Run with 7 Payroll Items and 7 Payslips
            $totalGross = 0;
            $totalNet   = 0;
            $payrollRun = PayrollRun::create([
                'company_id'       => $companyId,
                'title'            => Carbon::now()->subMonth()->format('F Y') . ' Payroll Run',
                'month'            => Carbon::now()->subMonth()->month,
                'year'             => Carbon::now()->subMonth()->year,
                'pay_date'         => Carbon::now()->subMonth()->endOfMonth()->format('Y-m-d'),
                'status'           => 'approved',
                'created_by'       => $demoUserId,
                'approved_by'      => $demoUserId,
                'approved_at'      => Carbon::now()->subDays(5),
                'employee_count'   => 7,
                'total_gross'      => 1250000,
                'total_deductions' => 110000,
                'total_net'        => 1140000,
            ]);

            foreach ($employees as $idx => $emp) {
                $allowances = ($emp->basic_salary * 0.25) + 8000 + 5000;
                $gross = $emp->basic_salary + $allowances;
                $tax   = $gross * 0.05;
                $ded   = $tax + ($gross * 0.05);
                $net   = $gross - $ded;

                $pItem = PayrollItem::create([
                    'payroll_run_id'    => $payrollRun->id,
                    'employee_id'       => $emp->id,
                    'basic_salary'      => $emp->basic_salary,
                    'total_allowances'  => $allowances,
                    'overtime_pay'      => rand(0, 3000),
                    'bonus'             => $idx === 0 ? 10000 : 0,
                    'gross_salary'      => $gross,
                    'total_deductions'  => $ded,
                    'tax_deduction'     => $tax,
                    'loan_deduction'    => 0,
                    'late_deduction'    => 0,
                    'absence_deduction' => 0,
                    'net_salary'        => $net,
                    'working_days'      => 26,
                    'present_days'      => 25,
                    'absent_days'       => 0,
                    'leave_days'        => 1,
                    'overtime_hours'    => 4,
                ]);

                Payslip::create([
                    'payroll_run_id'  => $payrollRun->id,
                    'payroll_item_id' => $pItem->id,
                    'employee_id'     => $emp->id,
                    'slip_number'     => "DEMO-PSL-{$companyId}-" . str_pad($idx + 1, 4, '0', STR_PAD_LEFT),
                ]);
            }

            // 12. 7 Loans / Advances
            $loansData = [
                ['emp' => 0, 'amount' => 80000, 'inst' => 8, 'paid' => 30000, 'status' => 'active',   'reason' => 'Home electronics purchase'],
                ['emp' => 1, 'amount' => 50000, 'inst' => 5, 'paid' => 50000, 'status' => 'completed','reason' => 'Advance salary for family travel'],
                ['emp' => 2, 'amount' => 120000,'inst' => 12,'paid' => 20000, 'status' => 'active',   'reason' => 'Professional degree tuition'],
                ['emp' => 3, 'amount' => 40000, 'inst' => 4, 'paid' => 10000, 'status' => 'active',   'reason' => 'Emergency car repair'],
                ['emp' => 4, 'amount' => 60000, 'inst' => 6, 'paid' => 0,     'status' => 'approved', 'reason' => 'Apartment security deposit'],
                ['emp' => 5, 'amount' => 35000, 'inst' => 3, 'paid' => 0,     'status' => 'pending',  'reason' => 'Medical dental procedure'],
                ['emp' => 6, 'amount' => 45000, 'inst' => 4, 'paid' => 22500, 'status' => 'active',   'reason' => 'Household appliances'],
            ];
            foreach ($loansData as $l) {
                $mDeduct = (int) ($l['amount'] / $l['inst']);
                Loan::create([
                    'employee_id'       => $employees[$l['emp']]->id,
                    'type'              => 'loan',
                    'amount'            => $l['amount'],
                    'installments'      => $l['inst'],
                    'monthly_deduction' => $mDeduct,
                    'paid_amount'       => $l['paid'],
                    'remaining_amount'  => $l['amount'] - $l['paid'],
                    'start_date'        => Carbon::now()->startOfMonth()->format('Y-m-d'),
                    'reason'            => $l['reason'],
                    'status'            => $l['status'],
                    'approved_by'       => in_array($l['status'], ['approved', 'active', 'completed']) ? $demoUserId : null,
                    'approved_at'       => in_array($l['status'], ['approved', 'active', 'completed']) ? Carbon::now()->subMonths(1) : null,
                ]);
            }

            // 13. 7 Job Openings
            $jobsData = [
                ['dept' => 0, 'title' => 'Senior React / Inertia Engineer', 'min' => 120000, 'max' => 180000, 'status' => 'published'],
                ['dept' => 0, 'title' => 'Cloud DevOps Engineer (AWS/K8s)',  'min' => 140000, 'max' => 210000, 'status' => 'published'],
                ['dept' => 1, 'title' => 'Senior UI/UX Product Designer',   'min' => 100000, 'max' => 150000, 'status' => 'published'],
                ['dept' => 2, 'title' => 'Growth & SEO Strategist',          'min' => 85000,  'max' => 130000, 'status' => 'published'],
                ['dept' => 3, 'title' => 'Technical Talent Partner',        'min' => 80000,  'max' => 120000, 'status' => 'published'],
                ['dept' => 4, 'title' => 'Senior Tax & Compliance Officer',  'min' => 95000,  'max' => 140000, 'status' => 'draft'],
                ['dept' => 6, 'title' => 'Enterprise Account Executive',     'min' => 110000, 'max' => 160000, 'status' => 'published'],
            ];
            $jobs = [];
            foreach ($jobsData as $jd) {
                $jobs[] = JobOpening::create([
                    'company_id'      => $companyId,
                    'department_id'   => $departments[$jd['dept']]->id,
                    'title'           => $jd['title'],
                    'location'        => 'Lahore / Hybrid',
                    'employment_type' => 'full_time',
                    'salary_min'      => $jd['min'],
                    'salary_max'      => $jd['max'],
                    'vacancies'       => 2,
                    'requirements'    => 'Strong domain expertise, proactive problem solver, 3+ years experience.',
                    'deadline'        => Carbon::now()->addMonths(2)->format('Y-m-d'),
                    'status'          => $jd['status'],
                    'created_by'      => $demoUserId,
                ]);
            }

            // 14. 7 Candidates
            $candidatesData = [
                ['job' => 0, 'name' => 'Waqas Bhatti',   'email' => 'waqas@demo.mail',   'phone' => '+92-321-4455667', 'exp' => 4, 'sal' => 150000, 'stage' => 'interview'],
                ['job' => 0, 'name' => 'Hina Shahzad',    'email' => 'hina@demo.mail',    'phone' => '+92-333-8899001', 'exp' => 5, 'sal' => 170000, 'stage' => 'offer_sent'],
                ['job' => 1, 'name' => 'Kamran Akram',   'email' => 'kamran@demo.mail',  'phone' => '+92-301-2233445', 'exp' => 3, 'sal' => 160000, 'stage' => 'shortlisted'],
                ['job' => 2, 'name' => 'Farah Jamil',     'email' => 'farah@demo.mail',   'phone' => '+92-345-5566778', 'exp' => 4, 'sal' => 130000, 'stage' => 'interview'],
                ['job' => 3, 'name' => 'Naveed Akhtar',   'email' => 'naveed@demo.mail',  'phone' => '+92-312-7788990', 'exp' => 3, 'sal' => 110000, 'stage' => 'applied'],
                ['job' => 4, 'name' => 'Sumbul Tariq',    'email' => 'sumbul@demo.mail',  'phone' => '+92-300-3344556', 'exp' => 2, 'sal' => 95000,  'stage' => 'shortlisted'],
                ['job' => 6, 'name' => 'Mustafa Zubair',  'email' => 'mustafa@demo.mail', 'phone' => '+92-322-9988776', 'exp' => 6, 'sal' => 140000, 'stage' => 'selected'],
            ];
            $candidates = [];
            foreach ($candidatesData as $cd) {
                $candidates[] = Candidate::create([
                    'job_opening_id'   => $jobs[$cd['job']]->id,
                    'name'             => $cd['name'],
                    'email'            => $cd['email'],
                    'phone'            => $cd['phone'],
                    'experience_years' => $cd['exp'],
                    'expected_salary'  => $cd['sal'],
                    'source'           => 'LinkedIn Recruiter',
                    'stage'            => $cd['stage'],
                ]);
            }

            // 15. 7 Interviews
            foreach ($candidates as $idx => $cand) {
                Interview::create([
                    'candidate_id'   => $cand->id,
                    'interviewer_id' => $demoUserId,
                    'scheduled_at'   => Carbon::now()->addDays($idx + 1)->setTime(11, 0),
                    'type'           => $idx % 2 === 0 ? 'video' : 'in_person',
                    'location'       => $idx % 2 === 0 ? 'Google Meet / Zoom' : 'Innovation Room B',
                    'status'         => $idx < 3 ? 'scheduled' : 'completed',
                ]);
            }

            // 16. 7 Offer Letters
            foreach ($candidates as $idx => $cand) {
                OfferLetter::create([
                    'candidate_id' => $cand->id,
                    'position'     => $cand->jobOpening->title,
                    'salary'       => $cand->expected_salary,
                    'joining_date' => Carbon::now()->addDays(20 + $idx)->format('Y-m-d'),
                    'offer_expiry' => Carbon::now()->addDays(7)->format('Y-m-d'),
                    'status'       => $idx === 1 ? 'accepted' : 'sent',
                    'sent_at'      => Carbon::now()->subDays(2),
                ]);
            }

            // 17. 7 Onboarding Tasks
            $onboardingList = [
                'Sign Employment Agreement and Code of Conduct',
                'Verify Bank Account details for automated payroll',
                'Upload Government ID (CNIC/Passport) and education certificates',
                'Assign workstation laptop, external 4K monitor and peripherals',
                'Provision corporate email, Slack, and GitHub credentials',
                'Introduction session with department lead and team mentor',
                'HR Benefits, Health Insurance, and leave policy walkthrough',
            ];
            foreach ($onboardingList as $i => $taskTitle) {
                OnboardingTask::create([
                    'employee_id'  => $employees[0]->id,
                    'task'         => $taskTitle,
                    'is_completed' => $i < 4,
                    'completed_at' => $i < 4 ? Carbon::now()->subDays(5) : null,
                    'sort_order'   => $i + 1,
                ]);
            }

            // 18. 7 Performance Reviews
            foreach ($employees as $idx => $emp) {
                PerformanceReview::create([
                    'employee_id'         => $emp->id,
                    'reviewer_id'         => $demoUserId,
                    'period'              => 'annual',
                    'review_year'         => $currentYear - 1,
                    'quality_score'       => rand(4, 5),
                    'productivity_score'  => rand(4, 5),
                    'communication_score' => rand(4, 5),
                    'teamwork_score'      => 5,
                    'attendance_score'    => 5,
                    'technical_score'     => 5,
                    'overall_rating'      => 4.8,
                    'strengths'           => 'Consistent high velocity, exemplary technical problem solving, dependable teammate.',
                    'improvements'        => 'Keep sharing learnings across teams and mentoring junior developers.',
                    'manager_comments'    => 'Exceeded all quarterly performance milestones.',
                    'status'              => 'submitted',
                ]);
            }

            // 19. 7 Goals / KPIs
            $goalsData = [
                ['title' => 'Deliver Cloud Migration Phase 2 on schedule', 'target' => 100, 'achieved' => 88,  'unit' => '%'],
                ['title' => 'Maintain 99.9% uptime across production APIs', 'target' => 99,  'achieved' => 99,  'unit' => '%'],
                ['title' => 'Standardize modern UI design system tokens',  'target' => 10,  'achieved' => 8,   'unit' => 'modules'],
                ['title' => 'Optimize candidate time-to-hire to 18 days',  'target' => 18,  'achieved' => 15,  'unit' => 'days'],
                ['title' => 'Automate monthly tax withholding workflows',   'target' => 100, 'achieved' => 95,  'unit' => '%'],
                ['title' => 'Achieve 95%+ employee satisfaction score',     'target' => 95,  'achieved' => 92,  'unit' => '%'],
                ['title' => 'Deliver 5 technical knowledge sharing sessions', 'target' => 5, 'achieved' => 4,   'unit' => 'sessions'],
            ];
            foreach ($goalsData as $idx => $gd) {
                Goal::create([
                    'employee_id' => $employees[$idx % count($employees)]->id,
                    'title'       => $gd['title'],
                    'target'      => $gd['target'],
                    'achieved'    => $gd['achieved'],
                    'unit'        => $gd['unit'],
                    'due_date'    => Carbon::now()->endOfYear()->format('Y-m-d'),
                    'year'        => $currentYear,
                ]);
            }

            // 20. 7 Promotions
            foreach ($employees as $idx => $emp) {
                Promotion::create([
                    'employee_id'         => $emp->id,
                    'from_designation_id' => $emp->designation_id,
                    'to_designation_id'   => $emp->designation_id,
                    'from_salary'         => $emp->basic_salary - 20000,
                    'to_salary'           => $emp->basic_salary,
                    'effective_date'      => Carbon::now()->subMonths(6 + $idx)->format('Y-m-d'),
                    'reason'              => 'Promoted based on superior annual performance review and impact.',
                    'type'                => 'promotion',
                    'approved_by'         => $demoUserId,
                ]);
            }

            // 21. 7 Warnings
            $warningTitles = [
                'Friendly reminder on shift punch timing',
                'Unplanned absence without advance leave notice',
                'Security badge replacement notice',
                'Compliance documentation pending reminder',
                'Client presentation punctuality observation',
                'Workstation clean desk policy reminder',
                'Travel expense submission timeline notice',
            ];
            foreach ($warningTitles as $idx => $wt) {
                Warning::create([
                    'employee_id' => $employees[$idx % count($employees)]->id,
                    'issued_by'   => $demoUserId,
                    'type'        => 'verbal',
                    'subject'     => $wt,
                    'description' => "Discussion held with team member regarding: {$wt}. Resolved constructively.",
                    'issue_date'  => Carbon::now()->subDays(10 + $idx)->format('Y-m-d'),
                ]);
            }

            // 22. 7 Trainings
            $trainingsData = [
                'Advanced Cloud Infrastructure & Microservices',
                'Modern Frontend Architecture with React & Inertia',
                'Enterprise Cybersecurity & Data Protection',
                'Agile Project Leadership & Scrum Mastery',
                'Product Design Systems & Accessibility',
                'Strategic HR Analytics & Talent Retention',
                'Financial Modeling & Corporate Compliance',
            ];
            foreach ($trainingsData as $idx => $tt) {
                $tr = Training::create([
                    'company_id'       => $companyId,
                    'title'            => $tt,
                    'trainer'          => 'Senior Industry Specialist',
                    'start_date'       => Carbon::now()->addDays(10 + $idx)->format('Y-m-d'),
                    'end_date'         => Carbon::now()->addDays(12 + $idx)->format('Y-m-d'),
                    'location'         => 'Executive Training Auditorium',
                    'max_participants' => 20,
                    'status'           => 'upcoming',
                ]);
                $tr->employees()->attach([$employees[0]->id, $employees[1]->id, $employees[2]->id]);
            }

            // 23. 7 Certifications
            $certsData = [
                ['name' => 'AWS Certified Solutions Architect', 'body' => 'Amazon Web Services'],
                ['name' => 'Google Cloud Professional Cloud Architect', 'body' => 'Google Cloud'],
                ['name' => 'Certified ScrumMaster (CSM)', 'body' => 'Scrum Alliance'],
                ['name' => 'Professional in Human Resources (PHR)', 'body' => 'HRCI'],
                ['name' => 'Chartered Financial Analyst (CFA Level 1)', 'body' => 'CFA Institute'],
                ['name' => 'Interaction Design Foundation UX Master', 'body' => 'IDF'],
                ['name' => 'Certified Information Systems Security Professional', 'body' => 'ISC2'],
            ];
            foreach ($certsData as $idx => $cd) {
                Certification::create([
                    'employee_id'  => $employees[$idx % count($employees)]->id,
                    'name'         => $cd['name'],
                    'issuing_body' => $cd['body'],
                    'issue_date'   => Carbon::now()->subYears(1)->format('Y-m-d'),
                    'expiry_date'  => Carbon::now()->addYears(2)->format('Y-m-d'),
                ]);
            }

            // 24. 7 Assets
            $assetsData = [
                ['name' => 'Apple MacBook Pro 16" M3 Max', 'cat' => 'Laptop',  'brand' => 'Apple', 'val' => 680000],
                ['name' => 'Dell XPS 15 OLED Laptop',     'cat' => 'Laptop',  'brand' => 'Dell',  'val' => 380000],
                ['name' => 'LG UltraFine 32" 4K Monitor',  'cat' => 'Monitor', 'brand' => 'LG',    'val' => 140000],
                ['name' => 'Apple iPad Pro 12.9" M2',      'cat' => 'Tablet',  'brand' => 'Apple', 'val' => 280000],
                ['name' => 'Apple iPhone 15 Pro 256GB',    'cat' => 'Mobile',  'brand' => 'Apple', 'val' => 390000],
                ['name' => 'Herman Miller Ergonomic Chair','cat' => 'Office',  'brand' => 'HM',    'val' => 195000],
                ['name' => 'Sony WH-1000XM5 ANC Headset',  'cat' => 'Audio',   'brand' => 'Sony',  'val' => 95000],
            ];
            foreach ($assetsData as $idx => $ad) {
                $asset = Asset::create([
                    'company_id'     => $companyId,
                    'asset_id'       => "DEMO-AST-{$companyId}-" . str_pad($idx + 1, 4, '0', STR_PAD_LEFT),
                    'name'           => $ad['name'],
                    'category'       => $ad['cat'],
                    'brand'          => $ad['brand'],
                    'model'          => $ad['name'],
                    'serial_number'  => 'SN-' . strtoupper(bin2hex(random_bytes(4))),
                    'purchase_value' => $ad['val'],
                    'purchase_date'  => Carbon::now()->subMonths(6)->format('Y-m-d'),
                    'condition'      => 'good',
                    'status'         => 'assigned',
                ]);

                AssetAssignment::create([
                    'asset_id'            => $asset->id,
                    'employee_id'         => $employees[$idx % count($employees)]->id,
                    'assigned_date'       => Carbon::now()->subMonths(5)->format('Y-m-d'),
                    'condition_on_assign' => 'new',
                ]);
            }

            // 25. 7 Expenses
            $expensesData = [
                ['title' => 'Client Executive Lunch Meeting',      'cat' => 'Meals',        'amt' => 8500],
                ['title' => 'Inter-city travel fuel reimbursement','cat' => 'Travel',       'amt' => 12500],
                ['title' => 'Cloud Architecture summit ticket',   'cat' => 'Professional', 'amt' => 25000],
                ['title' => 'Design team Figma plugins license',   'cat' => 'Software',     'amt' => 7800],
                ['title' => 'Office high-speed router replacement','cat' => 'Equipment',    'amt' => 18000],
                ['title' => 'Team building milestone celebration', 'cat' => 'Office',       'amt' => 15000],
                ['title' => 'Courier and express postal fees',     'cat' => 'Admin',        'amt' => 2400],
            ];
            foreach ($expensesData as $idx => $ex) {
                Expense::create([
                    'employee_id'   => $employees[$idx % count($employees)]->id,
                    'category'      => $ex['cat'],
                    'amount'        => $ex['amt'],
                    'expense_date'  => Carbon::now()->subDays(3 + $idx)->format('Y-m-d'),
                    'title'         => $ex['title'],
                    'status'        => $idx < 4 ? 'approved' : 'pending',
                    'approved_by'   => $idx < 4 ? $demoUserId : null,
                    'approved_at'   => $idx < 4 ? Carbon::now()->subDays(1) : null,
                ]);
            }

            // 26. 7 Documents
            $documentsData = [
                'Standard Employment Master Agreement',
                'Employee Non-Disclosure & Intellectual Property Deed',
                'Government CNIC Verified Identification',
                'Higher Education Degree & Transcript Attestation',
                'Emergency Contact & Medical Details Record',
                'Biometric Access Authorization Certificate',
                'Salary Bank Account Authorization Letter',
            ];
            $categories = ['contract', 'contract', 'cnic', 'degree', 'other', 'certificate', 'salary_letter'];
            foreach ($documentsData as $idx => $docTitle) {
                Document::create([
                    'employee_id' => $employees[$idx % count($employees)]->id,
                    'title'       => $docTitle,
                    'category'    => $categories[$idx % count($categories)],
                    'file_path'   => 'demo/documents/doc_' . ($idx + 1) . '.pdf',
                    'file_type'   => 'pdf',
                    'file_size'   => rand(120000, 850000),
                ]);
            }

            // 27. 7 Announcements
            $announcementsData = [
                ['title' => 'Welcome to the PeopleFlow Demo Experience!', 'priority' => 'high',   'content' => 'Explore the interactive HRMS. Test attendance, salary runs, recruitment pipelines, leave management and more!'],
                ['title' => 'Quarterly Company All-Hands Scheduled',       'priority' => 'medium', 'content' => 'The quarterly roadmap update will take place this Thursday at 3:00 PM in the innovation hall.'],
                ['title' => 'Annual Health & Wellness Benefit Launch',     'priority' => 'medium', 'content' => 'New comprehensive medical insurance coverage cards have been dispatched to all staff.'],
                ['title' => 'Public Holiday Office Closure Notice',        'priority' => 'high',   'content' => 'Headquarters and branches will observe the national holiday on the upcoming Monday.'],
                ['title' => 'Engineering Innovation Hackathon 2026',       'priority' => 'low',    'content' => 'Teams can register their innovative ideas for the 48-hour internal hackathon starting next month.'],
                ['title' => 'Updated Flexible Hybrid Working Guidelines',  'priority' => 'medium', 'content' => 'Review the newly published remote working policy in your HR documentation section.'],
                ['title' => 'Quarterly Employee Excellence Awards',        'priority' => 'high',   'content' => 'Congratulations to the high achievers nominated for outstanding quarterly contributions!'],
            ];
            foreach ($announcementsData as $an) {
                Announcement::create([
                    'company_id'   => $companyId,
                    'title'        => $an['title'],
                    'content'      => $an['content'],
                    'audience'     => 'all',
                    'priority'     => $an['priority'],
                    'is_published' => true,
                    'created_by'   => $demoUserId,
                ]);
            }

            // 28. 7 Offboarding / Exit Records
            $offboardingTasks = [
                'Conduct confidential exit interview and capture feedback',
                'Collect physical company access cards and parking pass',
                'Receive assigned MacBook Pro, monitor, and peripherals',
                'Deactivate corporate Google Workspace and email logins',
                'Calculate final end-of-service gratuity and dues',
                'Issue formal Experience Letter and Relieving Certificate',
                'Final sign-off by Department Head and Finance Director',
            ];
            foreach ($offboardingTasks as $idx => $taskText) {
                OffboardingTask::create([
                    'employee_id'  => $employees[6]->id,
                    'task'         => $taskText,
                    'is_completed' => $idx < 3,
                    'completed_at' => $idx < 3 ? Carbon::now()->subDays(2) : null,
                    'sort_order'   => $idx + 1,
                ]);
            }

            $resignation = Resignation::create([
                'employee_id'     => $employees[6]->id,
                'resignation_date'=> Carbon::now()->subDays(20)->format('Y-m-d'),
                'notice_date'     => Carbon::now()->subDays(20)->format('Y-m-d'),
                'last_working_day'=> Carbon::now()->addDays(10)->format('Y-m-d'),
                'reason'          => 'Pursuing higher international educational studies.',
                'status'          => 'accepted',
                'approved_by'     => $demoUserId,
                'approved_at'     => Carbon::now()->subDays(15),
            ]);

            ExitInterview::create([
                'employee_id'             => $employees[6]->id,
                'resignation_id'          => $resignation->id,
                'conducted_by'            => $demoUserId,
                'interview_date'          => Carbon::now()->subDays(5)->format('Y-m-d'),
                'reason_for_leaving'      => 'International higher education scholarship.',
                'manager_feedback'        => 'Exceptional company culture, supportive team, learned tremendous skills during tenure.',
                'work_environment_rating' => 5,
                'compensation_rating'     => 4,
                'would_return'            => true,
            ]);
        });
    }
}
