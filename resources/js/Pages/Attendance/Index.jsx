import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import { Select } from '../../Components/Input';
import { CheckCircle, XCircle, Clock, AlertCircle, Home, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_OPTS = ['present','absent','late','half_day','leave','work_from_home'];
const STATUS_ICONS = { present: '✅', absent: '❌', late: '⏰', half_day: '🌓', leave: '🏖️', work_from_home: '🏠', not_marked: '—' };

export default function AttendanceIndex({ daily, summary, date, departments }) {
  const [currentDate, setCurrentDate] = useState(date);
  const [markModal, setMarkModal] = useState(null);
  const { data, setData, post, processing, reset } = useForm({ employee_id: '', date: currentDate, status: 'present', check_in: '', check_out: '', notes: '' });

  const changeDate = (delta) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + delta);
    const newDate = d.toISOString().split('T')[0];
    setCurrentDate(newDate);
    router.get('/attendance', { date: newDate }, { preserveState: true });
  };

  const openMark = (emp) => { setData({ employee_id: emp.id, date: currentDate, status: 'present', check_in: '09:00', check_out: '18:00', notes: '' }); setMarkModal(emp); };
  const submitMark = (e) => { e.preventDefault(); post('/attendance/mark', { onSuccess: () => { reset(); setMarkModal(null); } }); };

  const summaryCards = [
    { label: 'Present',  value: summary.present, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Absent',   value: summary.absent,  icon: XCircle,     color: 'text-red-600',   bg: 'bg-red-50' },
    { label: 'Late',     value: summary.late,    icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'On Leave', value: summary.leave,   icon: Home,        color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'WFH',      value: summary.wfh,     icon: Home,        color: 'text-teal-600',   bg: 'bg-teal-50' },
  ];

  return (
    <AppLayout title="Daily Attendance">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-900">Daily Attendance</h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => changeDate(-1)}><ChevronLeft size={15}/></Button>
          <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium min-w-[140px] text-center">
            {new Date(currentDate).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}
          </span>
          <Button variant="secondary" size="sm" onClick={() => changeDate(1)}><ChevronRight size={15}/></Button>
          <Button size="sm" onClick={() => router.get('/attendance', { date: new Date().toISOString().split('T')[0] })}>Today</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-5">
        {summaryCards.map(c => (
          <div key={c.label} className={`${c.bg} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">{daily.length} employees</p>
          <Button size="sm" variant="secondary">Bulk Update</Button>
        </div>
        <div className="divide-y divide-gray-50">
          {daily.map(({ employee: emp, attendance: att, status }) => (
            <div key={emp.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition">
              <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm"/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{emp.first_name} {emp.last_name}</p>
                <p className="text-xs text-gray-400">{emp.designation?.name} · {emp.department?.name}</p>
              </div>
              {att ? (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">{att.check_in || '—'}</span>
                  <span className="text-gray-300">→</span>
                  <span className="text-gray-500">{att.check_out || '—'}</span>
                  {att.late_minutes > 0 && <span className="text-xs text-yellow-600 font-medium">+{att.late_minutes}m late</span>}
                  <Badge status={status}/>
                </div>
              ) : (
                <span className="text-sm text-gray-300">Not marked</span>
              )}
              <Button size="xs" variant="secondary" onClick={() => openMark(emp)}>
                {att ? 'Update' : 'Mark'}
              </Button>
            </div>
          ))}
          {daily.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No employees found</div>}
        </div>
      </div>

      {/* Mark Modal */}
      <Modal open={!!markModal} onClose={() => setMarkModal(null)} title={`Mark Attendance — ${markModal?.first_name} ${markModal?.last_name}`}>
        <form onSubmit={submitMark} className="space-y-4">
          <Select label="Status" value={data.status} onChange={e => setData('status', e.target.value)}>
            {STATUS_OPTS.map(s => <option key={s} value={s} className="capitalize">{STATUS_ICONS[s]} {s.replace(/_/g,' ')}</option>)}
          </Select>
          {data.status !== 'absent' && <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                <input type="time" value={data.check_in} onChange={e => setData('check_in', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                <input type="time" value={data.check_out} onChange={e => setData('check_out', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
              </div>
            </div>
          </>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea rows={2} value={data.notes} onChange={e => setData('notes', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none" placeholder="Optional notes…"/>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setMarkModal(null)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Save Attendance</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
