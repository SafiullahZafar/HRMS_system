<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    private function companyId(): int { return Auth::user()->company_id; }

    public function index(Request $request): Response
    {
        $query = Document::with('employee:id,first_name,last_name')
            ->whereHas('employee', fn($q) => $q->where('company_id', $this->companyId()));

        if ($request->employee_id) $query->where('employee_id', $request->employee_id);
        if ($request->category) $query->where('category', $request->category);

        return Inertia::render('Documents/Index', [
            'documents'  => $query->orderByDesc('created_at')->paginate(20)->withQueryString(),
            'employees'  => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
            'categories' => ['cnic','cv','degree','contract','salary_letter','warning','experience_letter','nda','certificate'],
            'filters'    => $request->only(['employee_id','category']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['employee_id' => 'required|exists:employees,id', 'title' => 'required|string', 'category' => 'required|string', 'file' => 'required|file|max:10240']);
        $path = $request->file('file')->store('documents', 'public');
        Document::create([
            'employee_id' => $request->employee_id,
            'title'       => $request->title,
            'category'    => $request->category,
            'file_path'   => $path,
            'file_type'   => $request->file('file')->getMimeType(),
            'file_size'   => $request->file('file')->getSize(),
            'uploaded_by' => Auth::id(),
        ]);
        return back()->with('success', 'Document uploaded.');
    }

    public function destroy(Document $document)
    {
        $document->delete();
        return back()->with('success', 'Document deleted.');
    }
}
