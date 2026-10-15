import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Input, Select } from '../../Components/Input';
import { Search, Plus, Download, Upload, MoreVertical, Eye, Edit, Trash2, Clock, DollarSign, FileText } from 'lucide-react';

export default function EmployeesIndex({ employees, departments, filters }) {
  const [search, setSearch] = useState(filters.search || '');
  const [dept, setDept] = useState(filters.department || '');
  const [status, setStatus] = useState(filters.status || '');
  const [openMenu, setOpenMenu] = useState(null);

  const applyFilters = () => router.get('/employees', { search, department: dept, status }, { preserveState: true });
  const clearFilters = () => { setSearch(''); setDept(''); setStatus(''); router.get('/employees'); };

  return (
    <AppLayout title="Employees">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Employees</h2>
          <p className="text-sm text-gray-500">{employees.total} total employees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled title="Import is not available yet"><Upload size={15}/> Import</Button>
          <Button variant="secondary" size="sm" disabled title="Export is not available yet"><Download size={15}/> Export</Button>
          <Link href="/employees/create"><Button size="sm"><Plus size={15}/> Add Employee</Button></Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3 items-end shadow-sm">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
          <div className="relative">
            <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key==='Enter' && applyFilters()}
              placeholder="Name, ID, email…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
          </div>
        </div>
        <div className="w-44">
          <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
          <select value={dept} onChange={e => setDept(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="w-36">
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="">All Status</option>
            {['active','inactive','on_leave','terminated','resigned'].map(s => <option key={s} value={s} className="capitalize">{s.replace('_',' ')}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <Button onClick={applyFilters} size="sm"><Search size={14}/> Filter</Button>
          <Button onClick={clearFilters} variant="secondary" size="sm">Clear</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead>
            <tr>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Designation</Th>
              <Th>Joining Date</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </Thead>
          <Tbody>
            {employees.data.map(emp => (
              <Tr key={emp.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm"/>
                    <div>
                      <Link href={`/employees/${emp.id}/profile`} className="font-medium text-gray-900 hover:text-blue-600 transition text-sm">
                        {emp.first_name} {emp.last_name}
                      </Link>
                      <p className="text-xs text-gray-400">{emp.employee_id}</p>
                    </div>
                  </div>
                </Td>
                <Td><span className="text-sm">{emp.department?.name || '—'}</span></Td>
                <Td><span className="text-sm">{emp.designation?.name || '—'}</span></Td>
                <Td><span className="text-sm">{emp.joining_date ? new Date(emp.joining_date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—'}</span></Td>
                <Td><Badge status={emp.employment_type}/></Td>
                <Td><Badge status={emp.status}/></Td>
                <Td>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/employees/${emp.id}/profile`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View"><Eye size={15}/></Link>
                    <Link href={`/employees/${emp.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit size={15}/></Link>
                    <Link href={`/attendance?employee_id=${emp.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Attendance"><Clock size={15}/></Link>
                    <Link href={`/documents?employee_id=${emp.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Documents"><FileText size={15}/></Link>
                  </div>
                </Td>
              </Tr>
            ))}
            {employees.data.length === 0 && (
              <Tr><Td className="text-center py-12 text-gray-400" colSpan={7}>No employees found</Td></Tr>
            )}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100">
          <Pagination links={employees.links} meta={employees.meta ?? employees}/>
        </div>
      </div>
    </AppLayout>
  );
}
