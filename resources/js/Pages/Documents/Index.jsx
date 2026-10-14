import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Select } from '../../Components/Input';
import { Plus, FileText, Download, Trash2, Shield } from 'lucide-react';

const CATS = ['cnic','cv','degree','contract','salary_letter','warning','experience_letter','nda','certificate'];

export default function DocumentsIndex({ documents, employees, categories, filters }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ employee_id: '', title: '', category: '', file: null });
  const submit = (e) => { e.preventDefault(); post('/documents', { forceFormData: true, onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Documents">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Employee Documents</h2>
        <Button onClick={() => setModal(true)}><Plus size={15}/> Upload Document</Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 flex gap-3 shadow-sm">
        <select defaultValue={filters.employee_id||''} onChange={e => router.get('/documents',{...filters,employee_id:e.target.value},{preserveState:true})}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">All Employees</option>
          {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
        </select>
        <select defaultValue={filters.category||''} onChange={e => router.get('/documents',{...filters,category:e.target.value},{preserveState:true})}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c} className="capitalize">{c.replace('_',' ')}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Document</Th><Th>Employee</Th><Th>Category</Th><Th>Size</Th><Th>Verified</Th><Th>Uploaded</Th><Th>Actions</Th></tr></Thead>
          <Tbody>
            {documents.data?.map(d => (
              <Tr key={d.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg"><FileText size={14} className="text-blue-600"/></div>
                    <span className="font-medium text-sm">{d.title}</span>
                  </div>
                </Td>
                <Td><div className="flex items-center gap-2"><Avatar name={`${d.employee?.first_name} ${d.employee?.last_name}`} size="xs"/><span className="text-sm">{d.employee?.first_name} {d.employee?.last_name}</span></div></Td>
                <Td><span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full capitalize">{d.category?.replace('_',' ')}</span></Td>
                <Td className="text-xs text-gray-500">{d.file_size ? `${Math.round(d.file_size/1024)}KB` : '—'}</Td>
                <Td>{d.is_verified ? <span className="flex items-center gap-1 text-blue-600 text-xs"><Shield size={12}/> Verified</span> : <span className="text-gray-400 text-xs">—</span>}</Td>
                <Td className="text-xs text-gray-500">{new Date(d.created_at).toLocaleDateString()}</Td>
                <Td><div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download size={13}/></button>
                  <button onClick={() => router.delete(`/documents/${d.id}`, {preserveState:true})} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Trash2 size={13}/></button>
                </div></Td>
              </Tr>
            ))}
            {(!documents.data || documents.data.length === 0) && <Tr><Td className="text-center py-10 text-gray-400" colSpan={7}>No documents</Td></Tr>}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={documents.links} meta={documents}/></div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Upload Document" size="sm">
        <form onSubmit={submit} className="space-y-4">
          <Select label="Employee *" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
          </Select>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="CNIC Front Side"/></div>
          <Select label="Category *" value={data.category} onChange={e => setData('category', e.target.value)}>
            <option value="">Select Category</option>
            {CATS.map(c => <option key={c} value={c} className="capitalize">{c.replace('_',' ')}</option>)}
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
            <input type="file" onChange={e => setData('file', e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Upload</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
