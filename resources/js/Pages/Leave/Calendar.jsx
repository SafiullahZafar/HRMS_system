import { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import Badge from '../../Components/Badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LeaveCalendar({ leaves }) {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const prev = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const leavesOnDay = (day) => {
    const date = new Date(current.year, current.month, day);
    return leaves.filter(l => {
      const from = new Date(l.from_date);
      const to = new Date(l.to_date);
      return date >= from && date <= to && l.status !== 'rejected';
    });
  };

  return (
    <AppLayout title="Leave Calendar">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Leave Calendar</h2>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={18}/></button>
          <span className="font-semibold text-gray-900 w-40 text-center">{months[current.month]} {current.year}</span>
          <button onClick={next} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={18}/></button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="border-r border-b border-gray-100 min-h-[90px]"/>)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const dayLeaves = leavesOnDay(day);
            const isToday = today.getDate() === day && today.getMonth() === current.month && today.getFullYear() === current.year;
            return (
              <div key={day} className={`border-r border-b border-gray-100 min-h-[90px] p-1.5 ${isToday ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}>
                <span className={`inline-flex items-center justify-center w-6 h-6 text-sm rounded-full mb-1 ${isToday ? 'bg-indigo-600 text-white font-bold' : 'text-gray-700'}`}>{day}</span>
                <div className="space-y-0.5">
                  {dayLeaves.slice(0, 3).map((l, i) => (
                    <div key={i} className="text-xs px-1.5 py-0.5 rounded truncate font-medium"
                      style={{ background: (l.leave_type?.color || '#4F46E5') + '22', color: l.leave_type?.color || '#4F46E5' }}>
                      {l.employee?.first_name}
                    </div>
                  ))}
                  {dayLeaves.length > 3 && <div className="text-xs text-gray-400">+{dayLeaves.length-3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
