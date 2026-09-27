import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';
import Badge from '../../Components/Badge';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';

export default function Salaries({ employees }) {
  return (
    <AppLayout title="Salaries">
      <div className="mb-5"><h2 className="text-xl font-bold text-gray-900">Salary Register</h2><p className="text-sm text-gray-500">{employees.length} employees</p></div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Employee</Th><Th>Department</Th><Th>Designation</Th><Th>Type</Th><Th>Basic Salary</Th><Th>Est. Gross</Th></tr></Thead>
          <Tbody>
            {employees.map(emp => {
              const gross = Number(emp.basic_salary) * 1.28 + 5000 + 3000;
              return (
                <Tr key={emp.id}>
                  <Td><div className="flex items-center gap-2"><Avatar name={`${emp.first_name} ${emp.last_name}`} size="sm"/><span className="font-medium text-sm">{emp.first_name} {emp.last_name}</span></div></Td>
                  <Td>{emp.department?.name}</Td>
                  <Td>{emp.designation?.name}</Td>
                  <Td><Badge status={emp.employment_type}/></Td>
                  <Td className="font-semibold">Rs. {Number(emp.basic_salary).toLocaleString()}</Td>
                  <Td className="font-semibold text-indigo-700">Rs. {Math.round(gross).toLocaleString()}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
