import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';

export default function LeaveBalances({ balances, year }) {
  // Group by employee
  const byEmployee = balances.reduce((acc, b) => {
    const key = b.employee_id;
    if (!acc[key]) acc[key] = { employee: b.employee, balances: [] };
    acc[key].balances.push(b);
    return acc;
  }, {});

  return (
    <AppLayout title="Leave Balances">
      <div className="mb-5"><h2 className="text-xl font-bold text-gray-900">Leave Balances — {year}</h2></div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Leave Type</Th><Th>Allocated</Th><Th>Used</Th><Th>Pending</Th><Th>Available</Th><Th>Progress</Th></tr></Thead>
          <Tbody>
            {balances.map(b => {
              const available = Math.max(0, (Number(b.allocated) + Number(b.carried_forward)) - Number(b.used) - Number(b.pending));
              const usedPct = Number(b.allocated) > 0 ? Math.min(100, (Number(b.used) / Number(b.allocated)) * 100) : 0;
              return (
                <Tr key={b.id}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Avatar name={`${b.employee?.first_name} ${b.employee?.last_name}`} size="sm"/>
                      <span className="font-medium text-sm">{b.employee?.first_name} {b.employee?.last_name}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{background: b.leave_type?.color || '#4F46E5'}}/>
                      {b.leave_type?.name}
                    </div>
                  </Td>
                  <Td>{b.allocated}</Td>
                  <Td><span className="text-red-600 font-medium">{b.used}</span></Td>
                  <Td><span className="text-yellow-600">{b.pending}</span></Td>
                  <Td><span className="text-green-700 font-bold">{available}</span></Td>
                  <Td>
                    <div className="w-24">
                      <div className="h-1.5 rounded-full bg-gray-100">
                        <div className="h-1.5 rounded-full bg-indigo-500" style={{width:`${usedPct}%`}}/>
                      </div>
                      <span className="text-xs text-gray-400">{Math.round(usedPct)}% used</span>
                    </div>
                  </Td>
                </Tr>
              );
            })}
            {balances.length === 0 && <Tr><Td className="text-center py-8 text-gray-400" colSpan={7}>No balances found</Td></Tr>}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
