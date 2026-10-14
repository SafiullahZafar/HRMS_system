import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Plus, Download, Mail } from 'lucide-react';

export default function Offers({ offers, candidates }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ candidate_id: '', position: '', salary: '', joining_date: '', offer_expiry: '' });
  const submit = (e) => { e.preventDefault(); post('/recruitment/offers', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Offer Letters">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Offer Letters</h2>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Generate Offer</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Candidate</Th><Th>Position</Th><Th>Salary</Th><Th>Joining Date</Th><Th>Expiry</Th><Th>Status</Th><Th>Actions</Th></tr></Thead>
          <Tbody>
            {offers.data?.map(o => (
              <Tr key={o.id}>
                <Td><span className="font-medium">{o.candidate?.name}</span></Td>
                <Td>{o.position}</Td>
                <Td className="font-semibold">Rs. {Number(o.salary).toLocaleString()}</Td>
                <Td>{new Date(o.joining_date).toLocaleDateString()}</Td>
                <Td>{o.offer_expiry ? new Date(o.offer_expiry).toLocaleDateString() : '—'}</Td>
                <Td><Badge status={o.status}/></Td>
                <Td><div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download size={13}/></button>
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Mail size={13}/></button>
                </div></Td>
              </Tr>
            ))}
            {(!offers.data || offers.data.length === 0) && <Tr><Td className="text-center py-8 text-gray-400" colSpan={7}>No offer letters</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={offers.links} meta={offers}/></div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Generate Offer Letter">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Candidate *</label>
            <select value={data.candidate_id} onChange={e => setData('candidate_id', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="">Select Candidate</option>
              {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
            <input value={data.position} onChange={e => setData('position', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Salary (Rs.) *</label>
            <input type="number" value={data.salary} onChange={e => setData('salary', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Joining Date *</label>
              <input type="date" value={data.joining_date} onChange={e => setData('joining_date', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Offer Expiry</label>
              <input type="date" value={data.offer_expiry} onChange={e => setData('offer_expiry', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Generate & Send</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
