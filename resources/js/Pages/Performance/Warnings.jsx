import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select, Textarea } from '../../Components/Input';
import { Plus, AlertTriangle } from 'lucide-react';

export default function Warnings({ warnings, employees }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ employee_id: '', type: 'verbal', subject: '', description: '', issue_date: new Date().toISOString().split('T')[0] });
  const submit = (e) => { e.preventDefault(); post('/performance/warnings', { onSuccess: () => { reset(); setModal(false); } }); };
  const typeColors = { verbal:'bg-yellow-100 text-yellow-700', written:'bg-orange-100 text-orange-700', show_cause:'bg-red-100 text-red-700', suspension:'bg-red-200 text-red-800', final:'bg-red-300 text-red-900' };

  return (
    <AppLayout title="Warnings">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Warnings & Disciplinary Actions</h2>
        <Button variant="danger" onClick={() => setModal(true)}><Plus size={15}/> Issue Warning</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Type</Th><Th>Subject</Th><Th>Date</Th><Th>Acknowledged</Th></tr></Thead>
          <Tbody>
            {warnings.data?.map(w => (
              <Tr key={w.id}>
                <Td><div className="flex items-center gap-2"><Avatar name={`${w.employee?.first_name} ${w.employee?.last_name}`} size="sm"/><span className="font-medium text-sm">{w.employee?.first_name} {w.employee?.last_name}</span></div></Td>
                <Td><span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${typeColors[w.type]||'bg-gray-100 text-gray-700'}`}>{w.type?.replace('_',' ')}</span></Td>
                <Td><span className="text-sm text-gray-700">{w.subject}</span></Td>
                <Td>{new Date(w.issue_date).toLocaleDateString()}</Td>
                <Td>{w.employee_acknowledged ? <span className="text-green-600 text-xs font-medium">✓ Yes</span> : <span className="text-gray-400 text-xs">Pending</span>}</Td>
              </Tr>
            ))}
            {(!warnings.data || warnings.data.length === 0) && <Tr><Td className="text-center py-10 text-gray-400" colSpan={5}>No warnings</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={warnings.links} meta={warnings}/></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Issue Warning" size="sm">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Employee *" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
          </Select>
          <Select label="Warning Type" value={data.type} onChange={e => setData('type', e.target.value)}>
            {['verbal','written','show_cause','suspension','final'].map(t => <option key={t} value={t} className="capitalize">{t.replace('_',' ')}</option>)}
          </Select>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input value={data.subject} onChange={e => setData('subject', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Repeated Late Arrival"/></div>
          <Textarea label="Description *" value={data.description} onChange={e => setData('description', e.target.value)} rows={3} placeholder="Describe the issue…"/>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
            <input type="date" value={data.issue_date} onChange={e => setData('issue_date', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" variant="danger" disabled={processing}>Issue Warning</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
