import { Task, Agent, STATUS_COLUMNS, STATUS_LABELS, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  agents: Agent[];
  filterAgentId: string | null;
  onTaskClick: (task: Task) => void;
}

export function KanbanBoard({ tasks, agents, filterAgentId, onTaskClick }: KanbanBoardProps) {
  const filteredTasks = filterAgentId
    ? tasks.filter(t => t.assigneeIds.includes(filterAgentId) || t.createdBy === filterAgentId)
    : tasks;

  const getTasksForColumn = (status: TaskStatus) => {
    return filteredTasks.filter(t => t.status === status);
  };

  return (
    <div className="flex-1 overflow-x-auto p-4">
      <div className="flex gap-4 h-full min-w-max">
        {STATUS_COLUMNS.map((status) => {
          const columnTasks = getTasksForColumn(status);
          return (
            <div
              key={status}
              className="w-72 flex flex-col bg-mc-card rounded-lg overflow-hidden"
            >
              <div className="p-3 border-b border-mc-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-mc-muted tracking-wider">
                  {STATUS_LABELS[status]}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-mc-bg text-mc-muted">
                  {columnTasks.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    agents={agents}
                    onClick={() => onTaskClick(task)}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-mc-muted text-sm">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
