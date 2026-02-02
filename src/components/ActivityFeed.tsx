import { Activity, Agent } from '../types';

interface ActivityFeedProps {
  activities: Activity[];
  agents: Agent[];
}

function formatTime(ts: string) {
  const date = new Date(ts);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'task_created': return '➕';
    case 'task_assigned': return '👤';
    case 'task_status_changed': return '🔄';
    case 'comment': return '💬';
    case 'document_created': return '📄';
    case 'agent_status_changed': return '🔔';
    case 'mention': return '@';
    default: return '•';
  }
}

export function ActivityFeed({ activities, agents }: ActivityFeedProps) {
  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : agentId;
  };

  const getAgentEmoji = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.emoji || '👤';
  };

  return (
    <div className="w-80 bg-mc-card border-l border-mc-border flex flex-col">
      <div className="p-4 border-b border-mc-border">
        <h2 className="text-sm font-semibold text-mc-muted tracking-wider">LIVE FEED</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-4 text-center text-mc-muted text-sm">
            No recent activity
          </div>
        ) : (
          activities.map((activity, i) => (
            <div
              key={`${activity.ts}-${i}`}
              className="p-3 border-b border-mc-border hover:bg-mc-bg transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-xs text-mc-muted font-mono">
                  {formatTime(activity.ts)}
                </span>
              </div>
              <div className="flex items-start gap-2 mt-1">
                <span>{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-mc-text">
                    {getAgentEmoji(activity.agent)} {getAgentName(activity.agent)}
                  </span>
                  <p className="text-sm text-mc-muted mt-0.5 break-words">
                    {activity.msg}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
