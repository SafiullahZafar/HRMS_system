<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetAssignment;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    private function companyId(): int { return Auth::user()->company_id; }

    public function index(Request $request): Response
    {
        $query = Asset::with(['currentAssignment.employee:id,first_name,last_name'])->where('company_id', $this->companyId());
        if ($request->status) $query->where('status', $request->status);
        if ($request->category) $query->where('category', $request->category);

        return Inertia::render('Assets/Index', [
            'assets'     => $query->orderByDesc('created_at')->paginate(15)->withQueryString(),
            'employees'  => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
            'categories' => Asset::where('company_id', $this->companyId())->distinct()->pluck('category'),
            'summary'    => ['available' => Asset::where('company_id',$this->companyId())->where('status','available')->count(), 'assigned' => Asset::where('company_id',$this->companyId())->where('status','assigned')->count(), 'maintenance' => Asset::where('company_id',$this->companyId())->where('status','maintenance')->count()],
            'filters'    => $request->only(['status','category']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string', 'category' => 'required|string', 'brand' => 'nullable|string', 'model' => 'nullable|string', 'serial_number' => 'nullable|string', 'purchase_value' => 'nullable|numeric', 'purchase_date' => 'nullable|date', 'condition' => 'required|in:new,good,fair,poor']);

        $last = Asset::where('company_id', $this->companyId())->orderByDesc('id')->first();
        $num  = $last ? (intval(substr($last->asset_id, 4)) + 1) : 1;
        $data['asset_id'] = 'AST-' . str_pad($num, 5, '0', STR_PAD_LEFT);
        $data['company_id'] = $this->companyId();

        Asset::create($data);
        return back()->with('success', 'Asset added.');
    }

    public function show(Asset $asset): Response
    {
        return Inertia::render('Assets/Show', [
            'asset'     => $asset->load(['assignments.employee:id,first_name,last_name', 'currentAssignment.employee']),
            'employees' => Employee::where('company_id', $this->companyId())->where('status','active')->get(['id','first_name','last_name']),
        ]);
    }

    public function update(Request $request, Asset $asset)
    {
        $asset->update($request->validate(['name' => 'required|string', 'condition' => 'required', 'status' => 'required', 'notes' => 'nullable|string']));
        return back()->with('success', 'Asset updated.');
    }

    public function destroy(Asset $asset)
    {
        $asset->update(['status' => 'retired']);
        return back()->with('success', 'Asset retired.');
    }

    public function assign(Request $request, Asset $asset)
    {
        $data = $request->validate(['employee_id' => 'required|exists:employees,id', 'condition_on_assign' => 'required|in:new,good,fair,poor', 'notes' => 'nullable|string']);
        $data['asset_id']      = $asset->id;
        $data['assigned_date'] = now()->toDateString();
        AssetAssignment::create($data);
        $asset->update(['status' => 'assigned']);
        return back()->with('success', 'Asset assigned.');
    }

    public function returnAsset(Request $request, Asset $asset)
    {
        $assignment = $asset->currentAssignment;
        if ($assignment) {
            $assignment->update(['is_returned' => true, 'return_date' => now()->toDateString(), 'condition_on_return' => $request->condition_on_return ?? 'good']);
            $asset->update(['status' => 'available', 'condition' => $request->condition_on_return ?? 'good']);
        }
        return back()->with('success', 'Asset returned.');
    }
}
