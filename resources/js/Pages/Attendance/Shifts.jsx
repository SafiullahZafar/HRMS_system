import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import { Input } from '../../Components/Input';
import { Plus, Clock, Users, UserPlus, Pencil, Trash2 } from 'lucide-react';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Shifts({ shifts, employees }) {
  const [modal, setModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [assigningShift, setAssigningShift] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '', start_time: '09:00', end_time: '18:00',
    grace_period: 15, break_duration: 60, working_days: [1,2,3,4,5], color: '#2563eb',
  });
  const assignmentForm = useForm({ employee_ids: [], effective_from: new Date().toISOString().slice(0, 10) });

  const toggleDay = (d) => {
    setData('working_days', data.working_days.includes(d)
      ? data.working_days.filter(x => x !== d)
      : [...data.working_days, d].sort());
  };

  const submit = (e) => {
    e.preventDefault();
    if (editingShift) {
      router.put(`/attendance/shifts/${editingShift.id}`, data, { onSuccess: () => { reset(); setEditingShift(null); setModal(false); } });
      return;
    }
    post('/attendance/shifts', { onSuccess: () => { reset(); setModal(false); } });
  };
  const openEdit = (shift) => {
    setEditingShift(shift);
    setData({
      name: shift.name,
      start_time: shift.start_time?.slice(0, 5) || '09:00',
      end_time: shift.end_time?.slice(0, 5) || '18:00',
      grace_period: shift.grace_period ?? 15,
      break_duration: shift.break_duration ?? 60,
      working_days: shift.working_days || [1, 2, 3, 4, 5],
      color: shift.color || '#2563eb',
    });
    setModal(true);
  };
  const deleteShift = (shift) => {
    if (window.confirm(`Delete the “${shift.name}” shift and its assignments?`)) {
      router.delete(`/attendance/shifts/${shift.id}`);
    }
  };
  const assign = (e) => {
    e.preventDefault();
    assignmentForm.post(`/attendance/shifts/${assigningShift.id}/assign`, {
      onSuccess: () => { assignmentForm.reset('employee_ids'); setAssigningShift(null); },
    });
  };
  const toggleEmployee = (id) => {
    assignmentForm.setData('employee_ids', assignmentForm.data.employee_ids.includes(id)
      ? assignmentForm.data.employee_ids.filter(employeeId => employeeId !== id)
      : [...assignmentForm.data.employee_ids, id]);
  };

  return (
    <AppLayout title="Shifts">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-gray-900">Shift Management</h2></div>
        <Button onClick={() => { reset(); setEditingShift(null); setModal(true); }}><Plus size={15}/> Create Shift</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map(s => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full" style={{ background: s.color || '#2563eb' }}/>
                <h3 className="font-semibold text-gray-900">{s.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={12}/> {s.assignments_count}</span>
                <button type="button" onClick={() => openEdit(s)} className="rounded-md p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600" aria-label={`Edit ${s.name}`} title="Edit shift"><Pencil size={14}/></button>
                <button type="button" onClick={() => deleteShift(s)} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${s.name}`} title="Delete shift"><Trash2 size={14}/></button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
              <Clock size={14} className="text-gray-400"/>
              <span className="font-medium">{s.start_time}</span>
              <span className="text-gray-400">→</span>
              <span className="font-medium">{s.end_time}</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {DAYS.map((d, i) => (
                <span key={i} className={`text-xs px-1.5 py-0.5 rounded ${
                  (s.working_days || [1,2,3,4,5]).includes(i+1)
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-400'
                }`}>{d}</span>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
              <span>Grace: {s.grace_period}min</span>
              <span>Break: {s.break_duration}min</span>
              {s.is_night_shift && <span className="text-blue-600 font-medium">Night Shift</span>}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-semibold text-gray-700">Assigned employees</p>
                <Button size="xs" variant="secondary" onClick={() => { assignmentForm.reset(); setAssigningShift(s); }}>
                  <UserPlus size={13}/> Assign employees
                </Button>
              </div>
              {s.assignments?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {s.assignments.map(assignment => (
                    <span key={assignment.id} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                      {assignment.employee?.first_name} {assignment.employee?.last_name}
                    </span>
                  ))}
                </div>
              ) : <p className="text-xs text-gray-400">No employees assigned yet.</p>}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => { setModal(false); setEditingShift(null); }} title={editingShift ? 'Edit Shift' : 'Create Shift'}>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Shift Name *" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="Morning"/>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Time" type="time" value={data.start_time} onChange={e => setData('start_time', e.target.value)}/>
            <Input label="End Time" type="time" value={data.end_time} onChange={e => setData('end_time', e.target.value)}/>
            <Input label="Grace Period (min)" type="number" value={data.grace_period} onChange={e => setData('grace_period', e.target.value)}/>
            <Input label="Break Duration (min)" type="number" value={data.break_duration} onChange={e => setData('break_duration', e.target.value)}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((d, i) => (
                <button key={i} type="button" onClick={() => toggleDay(i+1)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${data.working_days.includes(i+1) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <Input label="Color" type="color" value={data.color} onChange={e => setData('color', e.target.value)} className="h-10 cursor-pointer"/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>{editingShift ? 'Save Changes' : 'Create Shift'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(assigningShift)} onClose={() => setAssigningShift(null)} title={`Assign employees${assigningShift ? ` · ${assigningShift.name}` : ''}`}>
        <form onSubmit={assign} className="space-y-4">
          <Input label="Effective from" type="date" value={assignmentForm.data.effective_from}
            onChange={e => assignmentForm.setData('effective_from', e.target.value)} error={assignmentForm.errors.effective_from}/>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Select employees</label>
              <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700"
                onClick={() => assignmentForm.setData('employee_ids', employees.map(employee => employee.id))}>Select all</button>
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2">
              {employees.map(employee => (
                <label key={employee.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  <input type="checkbox" checked={assignmentForm.data.employee_ids.includes(employee.id)} onChange={() => toggleEmployee(employee.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  {employee.first_name} {employee.last_name}
                </label>
              ))}
              {!employees.length && <p className="px-2 py-3 text-sm text-gray-500">No active employees available.</p>}
            </div>
            {assignmentForm.errors.employee_ids && <p className="mt-1 text-xs text-red-600">{assignmentForm.errors.employee_ids}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setAssigningShift(null)}>Cancel</Button>
            <Button type="submit" disabled={assignmentForm.processing || !assignmentForm.data.employee_ids.length}>
              Assign {assignmentForm.data.employee_ids.length || ''} {assignmentForm.data.employee_ids.length === 1 ? 'employee' : 'employees'}
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
