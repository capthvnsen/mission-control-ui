import { Task, Agent } from '../types';

interface TaskCardProps {
  task: Task;
  agents: Agent[];
  onClick: () => void;
}

function getPriorityColor(priority?: string) {
  switch (priority) {
    case 'high': return 'border-l-red-500';
    case 'medium': return 'border-l-yellow-500';
    case 'low': return 'border-l-blue-500';
    default: return 'border-l-mc-border';
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function TaskCard({ task, agents, onClick }: TaskCardProps) {
  const assignees = agents.filter(a => task.assigneeIds.includes(a.id));

  return (
    <div
      onClick={onClick}
      className={`bg-mc-bg p-3 rounded-lg border-l-4 cursor-pointer hover:bg-opacity-80 transition-colors ${getPriorityColor(task.priority)}`}
    >
      <h3 className="font-medium text-mc-text text-sm mb-2 line-clamp-2">{task.title}</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {assignees.slice(0, 3).map((agent) => (
            <div
              key={agent.id}
              className="w-6 h-6 rounded-full bg-mc-card border border-mc-border flex items-center justify-center text-xs"
              title={agent.name}
            >
              {agent.emoji}
            </div>
          ))}
          {assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-mc-card border border-mc-border flex items-center justify-center text-xs text-mc-muted">
              +{assignees.length - 3}
            </div>
          )}
          {assignees.length === 0 && (
            <div className="w-6 h-6 rounded-full bg-mc-card border border-mc-border flex items-center justify-center text-xs text-mc-muted">
              ?
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-mc-muted">
          {task.comments.length > 0 && (
            <span className="flex items-center gap-1">
              💬 {task.comments.length}
            </span>
          )}
          <span>{formatTimeAgo(task.updatedAt)}</span>
        </div>
      </div>
      
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labels.slice(0, 3).map((label) => (
            <span
              key={label}
              className="text-[10px] px-1.5 py-0.5 rounded bg-mc-card text-mc-muted"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
