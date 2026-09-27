import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Button from '../../Components/Button';
import { Input } from '../../Components/Input';
import { Building2, Save } from 'lucide-react';

export default function SettingsIndex({ company }) {
  const { data, setData, put, processing, errors } = useForm({
    name: company?.name || '', email: company?.email || '', phone: company?.phone || '',
    address: company?.address || '', currency: company?.currency || 'PKR',
    timezone: company?.timezone || 'Asia/Karachi', website: company?.website || '', ntn: company?.ntn || '',
  });
  const submit = (e) => { e.preventDefault(); put('/settings/company'); };

  return (
    <AppLayout title="Settings">
      <div className="mb-6"><h2 className="text-xl font-bold text-gray-900">Settings</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 space-y-1">
            {['Company','HR Policy','Attendance','Leave','Payroll','Notifications','Roles & Permissions'].map((item,i) => (
              <button key={item} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${i===0?'bg-indigo-600 text-white font-medium':'text-gray-600 hover:bg-gray-100'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Company settings */}
        <div className="lg:col-span-3">
          <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <Building2 size={18} className="text-indigo-600"/>
              <h3 className="font-semibold text-gray-900 text-sm">Company Information</h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company Name *" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name}/>
              <Input label="Email" type="email" value={data.email} onChange={e => setData('email', e.target.value)}/>
              <Input label="Phone" value={data.phone} onChange={e => setData('phone', e.target.value)}/>
              <Input label="NTN" value={data.ntn} onChange={e => setData('ntn', e.target.value)} placeholder="NTN number"/>
              <Input label="Website" value={data.website} onChange={e => setData('website', e.target.value)} placeholder="https://"/>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select value={data.currency} onChange={e => setData('currency', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  {['PKR','USD','EUR','GBP','AED','SAR'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select value={data.timezone} onChange={e => setData('timezone', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  {['Asia/Karachi','Asia/Dubai','Asia/Riyadh','Europe/London','America/New_York'].map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea rows={2} value={data.address} onChange={e => setData('address', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"/>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
              <Button type="submit" disabled={processing}><Save size={15}/> {processing ? 'Saving…' : 'Save Settings'}</Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
