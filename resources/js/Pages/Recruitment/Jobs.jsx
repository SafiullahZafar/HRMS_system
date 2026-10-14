import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select, Textarea } from '../../Components/Input';
import { Plus, Users, MapPin, Briefcase } from 'lucide-react';

export default function Jobs({ jobs, departments, summary }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({ title: '', department_id: '', location: '', employment_type: 'full_time', salary_min: '', salary_max: '', vacancies: 1, requirements: '', description: '', deadline: '' });
  const submit = (e) => { e.preventDefault(); post('/recruitment/jobs', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Job Openings">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-xl font-bold text-gray-900">Job Openings</h2></div>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Create Job</Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[{l:'Published',v:summary.published,c:'bg-blue-50 text-blue-700'},{l:'Draft',v:summary.draft,c:'bg-gray-50 text-gray-700'},{l:'Closed',v:summary.closed,c:'bg-blue-50 text-blue-600'}].map(s=>(
          <div key={s.l} className={`${s.c} rounded-xl p-4 text-center`}><p className="text-2xl font-bold">{s.v}</p><p className="text-xs mt-0.5">{s.l}</p></div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.data?.map(job => (
          <div key={job.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{job.department?.name || 'No Department'}</p>
              </div>
              <Badge status={job.status}/>
            </div>
            <div className="space-y-1.5 text-xs text-gray-500 mb-3">
              {job.location && <div className="flex items-center gap-1.5"><MapPin size={12}/>{job.location}</div>}
              <div className="flex items-center gap-1.5"><Briefcase size={12}/>{job.employment_type?.replace('_',' ')}</div>
              {job.salary_min && <div className="flex items-center gap-1.5">💰 Rs. {Number(job.salary_min).toLocaleString()} – {Number(job.salary_max).toLocaleString()}</div>}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-500"><Users size={12}/>{job.candidates_count} applicants</div>
              <div className="flex gap-1">
                {job.status === 'draft' && <button onClick={() => router.put(`/recruitment/jobs/${job.id}`, { status: 'published', title: job.title })} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">Publish</button>}
                {job.status === 'published' && <button onClick={() => router.put(`/recruitment/jobs/${job.id}`, { status: 'closed', title: job.title })} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">Close</button>}
              </div>
            </div>
          </div>
        ))}
        {(!jobs.data || jobs.data.length === 0) && (
          <div className="col-span-3 bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-400">No job openings yet</p>
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Create Job Opening" size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. Backend Laravel Developer"/></div>
            <Select label="Department" value={data.department_id} onChange={e => setData('department_id', e.target.value)}>
              <option value="">Select Department</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Select label="Employment Type" value={data.employment_type} onChange={e => setData('employment_type', e.target.value)}>
              {['full_time','part_time','contract','intern'].map(t => <option key={t} value={t} className="capitalize">{t.replace('_',' ')}</option>)}
            </Select>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={data.location} onChange={e => setData('location', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Lahore"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Vacancies</label>
              <input type="number" min="1" value={data.vacancies} onChange={e => setData('vacancies', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Salary</label>
              <input type="number" value={data.salary_min} onChange={e => setData('salary_min', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="80000"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Salary</label>
              <input type="number" value={data.salary_max} onChange={e => setData('salary_max', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="120000"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          </div>
          <Textarea label="Requirements" value={data.requirements} onChange={e => setData('requirements', e.target.value)} rows={3} placeholder="List skills and requirements…"/>
          <Textarea label="Job Description" value={data.description} onChange={e => setData('description', e.target.value)} rows={3}/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Create Job</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
