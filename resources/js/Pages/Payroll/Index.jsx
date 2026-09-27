import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select } from '../../Components/Input';
import { Plus, Play, Check, Eye, DollarSign } from 'lucide-react';

export default function PayrollIndex({ payrollRuns, summary }) {
  const [runModal, setRunModal] = useState(false);
  const { data, setData, post, processing } = useForm({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const submit = (e) => { e.preventDefault(); post('/payroll/run', { onSuccess: () => setRunModal(false) }); };
  const approve = (id) => router.put(`/payroll/${id}/approve`, {}, { preserveState: true });

  return (
    <AppLayout title="Payroll">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-xl font-bold text-gray-900">Payroll Runs</h2></div>
        <Button onClick={() => setRunModal(true)}><Play size={15}/> Run Payroll</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[{l:'Draft',v:summary.draft,c:'bg-gray-50 text-gray-700'},{l:'Pending Review',v:summary.pending,c:'bg-yellow-50 text-yellow-700'},{l:'Approved',v:summary.approved,c:'bg-green-50 text-green-700'},{l:'Paid',v:summary.paid,c:'bg-indigo-50 text-indigo-700'}].map(s=>(
          <div key={s.l} className={`${s.c} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.v}</p>
            <p className="text-xs mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Period</Th><Th>Employees</Th><Th>Gross Payroll</Th><Th>Deductions</Th><Th>Net Payroll</Th><Th>Status</Th><Th>Actions</Th></tr></Thead>
          <Tbody>
            {payrollRuns.data?.map(run => (
              <Tr key={run.id}>
                <Td><div><p className="font-medium text-gray-900">{run.title}</p><p className="text-xs text-gray-400">{run.pay_date ? new Date(run.pay_date).toLocaleDateString() : '—'}</p></div></Td>
                <Td>{run.employee_count}</Td>
                <Td className="font-medium">Rs. {Number(run.total_gross).toLocaleString()}</Td>
                <Td className="text-red-600">-Rs. {Number(run.total_deductions).toLocaleString()}</Td>
                <Td className="font-bold text-green-700">Rs. {Number(run.total_net).toLocaleString()}</Td>
                <Td><Badge status={run.status}/></Td>
                <Td>
                  <div className="flex gap-1">
                    <Link href={`/payroll/${run.id}`} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Eye size={14}/></Link>
                    {['calculated','under_review'].includes(run.status) && (
                      <button onClick={() => approve(run.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"><Check size={14}/></button>
                    )}
                  </div>
                </Td>
              </Tr>
            ))}
            {(!payrollRuns.data || payrollRuns.data.length===0) && <Tr><Td className="text-center py-10 text-gray-400" colSpan={7}>No payroll runs yet</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={payrollRuns.links} meta={payrollRuns}/></div>
      </div>

      <Modal open={runModal} onClose={() => setRunModal(false)} title="Run Payroll" size="sm">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Month" value={data.month} onChange={e => setData('month', e.target.value)}>
            {months.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input type="number" value={data.year} onChange={e => setData('year', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            ⚠️ This will calculate payroll for all active employees for <strong>{months[data.month-1]} {data.year}</strong>.
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setRunModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}><Play size={14}/> {processing ? 'Calculating…' : 'Calculate Payroll'}</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
