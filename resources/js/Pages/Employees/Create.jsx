import { useForm, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Button from '../../Components/Button';
import { Input, Select, Textarea } from '../../Components/Input';
import { ArrowLeft, Save, User, Building2, DollarSign, Clock } from 'lucide-react';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <Icon size={18} className="text-blue-600"/>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

export default function CreateEmployee({ departments, designations, branches, shifts, managers }) {
  const { data, setData, post, processing, errors } = useForm({
    first_name: '', last_name: '', email: '', phone: '', gender: 'male',
    father_name: '', cnic: '', date_of_birth: '', address: '',
    emergency_contact_name: '', emergency_contact_phone: '',
    department_id: '', designation_id: '', branch_id: '', manager_id: '',
    employment_type: 'full_time', joining_date: '', probation_end_date: '',
    work_location: 'Office', basic_salary: '', payment_method: 'bank',
    bank_name: '', bank_account: '', shift_id: '',
  });

  const filteredDesignations = designations.filter(d => !data.department_id || d.department_id == data.department_id);

  return (
    <AppLayout title="Add Employee">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/employees" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"><ArrowLeft size={18}/></Link>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Add New Employee</h2>
          <p className="text-sm text-gray-500">Fill in the employee information below</p>
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); post('/employees'); }} className="space-y-5">
        <Section icon={User} title="Personal Information">
          <Input label="First Name *" value={data.first_name} onChange={e => setData('first_name', e.target.value)} error={errors.first_name} placeholder="Ali"/>
          <Input label="Last Name *" value={data.last_name} onChange={e => setData('last_name', e.target.value)} error={errors.last_name} placeholder="Ahmed"/>
          <Input label="Email Address *" type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} placeholder="ali@company.com"/>
          <Input label="Phone" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+92-300-0000000"/>
          <Select label="Gender" value={data.gender} onChange={e => setData('gender', e.target.value)}>
            <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
          </Select>
          <Input label="Father Name" value={data.father_name} onChange={e => setData('father_name', e.target.value)} placeholder="Father's name"/>
          <Input label="CNIC" value={data.cnic} onChange={e => setData('cnic', e.target.value)} placeholder="00000-0000000-0"/>
          <Input label="Date of Birth" type="date" value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)}/>
          <Input label="Emergency Contact Name" value={data.emergency_contact_name} onChange={e => setData('emergency_contact_name', e.target.value)}/>
          <Input label="Emergency Contact Phone" value={data.emergency_contact_phone} onChange={e => setData('emergency_contact_phone', e.target.value)}/>
          <div className="sm:col-span-2 lg:col-span-3">
            <Textarea label="Address" value={data.address} onChange={e => setData('address', e.target.value)} placeholder="Complete address" rows={2}/>
          </div>
        </Section>

        <Section icon={Building2} title="Employment Details">
          <Select label="Branch" value={data.branch_id} onChange={e => setData('branch_id', e.target.value)}>
            <option value="">Select Branch</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
          <Select label="Department *" value={data.department_id} onChange={e => { setData('department_id', e.target.value); setData('designation_id', ''); }} error={errors.department_id}>
            <option value="">Select Department</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Select label="Designation" value={data.designation_id} onChange={e => setData('designation_id', e.target.value)}>
            <option value="">Select Designation</option>
            {filteredDesignations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Select label="Manager" value={data.manager_id} onChange={e => setData('manager_id', e.target.value)}>
            <option value="">Select Manager</option>
            {managers.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
          </Select>
          <Select label="Employment Type *" value={data.employment_type} onChange={e => setData('employment_type', e.target.value)}>
            <option value="full_time">Full Time</option><option value="part_time">Part Time</option>
            <option value="contract">Contract</option><option value="intern">Intern</option>
          </Select>
          <Input label="Joining Date *" type="date" value={data.joining_date} onChange={e => setData('joining_date', e.target.value)} error={errors.joining_date}/>
          <Input label="Probation End Date" type="date" value={data.probation_end_date} onChange={e => setData('probation_end_date', e.target.value)}/>
          <Select label="Work Location" value={data.work_location} onChange={e => setData('work_location', e.target.value)}>
            <option value="Office">Office</option><option value="Remote">Remote</option><option value="Hybrid">Hybrid</option>
          </Select>
        </Section>

        <Section icon={DollarSign} title="Salary & Payment">
          <Input label="Basic Salary *" type="number" value={data.basic_salary} onChange={e => setData('basic_salary', e.target.value)} error={errors.basic_salary} placeholder="80000"/>
          <Select label="Payment Method" value={data.payment_method} onChange={e => setData('payment_method', e.target.value)}>
            <option value="bank">Bank Transfer</option><option value="cash">Cash</option><option value="cheque">Cheque</option>
          </Select>
          {data.payment_method === 'bank' && <>
            <Input label="Bank Name" value={data.bank_name} onChange={e => setData('bank_name', e.target.value)} placeholder="HBL"/>
            <Input label="Bank Account No" value={data.bank_account} onChange={e => setData('bank_account', e.target.value)} placeholder="Account number"/>
          </>}
        </Section>

        <Section icon={Clock} title="Work Schedule">
          <Select label="Shift" value={data.shift_id} onChange={e => setData('shift_id', e.target.value)}>
            <option value="">Select Shift</option>
            {shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/employees"><Button variant="secondary" type="button">Cancel</Button></Link>
          <Button variant="secondary" type="button">Save Draft</Button>
          <Button type="submit" disabled={processing}>
            <Save size={15}/> {processing ? 'Creating…' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
