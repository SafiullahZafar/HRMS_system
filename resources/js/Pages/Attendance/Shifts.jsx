import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import { Input, Select } from '../../Components/Input';
import { Plus, Clock, Users } from 'lucide-react';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function Shifts({ shifts }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '', start_time: '09:00', end_time: '18:00',
    grace_period: 15, break_duration: 60, working_days: [1,2,3,4,5], color: '#4F46E5',
  });

  const toggleDay = (d) => {
    setData('working_days', data.working_days.includes(d)
      ? data.working_days.filter(x => x !== d)
      : [...data.working_days, d].sort());
  };

  const submit = (e) => { e.preventDefault(); post('/attendance/shifts', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Shifts">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-gray-900">Shift Management</h2></div>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Create Shift</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map(s => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full" style={{ background: s.color || '#4F46E5' }}/>
                <h3 className="font-semibold text-gray-900">{s.name}</h3>
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1"><Users size={12}/> {s.assignments_count}</span>
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
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-400'
                }`}>{d}</span>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
              <span>Grace: {s.grace_period}min</span>
              <span>Break: {s.break_duration}min</span>
              {s.is_night_shift && <span className="text-indigo-600 font-medium">Night Shift</span>}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Create Shift">
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
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${data.working_days.includes(i+1) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <Input label="Color" type="color" value={data.color} onChange={e => setData('color', e.target.value)} className="h-10 cursor-pointer"/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Create Shift</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
