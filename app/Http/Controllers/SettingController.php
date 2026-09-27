<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        $company = Company::find(Auth::user()->company_id);
        return Inertia::render('Settings/Index', ['company' => $company]);
    }

    public function updateCompany(Request $request)
    {
        $company = Company::find(Auth::user()->company_id);
        $data = $request->validate([
            'name'     => 'required|string',
            'email'    => 'nullable|email',
            'phone'    => 'nullable|string',
            'address'  => 'nullable|string',
            'currency' => 'nullable|string',
            'timezone' => 'nullable|string',
            'website'  => 'nullable|string',
            'ntn'      => 'nullable|string',
        ]);
        $company->update($data);
        return back()->with('success', 'Company settings saved.');
    }

    public function roles(): Response
    {
        return Inertia::render('Settings/Roles', [
            'users' => User::where('company_id', Auth::user()->company_id)->get(['id','name','email','role','is_active']),
            'roles' => ['super_admin','company_owner','hr_manager','hr_officer','dept_manager','payroll_officer','accountant','employee'],
        ]);
    }
}
