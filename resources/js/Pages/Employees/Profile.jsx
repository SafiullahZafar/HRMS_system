import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, Building2, Award, Clock, FileText, Package, GraduationCap, TrendingUp, AlertTriangle, History, CheckSquare } from 'lucide-react';

const TABS = [
  { id: 'overview',    label: 'Overview',    icon: Building2 },
  { id: 'attendance',  label: 'Attendance',  icon: Clock },
  { id: 'leave',       label: 'Leave',       icon: Calendar },
  { id: 'payroll',     label: 'Payroll',     icon: Award },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'documents',   label: 'Documents',   icon: FileText },
  { id: 'assets',      label: 'Assets',      icon: Package },
  { id: 'onboarding',  label: 'Onboarding',  icon: CheckSquare },
];

export default function EmployeeProfile({ employee }) {
  const [tab, setTab] = useState('overview');
  const fullName = `${employee.first_name} ${employee.last_name}`;

  return (
    <AppLayout title={fullName}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link href="/employees" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"><ArrowLeft size={18}/></Link>
        <h2 className="text-xl font-bold text-gray-900">Employee Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600"/>
        <div className="px-6 pb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
            <div className="ring-4 ring-white rounded-full">
              <Avatar name={fullName} size="xl" src={employee.photo}/>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
              <p className="text-gray-500 text-sm">{employee.designation?.name || '—'}</p>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <span className="text-xs text-gray-400 flex items-center gap-1"><Building2 size={12}/> {employee.department?.name}</span>
                <span className="text-xs text-gray-400">{employee.employee_id}</span>
                <Badge status={employee.status}/>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/employees/${employee.id}/edit`}><Button variant="secondary" size="sm"><Edit size={14}/> Edit</Button></Link>
              <Button variant="secondary" size="sm">Promote</Button>
              <Button variant="secondary" size="sm">Salary Revision</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-px ${tab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <t.icon size={14}/>{t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'overview' && <OverviewTab emp={employee}/>}
          {tab === 'attendance' && <AttendanceTab records={employee.attendances}/>}
          {tab === 'leave' && <LeaveTab requests={employee.leave_requests} balances={employee.leave_balances}/>}
          {tab === 'payroll' && <PayrollTab items={employee.payroll_items}/>}
          {tab === 'performance' && <PerformanceTab reviews={employee.performance_reviews} goals={employee.goals}/>}
          {tab === 'documents' && <DocumentsTab docs={employee.documents}/>}
          {tab === 'assets' && <AssetsTab assignments={employee.asset_assignments}/>}
          {tab === 'onboarding' && <OnboardingTab tasks={employee.onboarding_tasks}/>}
        </div>
      </div>
    </AppLayout>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <Icon size={15} className="text-gray-400 mt-0.5 flex-shrink-0"/>
      <span className="text-sm text-gray-500 w-36 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value || '—'}</span>
    </div>
  );
}

function OverviewTab({ emp }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h4>
        <InfoRow icon={Mail}     label="Email"          value={emp.email}/>
        <InfoRow icon={Phone}    label="Phone"          value={emp.phone}/>
        <InfoRow icon={Calendar} label="Date of Birth"  value={emp.date_of_birth ? new Date(emp.date_of_birth).toLocaleDateString() : null}/>
        <InfoRow icon={MapPin}   label="Address"        value={emp.address}/>
        <InfoRow icon={Phone}    label="Emergency Contact" value={emp.emergency_contact_name ? `${emp.emergency_contact_name} · ${emp.emergency_contact_phone}` : null}/>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Employment Information</h4>
        <InfoRow icon={Building2} label="Department"    value={emp.department?.name}/>
        <InfoRow icon={Award}     label="Designation"   value={emp.designation?.name}/>
        <InfoRow icon={Calendar}  label="Joining Date"  value={emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : null}/>
        <InfoRow icon={Building2} label="Work Location" value={emp.work_location}/>
        <InfoRow icon={Building2} label="Employment"    value={emp.employment_type?.replace('_',' ')}/>
        <InfoRow icon={Building2} label="Manager"       value={emp.manager ? `${emp.manager.first_name} ${emp.manager.last_name}` : null}/>
        <InfoRow icon={Award}     label="Basic Salary"  value={emp.basic_salary ? `Rs. ${Number(emp.basic_salary).toLocaleString()}` : null}/>
        <InfoRow icon={Award}     label="Bank"          value={emp.bank_name ? `${emp.bank_name} · ${emp.bank_account}` : null}/>
      </div>
    </div>
  );
}

function AttendanceTab({ records = [] }) {
  return (
    <Table>
      <Thead><tr><Th>Date</Th><Th>Check In</Th><Th>Check Out</Th><Th>Status</Th><Th>Late (min)</Th><Th>Hours</Th></tr></Thead>
      <Tbody>
        {records.slice(0,20).map(r => (
          <Tr key={r.id}>
            <Td>{new Date(r.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</Td>
            <Td>{r.check_in || '—'}</Td>
            <Td>{r.check_out || '—'}</Td>
            <Td><Badge status={r.status}/></Td>
            <Td>{r.late_minutes > 0 ? <span className="text-yellow-600 font-medium">{r.late_minutes}</span> : '—'}</Td>
            <Td>{r.worked_minutes ? `${Math.floor(r.worked_minutes/60)}h ${r.worked_minutes%60}m` : '—'}</Td>
          </Tr>
        ))}
        {records.length === 0 && <Tr><Td className="text-center py-8 text-gray-400" colSpan={6}>No attendance records</Td></Tr>}
      </Tbody>
    </Table>
  );
}

function LeaveTab({ requests = [], balances = [] }) {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Leave Balances</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {balances.map(b => {
            const available = Math.max(0, (Number(b.allocated) + Number(b.carried_forward)) - Number(b.used) - Number(b.pending));
            return (
              <div key={b.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                <p className="text-xs font-medium text-gray-500">{b.leave_type?.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{available}</p>
                <p className="text-xs text-gray-400">of {b.allocated} days</p>
                <div className="mt-2 h-1.5 rounded-full bg-gray-200">
                  <div className="h-1.5 rounded-full bg-indigo-500" style={{width:`${Math.min(100,(Number(b.used)/Number(b.allocated||1))*100)}%`}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Leave History</h4>
        <Table>
          <Thead><tr><Th>Type</Th><Th>From</Th><Th>To</Th><Th>Days</Th><Th>Status</Th></tr></Thead>
          <Tbody>
            {requests.map(r => (
              <Tr key={r.id}>
                <Td>{r.leave_type?.name}</Td>
                <Td>{new Date(r.from_date).toLocaleDateString()}</Td>
                <Td>{new Date(r.to_date).toLocaleDateString()}</Td>
                <Td>{r.days}</Td>
                <Td><Badge status={r.status}/></Td>
              </Tr>
            ))}
            {requests.length === 0 && <Tr><Td className="text-center py-6 text-gray-400" colSpan={5}>No leave requests</Td></Tr>}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}

function PayrollTab({ items = [] }) {
  return (
    <Table>
      <Thead><tr><Th>Period</Th><Th>Basic</Th><Th>Allowances</Th><Th>Gross</Th><Th>Deductions</Th><Th>Net Salary</Th></tr></Thead>
      <Tbody>
        {items.map(i => (
          <Tr key={i.id}>
            <Td>{i.payroll_run?.title || '—'}</Td>
            <Td>Rs. {Number(i.basic_salary).toLocaleString()}</Td>
            <Td>Rs. {Number(i.total_allowances).toLocaleString()}</Td>
            <Td>Rs. {Number(i.gross_salary).toLocaleString()}</Td>
            <Td className="text-red-600">-Rs. {Number(i.total_deductions).toLocaleString()}</Td>
            <Td className="font-semibold text-green-700">Rs. {Number(i.net_salary).toLocaleString()}</Td>
          </Tr>
        ))}
        {items.length === 0 && <Tr><Td className="text-center py-6 text-gray-400" colSpan={6}>No payroll records</Td></Tr>}
      </Tbody>
    </Table>
  );
}

function PerformanceTab({ reviews = [], goals = [] }) {
  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Goals</h4>
        <div className="space-y-3">
          {goals.map(g => {
            const pct = g.target ? Math.min(100, Math.round((Number(g.achieved)/Number(g.target))*100)) : 0;
            return (
              <div key={g.id} className="p-3 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-gray-900">{g.title}</p>
                  <span className="text-sm font-bold text-indigo-600">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{width:`${pct}%`}}/>
                </div>
                <p className="text-xs text-gray-400 mt-1">{g.achieved} / {g.target} {g.unit}</p>
              </div>
            );
          })}
          {goals.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No goals set</p>}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Reviews</h4>
        {reviews.map(r => (
          <div key={r.id} className="p-4 rounded-lg border border-gray-100 mb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 capitalize">{r.period} Review {r.review_year}</p>
              {r.overall_rating && <div className="flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-full"><span className="text-indigo-700 font-bold text-sm">{r.overall_rating}</span><span className="text-indigo-400 text-xs">/5</span></div>}
            </div>
            {r.strengths && <p className="text-xs text-gray-500 mt-1.5"><span className="font-medium">Strengths:</span> {r.strengths}</p>}
            {r.manager_comments && <p className="text-xs text-gray-500 mt-1"><span className="font-medium">Comments:</span> {r.manager_comments}</p>}
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No reviews yet</p>}
      </div>
    </div>
  );
}

function DocumentsTab({ docs = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {docs.map(d => (
        <div key={d.id} className="p-3 rounded-lg border border-gray-100 hover:border-indigo-200 transition flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg"><FileText size={16} className="text-indigo-600"/></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{d.title}</p>
            <p className="text-xs text-gray-400 capitalize">{d.category}</p>
          </div>
          <Button variant="ghost" size="xs">View</Button>
        </div>
      ))}
      {docs.length === 0 && <div className="col-span-3 text-center py-8 text-gray-400 text-sm">No documents uploaded</div>}
    </div>
  );
}

function AssetsTab({ assignments = [] }) {
  return (
    <Table>
      <Thead><tr><Th>Asset</Th><Th>Category</Th><Th>Assigned</Th><Th>Condition</Th><Th>Status</Th></tr></Thead>
      <Tbody>
        {assignments.map(a => (
          <Tr key={a.id}>
            <Td><p className="font-medium">{a.asset?.name}</p><p className="text-xs text-gray-400">{a.asset?.asset_id}</p></Td>
            <Td>{a.asset?.category}</Td>
            <Td>{new Date(a.assigned_date).toLocaleDateString()}</Td>
            <Td className="capitalize">{a.condition_on_assign}</Td>
            <Td><Badge status={a.is_returned ? 'returned' : 'assigned'} label={a.is_returned ? 'Returned' : 'Active'}/></Td>
          </Tr>
        ))}
        {assignments.length === 0 && <Tr><Td className="text-center py-6 text-gray-400" colSpan={5}>No assets assigned</Td></Tr>}
      </Tbody>
    </Table>
  );
}

function OnboardingTab({ tasks = [] }) {
  const done = tasks.filter(t => t.is_completed).length;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{done} of {tasks.length} tasks completed</p>
        <div className="h-2 w-48 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-2 rounded-full bg-green-500" style={{width:`${tasks.length ? (done/tasks.length)*100 : 0}%`}}/>
        </div>
      </div>
      <div className="space-y-2">
        {tasks.map(t => (
          <div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border ${t.is_completed ? 'border-green-100 bg-green-50/50' : 'border-gray-100'}`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${t.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
              {t.is_completed && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>}
            </div>
            <span className={`text-sm ${t.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>{t.task}</span>
            {t.is_completed && <span className="ml-auto text-xs text-gray-400">{new Date(t.completed_at).toLocaleDateString()}</span>}
          </div>
        ))}
        {tasks.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No onboarding tasks</p>}
      </div>
    </div>
  );
}
