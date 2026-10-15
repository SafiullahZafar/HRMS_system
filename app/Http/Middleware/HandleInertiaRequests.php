<?php

namespace App\Http\Middleware;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $isSuperAdmin = $user?->isSuperAdmin() ?? false;
        $activeCompanyId = null;
        $activeCompany = null;

        if ($user) {
            $activeCompanyId = $isSuperAdmin
                ? (int) session('current_company_id', $user->company_id ?: 1)
                : (int) ($user->company_id ?: 1);

            $activeCompany = Company::find($activeCompanyId);
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id'              => $user->id,
                    'name'            => $user->name,
                    'email'           => $user->email,
                    'role'            => $user->role,
                    'avatar'          => $user->avatar,
                    'company_id'      => $user->company_id,
                    'is_super_admin'  => $isSuperAdmin,
                    'is_demo'         => $user->isDemoUser(),
                    'allowed_modules' => $isSuperAdmin ? ['*'] : ($user->allowed_modules ?? ['*']),
                ] : null,
            ],
            'current_workspace' => $activeCompany ? [
                'id'       => $activeCompany->id,
                'name'     => $activeCompany->name,
                'currency' => $activeCompany->currency,
            ] : null,
            'is_super_admin_viewing_other' => $isSuperAdmin && session('current_company_id') && session('current_company_id') != $user?->company_id,
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
            ],
        ]);
    }
}
