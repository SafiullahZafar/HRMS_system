<?php

namespace App\Http\Middleware;

use App\Models\DemoActivity;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackDemoActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $user = $request->user();
        if ($user && $user->isDemoUser()) {
            $path = $request->path();

            // Skip internal / static / logout redirects
            if (in_array($path, ['logout', 'up'], true)) {
                return $response;
            }

            $module = DemoActivity::detectModule($path);
            $action = 'Viewed ' . $module;

            if ($request->isMethod('POST')) {
                $action = 'Created / Submitted ' . $module;
            } elseif ($request->isMethod('PUT') || $request->isMethod('PATCH')) {
                $action = 'Updated ' . $module;
            } elseif ($request->isMethod('DELETE')) {
                $action = 'Deleted ' . $module;
            }

            // Only track non-asset Inertia or HTML requests
            if (!$request->is('build/*', 'vendor/*', '*.js', '*.css', '*.png', '*.jpg')) {
                DemoActivity::record($request, $action, $module);
            }
        }

        return $response;
    }
}
