import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import Pagination from '../../Components/Pagination';

export default function Overtime({ overtime }) {
  return (
    <AppLayout title="Overtime">
      <div className="mb-5"><h2 className="text-xl font-bold text-gray-900">Overtime Records</h2></div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Date</Th><Th>Check In</Th><Th>Check Out</Th><Th>Overtime</Th></tr></Thead>
          <Tbody>
            {overtime.data?.map(r => (
              <Tr key={r.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={`${r.employee?.first_name} ${r.employee?.last_name}`} size="sm"/>
                    <span className="font-medium text-sm">{r.employee?.first_name} {r.employee?.last_name}</span>
                  </div>
                </Td>
                <Td>{new Date(r.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</Td>
                <Td>{r.check_in||'—'}</Td>
                <Td>{r.check_out||'—'}</Td>
                <Td><span className="font-semibold text-indigo-600">{Math.floor(r.overtime_minutes/60)}h {r.overtime_minutes%60}m</span></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100">
          <Pagination links={overtime.links} meta={overtime}/>
        </div>
      </div>
    </AppLayout>
  );
}
