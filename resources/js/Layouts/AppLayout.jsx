import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  LayoutDashboard, Users, Clock, Calendar, DollarSign, Briefcase,
  TrendingUp, Package, FileText, UserMinus, BarChart2, Megaphone,
  Settings, ChevronDown, ChevronRight, Bell, Search, Menu, X,
  LogOut, User, Building2, ChevronUp, UserCheck, Layers,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  {
    label: 'Employees', icon: Users, children: [
      { label: 'All Employees',  href: '/employees' },
      { label: 'Add Employee',   href: '/employees/create' },
      { label: 'Departments',    href: '/departments' },
      { label: 'Designations',   href: '/designations' },
      { label: 'Org Chart',      href: '/org-chart' },
    ],
  },
  {
    label: 'Recruitment', icon: Briefcase, children: [
      { label: 'Job Openings',  href: '/recruitment/jobs' },
      { label: 'Candidates',    href: '/recruitment/candidates' },
      { label: 'Interviews',    href: '/recruitment/interviews' },
      { label: 'Offers',        href: '/recruitment/offers' },
      { label: 'Onboarding',    href: '/recruitment/onboarding' },
    ],
  },
  {
    label: 'Attendance', icon: Clock, children: [
      { label: 'Daily Attendance', href: '/attendance' },
      { label: 'Timesheets',       href: '/attendance/timesheets' },
      { label: 'Shifts',           href: '/attendance/shifts' },
      { label: 'Overtime',         href: '/attendance/overtime' },
    ],
  },
  {
    label: 'Leave', icon: Calendar, children: [
      { label: 'Leave Requests', href: '/leave' },
      { label: 'Leave Calendar', href: '/leave/calendar' },
      { label: 'Leave Types',    href: '/leave/types' },
      { label: 'Leave Balances', href: '/leave/balances' },
    ],
  },
  {
    label: 'Payroll', icon: DollarSign, children: [
      { label: 'Payroll Runs',  href: '/payroll' },
      { label: 'Salaries',      href: '/payroll/salaries' },
      { label: 'Components',    href: '/payroll/components' },
      { label: 'Loans',         href: '/payroll/loans' },
      { label: 'Payslips',      href: '/payroll/payslips' },
    ],
  },
  {
    label: 'Performance', icon: TrendingUp, children: [
      { label: 'Reviews',     href: '/performance/reviews' },
      { label: 'Goals / KPIs',href: '/performance/goals' },
      { label: 'Promotions',  href: '/performance/promotions' },
      { label: 'Warnings',    href: '/performance/warnings' },
    ],
  },
  {
    label: 'Assets', icon: Package, children: [
      { label: 'Company Assets', href: '/assets' },
    ],
  },
  {
    label: 'Documents', icon: FileText, children: [
      { label: 'Employee Files', href: '/documents' },
    ],
  },
  {
    label: 'Offboarding', icon: UserMinus, children: [
      { label: 'Resignations',    href: '/offboarding' },
      { label: 'Exit Interviews', href: '/offboarding/exit-interviews' },
    ],
  },
  { label: 'Reports',       icon: BarChart2,  href: '/reports' },
  { label: 'Announcements', icon: Megaphone,  href: '/announcements' },
  { label: 'Settings',      icon: Settings,   href: '/settings' },
];

function NavItem({ item, currentPath }) {
  const isActive = (href) => currentPath === href || currentPath.startsWith(href + '/');
  const hasActive = item.children?.some(c => isActive(c.href));
  const [open, setOpen] = useState(hasActive);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            hasActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <item.icon size={18} className={hasActive ? 'text-indigo-600' : 'text-gray-400'} />
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
        {open && (
          <div className="ml-9 mt-0.5 space-y-0.5">
            {item.children.map(child => (
              <Link
                key={child.href}
                href={child.href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(child.href)
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        isActive(item.href)
          ? 'bg-indigo-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <item.icon size={18} className={isActive(item.href) ? 'text-white' : 'text-gray-400'} />
      {item.label}
    </Link>
  );
}

export default function AppLayout({ children, title }) {
  const { auth, flash } = usePage().props;
  const { url } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentPath = url.split('?')[0];

  const handleLogout = () => router.post('/logout');

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'fixed inset-0 z-50 flex' : 'flex-shrink-0'}`}>
      {mobile && <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />}
      <div className={`${mobile ? 'relative z-10 w-72' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-full`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-base">PeopleFlow</span>
            <p className="text-xs text-gray-400 leading-none">HRMS</p>
          </div>
          {mobile && (
            <button onClick={() => setMobileOpen(false)} className="ml-auto text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map(item => (
            <NavItem key={item.label} item={item} currentPath={currentPath} />
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setUserMenuOpen(o => !o)}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
              {auth.user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{auth.user?.name}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{auth.user?.role?.replace('_', ' ')}</p>
            </div>
            {userMenuOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
          </div>
          {userMenuOpen && (
            <div className="mt-1 space-y-0.5">
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && <Sidebar mobile />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu size={22} />
          </button>

          {/* Page title */}
          <h1 className="text-base font-semibold text-gray-900 hidden sm:block">{title}</h1>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition w-52"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm cursor-pointer">
            {auth.user?.name?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Flash messages */}
        {flash?.success && (
          <div className="mx-4 lg:mx-6 mt-4 px-4 py-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg flex items-center justify-between">
            <span>✓ {flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="mx-4 lg:mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg">
            {flash.error}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
