import { Agent } from '../types';

interface AgentSidebarProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onSelectAgent: (agentId: string | null) => void;
}

function getStatusColor(status: Agent['status']) {
  switch (status) {
    case 'active': return 'bg-green-500';
    case 'idle': return 'bg-gray-500';
    case 'blocked': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function getStatusLabel(status: Agent['status']) {
  switch (status) {
    case 'active': return 'WORKING';
    case 'idle': return 'IDLE';
    case 'blocked': return 'BLOCKED';
    default: return 'UNKNOWN';
  }
}

export function AgentSidebar({ agents, selectedAgentId, onSelectAgent }: AgentSidebarProps) {
  return (
    <div className="w-64 bg-mc-card border-r border-mc-border flex flex-col">
      <div className="p-4 border-b border-mc-border">
        <h2 className="text-sm font-semibold text-mc-muted tracking-wider">AGENTS</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onSelectAgent(selectedAgentId === agent.id ? null : agent.id)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-mc-bg transition-colors text-left ${
              selectedAgentId === agent.id ? 'bg-mc-bg' : ''
            }`}
          >
            <div className="text-2xl">{agent.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-mc-text">{agent.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-mc-border text-mc-muted">
                  {agent.role.split(' ')[0].toUpperCase().slice(0, 4)}
                </span>
              </div>
              <div className="text-xs text-mc-muted truncate">{agent.role}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
              <span className="text-[10px] text-mc-muted">{getStatusLabel(agent.status)}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-mc-border">
        <div className="text-xs text-mc-muted">
          {agents.filter(a => a.status === 'active').length} active
          {' • '}
          {agents.filter(a => a.status === 'idle').length} idle
        </div>
      </div>
    </div>
  );
}
