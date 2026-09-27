import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';
import Badge from '../../Components/Badge';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';

export default function Roles({ users, roles }) {
  return (
    <AppLayout title="Roles & Permissions">
      <div className="mb-5"><h2 className="text-xl font-bold text-gray-900">User Roles</h2></div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>User</Th><Th>Role</Th><Th>Status</Th></tr></Thead>
          <Tbody>
            {users.map(u => (
              <Tr key={u.id}>
                <Td><div className="flex items-center gap-2"><Avatar name={u.name} size="sm"/><div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div></div></Td>
                <Td><span className="text-sm capitalize">{u.role?.replace(/_/g,' ')}</span></Td>
                <Td><Badge status={u.is_active ? 'active' : 'inactive'}/></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
