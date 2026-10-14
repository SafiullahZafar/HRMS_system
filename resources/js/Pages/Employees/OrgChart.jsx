import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';

function OrgNode({ emp, employees, level = 0 }) {
  const reports = employees.filter(e => e.manager_id === emp.id);
  return (
    <div className="flex flex-col items-center">
      <div className={`flex flex-col items-center p-3 rounded-xl border-2 ${level === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} shadow-sm min-w-[140px] max-w-[160px]`}>
        <Avatar name={`${emp.first_name} ${emp.last_name}`} size="md"/>
        <p className="text-sm font-semibold text-gray-900 mt-2 text-center leading-tight">{emp.first_name} {emp.last_name}</p>
        <p className="text-xs text-gray-500 text-center mt-0.5">{emp.designation?.name || '—'}</p>
        {emp.department && <span className="mt-1.5 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{emp.department.name}</span>}
      </div>
      {reports.length > 0 && (
        <div className="flex flex-col items-center mt-2">
          <div className="w-px h-5 bg-gray-300"/>
          <div className="flex items-start gap-4 relative">
            {reports.length > 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] h-px bg-gray-300"/>}
            {reports.map((r, i) => (
              <div key={r.id} className="flex flex-col items-center">
                <div className="w-px h-5 bg-gray-300"/>
                <OrgNode emp={r} employees={employees} level={level + 1}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrgChart({ employees }) {
  const roots = employees.filter(e => !e.manager_id);
  return (
    <AppLayout title="Organization Chart">
      <div className="mb-5"><h2 className="text-xl font-bold text-gray-900">Organization Chart</h2></div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 overflow-x-auto">
        <div className="flex gap-8 justify-center min-w-max">
          {roots.map(r => <OrgNode key={r.id} emp={r} employees={employees}/>)}
          {roots.length === 0 && <p className="text-gray-400 text-sm">No employees to display</p>}
        </div>
      </div>
    </AppLayout>
  );
}
