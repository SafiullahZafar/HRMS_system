import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function LeaveReport({ data, year }) {
  return (
    <AppLayout title="Leave Report">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/reports" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <h2 className="text-xl font-bold text-gray-900">Leave Report — {year}</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Leave Type</Th><Th>From</Th><Th>To</Th><Th>Days</Th><Th>Status</Th></tr></Thead>
          <Tbody>
            {data.map(r => (
              <Tr key={r.id}>
                <Td className="font-medium">{r.employee?.first_name} {r.employee?.last_name}</Td>
                <Td>{r.leave_type?.name}</Td>
                <Td>{new Date(r.from_date).toLocaleDateString()}</Td>
                <Td>{new Date(r.to_date).toLocaleDateString()}</Td>
                <Td>{r.days}d</Td>
                <Td><Badge status={r.status}/></Td>
              </Tr>
            ))}
            {data.length === 0 && <Tr><Td className="text-center py-8 text-gray-400" colSpan={6}>No leave records</Td></Tr>}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
