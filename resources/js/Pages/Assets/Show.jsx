import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import { Table, Thead, Th, Tbody, Tr, Td } from '../../Components/Table';
import { ArrowLeft } from 'lucide-react';

export default function AssetShow({ asset }) {
  return (
    <AppLayout title={asset.name}>
      <div className="flex items-center gap-3 mb-5">
        <Link href="/assets" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
        <h2 className="text-xl font-bold text-gray-900">{asset.name}</h2>
        <Badge status={asset.status}/>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Asset Details</h3>
          {[['Asset ID',asset.asset_id],['Category',asset.category],['Brand',asset.brand],['Model',asset.model],['Serial No.',asset.serial_number],['Purchase Value',asset.purchase_value?`Rs. ${Number(asset.purchase_value).toLocaleString()}`:'—'],['Condition',asset.condition]].map(([l,v])=>(
            <div key={l} className="flex py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500 w-36">{l}</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{v||'—'}</span>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Assignment History</h3>
          <Table>
            <Thead><tr><Th>Employee</Th><Th>Assigned</Th><Th>Returned</Th><Th>Condition In</Th><Th>Condition Out</Th></tr></Thead>
            <Tbody>
              {asset.assignments?.map(a => (
                <Tr key={a.id}>
                  <Td className="font-medium">{a.employee?.first_name} {a.employee?.last_name}</Td>
                  <Td>{new Date(a.assigned_date).toLocaleDateString()}</Td>
                  <Td>{a.return_date ? new Date(a.return_date).toLocaleDateString() : <span className="text-blue-600 text-xs font-medium">Active</span>}</Td>
                  <Td className="capitalize">{a.condition_on_assign}</Td>
                  <Td className="capitalize">{a.condition_on_return||'—'}</Td>
                </Tr>
              ))}
              {(!asset.assignments || asset.assignments.length === 0) && <Tr><Td className="text-center py-6 text-gray-400" colSpan={5}>Never assigned</Td></Tr>}
            </Tbody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
