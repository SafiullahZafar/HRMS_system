<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    private function companyId(): int { return Auth::user()->company_id; }

    public function index(): Response
    {
        return Inertia::render('Announcements/Index', [
            'announcements' => Announcement::with('createdBy:id,name')
                ->where('company_id', $this->companyId())
                ->orderByDesc('created_at')
                ->paginate(15),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['title' => 'required|string', 'content' => 'required|string', 'audience' => 'required|in:all,branch,department,specific', 'audience_ids' => 'nullable|array', 'priority' => 'required|in:low,medium,high', 'is_published' => 'boolean']);
        Announcement::create(array_merge($data, ['company_id' => $this->companyId(), 'created_by' => Auth::id(), 'publish_at' => now()]));
        return back()->with('success', 'Announcement published.');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $announcement->update($request->validate(['title' => 'required|string', 'content' => 'required|string', 'is_published' => 'boolean']));
        return back()->with('success', 'Announcement updated.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return back()->with('success', 'Announcement deleted.');
    }
}
