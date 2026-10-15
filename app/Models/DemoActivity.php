<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DemoActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_key',
        'demo_user_id',
        'demo_username',
        'action',
        'module',
        'path',
        'method',
        'ip_address',
        'os',
        'browser',
        'user_agent',
    ];

    public function demoUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'demo_user_id');
    }

    public static function parseAgent(?string $userAgent): array
    {
        $ua = $userAgent ?? '';
        $os = 'Unknown OS';
        if (preg_match('/windows nt 10/i', $ua)) {
            $os = 'Windows 10/11';
        } elseif (preg_match('/windows nt 6\.3/i', $ua)) {
            $os = 'Windows 8.1';
        } elseif (preg_match('/windows nt 6\.1/i', $ua)) {
            $os = 'Windows 7';
        } elseif (preg_match('/windows nt/i', $ua)) {
            $os = 'Windows';
        } elseif (preg_match('/macintosh|mac os x/i', $ua)) {
            $os = 'Mac OS';
        } elseif (preg_match('/android/i', $ua)) {
            $os = 'Android';
        } elseif (preg_match('/iphone|ipad|ipod/i', $ua)) {
            $os = 'iOS';
        } elseif (preg_match('/linux/i', $ua)) {
            $os = 'Linux';
        }

        $browser = 'Unknown Browser';
        if (preg_match('/edg/i', $ua)) {
            $browser = 'Microsoft Edge';
        } elseif (preg_match('/chrome/i', $ua) && !preg_match('/edg/i', $ua)) {
            $browser = 'Google Chrome';
        } elseif (preg_match('/firefox/i', $ua)) {
            $browser = 'Mozilla Firefox';
        } elseif (preg_match('/safari/i', $ua) && !preg_match('/chrome/i', $ua)) {
            $browser = 'Apple Safari';
        } elseif (preg_match('/opera|opr/i', $ua)) {
            $browser = 'Opera';
        }

        return ['os' => $os, 'browser' => $browser];
    }

    public static function detectModule(string $path): string
    {
        $path = trim($path, '/');
        if (empty($path)) return 'Dashboard';

        $firstSegment = explode('/', $path)[0];
        return match ($firstSegment) {
            'employees', 'departments', 'designations', 'org-chart' => 'Employees',
            'attendance' => 'Attendance',
            'leave' => 'Leave',
            'payroll' => 'Payroll',
            'recruitment' => 'Recruitment',
            'performance' => 'Performance',
            'assets' => 'Assets',
            'documents' => 'Documents',
            'offboarding' => 'Offboarding',
            'reports' => 'Reports',
            'announcements' => 'Announcements',
            'settings' => 'Settings',
            'super-admin' => 'Super Admin',
            'demo' => 'Demo Gateway',
            default => ucfirst($firstSegment),
        };
    }

    public static function record(Request $request, string $action, ?string $module = null): self
    {
        $visitorKey = $request->cookie('pf_demo_visitor')
            ?: $request->session()->get('demo_visitor_key')
            ?: (string) Str::uuid();

        $user = $request->user();
        $demoUsername = $user?->name ?? $request->session()->get('demo_username', 'demouser');

        $ua = $request->userAgent();
        $parsed = static::parseAgent($ua);
        $path = substr($request->path(), 0, 500);

        if (!$module) {
            $module = static::detectModule($path);
        }

        return static::create([
            'visitor_key'   => $visitorKey,
            'demo_user_id'  => $user?->id,
            'demo_username' => $demoUsername,
            'action'        => $action,
            'module'        => $module,
            'path'          => $path,
            'method'        => $request->method(),
            'ip_address'    => $request->ip(),
            'os'            => $parsed['os'],
            'browser'       => $parsed['browser'],
            'user_agent'    => substr((string) $ua, 0, 1000),
        ]);
    }
}
