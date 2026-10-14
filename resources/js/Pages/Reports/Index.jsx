import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { BarChart2, Users, Clock, Calendar, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';

const REPORT_CARDS = [
  { icon: Users,     title: 'Employee Reports',   desc: 'Headcount, new joiners, resignations, department strength', href: '/reports/employees', color: 'indigo' },
  { icon: Clock,     title: 'Attendance Reports', desc: 'Daily, monthly, late arrivals, absence, overtime', href: '/reports/attendance', color: 'blue' },
  { icon: Calendar,  title: 'Leave Reports',       desc: 'Leave usage, balances, trends by type', href: '/reports/leave', color: 'purple' },
  { icon: DollarSign,title: 'Payroll Reports',     desc: 'Salary register, deductions, bonuses, bank transfers', href: '/reports/payroll', color: 'green' },
];

const colorMap = { indigo:'bg-blue-50 text-blue-600', blue:'bg-blue-50 text-blue-600', purple:'bg-blue-50 text-blue-600', green:'bg-blue-50 text-blue-600' };

export default function ReportsIndex({ overview }) {
  const fmt = v => typeof v === 'number' ? v.toLocaleString() : v;
  return (
    <AppLayout title="Reports">
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2></div>

      {/* Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[{l:'Total Employees',v:overview.totalEmployees},{l:'New Hires This Year',v:overview.newHiresThisYear},{l:'Resigned This Year',v:overview.resignedThisYear},{l:'Payroll This Year',v:`Rs. ${Number(overview.payrollTotal||0).toLocaleString()}`}].map(s=>(
          <div key={s.l} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{s.v}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_CARDS.map(card => (
          <Link key={card.href} href={card.href} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition group">
            <div className={`inline-flex p-3 rounded-xl mb-3 ${colorMap[card.color]}`}><card.icon size={22}/></div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition">{card.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{card.desc}</p>
            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium"><span>View Report</span><ArrowRight size={12}/></div>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
