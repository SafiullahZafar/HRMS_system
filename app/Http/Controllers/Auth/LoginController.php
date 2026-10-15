<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\DemoActivity;
use App\Models\User;
use Database\Seeders\DemoWorkspaceSeeder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // Auto-verify super admin from .env if credentials match
        $superAdminEmail = config('app.super_admin_email', 'safullahzafar@gmail.com');
        $superAdminPass  = config('app.super_admin_password', '12345678');
        if (strtolower($credentials['email']) === strtolower($superAdminEmail)) {
            User::ensureSuperAdminExists();
        }

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            $user = Auth::user();

            if ($user->isSuperAdmin()) {
                $request->session()->forget('current_company_id');
                return redirect()->route('super-admin.owners');
            }

            return redirect()->intended(route('dashboard'));
        }

        return back()->withErrors(['email' => 'These credentials do not match our records.']);
    }

    public function demo(Request $request)
    {
        // Check for persistent browser cookie or session visitor key
        $visitorKey = $request->cookie('pf_demo_visitor') ?: $request->session()->get('demo_visitor_key');
        $demoUser = null;

        if ($visitorKey) {
            $demoUser = User::where('email', "demo+{$visitorKey}@peopleflow.local")->first();
        }

        if ($demoUser) {
            // Existing visitor in the same browser -> resume their exact workspace!
            Auth::login($demoUser);
            $request->session()->regenerate();
            $request->session()->put('demo_visitor_key', $visitorKey);

            DemoActivity::record($request, 'Entered demo (resumed existing session)', 'Demo Gateway');

            return redirect()->route('dashboard')
                ->withCookie(cookie('pf_demo_visitor', $visitorKey, 60 * 24 * 30))
                ->with('success', "Welcome back! Resumed your session as {$demoUser->name}.");
        }

        // New browser / visitor
        $newVisitorKey = (string) Str::uuid();
        $demoNumber = User::where('role', 'demo')->count() + 1;
        $demoUsername = "demouser_{$demoNumber}";
        $demoDisplayName = "demouser_{$demoNumber}";

        // 1. Create isolated demo company for this browser
        $company = Company::create([
            'name'     => "Demo Workspace {$demoNumber}",
            'email'    => "demo{$demoNumber}@peopleflow.local",
            'phone'    => '+92-42-35123456',
            'address'  => 'Demo Innovation Center, Lahore',
            'currency' => 'PKR',
            'timezone' => 'Asia/Karachi',
            'industry' => 'Information Technology',
            'is_active'=> true,
        ]);

        // 2. Create demo user
        $demoUser = User::create([
            'name'            => $demoDisplayName,
            'email'           => "demo+{$newVisitorKey}@peopleflow.local",
            'password'        => Hash::make(Str::random(32)),
            'role'            => 'demo',
            'company_id'      => $company->id,
            'is_active'       => true,
            'allowed_modules' => ['*'],
        ]);

        // 3. Seed exactly 7 items in each module
        app(DemoWorkspaceSeeder::class)->seed($company->id, $demoUser->id);

        Auth::login($demoUser);
        $request->session()->regenerate();
        $request->session()->put('demo_visitor_key', $newVisitorKey);
        $request->session()->put('demo_username', $demoUsername);

        DemoActivity::record($request, 'Entered demo (created new session)', 'Demo Gateway');

        return redirect()->route('dashboard')
            ->withCookie(cookie('pf_demo_visitor', $newVisitorKey, 60 * 24 * 30))
            ->with('success', "Welcome to PeopleFlow Demo! You are logged in as {$demoDisplayName}.");
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'You have been successfully logged out.');
    }
}
