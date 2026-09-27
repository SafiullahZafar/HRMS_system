<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Loan;
use App\Models\PayrollItem;
use App\Models\PayrollRun;
use App\Models\Payslip;
use App\Models\SalaryComponent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PayrollController extends Controller
{
    private function companyId(): int { return Auth::user()->company_id; }

    public function index(): Response
    {
        return Inertia::render('Payroll/Index', [
            'payrollRuns' => PayrollRun::where('company_id', $this->companyId())->orderByDesc('year')->orderByDesc('month')->paginate(12),
            'summary'     => [
                'draft'        => PayrollRun::where('company_id', $this->companyId())->where('status','draft')->count(),
                'pending'      => PayrollRun::where('company_id', $this->companyId())->whereIn('status',['calculated','under_review'])->count(),
                'approved'     => PayrollRun::where('company_id', $this->companyId())->where('status','approved')->count(),
                'paid'         => PayrollRun::where('company_id', $this->companyId())->where('status','paid')->count(),
            ],
        ]);
    }

    public function show(PayrollRun $payrollRun): Response
    {
        $payrollRun->load(['items.employee.department', 'items.employee.designation', 'createdBy:id,name', 'approvedBy:id,name']);
        return Inertia::render('Payroll/Show', ['payrollRun' => $payrollRun]);
    }

    public function runPayroll(Request $request)
    {
        $data = $request->validate(['month' => 'required|integer|between:1,12', 'year' => 'required|integer']);

        $employees = Employee::where('company_id', $this->companyId())->where('status', 'active')->get();
        $gross = 0; $deductions = 0;

        $run = PayrollRun::create([
            'company_id'     => $this->companyId(),
            'title'          => now()->parse("{$data['year']}-{$data['month']}-01")->format('F Y') . ' Payroll',
            'month'          => $data['month'],
            'year'           => $data['year'],
            'status'         => 'calculated',
            'created_by'     => Auth::id(),
            'employee_count' => $employees->count(),
        ]);

        $slip = 1;
        foreach ($employees as $emp) {
            $houseAllow  = $emp->basic_salary * 0.20;
            $transAllow  = 5000;
            $medAllow    = 3000;
            $grossSalary = $emp->basic_salary + $houseAllow + $transAllow + $medAllow;
            $tax         = $grossSalary * 0.05;
            $loanDed     = Loan::where('employee_id', $emp->id)->where('status', 'active')->sum('monthly_deduction');
            $totalDed    = $tax + $loanDed;
            $netSalary   = $grossSalary - $totalDed;

            $item = PayrollItem::create([
                'payroll_run_id'    => $run->id,
                'employee_id'       => $emp->id,
                'basic_salary'      => $emp->basic_salary,
                'total_allowances'  => $houseAllow + $transAllow + $medAllow,
                'gross_salary'      => $grossSalary,
                'tax_deduction'     => $tax,
                'loan_deduction'    => $loanDed,
                'total_deductions'  => $totalDed,
                'net_salary'        => $netSalary,
                'working_days'      => 26,
                'present_days'      => 25,
            ]);

            Payslip::create([
                'payroll_run_id'  => $run->id,
                'payroll_item_id' => $item->id,
                'employee_id'     => $emp->id,
                'slip_number'     => 'PSL-' . $run->id . '-' . str_pad($slip++, 4, '0', STR_PAD_LEFT),
            ]);

            $gross      += $grossSalary;
            $deductions += $totalDed;
        }

        $run->update(['total_gross' => $gross, 'total_deductions' => $deductions, 'total_net' => $gross - $deductions]);

        return redirect()->route('payroll.show', $run)->with('success', 'Payroll calculated successfully.');
    }

    public function approvePayroll(Request $request, PayrollRun $payrollRun)
    {
        $payrollRun->update(['status' => 'approved', 'approved_by' => Auth::id(), 'approved_at' => now()]);
        return back()->with('success', 'Payroll approved.');
    }

    public function salaries(): Response
    {
        return Inertia::render('Payroll/Salaries', [
            'employees' => Employee::with(['department:id,name', 'designation:id,name'])
                ->where('company_id', $this->companyId())
                ->where('status', 'active')
                ->get(['id','first_name','last_name','basic_salary','department_id','designation_id','employment_type']),
        ]);
    }

    public function components(): Response
    {
        return Inertia::render('Payroll/Components', [
            'components' => SalaryComponent::where('company_id', $this->companyId())->get(),
        ]);
    }

    public function payslips(): Response
    {
        return Inertia::render('Payroll/Payslips', [
            'payslips' => Payslip::with(['employee:id,first_name,last_name', 'payrollRun:id,title,month,year', 'payrollItem'])
                ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))
                ->orderByDesc('created_at')
                ->paginate(20),
        ]);
    }

    public function loans(): Response
    {
        return Inertia::render('Payroll/Loans', [
            'loans'      => Loan::with('employee:id,first_name,last_name')
                ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))
                ->orderByDesc('created_at')
                ->paginate(15),
            'employees'  => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
        ]);
    }

    public function storeLoan(Request $request)
    {
        $data = $request->validate(['employee_id' => 'required|exists:employees,id', 'type' => 'required|in:loan,advance', 'amount' => 'required|numeric|min:1', 'installments' => 'required|integer|min:1', 'reason' => 'nullable|string']);
        $data['monthly_deduction'] = $data['amount'] / $data['installments'];
        $data['remaining_amount']  = $data['amount'];
        Loan::create($data);
        return back()->with('success', 'Loan request submitted.');
    }

    public function approveLoan(Request $request, Loan $loan)
    {
        $loan->update(['status' => 'approved', 'approved_by' => Auth::id(), 'approved_at' => now(), 'start_date' => now()->startOfMonth()]);
        return back()->with('success', 'Loan approved.');
    }
}
