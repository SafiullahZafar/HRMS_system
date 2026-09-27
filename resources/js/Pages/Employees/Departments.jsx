import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import { Input, Select, Textarea } from '../../Components/Input';
import { Plus, Building2, Users, Edit, Trash2 } from 'lucide-react';

export default function Departments({ departments, branches, managers }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({ name: '', code: '', branch_id: '', description: '' });

  const submit = (e) => { e.preventDefault(); post('/departments', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Departments">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-gray-900">Departments</h2><p className="text-sm text-gray-500">{departments.length} departments</p></div>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Add Department</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(dept => (
          <div key={dept.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl"><Building2 size={20} className="text-indigo-600"/></div>
              <div className="flex gap-1">
                <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14}/></button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">{dept.name}</h3>
            {dept.code && <p className="text-xs text-gray-400 mt-0.5">Code: {dept.code}</p>}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <Users size={14} className="text-gray-400"/>
              <span className="text-sm text-gray-600">{dept.employees_count} employees</span>
              {dept.branch && <span className="ml-auto text-xs text-gray-400">{dept.branch.name}</span>}
            </div>
            {dept.manager && (
              <div className="mt-2 text-xs text-gray-500">
                Manager: <span className="font-medium text-gray-700">{dept.manager.first_name} {dept.manager.last_name}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Department">
        <form onSubmit={submit} className="space-y-4">
          <Input label="Department Name *" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="e.g. Development"/>
          <Input label="Code" value={data.code} onChange={e => setData('code', e.target.value)} placeholder="e.g. DEV"/>
          <Select label="Branch" value={data.branch_id} onChange={e => setData('branch_id', e.target.value)}>
            <option value="">Select Branch</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
          <Textarea label="Description" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Department description" rows={2}/>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Create Department</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
