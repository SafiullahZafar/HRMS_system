import { Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { ArrowLeft, Check, Download, Mail } from 'lucide-react';

export default function PayrollShow({ payrollRun }) {
  const approve = () => router.put(`/payroll/${payrollRun.id}/approve`);
  return (
    <AppLayout title={payrollRun.title}>
      <div className="flex items-center gap-3 mb-5">
        <Link href="/payroll" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <div className="flex-1"><h2 className="text-xl font-bold text-gray-900">{payrollRun.title}</h2></div>
        <Badge status={payrollRun.status}/>
        {['calculated','under_review'].includes(payrollRun.status) && (
          <Button onClick={approve}><Check size={15}/> Approve Payroll</Button>
        )}
        <Button variant="secondary"><Download size={15}/> Export</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          {l:'Employees',v:payrollRun.employee_count,c:'indigo'},
          {l:'Total Gross',v:`Rs. ${Number(payrollRun.total_gross).toLocaleString()}`,c:'blue'},
          {l:'Deductions',v:`Rs. ${Number(payrollRun.total_deductions).toLocaleString()}`,c:'red'},
          {l:'Net Payroll',v:`Rs. ${Number(payrollRun.total_net).toLocaleString()}`,c:'green'},
        ].map(s=>(
          <div key={s.l} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500">{s.l}</p>
            <p className={`text-xl font-bold mt-1 ${s.c==='green'?'text-blue-700':s.c==='red'?'text-blue-600':'text-gray-900'}`}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Basic</Th><Th>Allowances</Th><Th>Overtime</Th><Th>Gross</Th><Th>Deductions</Th><Th>Net Salary</Th><Th>Payslip</Th></tr></Thead>
          <Tbody>
            {payrollRun.items?.map(item => (
              <Tr key={item.id}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={`${item.employee?.first_name} ${item.employee?.last_name}`} size="sm"/>
                    <div>
                      <p className="font-medium text-sm">{item.employee?.first_name} {item.employee?.last_name}</p>
                      <p className="text-xs text-gray-400">{item.employee?.department?.name}</p>
                    </div>
                  </div>
                </Td>
                <Td>Rs. {Number(item.basic_salary).toLocaleString()}</Td>
                <Td>Rs. {Number(item.total_allowances).toLocaleString()}</Td>
                <Td>{Number(item.overtime_pay) > 0 ? `Rs. ${Number(item.overtime_pay).toLocaleString()}` : '—'}</Td>
                <Td className="font-medium">Rs. {Number(item.gross_salary).toLocaleString()}</Td>
                <Td className="text-blue-600">-Rs. {Number(item.total_deductions).toLocaleString()}</Td>
                <Td className="font-bold text-blue-700">Rs. {Number(item.net_salary).toLocaleString()}</Td>
                <Td>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download size={13}/></button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Mail size={13}/></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
