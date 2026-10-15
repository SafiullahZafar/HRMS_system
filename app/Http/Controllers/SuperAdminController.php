<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Company;
use App\Models\DemoActivity;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminController extends Controller
{
    public const AVAILABLE_MODULES = [
        ['key' => 'dashboard',     'label' => 'Dashboard',           'description' => 'Real-time HR KPIs, headcount & daily trends'],
        ['key' => 'employees',     'label' => 'Employee Management', 'description' => 'Profiles, departments, designations & org chart'],
        ['key' => 'attendance',    'label' => 'Attendance & Shifts', 'description' => 'Daily punch records, shifts & overtime'],
        ['key' => 'leave',         'label' => 'Leave Management',    'description' => 'Requests, calendar, balances & approvals'],
        ['key' => 'payroll',       'label' => 'Payroll & Loans',     'description' => 'Salary structures, monthly runs, payslips & loans'],
        ['key' => 'recruitment',   'label' => 'Recruitment & Hiring','description' => 'Job postings, candidates, interviews & onboarding'],
        ['key' => 'performance',   'label' => 'Performance & Goals', 'description' => 'Annual reviews, KPI goals, promotions & warnings'],
        ['key' => 'assets',        'label' => 'Company Assets',      'description' => 'Asset tracking, serial numbers & allocations'],
        ['key' => 'documents',     'label' => 'Document Vault',      'description' => 'Employee contracts, certifications & files'],
        ['key' => 'offboarding',   'label' => 'Offboarding & Exits', 'description' => 'Resignations, exit surveys & clearance checklist'],
        ['key' => 'reports',       'label' => 'Analytics & Reports', 'description' => 'Comprehensive exports for HR & finance'],
        ['key' => 'announcements', 'label' => 'Announcements',       'description' => 'Broadcast company memos & bulletins'],
        ['key' => 'settings',      'label' => 'Company Settings',    'description' => 'Company profile, currency & operational policies'],
    ];

    public function owners(Request $request): Response
    {
        $query = User::with('company')
            ->where('role', 'company_owner')
            ->orderBy('name');

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
                  ->orWhereHas('company', fn($cq) => $cq->where('name', 'like', "%{$request->search}%"));
            });
        }

        $owners = $query->paginate(15)->through(function (User $u) {
            $employeeCount = Employee::where('company_id', $u->company_id)->count();
            return [
                'id'              => $u->id,
                'name'            => $u->name,
                'email'           => $u->email,
                'phone'           => $u->phone,
                'role'            => $u->role,
                'is_super_admin'  => $u->isSuperAdmin(),
                'is_active'       => $u->is_active,
                'company_id'      => $u->company_id,
                'company_name'    => $u->company?->name ?? 'No Workspace',
                'company_email'   => $u->company?->email,
                'company_phone'   => $u->company?->phone,
                'employee_count'  => $employeeCount,
                'allowed_modules' => $u->allowed_modules ?? ['*'],
                'created_at'      => $u->created_at->format('M d, Y'),
            ];
        });

        $totalBusinesses   = Company::whereHas('users', fn($q) => $q->where('role', 'company_owner'))->count();
        $totalOwners       = User::where('role', 'company_owner')->count();
        $totalDemoUsers    = User::where('role', 'demo')->count();
        $activeDemoSessions= DemoActivity::where('created_at', '>=', now()->subMinutes(30))
            ->distinct('visitor_key')->count('visitor_key');

        return Inertia::render('SuperAdmin/Owners', [
            'owners'            => $owners,
            'filters'           => $request->only(['search']),
            'availableModules'  => self::AVAILABLE_MODULES,
            'stats'             => [
                'totalBusinesses'    => $totalBusinesses,
                'totalOwners'        => $totalOwners,
                'totalDemoUsers'     => $totalDemoUsers,
                'activeDemoSessions' => $activeDemoSessions,
            ],
            'currentCompanyId'  => session('current_company_id'),
        ]);
    }

    public function storeOwner(Request $request)
    {
        $data = $request->validate([
            'business_name'   => ['required', 'string', 'max:255'],
            'business_email'  => ['nullable', 'email', 'max:255'],
            'business_phone'  => ['nullable', 'string', 'max:50'],
            'business_address'=> ['nullable', 'string', 'max:255'],
            'currency'        => ['nullable', 'string', 'max:10'],
            'name'            => ['required', 'string', 'max:255'],
            'email'           => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone'           => ['nullable', 'string', 'max:50'],
            'password'        => ['required', 'string', 'min:6'],
            'allowed_modules' => ['nullable', 'array'],
        ]);

        // 1. Create completely clean Company (empty workspace)
        $company = Company::create([
            'name'     => $data['business_name'],
            'email'    => $data['business_email'] ?? $data['email'],
            'phone'    => $data['business_phone'] ?? $data['phone'] ?? null,
            'address'  => $data['business_address'] ?? null,
            'currency' => $data['currency'] ?? 'PKR',
            'is_active'=> true,
        ]);

        // 2. Create one initial default branch for the clean workspace
        Branch::create([
            'company_id' => $company->id,
            'name'       => 'Main Branch',
            'city'       => 'Headquarters',
            'address'    => $data['business_address'] ?? null,
            'phone'      => $data['business_phone'] ?? null,
        ]);

        // 3. Modules selection (default to all if not specified)
        $allowed = !empty($data['allowed_modules'])
            ? array_values($data['allowed_modules'])
            : array_column(self::AVAILABLE_MODULES, 'key');

        // 4. Create Owner User
        User::create([
            'name'            => $data['name'],
            'email'           => strtolower($data['email']),
            'phone'           => $data['phone'] ?? null,
            'password'        => Hash::make($data['password']),
            'role'            => 'company_owner',
            'company_id'      => $company->id,
            'allowed_modules' => $allowed,
            'is_active'       => true,
        ]);

        return back()->with('success', "Business workspace '{$company->name}' and Owner '{$data['name']}' created successfully.");
    }

    public function updateOwner(Request $request, User $user)
    {
        abort_if($user->isSuperAdmin() && $user->id !== auth()->id(), 403);

        $data = $request->validate([
            'name'            => ['required', 'string', 'max:255'],
            'email'           => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone'           => ['nullable', 'string', 'max:50'],
            'password'        => ['nullable', 'string', 'min:6'],
            'allowed_modules' => ['nullable', 'array'],
            'is_active'       => ['boolean'],
            'business_name'   => ['nullable', 'string', 'max:255'],
        ]);

        $updateData = [
            'name'            => $data['name'],
            'email'           => strtolower($data['email']),
            'phone'           => $data['phone'] ?? null,
            'is_active'       => $data['is_active'] ?? $user->is_active,
            'allowed_modules' => !empty($data['allowed_modules']) ? array_values($data['allowed_modules']) : $user->allowed_modules,
        ];

        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $user->update($updateData);

        if (!empty($data['business_name']) && $user->company) {
            $user->company->update(['name' => $data['business_name']]);
        }

        return back()->with('success', "Account settings for '{$user->name}' updated successfully.");
    }

    public function destroyOwner(User $user)
    {
        abort_if($user->isSuperAdmin(), 403, 'Super Admin accounts cannot be deleted.');

        $company = $user->company;
        $userName = $user->name;

        $user->delete();

        // If the company has no other users or employees, clean it up
        if ($company && $company->users()->count() === 0 && $company->employees()->count() === 0) {
            $company->delete();
        }

        return back()->with('success', "Account '{$userName}' has been deleted.");
    }

    public function switchWorkspace(Company $company)
    {
        session(['current_company_id' => $company->id]);
        return redirect()->route('dashboard')->with('success', "Switched active workspace to '{$company->name}'.");
    }

    public function resetWorkspace()
    {
        session()->forget('current_company_id');
        return redirect()->route('super-admin.owners')->with('success', 'Reset workspace back to primary Super Admin account.');
    }

    public function demoLogs(Request $request): Response
    {
        $selectedVisitor = $request->visitor;
        $selectedModule  = $request->module;

        $query = DemoActivity::latest();

        if ($selectedVisitor) {
            $query->where(function ($q) use ($selectedVisitor) {
                $q->where('visitor_key', $selectedVisitor)
                  ->orWhere('demo_username', $selectedVisitor)
                  ->orWhere('demo_user_id', $selectedVisitor);
            });
        }

        if ($selectedModule) {
            $query->where('module', $selectedModule);
        }

        $activities = $query->paginate(30)->withQueryString();

        // Unique demo visitor list with click/activity counts
        $demoUsers = User::with('company')->where('role', 'demo')->orderBy('id')->get();
        $visitors = $demoUsers->map(function (User $du) {
            $visitorKey = \Illuminate\Support\Str::between($du->email, 'demo+', '@peopleflow.local');
            $activitiesQuery = DemoActivity::where(function ($q) use ($du, $visitorKey) {
                $q->where('demo_user_id', $du->id)
                  ->orWhere('demo_username', $du->name);
                if ($visitorKey) {
                    $q->orWhere('visitor_key', $visitorKey);
                }
            });

            $activityCount = (clone $activitiesQuery)->count();
            $latest = (clone $activitiesQuery)->latest()->first();
            $first = (clone $activitiesQuery)->oldest()->first();

            return [
                'user_id'        => $du->id,
                'visitor_key'    => $visitorKey ?: "demo_{$du->id}",
                'demo_username'  => $du->name, // demouser_1, demouser_2
                'company_name'   => $du->company?->name ?? "Demo Workspace",
                'os'             => $latest?->os ?? 'Windows 10/11',
                'browser'        => $latest?->browser ?? 'Browser',
                'ip_address'     => $latest?->ip_address ?? '127.0.0.1',
                'first_seen'     => $first?->created_at?->format('M d, Y H:i') ?? $du->created_at->format('M d, Y H:i'),
                'last_seen'      => $latest?->created_at?->diffForHumans() ?? 'Just now',
                'activity_count' => $activityCount,
            ];
        });

        $stats = [
            'totalEntries'        => DemoActivity::where('action', 'like', '%Entered demo%')->count(),
            'totalActions'        => DemoActivity::count(),
            'uniqueVisitors'      => DemoActivity::distinct('visitor_key')->count('visitor_key'),
            'activeLast30Minutes' => DemoActivity::where('created_at', '>=', now()->subMinutes(30))->distinct('visitor_key')->count('visitor_key'),
        ];

        return Inertia::render('SuperAdmin/DemoLogs', [
            'activities'       => $activities,
            'visitors'         => $visitors,
            'stats'            => $stats,
            'filters'          => $request->only(['visitor', 'module']),
            'availableModules' => array_column(self::AVAILABLE_MODULES, 'label'),
        ]);
    }

    public function clearDemoLogs()
    {
        DemoActivity::truncate();
        return back()->with('success', 'All demo activity logs have been cleared.');
    }
}
