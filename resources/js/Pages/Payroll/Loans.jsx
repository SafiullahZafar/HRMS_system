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
import { Plus, Check } from 'lucide-react';

export default function Loans({ loans, employees }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ employee_id: '', type: 'advance', amount: '', installments: 1, reason: '' });
  const submit = (e) => { e.preventDefault(); post('/payroll/loans', { onSuccess: () => { reset(); setModal(false); } }); };
  const approve = (id) => router.put(`/payroll/loans/${id}/approve`, {}, { preserveState: true });

  return (
    <AppLayout title="Loans & Advances">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-xl font-bold text-gray-900">Loans & Advances</h2></div>
        <Button onClick={() => setModal(true)}><Plus size={15}/> New Request</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Type</Th><Th>Amount</Th><Th>Installments</Th><Th>Monthly</Th><Th>Remaining</Th><Th>Status</Th><Th>Actions</Th></tr></Thead>
          <Tbody>
            {loans.data?.map(l => (
              <Tr key={l.id}>
                <Td><div className="flex items-center gap-2"><Avatar name={`${l.employee?.first_name} ${l.employee?.last_name}`} size="sm"/><span className="font-medium text-sm">{l.employee?.first_name} {l.employee?.last_name}</span></div></Td>
                <Td><Badge status={l.type}/></Td>
                <Td className="font-semibold">Rs. {Number(l.amount).toLocaleString()}</Td>
                <Td>{l.installments}</Td>
                <Td>Rs. {Number(l.monthly_deduction).toLocaleString()}</Td>
                <Td><span className={l.remaining_amount > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>Rs. {Number(l.remaining_amount).toLocaleString()}</span></Td>
                <Td><Badge status={l.status}/></Td>
                <Td>{l.status === 'pending' && <button onClick={() => approve(l.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Check size={14}/></button>}</Td>
              </Tr>
            ))}
            {(!loans.data || loans.data.length === 0) && <Tr><Td className="text-center py-8 text-gray-400" colSpan={8}>No loans</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={loans.links} meta={loans}/></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="New Loan / Advance Request" size="sm">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Employee *" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
          </Select>
          <Select label="Type" value={data.type} onChange={e => setData('type', e.target.value)}>
            <option value="advance">Salary Advance</option><option value="loan">Loan</option>
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="50000"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Installments</label>
              <input type="number" min="1" value={data.installments} onChange={e => setData('installments', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/></div>
          </div>
          {data.amount && data.installments && (
            <div className="bg-indigo-50 rounded-lg p-3 text-sm text-indigo-700">
              Monthly deduction: <strong>Rs. {Math.round(data.amount / data.installments).toLocaleString()}</strong>
            </div>
          )}
          <Textarea label="Reason" value={data.reason} onChange={e => setData('reason', e.target.value)} rows={2}/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Submit</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
