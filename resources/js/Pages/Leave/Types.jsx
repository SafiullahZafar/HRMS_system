import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import { Input, Select } from '../../Components/Input';
import { Plus } from 'lucide-react';

export default function LeaveTypes({ leaveTypes }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '', code: '', days_per_year: 0, is_paid: true,
    carry_forward: false, max_carry_forward: 0, applicable_gender: 'all',
    requires_document: false, available_in_probation: false, color: '#2563eb',
  });
  const submit = (e) => { e.preventDefault(); post('/leave/types', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Leave Types">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-gray-900">Leave Types</h2></div>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Add Leave Type</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaveTypes.map(lt => (
          <div key={lt.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{background: lt.color || '#2563eb'}}>
                {lt.code}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{lt.name}</h3>
                <p className="text-xs text-gray-400">{lt.days_per_year} days/year</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {lt.is_paid && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Paid</span>}
              {!lt.is_paid && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">Unpaid</span>}
              {lt.carry_forward && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Carry Forward</span>}
              {lt.encashable && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Encashable</span>}
              {lt.requires_document && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Doc Required</span>}
              {lt.applicable_gender !== 'all' && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize">{lt.applicable_gender} only</span>}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Leave Type">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name *" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} placeholder="Annual Leave"/>
            <Input label="Code *" value={data.code} onChange={e => setData('code', e.target.value)} error={errors.code} placeholder="AL"/>
          </div>
          <Input label="Days Per Year" type="number" value={data.days_per_year} onChange={e => setData('days_per_year', e.target.value)}/>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Is Paid" value={data.is_paid} onChange={e => setData('is_paid', e.target.value === 'true')}>
              <option value="true">Paid</option><option value="false">Unpaid</option>
            </Select>
            <Select label="Applicable Gender" value={data.applicable_gender} onChange={e => setData('applicable_gender', e.target.value)}>
              <option value="all">All</option><option value="male">Male Only</option><option value="female">Female Only</option>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={data.carry_forward} onChange={e => setData('carry_forward', e.target.checked)} className="rounded text-blue-600"/>
              Carry Forward
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={data.requires_document} onChange={e => setData('requires_document', e.target.checked)} className="rounded text-blue-600"/>
              Requires Document
            </label>
          </div>
          <Input label="Color" type="color" value={data.color} onChange={e => setData('color', e.target.value)} className="h-10"/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Create</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
