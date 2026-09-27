import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';

export default function Components({ components }) {
  const typeColors = { allowance:'text-green-700 bg-green-100', deduction:'text-red-700 bg-red-100', bonus:'text-indigo-700 bg-indigo-100', tax:'text-yellow-700 bg-yellow-100', loan:'text-blue-700 bg-blue-100' };
  return (
    <AppLayout title="Salary Components">
      <div className="mb-5"><h2 className="text-xl font-bold text-gray-900">Salary Components</h2></div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <Thead><tr><Th>Name</Th><Th>Code</Th><Th>Type</Th><Th>Calculation</Th><Th>Value</Th><Th>Taxable</Th></tr></Thead>
          <Tbody>
            {components.map(c => (
              <Tr key={c.id}>
                <Td><span className="font-medium">{c.name}</span></Td>
                <Td><span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{c.code}</span></Td>
                <Td><span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[c.type]||'bg-gray-100 text-gray-700'}`}>{c.type}</span></Td>
                <Td className="capitalize">{c.calculation_type}</Td>
                <Td className="font-semibold">{c.calculation_type === 'percentage' ? `${c.value}%` : `Rs. ${Number(c.value).toLocaleString()}`}</Td>
                <Td>{c.is_taxable ? <span className="text-green-600 text-xs font-medium">Yes</span> : <span className="text-gray-400 text-xs">No</span>}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </AppLayout>
  );
}
