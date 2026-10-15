import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  LayoutDashboard, Users, Clock, Calendar, DollarSign, Briefcase,
  TrendingUp, Package, FileText, UserMinus, BarChart2, Megaphone,
  Settings, ChevronDown, ChevronRight, Bell, Search, Menu, X,
  LogOut, ShieldCheck, Building2, Activity, ChevronUp, Sparkles,
  ArrowLeftRight, AlertCircle,
} from 'lucide-react';

const baseNavItems = [
  { moduleKey: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  {
    moduleKey: 'employees',
    label: 'Employees', icon: Users, children: [
      { label: 'All Employees',  href: '/employees' },
      { label: 'Add Employee',   href: '/employees/create' },
      { label: 'Departments',    href: '/departments' },
      { label: 'Designations',   href: '/designations' },
      { label: 'Org Chart',      href: '/org-chart' },
    ],
  },
  {
    moduleKey: 'recruitment',
    label: 'Recruitment', icon: Briefcase, children: [
      { label: 'Job Openings',  href: '/recruitment/jobs' },
      { label: 'Candidates',    href: '/recruitment/candidates' },
      { label: 'Interviews',    href: '/recruitment/interviews' },
      { label: 'Offers',        href: '/recruitment/offers' },
      { label: 'Onboarding',    href: '/recruitment/onboarding' },
    ],
  },
  {
    moduleKey: 'attendance',
    label: 'Attendance', icon: Clock, children: [
      { label: 'Daily Attendance', href: '/attendance' },
      { label: 'Timesheets',       href: '/attendance/timesheets' },
      { label: 'Shifts',           href: '/attendance/shifts' },
      { label: 'Overtime',         href: '/attendance/overtime' },
    ],
  },
  {
    moduleKey: 'leave',
    label: 'Leave', icon: Calendar, children: [
      { label: 'Leave Requests', href: '/leave' },
      { label: 'Leave Calendar', href: '/leave/calendar' },
      { label: 'Leave Types',    href: '/leave/types' },
      { label: 'Leave Balances', href: '/leave/balances' },
    ],
  },
  {
    moduleKey: 'payroll',
    label: 'Payroll', icon: DollarSign, children: [
      { label: 'Payroll Runs',  href: '/payroll' },
      { label: 'Salaries',      href: '/payroll/salaries' },
      { label: 'Components',    href: '/payroll/components' },
      { label: 'Loans',         href: '/payroll/loans' },
      { label: 'Payslips',      href: '/payroll/payslips' },
    ],
  },
  {
    moduleKey: 'performance',
    label: 'Performance', icon: TrendingUp, children: [
      { label: 'Reviews',      href: '/performance/reviews' },
      { label: 'Goals / KPIs', href: '/performance/goals' },
      { label: 'Promotions',   href: '/performance/promotions' },
      { label: 'Warnings',     href: '/performance/warnings' },
    ],
  },
  {
    moduleKey: 'assets',
    label: 'Assets', icon: Package, children: [
      { label: 'Company Assets', href: '/assets' },
    ],
  },
  {
    moduleKey: 'documents',
    label: 'Documents', icon: FileText, children: [
      { label: 'Employee Files', href: '/documents' },
    ],
  },
  {
    moduleKey: 'offboarding',
    label: 'Offboarding', icon: UserMinus, children: [
      { label: 'Resignations',    href: '/offboarding' },
      { label: 'Exit Interviews', href: '/offboarding/exit-interviews' },
    ],
  },
  { moduleKey: 'reports',       label: 'Reports',       icon: BarChart2,  href: '/reports' },
  { moduleKey: 'announcements', label: 'Announcements', icon: Megaphone,  href: '/announcements' },
  { moduleKey: 'settings',      label: 'Settings',      icon: Settings,   href: '/settings' },
];

function NavItem({ item, currentPath }) {
  const isActive = (href) => currentPath === href || currentPath.startsWith(href + '/');
  const hasActive = item.children?.some(c => isActive(c.href));
  const [open, setOpen] = useState(hasActive);

  if (item.children) {
    return (
      <div data-tour={`nav-${item.moduleKey}`}>
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            hasActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <item.icon size={18} className={hasActive ? 'text-blue-600' : 'text-gray-400'} />
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
        {open && (
          <div className="ml-9 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-2">
            {item.children.map(child => (
              <Link
                key={child.href}
                href={child.href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(child.href)
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
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
      data-tour={`nav-${item.moduleKey}`}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive(item.href)
          ? 'bg-blue-600 text-white font-semibold shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <item.icon size={18} className={isActive(item.href) ? 'text-white' : 'text-gray-400'} />
      {item.label}
    </Link>
  );
}

function GuidedTour({ open, steps, stepIndex, onNext, onBack, onCancel }) {
  const [targetRect, setTargetRect] = useState(null);
  const [cardPosition, setCardPosition] = useState(null);
  const cardRef = useRef(null);
  const step = steps[stepIndex];

  useEffect(() => {
    if (!open || !step?.target) {
      setTargetRect(null);
      return undefined;
    }

    const target = document.querySelector(`[data-tour="${step.target}"]`);
    if (!target) {
      setTargetRect(null);
      return undefined;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    const updateRect = () => {
      const rect = target.getBoundingClientRect();
      setTargetRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    };
    const timer = window.setTimeout(updateRect, 250);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    const margin = 16;
    const card = cardRef.current?.getBoundingClientRect();
    const width = card?.width ?? Math.min(400, window.innerWidth - margin * 2);
    const height = card?.height ?? 240;
    if (!targetRect) {
      setCardPosition({ left: Math.max(margin, (window.innerWidth - width) / 2), top: Math.max(margin, (window.innerHeight - height) / 2) });
      return;
    }

    const gap = 18;
    const fitsRight = window.innerWidth - targetRect.left - targetRect.width - gap >= width + margin;
    const fitsLeft = targetRect.left - gap >= width + margin;
    let left = fitsRight
      ? targetRect.left + targetRect.width + gap
      : fitsLeft
        ? targetRect.left - width - gap
        : targetRect.left + targetRect.width / 2 - width / 2;
    let top = targetRect.top + targetRect.height / 2 - height / 2;

    if (left < margin || left + width > window.innerWidth - margin) {
      left = Math.max(margin, Math.min(window.innerWidth - width - margin, left));
      const below = targetRect.top + targetRect.height + gap;
      const above = targetRect.top - height - gap;
      if (below + height <= window.innerHeight - margin) top = below;
      else if (above >= margin) top = above;
    }

    setCardPosition({ left, top: Math.max(margin, Math.min(window.innerHeight - height - margin, top)) });
  }, [open, targetRect, step]);

  if (!open || !step) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="absolute inset-0 bg-slate-950/60" />
      {targetRect && <div className="fixed rounded-xl border-2 border-cyan-300 bg-blue-400/10 ring-4 ring-cyan-300/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.72),0_0_30px_8px_rgba(34,211,238,0.65)] transition-all duration-200 pointer-events-none" style={{ top: targetRect.top - 6, left: targetRect.left - 6, width: targetRect.width + 12, height: targetRect.height + 12 }}><span className="absolute -top-3 -right-3 h-5 w-5 rounded-full border-2 border-white bg-cyan-400 shadow-lg shadow-cyan-500/50" /></div>}
      <section ref={cardRef} className="fixed left-4 top-4 w-[min(25rem,calc(100vw-2rem))] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_20px_70px_rgba(2,6,23,0.38)] ring-1 ring-blue-500/15 transition-[top,left] duration-200" style={cardPosition ? { left: cardPosition.left, top: cardPosition.top } : undefined}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">PeopleFlow tour · {stepIndex + 1} of {steps.length}</p>
          <button type="button" onClick={onCancel} className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100">Cancel</button>
        </div>
        <h2 id="tour-title" className="text-lg font-bold text-gray-900">{step.title}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button type="button" onClick={onBack} disabled={stepIndex === 0} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40">Back</button>
          <button type="button" onClick={onNext} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{stepIndex === steps.length - 1 ? 'Finish' : 'Next'}</button>
        </div>
      </section>
    </div>
  );
}

export default function AppLayout({ children, title }) {
  const { auth, flash, current_workspace, is_super_admin_viewing_other } = usePage().props;
  const { url } = usePage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [superAdminMenuOpen, setSuperAdminMenuOpen] = useState(true);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  const currentPath = url.split('?')[0];

  const handleLogout = () => router.post('/logout');
  const handleResetWorkspace = () => router.post('/super-admin/reset-workspace');

  // Filter navigation items by user's allowed modules
  const allowedModules = auth.user?.allowed_modules ?? ['*'];
  const isSuperAdmin = Boolean(auth.user?.is_super_admin);
  const isDemo = Boolean(auth.user?.is_demo);

  const filteredNavItems = useMemo(() => baseNavItems.filter(item => {
    if (isSuperAdmin) return true;
    if (allowedModules.includes('*')) return true;
    return allowedModules.includes(item.moduleKey);
  }), [isSuperAdmin, allowedModules]);

  const isSuperAdminActive = currentPath.startsWith('/super-admin');

  const tourSteps = useMemo(() => [
    { title: 'Welcome to PeopleFlow', description: 'Take a quick tour of the workspace navigation and the controls available on every page.' },
    ...filteredNavItems.map(item => ({
      target: `nav-${item.moduleKey}`,
      title: item.label,
      description: item.children?.length
        ? `Open ${item.label} in the sidebar to visit ${item.children.map(child => child.label).join(', ')}.`
        : `Use ${item.label} to open this area of your workspace.`,
    })),
    { target: 'topbar-search', title: 'Search', description: 'Find people and records from the top bar.' },
    { target: 'topbar-notifications', title: 'Notifications', description: 'Check this area for updates and alerts.' },
    { target: 'topbar-profile', title: 'Your account', description: 'Your profile badge identifies the current account. Sign out from the profile menu in the sidebar.' },
    { target: 'page-content', title: 'Page actions and content', description: `This is the ${title} page. Scroll here to see its content and use the available page buttons and forms.` },
  ], [filteredNavItems, title]);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem('peopleflow-tour-seen')) {
        const timer = window.setTimeout(() => {
          if (window.innerWidth < 1024) setMobileOpen(true);
          setTourOpen(true);
        }, 500);
        return () => window.clearTimeout(timer);
      }
    } catch {
      // Keep the tour available through the top bar when browser storage is disabled.
    }
  }, []);

  const markTourSeen = () => {
    try { window.localStorage.setItem('peopleflow-tour-seen', '1'); } catch { /* Storage may be disabled. */ }
  };
  const startTour = () => {
    markTourSeen();
    if (window.innerWidth < 1024) setMobileOpen(true);
    setTourStep(0);
    setTourOpen(true);
  };
  const cancelTour = () => {
    markTourSeen();
    setTourOpen(false);
    if (window.innerWidth < 1024) setMobileOpen(false);
  };
  const advanceTour = () => {
    if (tourStep >= tourSteps.length - 1) {
      markTourSeen();
      setTourOpen(false);
      if (window.innerWidth < 1024) setMobileOpen(false);
      return;
    }
    setTourStep(index => index + 1);
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'fixed inset-0 z-50 flex' : 'flex-shrink-0'}`}>
      {mobile && <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />}
      <div className={`${mobile ? 'relative z-10 w-72' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-full`}>
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <Users size={20} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 text-base tracking-tight">PeopleFlow</span>
              {isSuperAdmin && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                  Super
                </span>
              )}
              {isDemo && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  Demo
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate leading-none mt-0.5">
              {isSuperAdmin && !is_super_admin_viewing_other ? 'Super Admin Portal' : (current_workspace?.name ?? 'HR Management')}
            </p>
          </div>
          {mobile && (
            <button onClick={() => setMobileOpen(false)} className="ml-auto text-gray-400 hover:text-gray-600 p-1">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 no-scrollbar">

          {/* Super Admin Dedicated Menu */}
          {isSuperAdmin && !is_super_admin_viewing_other ? (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider px-3 py-1 bg-amber-50 rounded-lg flex items-center justify-between">
                <span>Super Admin Portal</span>
                <ShieldCheck size={14} className="text-amber-700" />
              </div>

              <div className="space-y-1 pt-1">
                <Link
                  href="/super-admin/owners"
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                    currentPath === '/super-admin/owners'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-950'
                  }`}
                >
                  <Building2 size={18} className={currentPath === '/super-admin/owners' ? 'text-white' : 'text-amber-600'} />
                  <div className="flex-1">
                    <p className="leading-tight">Business Owners</p>
                    <p className={`text-[10px] ${currentPath === '/super-admin/owners' ? 'text-amber-100' : 'text-gray-400'}`}>
                      Workspaces & Accounts
                    </p>
                  </div>
                </Link>

                <Link
                  href="/super-admin/demo-logs"
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                    currentPath === '/super-admin/demo-logs'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-950'
                  }`}
                >
                  <Sparkles size={18} className={currentPath === '/super-admin/demo-logs' ? 'text-white' : 'text-indigo-600'} />
                  <div className="flex-1">
                    <p className="leading-tight">Demo Users & Logs</p>
                    <p className={`text-[10px] ${currentPath === '/super-admin/demo-logs' ? 'text-indigo-100' : 'text-gray-400'}`}>
                      demouser_1, 2... & Clicks
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* If Super Admin is inspecting a client workspace, show quick link back to Admin Portal */}
              {is_super_admin_viewing_other && (
                <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-200">
                  <button
                    onClick={handleResetWorkspace}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                  >
                    <ArrowLeftRight size={13} />
                    <span>Return to Super Admin</span>
                  </button>
                </div>
              )}

              {/* Standard HRM Modules */}
              <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                HR Modules
              </div>

              {filteredNavItems.map(item => (
                <NavItem key={item.label} item={item} currentPath={currentPath} />
              ))}
            </>
          )}
        </nav>

        {/* User Footer Profile */}
        <div className="border-t border-gray-100 p-3 bg-gray-50/50">
          <div
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white hover:shadow-xs border border-transparent hover:border-gray-200 cursor-pointer transition"
            onClick={() => setUserMenuOpen(o => !o)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              isSuperAdmin ? 'bg-amber-100 text-amber-800' : isDemo ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-700'
            }`}>
              {auth.user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{auth.user?.name}</p>
              <p className="text-xs text-gray-400 truncate capitalize leading-tight">
                {isSuperAdmin ? 'Super Administrator' : isDemo ? 'Demo User' : auth.user?.role?.replace('_', ' ')}
              </p>
            </div>
            {userMenuOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
          </div>

          {userMenuOpen && (
            <div className="mt-2 space-y-1 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && <Sidebar mobile />}

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Inspection Mode Alert Banner for Super Admin */}
        {is_super_admin_viewing_other && (
          <div className="bg-amber-600 text-white px-4 py-2 text-xs font-medium flex items-center justify-between shadow-sm z-20">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} />
              <span>
                Super Admin Inspection Mode: You are viewing <strong>{current_workspace?.name}</strong>'s workspace.
              </span>
            </div>
            <button
              onClick={handleResetWorkspace}
              className="px-2.5 py-1 rounded bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeftRight size={13} />
              Exit Inspection Mode
            </button>
          </div>
        )}

        {/* Demo Mode Notice */}
        {isDemo && (
          <div className="bg-emerald-600 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between z-20 shadow-xs">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Live Interactive Demo Session · All 13 modules pre-loaded with sample records.</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-white hover:underline text-xs font-semibold cursor-pointer"
            >
              Exit Demo
            </button>
          </div>
        )}

        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-lg"
          >
            <Menu size={22} />
          </button>

          {/* Page title */}
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">{title}</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              {isSuperAdmin && !is_super_admin_viewing_other ? 'Super Admin Portal' : (current_workspace?.name ?? 'PeopleFlow System')}
            </p>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div data-tour="topbar-search" className="relative hidden md:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-1.5 text-xs bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition w-52 text-gray-800"
            />
          </div>

          {/* Role badge */}
          {isSuperAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-800">
              <ShieldCheck size={14} />
              Super Admin
            </span>
          )}

          <button type="button" onClick={startTour} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100">Take Tour</button>

          {/* Notifications */}
          <button data-tour="topbar-notifications" type="button" aria-label="Notifications" className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
          </button>

          {/* Avatar */}
          <div data-tour="topbar-profile" className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            isSuperAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
          }`}>
            {auth.user?.name?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Flash Notifications */}
        {flash?.success && (
          <div className="mx-4 lg:mx-6 mt-4 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2 shadow-xs">
            <span>✓ {flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="mx-4 lg:mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-800 text-xs font-medium rounded-xl shadow-xs">
            ✕ {flash.error}
          </div>
        )}

        {/* Page Body */}
        <main data-tour="page-content" className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
      <GuidedTour open={tourOpen} steps={tourSteps} stepIndex={tourStep} onNext={advanceTour} onBack={() => setTourStep(index => Math.max(0, index - 1))} onCancel={cancelTour} />
    </div>
  );
}
