import { Task, Agent, STATUS_LABELS } from '../types';

interface TaskDetailProps {
  task: Task;
  agents: Agent[];
  onClose: () => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TaskDetail({ task, agents, onClose }: TaskDetailProps) {
  const assignees = agents.filter(a => task.assigneeIds.includes(a.id));
  const creator = agents.find(a => a.id === task.createdBy);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-mc-card rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-mc-border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded bg-mc-bg text-mc-muted">
                {task.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-mc-accent/20 text-mc-accent">
                {STATUS_LABELS[task.status]}
              </span>
              {task.priority && (
                <span className={`text-xs px-2 py-0.5 rounded ${
                  task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {task.priority.toUpperCase()}
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-mc-text">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-mc-muted hover:text-mc-text p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-mc-muted mb-2">Description</h3>
            <p className="text-mc-text whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-mc-muted mb-2">Assignees</h3>
              <div className="flex flex-wrap gap-2">
                {assignees.length > 0 ? assignees.map(agent => (
                  <span
                    key={agent.id}
                    className="flex items-center gap-1 text-sm bg-mc-bg px-2 py-1 rounded"
                  >
                    {agent.emoji} {agent.name}
                  </span>
                )) : (
                  <span className="text-mc-muted text-sm">Unassigned</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-mc-muted mb-2">Created by</h3>
              <span className="text-sm">
                {creator ? `${creator.emoji} ${creator.name}` : task.createdBy}
              </span>
              <span className="text-mc-muted text-sm ml-2">
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>

          {/* Labels */}
          {task.labels && task.labels.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-mc-muted mb-2">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {task.labels.map(label => (
                  <span
                    key={label}
                    className="text-xs px-2 py-1 rounded bg-mc-bg text-mc-muted"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h3 className="text-sm font-semibold text-mc-muted mb-2">
              Comments ({task.comments.length})
            </h3>
            {task.comments.length === 0 ? (
              <p className="text-mc-muted text-sm">No comments yet</p>
            ) : (
              <div className="space-y-3">
                {task.comments.map((comment, i) => {
                  const author = agents.find(a => a.id === comment.from);
                  return (
                    <div key={comment.id || i} className="bg-mc-bg p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {author ? `${author.emoji} ${author.name}` : comment.from}
                        </span>
                        <span className="text-xs text-mc-muted">
                          {formatDate(comment.at)}
                        </span>
                      </div>
                      <p className="text-sm text-mc-text whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-mc-border">
          <div className="text-xs text-mc-muted">
            Last updated: {formatDate(task.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
