import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select } from '../../Components/Input';
import { Plus, Video, Phone, MapPin } from 'lucide-react';

const TYPE_ICONS = { video: <Video size={13}/>, phone: <Phone size={13}/>, in_person: <MapPin size={13}/> };

export default function Interviews({ interviews, candidates, interviewers }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ candidate_id: '', interviewer_id: '', scheduled_at: '', type: 'in_person', location: '', meeting_link: '' });
  const submit = (e) => { e.preventDefault(); post('/recruitment/interviews', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Interviews">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Interviews</h2>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Schedule Interview</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Candidate</Th><Th>Interviewer</Th><Th>Date & Time</Th><Th>Type</Th><Th>Status</Th><Th>Scores</Th></tr></Thead>
          <Tbody>
            {interviews.data?.map(iv => (
              <Tr key={iv.id}>
                <Td><span className="font-medium">{iv.candidate?.name}</span></Td>
                <Td>{iv.interviewer?.name || '—'}</Td>
                <Td>{iv.scheduled_at ? new Date(iv.scheduled_at).toLocaleString('en-GB',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—'}</Td>
                <Td><span className="flex items-center gap-1.5 text-sm capitalize">{TYPE_ICONS[iv.type]}{iv.type?.replace('_',' ')}</span></Td>
                <Td><Badge status={iv.status}/></Td>
                <Td>
                  {iv.technical_score != null && (
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <div>Tech: <strong>{iv.technical_score}/10</strong></div>
                      {iv.communication_score != null && <div>Comm: <strong>{iv.communication_score}/10</strong></div>}
                    </div>
                  )}
                </Td>
              </Tr>
            ))}
            {(!interviews.data || interviews.data.length === 0) && <Tr><Td className="text-center py-10 text-gray-400" colSpan={6}>No interviews scheduled</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={interviews.links} meta={interviews}/></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Schedule Interview">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Candidate *" value={data.candidate_id} onChange={e => setData('candidate_id', e.target.value)}>
            <option value="">Select Candidate</option>
            {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="Interviewer" value={data.interviewer_id} onChange={e => setData('interviewer_id', e.target.value)}>
            <option value="">Select Interviewer</option>
            {interviewers.map(i => <option key={i.id} value={i.id}>{i.first_name} {i.last_name}</option>)}
          </Select>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Date & Time *</label>
            <input type="datetime-local" value={data.scheduled_at} onChange={e => setData('scheduled_at', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          <Select label="Interview Type" value={data.type} onChange={e => setData('type', e.target.value)}>
            <option value="in_person">In Person</option><option value="video">Video</option><option value="phone">Phone</option>
          </Select>
          {data.type === 'in_person' && (
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={data.location} onChange={e => setData('location', e.target.value)} placeholder="Office - Conference Room" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          )}
          {data.type === 'video' && (
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
              <input type="url" value={data.meeting_link} onChange={e => setData('meeting_link', e.target.value)} placeholder="https://meet.google.com/…" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Schedule</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
