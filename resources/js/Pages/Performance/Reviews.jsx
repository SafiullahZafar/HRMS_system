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
import { Plus, Star } from 'lucide-react';

function ScoreInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex gap-1">{[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`w-8 h-8 rounded-lg text-sm font-bold transition ${value >= n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-blue-50'}`}>{n}</button>
      ))}</div>
    </div>
  );
}

export default function Reviews({ reviews, employees }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({
    employee_id: '', period: 'annual', review_year: new Date().getFullYear(),
    quality_score: null, productivity_score: null, communication_score: null,
    teamwork_score: null, attendance_score: null, technical_score: null,
    strengths: '', improvements: '', manager_comments: '',
  });
  const submit = (e) => { e.preventDefault(); post('/performance/reviews', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Performance Reviews">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Performance Reviews</h2>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Start Review</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Period</Th><Th>Year</Th><Th>Rating</Th><Th>Strengths</Th><Th>Status</Th></tr></Thead>
          <Tbody>
            {reviews.data?.map(r => (
              <Tr key={r.id}>
                <Td><div className="flex items-center gap-2"><Avatar name={`${r.employee?.first_name} ${r.employee?.last_name}`} size="sm"/><span className="font-medium text-sm">{r.employee?.first_name} {r.employee?.last_name}</span></div></Td>
                <Td className="capitalize">{r.period}</Td>
                <Td>{r.review_year}</Td>
                <Td>{r.overall_rating ? (
                  <div className="flex items-center gap-1"><Star size={13} className="text-blue-400 fill-yellow-400"/><span className="font-bold text-sm">{r.overall_rating}/5</span></div>
                ) : '—'}</Td>
                <Td><span className="text-xs text-gray-500 max-w-[160px] truncate block">{r.strengths || '—'}</span></Td>
                <Td><Badge status={r.status}/></Td>
              </Tr>
            ))}
            {(!reviews.data || reviews.data.length === 0) && <Tr><Td className="text-center py-10 text-gray-400" colSpan={6}>No reviews</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={reviews.links} meta={reviews}/></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Performance Review" size="lg">
        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <Select label="Employee" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}>
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
            </Select>
            <Select label="Period" value={data.period} onChange={e => setData('period', e.target.value)}>
              <option value="annual">Annual</option><option value="quarterly">Quarterly</option><option value="monthly">Monthly</option>
            </Select>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" value={data.review_year} onChange={e => setData('review_year', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Scores (1–5)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ScoreInput label="Quality of Work" value={data.quality_score} onChange={v => setData('quality_score', v)}/>
              <ScoreInput label="Productivity" value={data.productivity_score} onChange={v => setData('productivity_score', v)}/>
              <ScoreInput label="Communication" value={data.communication_score} onChange={v => setData('communication_score', v)}/>
              <ScoreInput label="Teamwork" value={data.teamwork_score} onChange={v => setData('teamwork_score', v)}/>
              <ScoreInput label="Attendance" value={data.attendance_score} onChange={v => setData('attendance_score', v)}/>
              <ScoreInput label="Technical Skills" value={data.technical_score} onChange={v => setData('technical_score', v)}/>
            </div>
          </div>
          <Textarea label="Strengths" value={data.strengths} onChange={e => setData('strengths', e.target.value)} rows={2} placeholder="Key strengths…"/>
          <Textarea label="Areas for Improvement" value={data.improvements} onChange={e => setData('improvements', e.target.value)} rows={2}/>
          <Textarea label="Manager Comments" value={data.manager_comments} onChange={e => setData('manager_comments', e.target.value)} rows={2}/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Submit Review</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
