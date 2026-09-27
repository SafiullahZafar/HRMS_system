import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Download } from 'lucide-react';
import Button from '../../Components/Button';

export default function EmployeesReport({ employees }) {
  return (
    <AppLayout title="Employee Report">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/reports" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <div className="flex-1"><h2 className="text-xl font-bold text-gray-900">Employee Report</h2><p className="text-sm text-gray-500">{employees.length} employees</p></div>
        <Button size="sm" variant="secondary"><Download size={14}/> Export Excel</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Department</Th><Th>Designation</Th><Th>Branch</Th><Th>Type</Th><Th>Joining Date</Th><Th>Status</Th></tr></Thead>
          <Tbody>
            {employees.map(e => (
              <Tr key={e.id}>
                <Td><div className="flex items-center gap-2"><Avatar name={`${e.first_name} ${e.last_name}`} size="sm"/><div><p className="font-medium text-sm">{e.first_name} {e.last_name}</p><p className="text-xs text-gray-400">{e.employee_id}</p></div></div></Td>
                <Td>{e.department?.name||'—'}</Td>
                <Td>{e.designation?.name||'—'}</Td>
                <Td>{e.branch?.name||'—'}</Td>
                <Td><Badge status={e.employment_type}/></Td>
                <Td>{e.joining_date ? new Date(e.joining_date).toLocaleDateString() : '—'}</Td>
                <Td><Badge status={e.status}/></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
