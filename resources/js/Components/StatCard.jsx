export default function StatCard({ title, value, icon: Icon, color = 'indigo', change, sub }) {
  const colors = {
    indigo: 'bg-blue-50 text-blue-600',
    green:  'bg-blue-50 text-blue-600',
    red:    'bg-blue-50 text-blue-600',
    yellow: 'bg-blue-50 text-blue-600',
    blue:   'bg-blue-50 text-blue-600',
    purple: 'bg-blue-50 text-blue-600',
    orange: 'bg-blue-50 text-blue-600',
    teal:   'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          {change !== undefined && (
            <p className={`text-xs mt-1 font-medium ${change >= 0 ? 'text-blue-600' : 'text-blue-600'}`}>
              {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors[color] || colors.indigo}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
