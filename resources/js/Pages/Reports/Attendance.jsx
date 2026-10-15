import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import Button from '../../Components/Button';
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from '@inertiajs/react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AttendanceReport({ report, month, year }) {
  const [m, setM] = useState(month);
  const [y, setY] = useState(year);
  const apply = () => router.get('/reports/attendance', { month: m, year: y });

  return (
    <AppLayout title="Attendance Report">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/reports" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <div className="flex-1"><h2 className="text-xl font-bold text-gray-900">Attendance Report — {MONTHS[m-1]} {y}</h2></div>
        <select value={m} onChange={e=>setM(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
          {MONTHS.map((mo,i)=><option key={i} value={i+1}>{mo}</option>)}
        </select>
        <input type="number" value={y} onChange={e=>setY(e.target.value)} className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
        <Button size="sm" onClick={apply}>Apply</Button>
        <Button size="sm" variant="secondary" disabled title="Export is not available yet"><Download size={14}/> Export</Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Present</Th><Th>Absent</Th><Th>Late</Th><Th>Leaves</Th><Th>Total Hours</Th><Th>Overtime</Th></tr></Thead>
          <Tbody>
            {report.map((r,i) => (
              <Tr key={i}>
                <Td><div className="flex items-center gap-2"><Avatar name={`${r.employee.first_name} ${r.employee.last_name}`} size="sm"/><div><p className="font-medium text-sm">{r.employee.first_name} {r.employee.last_name}</p><p className="text-xs text-gray-400">{r.employee.department?.name}</p></div></div></Td>
                <Td><span className="font-medium text-blue-700">{r.present}</span></Td>
                <Td><span className="font-medium text-blue-600">{r.absent}</span></Td>
                <Td><span className="font-medium text-blue-600">{r.late}</span></Td>
                <Td><span className="font-medium text-blue-600">{r.leaves}</span></Td>
                <Td><span className="font-semibold">{r.total_hours}h</span></Td>
                <Td><span className={r.overtime > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}>{r.overtime}h</span></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
