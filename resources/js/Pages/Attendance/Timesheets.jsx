import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import Button from '../../Components/Button';
import { Download } from 'lucide-react';

export default function Timesheets({ summary, month, year }) {
  const [m, setM] = useState(month);
  const [y, setY] = useState(year);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const apply = () => router.get('/attendance/timesheets', { month: m, year: y }, { preserveState: true });

  return (
    <AppLayout title="Timesheets">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div><h2 className="text-xl font-bold text-gray-900">Timesheets</h2><p className="text-sm text-gray-500">{months[m-1]} {y}</p></div>
        <div className="flex items-center gap-2">
          <select value={m} onChange={e=>setM(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
            {months.map((mo,i)=><option key={i} value={i+1}>{mo}</option>)}
          </select>
          <input type="number" value={y} onChange={e=>setY(e.target.value)} className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
          <Button size="sm" onClick={apply}>Apply</Button>
          <Button size="sm" variant="secondary"><Download size={14}/> Export</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr>
            <Th>Employee</Th><Th>Present</Th><Th>Absent</Th><Th>Late</Th>
            <Th>Leaves</Th><Th>WFH</Th><Th>Total Hours</Th><Th>Overtime</Th>
          </tr></Thead>
          <Tbody>
            {summary.map((row,i) => (
              <Tr key={i}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={`${row.employee.first_name} ${row.employee.last_name}`} size="sm"/>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{row.employee.first_name} {row.employee.last_name}</p>
                      <p className="text-xs text-gray-400">{row.employee.department?.name}</p>
                    </div>
                  </div>
                </Td>
                <Td><span className="font-medium text-blue-700">{row.present_days}</span></Td>
                <Td><span className="font-medium text-blue-600">{row.absent_days}</span></Td>
                <Td><span className="font-medium text-blue-600">{row.late_days}</span></Td>
                <Td><span className="font-medium text-blue-600">{row.leave_days}</span></Td>
                <Td><span className="font-medium text-blue-600">{row.wfh_days}</span></Td>
                <Td><span className="font-semibold">{row.total_hours}h</span></Td>
                <Td><span className={row.overtime_hours > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}>{row.overtime_hours}h</span></Td>
              </Tr>
            ))}
            {summary.length === 0 && <Tr><Td className="text-center py-8 text-gray-400" colSpan={8}>No data</Td></Tr>}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
