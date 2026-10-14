import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select, Textarea } from '../../Components/Input';
import { Plus, Star } from 'lucide-react';

export default function ExitInterviews({ interviews, employees }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ employee_id: '', reason_for_leaving: '', work_environment_rating: null, compensation_rating: null, would_return: null, comments: '', interview_date: new Date().toISOString().split('T')[0] });
  const submit = (e) => { e.preventDefault(); post('/offboarding/exit-interviews', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Exit Interviews">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Exit Interviews</h2>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Record Interview</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Interview Date</Th><Th>Work Env.</Th><Th>Compensation</Th><Th>Would Return</Th><Th>Conducted By</Th></tr></Thead>
          <Tbody>
            {interviews.data?.map(iv => (
              <Tr key={iv.id}>
                <Td className="font-medium">{iv.employee?.first_name} {iv.employee?.last_name}</Td>
                <Td>{new Date(iv.interview_date).toLocaleDateString()}</Td>
                <Td>{iv.work_environment_rating ? <div className="flex items-center gap-1"><Star size={12} className="text-blue-400 fill-yellow-400"/><span className="font-medium">{iv.work_environment_rating}/5</span></div> : '—'}</Td>
                <Td>{iv.compensation_rating ? `${iv.compensation_rating}/5` : '—'}</Td>
                <Td>{iv.would_return === null ? '—' : iv.would_return ? <span className="text-blue-600 text-xs font-medium">Yes</span> : <span className="text-blue-500 text-xs font-medium">No</span>}</Td>
                <Td>{iv.conducted_by?.name || '—'}</Td>
              </Tr>
            ))}
            {(!interviews.data || interviews.data.length === 0) && <Tr><Td className="text-center py-8 text-gray-400" colSpan={6}>No exit interviews</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={interviews.links} meta={interviews}/></div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Exit Interview" size="sm">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Employee *" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
          </Select>
          <Textarea label="Reason for Leaving" value={data.reason_for_leaving} onChange={e => setData('reason_for_leaving', e.target.value)} rows={2}/>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Work Env. Rating" value={data.work_environment_rating||''} onChange={e => setData('work_environment_rating', e.target.value)}>
              <option value="">—</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}
            </Select>
            <Select label="Compensation Rating" value={data.compensation_rating||''} onChange={e => setData('compensation_rating', e.target.value)}>
              <option value="">—</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}
            </Select>
          </div>
          <Select label="Would Return?" value={data.would_return===null?'':String(data.would_return)} onChange={e => setData('would_return', e.target.value===''?null:e.target.value==='true')}>
            <option value="">—</option><option value="true">Yes</option><option value="false">No</option>
          </Select>
          <Textarea label="Comments" value={data.comments} onChange={e => setData('comments', e.target.value)} rows={2}/>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Interview Date *</label>
            <input type="date" value={data.interview_date} onChange={e => setData('interview_date', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Save</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
