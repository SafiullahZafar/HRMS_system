import AppLayout from '../Layouts/AppLayout';
import StatCard from '../Components/StatCard';
import Badge from '../Components/Badge';
import Avatar from '../Components/Avatar';
import { Link, usePage } from '@inertiajs/react';
import {
  Users, UserCheck, UserX, Clock, Briefcase, DollarSign,
  AlertCircle, TrendingUp, Plus, ClipboardList, CheckCircle,
  Megaphone, ArrowRight, Calendar,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const PIE_COLORS = ['#4F46E5','#7C3AED','#0891B2','#059669','#D97706','#DC2626','#DB2777'];

export default function Dashboard({ stats, attendanceTrend, byDepartment, recentHires, pendingLeaveRequests, announcements }) {
  const { auth } = usePage().props;
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const fmt = (v) => typeof v === 'number' ? v.toLocaleString() : v;
  const fmtCurrency = (v) => `Rs. ${Number(v).toLocaleString()}`;

  return (
    <AppLayout title="Dashboard">
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {greeting()}, {auth.user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Employees"   value={stats.totalEmployees}   icon={Users}       color="indigo" />
        <StatCard title="Present Today"     value={stats.presentToday}     icon={UserCheck}   color="green"  />
        <StatCard title="Absent Today"      value={stats.absentToday}      icon={UserX}       color="red"    />
        <StatCard title="Late Today"        value={stats.lateToday}        icon={Clock}       color="yellow" />
        <StatCard title="On Leave"          value={stats.onLeave}          icon={Calendar}    color="purple" />
        <StatCard title="Open Positions"    value={stats.openPositions}    icon={Briefcase}   color="blue"   />
        <StatCard title="Payroll This Month" value={fmtCurrency(stats.payrollThisMonth)} icon={DollarSign} color="teal" />
        <StatCard title="Pending Requests"  value={stats.pendingRequests}  icon={AlertCircle} color="orange" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '+ Add Employee', href: '/employees/create',        color: 'bg-indigo-600 text-white hover:bg-indigo-700' },
            { label: 'Mark Attendance', href: '/attendance',             color: 'bg-green-600 text-white hover:bg-green-700' },
            { label: 'Run Payroll',     href: '/payroll',                color: 'bg-blue-600 text-white hover:bg-blue-700' },
            { label: 'Approve Leave',   href: '/leave',                  color: 'bg-purple-600 text-white hover:bg-purple-700' },
            { label: 'Create Job',      href: '/recruitment/jobs',       color: 'bg-teal-600 text-white hover:bg-teal-700' },
            { label: 'Announcement',    href: '/announcements',          color: 'bg-orange-500 text-white hover:bg-orange-600' },
          ].map(a => (
            <Link key={a.href} href={a.href} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${a.color}`}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Attendance Trend (Last 7 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#DC2626" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="present" stroke="#4F46E5" strokeWidth={2} fill="url(#gradPresent)" name="Present" />
              <Area type="monotone" dataKey="late"    stroke="#D97706" strokeWidth={2} fill="none" name="Late" />
              <Area type="monotone" dataKey="absent"  stroke="#DC2626" strokeWidth={2} fill="url(#gradAbsent)" name="Absent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* By Department */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Employees by Department</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={byDepartment} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" nameKey="name" paddingAngle={3}>
                {byDepartment.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {byDepartment.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-gray-600 truncate max-w-[120px]">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Hires */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">New Hires</h3>
            <Link href="/employees" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">View All <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {recentHires.map(emp => (
              <Link key={emp.id} href={`/employees/${emp.id}/profile`} className="flex items-center gap-3 hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition">
                <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{emp.first_name} {emp.last_name}</p>
                  <p className="text-xs text-gray-400 truncate">{emp.designation?.name || '—'}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(emp.joining_date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
              </Link>
            ))}
            {recentHires.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No recent hires</p>}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Leave Requests</h3>
            <Link href="/leave" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">View All <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {pendingLeaveRequests.map(req => (
              <div key={req.id} className="flex items-center gap-3">
                <Avatar name={`${req.employee?.first_name} ${req.employee?.last_name}`} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{req.employee?.first_name} {req.employee?.last_name}</p>
                  <p className="text-xs text-gray-400">{req.leave_type?.name} · {req.days}d</p>
                </div>
                <Badge status={req.status} />
              </div>
            ))}
            {pendingLeaveRequests.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No pending requests</p>}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Announcements</h3>
            <Link href="/announcements" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">View All <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {announcements.map(ann => (
              <div key={ann.id} className="p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition">
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${ann.priority === 'high' ? 'bg-red-500' : ann.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 leading-snug">{ann.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{ann.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No announcements</p>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
