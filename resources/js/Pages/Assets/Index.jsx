import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select } from '../../Components/Input';
import { Plus, Eye, UserPlus, RotateCcw } from 'lucide-react';

export default function AssetsIndex({ assets, employees, categories, summary, filters }) {
  const [addModal, setAddModal] = useState(false);
  const [assignModal, setAssignModal] = useState(null);
  const { data, setData, post, processing, reset } = useForm({ name: '', category: '', brand: '', model: '', serial_number: '', purchase_value: '', purchase_date: '', condition: 'new' });
  const { data: ad, setData: setAd, post: assignPost, processing: ap, reset: areset } = useForm({ employee_id: '', condition_on_assign: 'good', notes: '' });

  const submit = (e) => { e.preventDefault(); post('/assets', { onSuccess: () => { reset(); setAddModal(false); } }); };
  const submitAssign = (e) => { e.preventDefault(); assignPost(`/assets/${assignModal}/assign`, { onSuccess: () => { areset(); setAssignModal(null); } }); };
  const returnAsset = (id) => router.post(`/assets/${id}/return`, { condition_on_return: 'good' }, { preserveState: true });

  return (
    <AppLayout title="Assets">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-xl font-bold text-gray-900">Company Assets</h2></div>
        <Button onClick={() => setAddModal(true)}><Plus size={15}/> Add Asset</Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[{l:'Available',v:summary.available,c:'bg-blue-50 text-blue-700'},{l:'Assigned',v:summary.assigned,c:'bg-blue-50 text-blue-700'},{l:'Maintenance',v:summary.maintenance,c:'bg-blue-50 text-blue-700'}].map(s=>(
          <div key={s.l} className={`${s.c} rounded-xl p-4 text-center`}><p className="text-2xl font-bold">{s.v}</p><p className="text-xs mt-0.5">{s.l}</p></div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Asset</Th><Th>Category</Th><Th>Serial No.</Th><Th>Condition</Th><Th>Status</Th><Th>Assigned To</Th><Th>Actions</Th></tr></Thead>
          <Tbody>
            {assets.data?.map(a => (
              <Tr key={a.id}>
                <Td><div><p className="font-medium text-sm text-gray-900">{a.name}</p><p className="text-xs text-gray-400">{a.asset_id} · {a.brand}</p></div></Td>
                <Td>{a.category}</Td>
                <Td><span className="font-mono text-xs">{a.serial_number||'—'}</span></Td>
                <Td className="capitalize">{a.condition}</Td>
                <Td><Badge status={a.status}/></Td>
                <Td>{a.current_assignment?.employee ? `${a.current_assignment.employee.first_name} ${a.current_assignment.employee.last_name}` : '—'}</Td>
                <Td>
                  <div className="flex gap-1">
                    <Link href={`/assets/${a.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={14}/></Link>
                    {a.status === 'available' && <button onClick={() => setAssignModal(a.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><UserPlus size={14}/></button>}
                    {a.status === 'assigned' && <button onClick={() => returnAsset(a.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><RotateCcw size={14}/></button>}
                  </div>
                </Td>
              </Tr>
            ))}
            {(!assets.data || assets.data.length === 0) && <Tr><Td className="text-center py-10 text-gray-400" colSpan={7}>No assets</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={assets.links} meta={assets}/></div>
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Asset">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
              <input value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="HP EliteBook 840"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input value={data.category} onChange={e => setData('category', e.target.value)} list="cats" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Laptop"/>
              <datalist id="cats">{['Laptop','Phone','Monitor','SIM','Vehicle','Keyboard','Access Card'].map(c=><option key={c} value={c}/>)}</datalist></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input value={data.brand} onChange={e => setData('brand', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input value={data.model} onChange={e => setData('model', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
              <input value={data.serial_number} onChange={e => setData('serial_number', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Purchase Value</label>
              <input type="number" value={data.purchase_value} onChange={e => setData('purchase_value', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
              <input type="date" value={data.purchase_date} onChange={e => setData('purchase_date', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          </div>
          <Select label="Condition" value={data.condition} onChange={e => setData('condition', e.target.value)}>
            {['new','good','fair','poor'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Add Asset</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Asset" size="sm">
        <form onSubmit={submitAssign} className="space-y-4">
          <Select label="Assign To *" value={ad.employee_id} onChange={e => setAd('employee_id', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
          </Select>
          <Select label="Condition" value={ad.condition_on_assign} onChange={e => setAd('condition_on_assign', e.target.value)}>
            {['new','good','fair','poor'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Button>
            <Button type="submit" disabled={ap}>Assign</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
