import { useState } from 'react';
import { router, Head, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import {
  Activity, Users, Sparkles, Filter, Trash2, Clock, Globe,
  Monitor, Smartphone, Laptop, CheckCircle2, ArrowRight, X,
  Search, RefreshCw, ShieldAlert, Cpu, Eye, MousePointerClick,
  Building2
} from 'lucide-react';

export default function DemoLogs({ activities, visitors, stats, filters, availableModules }) {
  const [selectedVisitor, setSelectedVisitor] = useState(filters.visitor || '');
  const [selectedModule, setSelectedModule] = useState(filters.module || '');

  const applyFilters = (visitor = selectedVisitor, module = selectedModule, scrollToLogs = true) => {
    setSelectedVisitor(visitor);
    setSelectedModule(module);
    router.get('/super-admin/demo-logs', {
      visitor: visitor || undefined,
      module: module || undefined,
    }, {
      preserveState: true,
      replace: true,
      onSuccess: () => {
        if (scrollToLogs && visitor) {
          setTimeout(() => {
            const el = document.getElementById('detailed-logs-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    });
  };

  const handleClearFilter = () => {
    setSelectedVisitor('');
    setSelectedModule('');
    router.get('/super-admin/demo-logs', {}, { preserveState: true, replace: true });
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to delete all demo activity logs? This action cannot be undone.')) {
      router.delete('/super-admin/demo-logs/clear');
    }
  };

  const getOsIcon = (os) => {
    const o = (os || '').toLowerCase();
    if (o.includes('windows')) return <Laptop size={14} className="text-blue-500" />;
    if (o.includes('linux')) return <Cpu size={14} className="text-amber-500" />;
    if (o.includes('mac')) return <Monitor size={14} className="text-gray-700" />;
    if (o.includes('android') || o.includes('ios')) return <Smartphone size={14} className="text-emerald-500" />;
    return <Globe size={14} className="text-gray-400" />;
  };

  return (
    <AppLayout title="Demo Visitor & Device Logs">
      <Head title="Demo Visitor Logs - Super Admin" />

      <div className="space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                Super Admin Monitoring
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-950 mt-1">Demo Users & Real-Time Activity Logs</h2>
            <p className="text-gray-500 text-sm">
              Track demo accounts (demouser_1, demouser_2...), monitor visitor operating systems, IP addresses, click counts, and inspect detailed actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.reload()}
              className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleClearLogs}
              className="px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear All Logs</span>
            </button>
          </div>
        </div>

        {/* ── SUPER ADMIN CATEGORIES ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-gray-200/70 rounded-2xl border border-gray-200">
          <Link
            href="/super-admin/owners"
            className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white/80 transition text-gray-600 border border-transparent hover:border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800 flex items-center gap-2">
                  <span>Category 1: Business Accounts & Owners</span>
                </p>
                <p className="text-xs text-gray-500">Create client workspaces, owner credentials & configure modules</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
              Manage Owners
            </span>
          </Link>

          <Link
            href="/super-admin/demo-logs"
            className="flex items-center justify-between p-3.5 rounded-xl bg-white shadow-xs border border-indigo-300 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-950 flex items-center gap-2">
                  <span>Category 2: Demo Users & Activity Logs</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase tracking-wider">Active</span>
                </p>
                <p className="text-xs text-gray-500">demouser_1, demouser_2... device info, click counts & activity logs</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
              {visitors.length} Demo Users
            </span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Total Demo Entries</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalEntries}</p>
            <p className="text-xs text-gray-400 mt-0.5">Visits to /demo portal</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Total Clicks & Actions</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MousePointerClick size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalActions}</p>
            <p className="text-xs text-gray-400 mt-0.5">Clicks, page loads & queries</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Demo Users Generated</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{visitors.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">demouser_1, demouser_2, etc.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Active (Last 30m)</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.activeLast30Minutes}</p>
            <p className="text-xs text-gray-400 mt-0.5">Concurrent visitors online</p>
          </div>
        </div>

        {/* ── DEMO USERS SUMMARY TABLE ────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" />
                <span>Demo Visitors Directory (Click "See Logs" to inspect actions)</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Each browser session gets an isolated workspace with 7 records in every module.
              </p>
            </div>
            {selectedVisitor && (
              <button
                onClick={handleClearFilter}
                className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <X size={13} />
                <span>Clear Filter (Viewing: {selectedVisitor})</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Demo User</th>
                  <th className="py-3 px-4">Workspace</th>
                  <th className="py-3 px-4">Device & OS</th>
                  <th className="py-3 px-4">Browser</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Total Clicks</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitors.map((v) => {
                  const isFiltered = selectedVisitor === v.demo_username || selectedVisitor === v.visitor_key;
                  return (
                    <tr
                      key={v.user_id || v.visitor_key}
                      className={`transition ${isFiltered ? 'bg-amber-50/80 font-medium' : 'hover:bg-slate-50/70'}`}
                    >
                      {/* Demo User name badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono shadow-2xs">
                          <Sparkles size={12} className="text-indigo-600" />
                          {v.demo_username}
                        </span>
                      </td>

                      {/* Workspace */}
                      <td className="py-3.5 px-4 text-gray-700 whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Building2 size={13} className="text-gray-400" />
                          {v.company_name}
                        </span>
                      </td>

                      {/* Device & OS */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {getOsIcon(v.os)}
                          <span className="font-semibold text-gray-800">{v.os || 'Windows 10/11'}</span>
                        </div>
                      </td>

                      {/* Browser */}
                      <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                        {v.browser || 'Google Chrome'}
                      </td>

                      {/* IP Address */}
                      <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                        {v.ip_address || '127.0.0.1'}
                      </td>

                      {/* Click count */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <MousePointerClick size={12} />
                          {v.activity_count} {v.activity_count === 1 ? 'click' : 'clicks'}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        {v.last_seen}
                      </td>

                      {/* Button: See Logs */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => applyFilters(isFiltered ? '' : v.demo_username, selectedModule)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer ${
                            isFiltered
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : 'bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 hover:border-blue-300'
                          }`}
                        >
                          <Eye size={13} />
                          <span>{isFiltered ? 'Viewing Logs' : 'See Logs'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {visitors.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-12 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
                          <Sparkles size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">No Demo Visitors Yet</p>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            No fake or random users are generated. When an actual visitor launches <code className="bg-gray-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono font-semibold">/demo</code> or clicks "Launch Interactive Demo" on the login page, their real browser session (<span className="font-mono text-gray-700 font-semibold">demouser_1</span>, <span className="font-mono text-gray-700 font-semibold">demouser_2</span>...), device OS, IP address, and clicks will be recorded here in real-time.
                          </p>
                        </div>
                        <div className="pt-1">
                          <a
                            href="/demo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                          >
                            <Sparkles size={14} />
                            <span>Test /demo in a New Tab</span>
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FILTER TOOLBAR FOR DETAILED LOGS ─────────────────── */}
        <div id="detailed-logs-section" className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          {selectedVisitor && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-amber-950">
                  Showing detailed click & activity logs for: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900">{selectedVisitor}</strong>
                </span>
              </div>
              <button
                onClick={handleClearFilter}
                className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 transition cursor-pointer flex items-center gap-1"
              >
                <X size={13} />
                <span>Show All Users Logs</span>
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={15} className="text-amber-600" />
                Detailed Action Logs
              </span>

            {/* Filter by Module */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600">Module:</label>
              <select
                value={selectedModule}
                onChange={(e) => applyFilters(selectedVisitor, e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="">All Modules</option>
                {availableModules.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Filter by Visitor */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600">User:</label>
              <input
                type="text"
                value={selectedVisitor}
                onChange={(e) => setSelectedVisitor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters(selectedVisitor, selectedModule)}
                placeholder="e.g. demouser_1"
                className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 w-36 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => applyFilters(selectedVisitor, selectedModule)}
                className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold cursor-pointer"
              >
                Filter
              </button>
            </div>
          </div>

          <span className="text-xs text-gray-500">
            Showing {activities.data?.length ?? 0} of {activities.total ?? 0} logs
          </span>
        </div>
      </div>

        {/* ── DETAILED ACTIVITY LOGS TABLE ─────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Demo User</th>
                  <th className="py-3 px-4">Action & Module</th>
                  <th className="py-3 px-4">Endpoint / Path</th>
                  <th className="py-3 px-4">Client IP Address</th>
                  <th className="py-3 px-4">OS & Browser</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.data?.map((act) => {
                  const isPost = act.method === 'POST';
                  const isDelete = act.method === 'DELETE';
                  const isPut = act.method === 'PUT' || act.method === 'PATCH';

                  return (
                    <tr key={act.id} className="hover:bg-slate-50/80 transition">
                      {/* Demo user badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-900 font-mono">
                          <Sparkles size={12} className="text-indigo-600" />
                          {act.demo_username || 'demouser_1'}
                        </span>
                      </td>

                      {/* Action & Module */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isPost ? 'bg-emerald-100 text-emerald-800' :
                            isPut ? 'bg-amber-100 text-amber-800' :
                            isDelete ? 'bg-red-100 text-red-800' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {act.method}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900">{act.action}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Module: {act.module || 'Dashboard'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Path */}
                      <td className="py-3 px-4 font-mono text-gray-600 text-[11px]">
                        {act.path || '/'}
                      </td>

                      {/* IP Address */}
                      <td className="py-3 px-4 font-mono text-gray-600 text-[11px] whitespace-nowrap">
                        {act.ip_address || '127.0.0.1'}
                      </td>

                      {/* OS and Browser */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {getOsIcon(act.os)}
                          <span className="font-semibold text-gray-800">{act.os || 'Windows 10/11'}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 text-[11px]">{act.browser || 'Google Chrome'}</span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <p className="font-semibold text-gray-800">
                          {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(act.created_at).toLocaleDateString()}
                        </p>
                      </td>
                    </tr>
                  );
                })}

                {activities.data?.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-400">
                      No activity logs match the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination links */}
          {activities.links && activities.links.length > 3 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Page {activities.current_page} of {activities.last_page}
              </span>
              <div className="flex gap-1">
                {activities.links.map((link, i) => (
                  <Link
                    key={i}
                    href={link.url || '#'}
                    preserveState
                    className={`px-3 py-1.5 text-xs rounded-lg transition ${
                      link.active
                        ? 'bg-amber-600 text-white font-bold'
                        : link.url
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-gray-300 pointer-events-none'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
