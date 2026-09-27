<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Department;
use App\Models\Interview;
use App\Models\JobOpening;
use App\Models\OfferLetter;
use App\Models\OnboardingTask;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RecruitmentController extends Controller
{
    private function companyId(): int { return Auth::user()->company_id; }

    public function jobs(): Response
    {
        return Inertia::render('Recruitment/Jobs', [
            'jobs'        => JobOpening::with('department:id,name')->withCount('candidates')->where('company_id', $this->companyId())->orderByDesc('created_at')->paginate(15),
            'departments' => Department::where('company_id', $this->companyId())->get(['id','name']),
            'summary'     => [
                'published' => JobOpening::where('company_id', $this->companyId())->where('status', 'published')->count(),
                'draft'     => JobOpening::where('company_id', $this->companyId())->where('status', 'draft')->count(),
                'closed'    => JobOpening::where('company_id', $this->companyId())->where('status', 'closed')->count(),
            ],
        ]);
    }

    public function storeJob(Request $request)
    {
        $data = $request->validate([
            'title'           => 'required|string',
            'department_id'   => 'nullable|exists:departments,id',
            'location'        => 'nullable|string',
            'employment_type' => 'required',
            'salary_min'      => 'nullable|numeric',
            'salary_max'      => 'nullable|numeric',
            'vacancies'       => 'required|integer|min:1',
            'requirements'    => 'nullable|string',
            'description'     => 'nullable|string',
            'deadline'        => 'nullable|date',
        ]);
        JobOpening::create(array_merge($data, ['company_id' => $this->companyId(), 'created_by' => Auth::id()]));
        return back()->with('success', 'Job opening created.');
    }

    public function updateJob(Request $request, JobOpening $job)
    {
        $job->update($request->validate(['status' => 'required|in:draft,published,closed,on_hold', 'title' => 'required|string']));
        return back()->with('success', 'Job updated.');
    }

    public function candidates(Request $request): Response
    {
        $query = Candidate::with('jobOpening:id,title')
            ->whereHas('jobOpening', fn($q) => $q->where('company_id', $this->companyId()));

        if ($request->stage) $query->where('stage', $request->stage);
        if ($request->job_id) $query->where('job_opening_id', $request->job_id);

        $stages = ['applied','screening','shortlisted','interview','selected','offer_sent','hired','rejected'];
        $pipeline = collect($stages)->mapWithKeys(fn($s) => [$s => Candidate::whereHas('jobOpening', fn($q) => $q->where('company_id', $this->companyId()))->where('stage', $s)->count()]);

        return Inertia::render('Recruitment/Candidates', [
            'candidates' => $query->orderByDesc('created_at')->paginate(15)->withQueryString(),
            'jobs'       => JobOpening::where('company_id', $this->companyId())->get(['id','title']),
            'pipeline'   => $pipeline,
            'stages'     => $stages,
            'filters'    => $request->only(['stage','job_id']),
        ]);
    }

    public function storeCandidate(Request $request)
    {
        $data = $request->validate([
            'name'            => 'required|string',
            'email'           => 'nullable|email',
            'phone'           => 'nullable|string',
            'job_opening_id'  => 'nullable|exists:job_openings,id',
            'experience_years'=> 'nullable|integer',
            'expected_salary' => 'nullable|numeric',
            'source'          => 'nullable|string',
            'skills'          => 'nullable|string',
        ]);
        Candidate::create($data);
        return back()->with('success', 'Candidate added.');
    }

    public function updateStage(Request $request, Candidate $candidate)
    {
        $candidate->update($request->validate(['stage' => 'required|in:applied,screening,shortlisted,interview,selected,offer_sent,hired,rejected']));
        return back()->with('success', 'Candidate stage updated.');
    }

    public function interviews(): Response
    {
        return Inertia::render('Recruitment/Interviews', [
            'interviews' => Interview::with(['candidate:id,name', 'interviewer:id,name'])->whereHas('candidate.jobOpening', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('scheduled_at')->paginate(15),
            'candidates' => Candidate::whereHas('jobOpening', fn($q) => $q->where('company_id', $this->companyId()))->whereIn('stage', ['shortlisted','interview'])->get(['id','name']),
            'interviewers'=> Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
        ]);
    }

    public function storeInterview(Request $request)
    {
        $data = $request->validate(['candidate_id' => 'required|exists:candidates,id', 'interviewer_id' => 'nullable|exists:users,id', 'scheduled_at' => 'required|date', 'type' => 'required', 'location' => 'nullable|string', 'meeting_link' => 'nullable|url']);
        Interview::create($data);
        Candidate::find($data['candidate_id'])->update(['stage' => 'interview']);
        return back()->with('success', 'Interview scheduled.');
    }

    public function offers(): Response
    {
        return Inertia::render('Recruitment/Offers', [
            'offers'     => OfferLetter::with('candidate:id,name')->whereHas('candidate.jobOpening', fn($q) => $q->where('company_id', $this->companyId()))->orderByDesc('created_at')->paginate(15),
            'candidates' => Candidate::whereHas('jobOpening', fn($q) => $q->where('company_id', $this->companyId()))->where('stage', 'selected')->get(['id','name']),
        ]);
    }

    public function storeOffer(Request $request)
    {
        $data = $request->validate(['candidate_id' => 'required|exists:candidates,id', 'position' => 'required|string', 'salary' => 'required|numeric', 'joining_date' => 'required|date', 'offer_expiry' => 'nullable|date']);
        $offer = OfferLetter::create(array_merge($data, ['status' => 'sent', 'sent_at' => now()]));
        Candidate::find($data['candidate_id'])->update(['stage' => 'offer_sent']);
        return back()->with('success', 'Offer letter sent.');
    }

    public function onboarding(): Response
    {
        $tasks = OnboardingTask::with('employee:id,first_name,last_name')
            ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()))
            ->orderBy('sort_order')
            ->get()
            ->groupBy('employee_id');

        return Inertia::render('Recruitment/Onboarding', [
            'taskGroups' => $tasks,
            'employees'  => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
        ]);
    }

    public function completeTask(Request $request, OnboardingTask $task)
    {
        $task->update(['is_completed' => true, 'completed_at' => now()]);
        return back()->with('success', 'Task completed.');
    }
}
