import { router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Avatar from '../../Components/Avatar';
import Button from '../../Components/Button';
import { CheckSquare, Square } from 'lucide-react';

export default function Onboarding({ taskGroups, employees }) {
  const completeTask = (id) => router.put(`/recruitment/onboarding/${id}/complete`, {}, { preserveState: true });

  const groups = Object.entries(taskGroups || {});

  return (
    <AppLayout title="Onboarding">
      <div className="mb-5"><h2 className="text-xl font-bold text-gray-900">Employee Onboarding</h2><p className="text-sm text-gray-500">{groups.length} employees in onboarding</p></div>
      <div className="space-y-4">
        {groups.map(([empId, { employee: emp, balances: tasks }]) => {
          const taskList = Array.isArray(tasks) ? tasks : Object.values(tasks || {});
          const done = taskList.filter(t => t.is_completed).length;
          const pct = taskList.length ? Math.round((done / taskList.length) * 100) : 0;
          const empInfo = employees.find(e => e.id == empId) || emp || {};
          return (
            <div key={empId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                <Avatar name={`${empInfo.first_name||''} ${empInfo.last_name||''}`} size="md"/>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{empInfo.first_name} {empInfo.last_name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-xs">
                      <div className="h-2 bg-blue-500 rounded-full transition-all" style={{width:`${pct}%`}}/>
                    </div>
                    <span className="text-xs text-gray-500">{done}/{taskList.length} tasks • {pct}%</span>
                  </div>
                </div>
                {pct === 100 && <span className="text-xs px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">✓ Complete</span>}
              </div>
              <div className="p-4 grid sm:grid-cols-2 gap-2">
                {taskList.map(task => (
                  <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border transition ${task.is_completed ? 'border-blue-100 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'}`}>
                    <button onClick={() => !task.is_completed && completeTask(task.id)} className={task.is_completed ? 'cursor-default' : 'cursor-pointer'}>
                      {task.is_completed ? <CheckSquare size={18} className="text-blue-600"/> : <Square size={18} className="text-gray-300"/>}
                    </button>
                    <span className={`text-sm flex-1 ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.task}</span>
                    {!task.is_completed && (
                      <Button size="xs" variant="ghost" onClick={() => completeTask(task.id)}>Mark</Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {groups.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-400">No employees currently in onboarding</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
