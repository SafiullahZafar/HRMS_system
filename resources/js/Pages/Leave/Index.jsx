import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select, Textarea } from '../../Components/Input';
import { Plus, Check, X, Filter } from 'lucide-react';

export default function LeaveIndex({ requests, leaveTypes, employees, filters, summary }) {
  const [addModal, setAddModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(null);
  const { data, setData, post, processing, errors, reset } = useForm({ employee_id: '', leave_type_id: '', from_date: '', to_date: '', day_type: 'full', reason: '' });
  const { data: rd, setData: setRd, put: rejectPut, processing: rp } = useForm({ reason: '' });

  const submit = (e) => { e.preventDefault(); post('/leave', { onSuccess: () => { reset(); setAddModal(false); } }); };
  const approve = (id) => router.put(`/leave/${id}/approve`, {}, { preserveState: true });
  const reject = (e) => { e.preventDefault(); rejectPut(`/leave/${rejectModal}/reject`, { onSuccess: () => setRejectModal(null) }); };

  return (
    <AppLayout title="Leave Requests">
      <div className="flex items-center justify-between mb-5">
        <div><h2 className="text-xl font-bold text-gray-900">Leave Requests</h2></div>
        <Button onClick={() => setAddModal(true)}><Plus size={15}/> New Request</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[{l:'Pending',v:summary.pending,c:'text-blue-600 bg-blue-50'},{l:'Approved',v:summary.approved,c:'text-blue-600 bg-blue-50'},{l:'Rejected',v:summary.rejected,c:'text-blue-600 bg-blue-50'}].map(s=>(
          <div key={s.l} className={`${s.c} rounded-xl p-4 text-center`}>
            <p className={`text-3xl font-bold ${s.c.split(' ')[0]}`}>{s.v}</p>
            <p className="text-xs text-gray-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex flex-wrap gap-3 shadow-sm">
        <select defaultValue={filters.status||''} onChange={e => router.get('/leave',{...filters,status:e.target.value},{preserveState:true})}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">All Status</option>
          {['pending','approved','rejected','cancelled'].map(s=><option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <select defaultValue={filters.leave_type_id||''} onChange={e => router.get('/leave',{...filters,leave_type_id:e.target.value},{preserveState:true})}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">All Types</option>
          {leaveTypes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Type</Th><Th>From</Th><Th>To</Th><Th>Days</Th><Th>Reason</Th><Th>Status</Th><Th>Actions</Th></tr></Thead>
          <Tbody>
            {requests.data.map(r => (
              <Tr key={r.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={`${r.employee?.first_name} ${r.employee?.last_name}`} size="sm"/>
                    <span className="font-medium text-sm">{r.employee?.first_name} {r.employee?.last_name}</span>
                  </div>
                </Td>
                <Td>
                  <span className="flex items-center gap-1.5">
                    {r.leave_type?.color && <span className="w-2 h-2 rounded-full" style={{background:r.leave_type.color}}/>}
                    {r.leave_type?.name}
                  </span>
                </Td>
                <Td>{new Date(r.from_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}</Td>
                <Td>{new Date(r.to_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}</Td>
                <Td><span className="font-semibold">{r.days}d</span></Td>
                <Td><span className="text-xs text-gray-500 max-w-[140px] truncate block">{r.reason||'—'}</span></Td>
                <Td><Badge status={r.status}/></Td>
                <Td>
                  {r.status === 'pending' && (
                    <div className="flex gap-1">
                      <button onClick={()=>approve(r.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Approve"><Check size={15}/></button>
                      <button onClick={()=>setRejectModal(r.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Reject"><X size={15}/></button>
                    </div>
                  )}
                </Td>
              </Tr>
            ))}
            {requests.data.length===0 && <Tr><Td className="text-center py-10 text-gray-400" colSpan={8}>No leave requests</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100">
          <Pagination links={requests.links} meta={requests}/>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={addModal} onClose={()=>setAddModal(false)} title="New Leave Request">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Employee *" value={data.employee_id} onChange={e=>setData('employee_id',e.target.value)} error={errors.employee_id}>
            <option value="">Select Employee</option>
            {employees.map(e=><option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
          </Select>
          <Select label="Leave Type *" value={data.leave_type_id} onChange={e=>setData('leave_type_id',e.target.value)} error={errors.leave_type_id}>
            <option value="">Select Type</option>
            {leaveTypes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">From *</label>
              <input type="date" value={data.from_date} onChange={e=>setData('from_date',e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
              <input type="date" value={data.to_date} onChange={e=>setData('to_date',e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
          </div>
          <Select label="Day Type" value={data.day_type} onChange={e=>setData('day_type',e.target.value)}>
            <option value="full">Full Day</option><option value="half_morning">Half Day (Morning)</option><option value="half_afternoon">Half Day (Afternoon)</option>
          </Select>
          <Textarea label="Reason" value={data.reason} onChange={e=>setData('reason',e.target.value)} rows={2} placeholder="Reason for leave…"/>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={()=>setAddModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Submit Request</Button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal open={!!rejectModal} onClose={()=>setRejectModal(null)} title="Reject Leave Request" size="sm">
        <form onSubmit={reject} className="space-y-4">
          <Textarea label="Reason for Rejection" value={rd.reason} onChange={e=>setRd('reason',e.target.value)} rows={3} placeholder="Provide reason…"/>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={()=>setRejectModal(null)}>Cancel</Button>
            <Button type="submit" variant="danger" disabled={rp}>Reject Leave</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
