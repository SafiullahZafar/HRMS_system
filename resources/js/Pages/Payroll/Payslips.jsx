import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';
import Pagination from '../../Components/Pagination';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Download, Mail } from 'lucide-react';

export default function Payslips({ payslips }) {
  return (
    <AppLayout title="Payslips">
      <div className="mb-5"><h2 className="text-xl font-bold text-gray-900">Payslips</h2></div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Slip #</Th><Th>Period</Th><Th>Net Salary</Th><Th>Emailed</Th><Th>Actions</Th></tr></Thead>
          <Tbody>
            {payslips.data?.map(ps => (
              <Tr key={ps.id}>
                <Td><div className="flex items-center gap-2"><Avatar name={`${ps.employee?.first_name} ${ps.employee?.last_name}`} size="sm"/><span className="font-medium text-sm">{ps.employee?.first_name} {ps.employee?.last_name}</span></div></Td>
                <Td><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{ps.slip_number}</span></Td>
                <Td>{ps.payroll_run?.title || '—'}</Td>
                <Td className="font-bold text-green-700">Rs. {Number(ps.payroll_item?.net_salary || 0).toLocaleString()}</Td>
                <Td>{ps.is_emailed ? <span className="text-green-600 text-xs font-medium">✓ Sent</span> : <span className="text-gray-400 text-xs">Pending</span>}</Td>
                <Td><div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Download size={13}/></button>
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Mail size={13}/></button>
                </div></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <div className="px-4 py-3 border-t border-gray-100"><Pagination links={payslips.links} meta={payslips}/></div>
      </div>
    </AppLayout>
  );
}
