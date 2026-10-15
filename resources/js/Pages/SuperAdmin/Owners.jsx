import { useState } from 'react';
import { useForm, router, Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
  Building2, Users, Shield, Plus, Search, Edit2, Trash2,
  CheckCircle, XCircle, ArrowRight, Eye, Key, Phone, Mail,
  Lock, Check, X, ShieldAlert, Sparkles, Layers, RefreshCw
} from 'lucide-react';

export default function Owners({ owners, filters, availableModules, stats, currentCompanyId }) {
  const [search, setSearch] = useState(filters.search || '');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);

  // Form for creating a new business account
  const createForm = useForm({
    business_name: '',
    business_email: '',
    business_phone: '',
    business_address: '',
    currency: 'PKR',
    name: '',
    email: '',
    phone: '',
    password: '',
    allowed_modules: availableModules.map(m => m.key),
  });

  // Form for editing an owner & toggling module access
  const editForm = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    business_name: '',
    is_active: true,
    allowed_modules: [],
  });

  const handleSearch = (e) => {
    e.preventDefault();
    router.get('/super-admin/owners', { search }, { preserveState: true, replace: true });
  };

  const handleOpenEdit = (owner) => {
    setEditingOwner(owner);
    editForm.setData({
      name: owner.name,
      email: owner.email,
      phone: owner.phone || '',
      password: '',
      business_name: owner.company_name || '',
      is_active: Boolean(owner.is_active),
      allowed_modules: Array.isArray(owner.allowed_modules) && owner.allowed_modules[0] === '*'
        ? availableModules.map(m => m.key)
        : (owner.allowed_modules || []),
    });
    setEditModalOpen(true);
  };

  const submitCreate = (e) => {
    e.preventDefault();
    createForm.post('/super-admin/owners', {
      onSuccess: () => {
        setCreateModalOpen(false);
        createForm.reset();
      },
    });
  };

  const submitEdit = (e) => {
    e.preventDefault();
    editForm.put(`/super-admin/owners/${editingOwner.id}`, {
      onSuccess: () => {
        setEditModalOpen(false);
        setEditingOwner(null);
      },
    });
  };

  const handleDelete = (owner) => {
    if (confirm(`Are you sure you want to delete account '${owner.name}' (${owner.company_name})? This cannot be undone.`)) {
      router.delete(`/super-admin/owners/${owner.id}`);
    }
  };

  const handleSwitchWorkspace = (companyId) => {
    router.post(`/super-admin/switch-workspace/${companyId}`);
  };

  const toggleCreateModule = (key) => {
    const current = createForm.data.allowed_modules;
    if (current.includes(key)) {
      createForm.setData('allowed_modules', current.filter(k => k !== key));
    } else {
      createForm.setData('allowed_modules', [...current, key]);
    }
  };

  const toggleEditModule = (key) => {
    const current = editForm.data.allowed_modules;
    if (current.includes(key)) {
      editForm.setData('allowed_modules', current.filter(k => k !== key));
    } else {
      editForm.setData('allowed_modules', [...current, key]);
    }
  };

  const selectAllCreate = () => createForm.setData('allowed_modules', availableModules.map(m => m.key));
  const deselectAllCreate = () => createForm.setData('allowed_modules', ['dashboard']);

  const selectAllEdit = () => editForm.setData('allowed_modules', availableModules.map(m => m.key));
  const deselectAllEdit = () => editForm.setData('allowed_modules', ['dashboard']);

  return (
    <AppLayout title="Business Accounts & Owners">
      <Head title="Business Accounts & Owners - Super Admin" />

      <div className="space-y-6">

        {/* Header Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                Super Admin Portal
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-950 mt-1">Business Accounts & Owners</h2>
            <p className="text-gray-500 text-sm">
              Create and manage isolated company workspaces, assign owner credentials, and configure module access permissions.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition cursor-pointer"
          >
            <Plus size={18} />
            <span>Create Business Account</span>
          </button>
        </div>

        {/* ── SUPER ADMIN CATEGORIES ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-gray-200/70 rounded-2xl border border-gray-200">
          <Link
            href="/super-admin/owners"
            className="flex items-center justify-between p-3.5 rounded-xl bg-white shadow-xs border border-amber-300 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <Building2 size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-950 flex items-center gap-2">
                  <span>Category 1: Business Accounts & Owners</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">Active</span>
                </p>
                <p className="text-xs text-gray-500">Create client workspaces, owner credentials & configure modules</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
              {stats.totalOwners} Owners
            </span>
          </Link>

          <Link
            href="/super-admin/demo-logs"
            className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/80 transition text-gray-600 border border-transparent hover:border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800 flex items-center gap-2">
                  <span>Category 2: Demo Users & Activity Logs</span>
                </p>
                <p className="text-xs text-gray-500">demouser_1, demouser_2... device info, click counts & activity logs</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
              {stats.totalDemoUsers} Demo Users
            </span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Total Businesses</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalBusinesses}</p>
            <p className="text-xs text-gray-400 mt-0.5">Isolated company databases</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Business Owners</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOwners}</p>
            <p className="text-xs text-gray-400 mt-0.5">Primary business accounts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Demo Users</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalDemoUsers}</p>
            <p className="text-xs text-gray-400 mt-0.5">Temporary sandboxes generated</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Active Demo Sessions</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Shield size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeDemoSessions}</p>
            <p className="text-xs text-gray-400 mt-0.5">Visitors in last 30 minutes</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by owner name, email, or company..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
          </form>

          <span className="text-xs text-gray-500 font-medium">
            Showing {owners.data?.length ?? 0} accounts
          </span>
        </div>

        {/* Owners Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Business & Workspace</th>
                  <th className="py-3 px-4">Owner Details</th>
                  <th className="py-3 px-4">Allowed Modules</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {owners.data?.map((owner) => {
                  const isCurrent = currentCompanyId && currentCompanyId == owner.company_id;
                  const isSuper = owner.is_super_admin;
                  const moduleList = Array.isArray(owner.allowed_modules) && owner.allowed_modules[0] === '*'
                    ? 'All Modules (13)'
                    : `${owner.allowed_modules?.length || 0} Modules`;

                  return (
                    <tr key={owner.id} className="hover:bg-slate-50/80 transition">
                      {/* Business info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isSuper ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
                          }`}>
                            <Building2 size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                              {owner.company_name}
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-bold">
                                  Current Active
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {owner.employee_count} {owner.employee_count === 1 ? 'employee' : 'employees'} in workspace
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Owner Details */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-gray-900 flex items-center gap-1">
                            {owner.name}
                            {isSuper && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                                Super Admin
                              </span>
                            )}
                          </p>
                          <p className="text-gray-500 font-mono text-[11px]">{owner.email}</p>
                          {owner.phone && (
                            <p className="text-gray-400 text-[11px] flex items-center gap-1">
                              <Phone size={10} /> {owner.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Allowed Modules */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isSuper || moduleList.includes('All')
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-gray-100 text-gray-700 border border-gray-200'
                          }`}>
                            {moduleList}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {owner.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>

                      {/* Created date */}
                      <td className="py-3.5 px-4 text-gray-500">
                        {owner.created_at}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Workspace Switch button */}
                          {owner.company_id && (
                            <button
                              onClick={() => handleSwitchWorkspace(owner.company_id)}
                              title="Inspect this workspace"
                              className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 font-semibold text-[11px] transition flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={13} />
                              <span>View HRM</span>
                            </button>
                          )}

                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(owner)}
                            title="Edit account & allowed modules"
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-amber-700 transition cursor-pointer"
                          >
                            <Edit2 size={14} />
                          </button>

                          {/* Delete button (cannot delete super admin) */}
                          {!isSuper && (
                            <button
                              onClick={() => handleDelete(owner)}
                              title="Delete account"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {owners.data?.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No business accounts found. Click "Create Business Account" to add the first one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CREATE MODAL ─────────────────────────────────────── */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Create New Business & Owner Account</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    This initializes an isolated workspace with completely clean, empty data.
                  </p>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitCreate} className="space-y-5">
                {/* Section 1: Business Details */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg mb-3">
                    1. Business Workspace Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Business Name *</label>
                      <input
                        type="text"
                        required
                        value={createForm.data.business_name}
                        onChange={e => createForm.setData('business_name', e.target.value)}
                        placeholder="e.g. Apex Technologies Pvt Ltd"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      {createForm.errors.business_name && (
                        <p className="text-red-600 text-[11px] mt-1">{createForm.errors.business_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Operating Currency</label>
                      <input
                        type="text"
                        value={createForm.data.currency}
                        onChange={e => createForm.setData('currency', e.target.value)}
                        placeholder="PKR, USD, etc."
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Business Phone</label>
                      <input
                        type="text"
                        value={createForm.data.business_phone}
                        onChange={e => createForm.setData('business_phone', e.target.value)}
                        placeholder="+92-300-1234567"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Office Address</label>
                      <input
                        type="text"
                        value={createForm.data.business_address}
                        onChange={e => createForm.setData('business_address', e.target.value)}
                        placeholder="Office #12, Tech Park, Lahore"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Owner Credentials */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg mb-3">
                    2. Owner Login Credentials
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Owner Full Name *</label>
                      <input
                        type="text"
                        required
                        value={createForm.data.name}
                        onChange={e => createForm.setData('name', e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {createForm.errors.name && (
                        <p className="text-red-600 text-[11px] mt-1">{createForm.errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Owner Email *</label>
                      <input
                        type="email"
                        required
                        value={createForm.data.email}
                        onChange={e => createForm.setData('email', e.target.value)}
                        placeholder="owner@company.com"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {createForm.errors.email && (
                        <p className="text-red-600 text-[11px] mt-1">{createForm.errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Owner Mobile Phone</label>
                      <input
                        type="text"
                        value={createForm.data.phone}
                        onChange={e => createForm.setData('phone', e.target.value)}
                        placeholder="+92-321-7654321"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Password * (Min 6 chars)</label>
                      <input
                        type="password"
                        required
                        value={createForm.data.password}
                        onChange={e => createForm.setData('password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {createForm.errors.password && (
                        <p className="text-red-600 text-[11px] mt-1">{createForm.errors.password}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Allowed Modules */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg">
                      3. Module Access Permissions ({createForm.data.allowed_modules.length} Enabled)
                    </h4>
                    <div className="space-x-2 text-[11px]">
                      <button
                        type="button"
                        onClick={selectAllCreate}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={deselectAllCreate}
                        className="text-gray-500 hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50">
                    {availableModules.map(m => {
                      const isChecked = createForm.data.allowed_modules.includes(m.key);
                      return (
                        <label
                          key={m.key}
                          className={`flex items-start gap-2.5 p-2 rounded-lg border transition cursor-pointer ${
                            isChecked
                              ? 'bg-white border-blue-200 shadow-2xs'
                              : 'bg-transparent border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCreateModule(m.key)}
                            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <span className="block text-xs font-semibold text-gray-900">{m.label}</span>
                            <span className="block text-[10px] text-gray-500 leading-tight">{m.description}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createForm.processing}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {createForm.processing ? 'Creating Account…' : 'Create Business & Owner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── EDIT MODAL ───────────────────────────────────────── */}
        {editModalOpen && editingOwner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Edit Account & Module Access: {editingOwner.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Modify profile details, reset password, or toggle module permissions.
                  </p>
                </div>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitEdit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Business Name</label>
                    <input
                      type="text"
                      value={editForm.data.business_name}
                      onChange={e => editForm.setData('business_name', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Owner Name *</label>
                    <input
                      type="text"
                      required
                      value={editForm.data.name}
                      onChange={e => editForm.setData('name', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editForm.data.email}
                      onChange={e => editForm.setData('email', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editForm.data.phone}
                      onChange={e => editForm.setData('phone', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      value={editForm.data.password}
                      onChange={e => editForm.setData('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.data.is_active}
                        onChange={e => editForm.setData('is_active', e.target.checked)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Account Active & Enabled</span>
                    </label>
                  </div>
                </div>

                {/* Module Permissions Checkboxes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg">
                      Module Access Permissions ({editForm.data.allowed_modules.length} Enabled)
                    </h4>
                    <div className="space-x-2 text-[11px]">
                      <button
                        type="button"
                        onClick={selectAllEdit}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={deselectAllEdit}
                        className="text-gray-500 hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50">
                    {availableModules.map(m => {
                      const isChecked = editForm.data.allowed_modules.includes(m.key);
                      return (
                        <label
                          key={m.key}
                          className={`flex items-start gap-2.5 p-2 rounded-lg border transition cursor-pointer ${
                            isChecked
                              ? 'bg-white border-blue-200 shadow-2xs'
                              : 'bg-transparent border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleEditModule(m.key)}
                            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <span className="block text-xs font-semibold text-gray-900">{m.label}</span>
                            <span className="block text-[10px] text-gray-500 leading-tight">{m.description}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editForm.processing}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {editForm.processing ? 'Saving Changes…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
