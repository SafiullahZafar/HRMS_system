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
import { Plus, TrendingUp } from 'lucide-react';

export default function Promotions({ promotions, employees, designations, departments }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ employee_id: '', to_designation_id: '', to_department_id: '', from_salary: '', to_salary: '', effective_date: '', type: 'promotion', reason: '' });

  const selectEmp = (id) => {
    setData('employee_id', id);
    const emp = employees.find(e => e.id == id);
    if (emp) setData('from_salary', emp.basic_salary);
  };

  const submit = (e) => { e.preventDefault(); post('/performance/promotions', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Promotions">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Promotions & Increments</h2>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Add Promotion</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Type</Th><Th>New Role</Th><Th>Salary Change</Th><Th>Effective Date</Th></tr></Thead>
          <Tbody>
            {promotions.data?.map(p => (
              <Tr key={p.id}>
                <Td><div className="flex items-center gap-2"><Avatar name={`${p.employee?.first_name} ${p.employee?.last_name}`} size="sm"/><span className="font-medium text-sm">{p.employee?.first_name} {p.employee?.last_name}</span></div></Td>
                <Td><Badge status={p.type}/></Td>
                <Td>
                  {p.to_designation && <p className="text-sm">{p.to_designation.name}</p>}
                  {p.to_department && <p className="text-xs text-gray-400">{p.to_department.name}</p>}
                </Td>
                <Td>
                  <div className="text-xs">
                    <span className="text-gray-400">Rs. {Number(p.from_salary).toLocaleString()}</span>
                    <span className="mx-1 text-gray-300">→</span>
                    <span className="text-green-700 font-semibold">Rs. {Number(p.to_salary).toLocaleString()}</span>
                  </div>
                </Td>
                <Td>{new Date(p.effective_date).toLocaleDateString()}</Td>
              </Tr>
            ))}
            {(!promotions.data || promotions.data.length === 0) && <Tr><Td className="text-center py-10 text-gray-400" colSpan={5}>No promotions</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={promotions.links} meta={promotions}/></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Promotion / Increment">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Employee *" value={data.employee_id} onChange={e => selectEmp(e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
          </Select>
          <Select label="Type" value={data.type} onChange={e => setData('type', e.target.value)}>
            <option value="promotion">Promotion</option><option value="increment">Salary Increment</option><option value="transfer">Transfer</option>
          </Select>
          <Select label="New Designation" value={data.to_designation_id} onChange={e => setData('to_designation_id', e.target.value)}>
            <option value="">Same / Select New</option>
            {designations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Salary</label>
              <input type="number" value={data.from_salary} readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">New Salary *</label>
              <input type="number" value={data.to_salary} onChange={e => setData('to_salary', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
            <input type="date" value={data.effective_date} onChange={e => setData('effective_date', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/></div>
          <Textarea label="Reason" value={data.reason} onChange={e => setData('reason', e.target.value)} rows={2}/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Confirm</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
