<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModuleAccess
{
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        if ($module === 'super-admin') {
            abort(403, 'Unauthorized. Super Admin access required.');
        }

        if (!$user->hasModuleAccess($module)) {
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                abort(403, "Access to the '{$module}' module is not enabled for your account. Please contact your administrator.");
            }
            return redirect()->route('dashboard')->with('error', "Access to the '{$module}' module is restricted.");
        }

        return $next($request);
    }
}
