import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function PayrollReport({ runs, year }) {
  const total = runs.reduce((s, r) => s + Number(r.total_net), 0);
  return (
    <AppLayout title="Payroll Report">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/reports" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <h2 className="text-xl font-bold text-gray-900">Payroll Report — {year}</h2>
        <div className="ml-auto bg-green-50 border border-green-200 rounded-xl px-4 py-2">
          <p className="text-xs text-gray-500">Total Paid</p>
          <p className="font-bold text-green-700">Rs. {total.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Period</Th><Th>Employees</Th><Th>Gross</Th><Th>Deductions</Th><Th>Net</Th><Th>Status</Th></tr></Thead>
          <Tbody>
            {runs.map(r => (
              <Tr key={r.id}>
                <Td className="font-medium">{r.title}</Td>
                <Td>{r.employee_count}</Td>
                <Td>Rs. {Number(r.total_gross).toLocaleString()}</Td>
                <Td className="text-red-600">-Rs. {Number(r.total_deductions).toLocaleString()}</Td>
                <Td className="font-bold text-green-700">Rs. {Number(r.total_net).toLocaleString()}</Td>
                <Td><Badge status={r.status}/></Td>
              </Tr>
            ))}
            {runs.length === 0 && <Tr><Td className="text-center py-8 text-gray-400" colSpan={6}>No payroll data</Td></Tr>}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
