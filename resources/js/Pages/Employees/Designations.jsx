import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import { Input, Select } from '../../Components/Input';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Plus } from 'lucide-react';

export default function Designations({ designations, departments }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({ name: '', department_id: '', level: '' });
  const submit = (e) => { e.preventDefault(); post('/designations', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Designations">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-gray-900">Designations</h2></div>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Add Designation</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Designation</Th><Th>Department</Th><Th>Level</Th><Th>Employees</Th></tr></Thead>
          <Tbody>
            {designations.map(d => (
              <Tr key={d.id}>
                <Td><span className="font-medium text-gray-900">{d.name}</span></Td>
                <Td>{d.department?.name || '—'}</Td>
                <Td className="capitalize">{d.level || '—'}</Td>
                <Td>{d.employees_count}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Add Designation">
        <form onSubmit={submit} className="space-y-4">
          <Input label="Designation Name *" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name}/>
          <Select label="Department" value={data.department_id} onChange={e => setData('department_id', e.target.value)}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Select label="Level" value={data.level} onChange={e => setData('level', e.target.value)}>
            <option value="">Select Level</option>
            {['junior','mid','senior','lead','manager','executive'].map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Create</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
