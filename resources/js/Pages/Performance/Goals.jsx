import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Select, Textarea } from '../../Components/Input';
import { Plus, Target } from 'lucide-react';

export default function Goals({ goals, employees }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ employee_id: '', title: '', target: '', unit: '%', due_date: '', description: '' });
  const submit = (e) => { e.preventDefault(); post('/performance/goals', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Goals & KPIs">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Goals / KPIs</h2>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Add Goal</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.data?.map(g => {
          const pct = g.target ? Math.min(100, Math.round((Number(g.achieved)/Number(g.target))*100)) : 0;
          return (
            <div key={g.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar name={`${g.employee?.first_name} ${g.employee?.last_name}`} size="xs"/>
                    <span className="text-xs text-gray-500">{g.employee?.first_name} {g.employee?.last_name}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{g.title}</p>
                </div>
                <Badge status={g.status}/>
              </div>
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-sm font-bold text-blue-600">{pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100">
                  <div className={`h-2.5 rounded-full transition-all ${pct >= 100 ? 'bg-blue-500' : pct >= 70 ? 'bg-blue-500' : 'bg-blue-400'}`} style={{width:`${pct}%`}}/>
                </div>
                <p className="text-xs text-gray-400 mt-1">{g.achieved} / {g.target} {g.unit}</p>
              </div>
              {g.due_date && <p className="text-xs text-gray-400 mt-2">Due: {new Date(g.due_date).toLocaleDateString()}</p>}
              <div className="mt-3 flex gap-2">
                <button onClick={() => {const v = prompt('Update achieved value:', g.achieved); if(v) router.put(`/performance/goals/${g.id}`, {achieved: v}, {preserveState:true})}}
                  className="flex-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition">
                  Update Progress
                </button>
              </div>
            </div>
          );
        })}
        {(!goals.data || goals.data.length === 0) && <div className="col-span-3 bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center"><p className="text-gray-400">No goals set</p></div>}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Goal" size="sm">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Employee *" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
          </Select>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label>
            <input value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Complete assigned projects"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
              <input type="number" value={data.target} onChange={e => setData('target', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input value={data.unit} onChange={e => setData('unit', e.target.value)} placeholder="%, count, tasks…" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Add Goal</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
