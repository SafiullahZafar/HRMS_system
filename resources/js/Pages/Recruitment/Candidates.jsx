import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select, Textarea } from '../../Components/Input';
import { Plus, ChevronRight } from 'lucide-react';

const STAGES = ['applied','screening','shortlisted','interview','selected','offer_sent','hired','rejected'];
const STAGE_COLORS = { applied:'bg-blue-100 text-blue-700', screening:'bg-blue-100 text-blue-700', shortlisted:'bg-blue-100 text-blue-700', interview:'bg-blue-100 text-blue-700', selected:'bg-blue-100 text-blue-700', offer_sent:'bg-blue-100 text-blue-700', hired:'bg-blue-100 text-blue-700', rejected:'bg-blue-100 text-blue-700' };

export default function Candidates({ candidates, jobs, pipeline, stages, filters }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ name: '', email: '', phone: '', job_opening_id: '', experience_years: 0, expected_salary: '', source: '', skills: '' });
  const submit = (e) => { e.preventDefault(); post('/recruitment/candidates', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Candidates">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Candidates Pipeline</h2>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Add Candidate</Button>
      </div>

      {/* Pipeline */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {STAGES.map(s => (
          <button key={s} onClick={() => router.get('/recruitment/candidates', { ...filters, stage: filters.stage === s ? '' : s }, { preserveState: true })}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition border ${filters.stage === s ? 'border-blue-400 bg-blue-600 text-white' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
            <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-bold ${filters.stage === s ? 'bg-white/20' : STAGE_COLORS[s]}`}>{pipeline[s] || 0}</span>
            <span className="capitalize">{s.replace('_',' ')}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Candidate</Th><Th>Job</Th><Th>Experience</Th><Th>Expected Salary</Th><Th>Source</Th><Th>Stage</Th><Th>Actions</Th></tr></Thead>
          <Tbody>
            {candidates.data?.map(c => (
              <Tr key={c.id}>
                <Td><div><p className="font-medium text-sm text-gray-900">{c.name}</p><p className="text-xs text-gray-400">{c.email}</p></div></Td>
                <Td><span className="text-sm">{c.job_opening?.title || '—'}</span></Td>
                <Td>{c.experience_years}y</Td>
                <Td>{c.expected_salary ? `Rs. ${Number(c.expected_salary).toLocaleString()}` : '—'}</Td>
                <Td>{c.source || '—'}</Td>
                <Td>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STAGE_COLORS[c.stage]}`}>{c.stage?.replace('_',' ')}</span>
                </Td>
                <Td>
                  <select value={c.stage} onChange={e => router.put(`/recruitment/candidates/${c.id}/stage`, { stage: e.target.value }, { preserveState: true })}
                    className="text-xs px-2 py-1 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none">
                    {STAGES.map(s => <option key={s} value={s} className="capitalize">{s.replace('_',' ')}</option>)}
                  </select>
                </Td>
              </Tr>
            ))}
            {(!candidates.data || candidates.data.length === 0) && <Tr><Td className="text-center py-10 text-gray-400" colSpan={7}>No candidates</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={candidates.links} meta={candidates}/></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Candidate">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input value={data.source} onChange={e => setData('source', e.target.value)} placeholder="LinkedIn, Rozee.pk…" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
              <input type="number" value={data.experience_years} onChange={e => setData('experience_years', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
              <input type="number" value={data.expected_salary} onChange={e => setData('expected_salary', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          </div>
          <Select label="Job Opening" value={data.job_opening_id} onChange={e => setData('job_opening_id', e.target.value)}>
            <option value="">Select Job</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </Select>
          <Textarea label="Skills" value={data.skills} onChange={e => setData('skills', e.target.value)} rows={2} placeholder="React, Laravel, MySQL…"/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Add Candidate</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
