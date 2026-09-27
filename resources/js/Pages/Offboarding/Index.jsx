import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select, Textarea } from '../../Components/Input';
import { Plus, Check, CheckSquare, Square } from 'lucide-react';

export default function OffboardingIndex({ resignations, employees, summary }) {
  const [modal, setModal] = useState(false);
  const [viewTasks, setViewTasks] = useState(null);
  const { data, setData, post, processing, reset } = useForm({ employee_id: '', resignation_date: new Date().toISOString().split('T')[0], last_working_day: '', reason: '', notice_period_days: 30, type: 'resignation' });
  const submit = (e) => { e.preventDefault(); post('/offboarding/resignations', { onSuccess: () => { reset(); setModal(false); } }); };
  const approve = (id) => router.put(`/offboarding/resignations/${id}/approve`, {}, { preserveState: true });

  return (
    <AppLayout title="Offboarding">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-xl font-bold text-gray-900">Offboarding</h2></div>
        <Button onClick={() => setModal(true)}><Plus size={15}/> New Resignation</Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {[{l:'Pending',v:summary.pending,c:'bg-yellow-50 text-yellow-700'},{l:'Accepted',v:summary.accepted,c:'bg-red-50 text-red-700'}].map(s=>(
          <div key={s.l} className={`${s.c} rounded-xl p-4 text-center`}><p className="text-2xl font-bold">{s.v}</p><p className="text-xs mt-0.5">{s.l}</p></div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Type</Th><Th>Resignation Date</Th><Th>Last Working Day</Th><Th>Notice Days</Th><Th>Status</Th><Th>Clearance</Th><Th>Actions</Th></tr></Thead>
          <Tbody>
            {resignations.data?.map(r => {
              const done = r.offboarding_tasks?.filter(t => t.is_completed).length || 0;
              const total = r.offboarding_tasks?.length || 0;
              return (
                <Tr key={r.id}>
                  <Td><div className="flex items-center gap-2"><Avatar name={`${r.employee?.first_name} ${r.employee?.last_name}`} size="sm"/><span className="font-medium text-sm">{r.employee?.first_name} {r.employee?.last_name}</span></div></Td>
                  <Td><Badge status={r.type}/></Td>
                  <Td>{new Date(r.resignation_date).toLocaleDateString()}</Td>
                  <Td>{new Date(r.last_working_day).toLocaleDateString()}</Td>
                  <Td>{r.notice_period_days}d</Td>
                  <Td><Badge status={r.status}/></Td>
                  <Td>
                    <button onClick={() => setViewTasks(r)} className="flex items-center gap-1.5 text-xs hover:text-indigo-600">
                      <div className="w-16 h-1.5 rounded-full bg-gray-100"><div className="h-1.5 rounded-full bg-green-500" style={{width:`${total?((done/total)*100):0}%`}}/></div>
                      <span>{done}/{total}</span>
                    </button>
                  </Td>
                  <Td>{r.status === 'pending' && <button onClick={() => approve(r.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Check size={14}/></button>}</Td>
                </Tr>
              );
            })}
            {(!resignations.data || resignations.data.length === 0) && <Tr><Td className="text-center py-10 text-gray-400" colSpan={8}>No resignations</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={resignations.links} meta={resignations}/></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Submit Resignation">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Employee *" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
          </Select>
          <Select label="Type" value={data.type} onChange={e => setData('type', e.target.value)}>
            <option value="resignation">Resignation</option><option value="termination">Termination</option>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Resignation Date</label>
              <input type="date" value={data.resignation_date} onChange={e => setData('resignation_date', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Working Day</label>
              <input type="date" value={data.last_working_day} onChange={e => setData('last_working_day', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/></div>
          </div>
          <Textarea label="Reason" value={data.reason} onChange={e => setData('reason', e.target.value)} rows={2}/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Submit</Button>
          </div>
        </form>
      </Modal>

      {/* Tasks modal */}
      <Modal open={!!viewTasks} onClose={() => setViewTasks(null)} title={`Clearance — ${viewTasks?.employee?.first_name} ${viewTasks?.employee?.last_name}`} size="sm">
        <div className="space-y-2">
          {viewTasks?.offboarding_tasks?.map(t => (
            <div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border ${t.is_completed ? 'border-green-100 bg-green-50' : 'border-gray-100'}`}>
              {t.is_completed ? <CheckSquare size={16} className="text-green-600"/> : <Square size={16} className="text-gray-300"/>}
              <span className={`text-sm ${t.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{t.task}</span>
            </div>
          ))}
          {!viewTasks?.offboarding_tasks?.length && <p className="text-sm text-gray-400 text-center py-4">No tasks</p>}
        </div>
      </Modal>
    </AppLayout>
  );
}
