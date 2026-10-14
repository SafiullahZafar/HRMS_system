import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import Avatar from '../../Components/Avatar';
import { TrendingUp, Target, Award, AlertTriangle, ArrowRight } from 'lucide-react';

export default function PerformanceIndex({ reviews, promotions, warnings }) {
  return (
    <AppLayout title="Performance">
      <div className="mb-5"><h2 className="text-xl font-bold text-gray-900">Performance Overview</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><TrendingUp size={16} className="text-blue-600"/><h3 className="font-semibold text-gray-900 text-sm">Recent Reviews</h3></div>
            <Link href="/performance/reviews" className="text-xs text-blue-600 flex items-center gap-1">All <ArrowRight size={11}/></Link>
          </div>
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="flex items-center gap-3">
                <Avatar name={`${r.employee?.first_name} ${r.employee?.last_name}`} size="sm"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.employee?.first_name} {r.employee?.last_name}</p>
                  <p className="text-xs text-gray-400 capitalize">{r.period} {r.review_year}</p>
                </div>
                {r.overall_rating && <div className="flex items-center gap-0.5 bg-blue-50 px-2 py-0.5 rounded-full"><span className="text-blue-700 font-bold text-sm">{r.overall_rating}</span><span className="text-blue-400 text-xs">/5</span></div>}
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No reviews yet</p>}
          </div>
        </div>

        {/* Promotions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Award size={16} className="text-blue-600"/><h3 className="font-semibold text-gray-900 text-sm">Recent Promotions</h3></div>
            <Link href="/performance/promotions" className="text-xs text-blue-600 flex items-center gap-1">All <ArrowRight size={11}/></Link>
          </div>
          <div className="space-y-3">
            {promotions.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <Avatar name={`${p.employee?.first_name} ${p.employee?.last_name}`} size="sm"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.employee?.first_name} {p.employee?.last_name}</p>
                  <p className="text-xs text-gray-400">→ {p.to_designation?.name}</p>
                </div>
                <Badge status={p.type}/>
              </div>
            ))}
            {promotions.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No promotions yet</p>}
          </div>
        </div>

        {/* Warnings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><AlertTriangle size={16} className="text-blue-500"/><h3 className="font-semibold text-gray-900 text-sm">Recent Warnings</h3></div>
            <Link href="/performance/warnings" className="text-xs text-blue-600 flex items-center gap-1">All <ArrowRight size={11}/></Link>
          </div>
          <div className="space-y-3">
            {warnings.map(w => (
              <div key={w.id} className="flex items-center gap-3">
                <Avatar name={`${w.employee?.first_name} ${w.employee?.last_name}`} size="sm"/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{w.employee?.first_name} {w.employee?.last_name}</p>
                  <p className="text-xs text-gray-400 truncate">{w.subject}</p>
                </div>
                <Badge status={w.type}/>
              </div>
            ))}
            {warnings.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No warnings</p>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
