import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Button from '../../Components/Button';
import Modal from '../../Components/Modal';
import Pagination from '../../Components/Pagination';
import { Select, Textarea } from '../../Components/Input';
import { Plus, Megaphone, Trash2 } from 'lucide-react';

const PRIORITY_COLORS = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700' };

export default function AnnouncementsIndex({ announcements }) {
  const [modal, setModal] = useState(false);
  const { data, setData, post, processing, reset } = useForm({ title: '', content: '', audience: 'all', priority: 'medium', is_published: true });
  const submit = (e) => { e.preventDefault(); post('/announcements', { onSuccess: () => { reset(); setModal(false); } }); };

  return (
    <AppLayout title="Announcements">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Announcements</h2>
        <Button onClick={() => setModal(true)}><Plus size={15}/> New Announcement</Button>
      </div>

      <div className="space-y-3">
        {announcements.data?.map(ann => (
          <div key={ann.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-indigo-50 rounded-xl flex-shrink-0"><Megaphone size={18} className="text-indigo-600"/></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${PRIORITY_COLORS[ann.priority]||'bg-gray-100 text-gray-600'}`}>{ann.priority}</span>
                    {ann.is_published ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Published</span> : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Draft</span>}
                    <button onClick={() => router.delete(`/announcements/${ann.id}`, {preserveState:true})} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13}/></button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{ann.content}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>Audience: <span className="font-medium capitalize text-gray-600">{ann.audience}</span></span>
                  <span>By: {ann.created_by?.name}</span>
                  <span>{new Date(ann.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {(!announcements.data || announcements.data.length === 0) && (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-400">No announcements yet</p>
          </div>
        )}
      </div>
      <div className="mt-4"><Pagination links={announcements.links} meta={announcements}/></div>

      <Modal open={modal} onClose={() => setModal(false)} title="New Announcement">
        <form onSubmit={submit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input value={data.title} onChange={e => setData('title', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"/></div>
          <Textarea label="Content *" value={data.content} onChange={e => setData('content', e.target.value)} rows={4}/>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Audience" value={data.audience} onChange={e => setData('audience', e.target.value)}>
              <option value="all">All Employees</option><option value="branch">Branch</option><option value="department">Department</option>
            </Select>
            <Select label="Priority" value={data.priority} onChange={e => setData('priority', e.target.value)}>
              <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={data.is_published} onChange={e => setData('is_published', e.target.checked)} className="rounded text-indigo-600"/>
            Publish immediately
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button type="submit" disabled={processing}>Publish</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
