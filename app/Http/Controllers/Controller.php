<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    /**
     * Get the active company ID for the current request.
     * Super Admin can switch between company workspaces via session.
     * Business Owners and Demo Users are strictly scoped to their own company workspace.
     */
    protected function companyId(): int
    {
        $user = Auth::user();
        if (!$user) {
            return 1;
        }

        if ($user->isSuperAdmin()) {
            return (int) session('current_company_id', $user->company_id ?: 1);
        }

        return (int) ($user->company_id ?: 1);
    }
}
