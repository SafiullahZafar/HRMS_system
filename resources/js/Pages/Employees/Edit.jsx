import { useForm, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Button from '../../Components/Button';
import { Input, Select } from '../../Components/Input';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditEmployee({ employee, departments, designations, branches, shifts, managers }) {
  const { data, setData, put, processing, errors } = useForm({
    first_name: employee.first_name || '', last_name: employee.last_name || '',
    phone: employee.phone || '', gender: employee.gender || 'male',
    department_id: employee.department_id || '', designation_id: employee.designation_id || '',
    branch_id: employee.branch_id || '', manager_id: employee.manager_id || '',
    employment_type: employee.employment_type || 'full_time',
    work_location: employee.work_location || 'Office',
    basic_salary: employee.basic_salary || '', status: employee.status || 'active',
    bank_name: employee.bank_name || '', bank_account: employee.bank_account || '',
  });

  const submit = (e) => { e.preventDefault(); put(`/employees/${employee.id}`); };

  return (
    <AppLayout title="Edit Employee">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/employees/${employee.id}/profile`} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <h2 className="text-xl font-bold text-gray-900">Edit — {employee.first_name} {employee.last_name}</h2>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="First Name *" value={data.first_name} onChange={e => setData('first_name', e.target.value)} error={errors.first_name}/>
          <Input label="Last Name *" value={data.last_name} onChange={e => setData('last_name', e.target.value)} error={errors.last_name}/>
          <Input label="Phone" value={data.phone} onChange={e => setData('phone', e.target.value)}/>
          <Select label="Gender" value={data.gender} onChange={e => setData('gender', e.target.value)}>
            <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
          </Select>
          <Select label="Department" value={data.department_id} onChange={e => setData('department_id', e.target.value)}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Select label="Designation" value={data.designation_id} onChange={e => setData('designation_id', e.target.value)}>
            <option value="">Select Designation</option>
            {designations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Select label="Status" value={data.status} onChange={e => setData('status', e.target.value)}>
            {['active','inactive','on_leave','terminated','resigned'].map(s => <option key={s} value={s} className="capitalize">{s.replace('_',' ')}</option>)}
          </Select>
          <Input label="Basic Salary" type="number" value={data.basic_salary} onChange={e => setData('basic_salary', e.target.value)}/>
          <Input label="Bank Name" value={data.bank_name} onChange={e => setData('bank_name', e.target.value)}/>
          <Input label="Bank Account" value={data.bank_account} onChange={e => setData('bank_account', e.target.value)}/>
        </div>
        <div className="flex justify-end gap-3">
          <Link href={`/employees/${employee.id}/profile`}><Button variant="secondary" type="button">Cancel</Button></Link>
          <Button type="submit" disabled={processing}><Save size={15}/> {processing ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </form>
    </AppLayout>
  );
}
