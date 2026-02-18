import { useAgents, useTasks } from '../hooks/useData';
import { Agent } from '../types';

const AGENT_COLORS: Record<string, string> = {
  'alan-main': 'from-amber-500 to-orange-600',
  'shuri-product': 'from-purple-500 to-pink-500',
  'fury-research': 'from-red-500 to-rose-600',
  'vision-seo': 'from-green-500 to-emerald-600',
  'loki-content': 'from-blue-500 to-cyan-600',
  'quill-social': 'from-pink-500 to-rose-500',
  'pepper-email': 'from-yellow-500 to-amber-600',
  'wanda-design': 'from-violet-500 to-purple-600',
  'wong-docs': 'from-teal-500 to-cyan-600',
  'friday-dev': 'from-slate-500 to-zinc-600',
};

const AGENT_ROLES: Record<string, string> = {
  'alan-main': 'Squad Lead',
  'shuri-product': 'Product Analyst',
  'fury-research': 'Customer Researcher',
  'vision-seo': 'SEO Analyst',
  'loki-content': 'Content Writer',
  'quill-social': 'Social Media',
  'pepper-email': 'Email Marketing',
  'wanda-design': 'Designer',
  'wong-docs': 'Documentation',
  'friday-dev': 'Developer',
};

const DESK_ITEMS: Record<string, string[]> = {
  'alan-main': ['💻 MacBook', '☕ Coffee', '📋 Clipboard'],
  'shuri-product': ['🔬 Microscope', '📱 Phone', '📝 Notepad'],
  'fury-research': ['🔍 Magnifier', '📊 Charts', '📚 Books'],
  'vision-seo': ['📈 Graphs', '🔧 SEO Tools', '💻 Laptop'],
  'loki-content': ['✍️ Pen', '📓 Notebook', '☕ Coffee'],
  'quill-social': ['📱 Phone', '🐦 Bird', '📝 Notes'],
  'pepper-email': ['📧 Envelope', '📊 Spreadsheet', '📞 Headset'],
  'wanda-design': ['🎨 Palette', '🖌️ Brush', '🎭 Colors'],
  'wong-docs': ['📚 Manuals', '📝 Papers', '💻 Laptop'],
  'friday-dev': ['💻 Laptop', '⌨️ Keyboard', '🖥️ Monitor'],
};

function formatLastSeen(isoString: string | null): string {
  if (!isoString) return 'Never';
  
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function AgentAvatar({ agent, tasks }: { agent: Agent; tasks: any[] }) {
  const currentTask = agent.currentTaskId 
    ? tasks.find(t => t.id === agent.currentTaskId) 
    : null;
  
  const statusColor = agent.status === 'active' 
    ? 'bg-emerald-500' 
    : agent.status === 'working'
    ? 'bg-blue-500'
    : agent.status === 'blocked'
    ? 'bg-red-500'
    : 'bg-yellow-500';

  const gradient = AGENT_COLORS[agent.id] || 'from-gray-500 to-slate-600';

  return (
    <div className="bg-mc-surface rounded-xl p-4 border border-mc-border hover:border-mc-accent/30 transition-all hover:shadow-lg">
      {/* Desk Area */}
      <div className="h-24 bg-mc-bg rounded-lg mb-3 relative overflow-hidden">
        {/* Desk surface */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-amber-800/30 rounded-b-lg" />
        
        {/* Agent at desk */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
          {agent.status === 'working' ? (
            <span className="text-2xl animate-bounce">💻</span>
          ) : agent.status === 'idle' ? (
            <span className="text-2xl">🧘</span>
          ) : (
            <span className="text-2xl">⏳</span>
          )}
        </div>

        {/* Desk items */}
        <div className="absolute bottom-1 left-2 right-2 flex justify-between text-xs opacity-50">
          {(DESK_ITEMS[agent.id] || ['💻', '📝']).slice(0, 3).map((item, i) => (
            <span key={i}>{item.split(' ')[0]}</span>
          ))}
        </div>
      </div>

      {/* Agent Info */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
          {agent.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-mc-text truncate">{agent.name}</h4>
            <span className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
          </div>
          <p className="text-xs text-mc-muted">{AGENT_ROLES[agent.id] || agent.role}</p>
        </div>
      </div>

      {/* Current Task */}
      {currentTask && (
        <div className="mt-3 pt-3 border-t border-mc-border">
          <p className="text-xs text-mc-muted mb-1">Working on:</p>
          <p className="text-xs text-mc-text truncate">{currentTask.title}</p>
        </div>
      )}

      {/* Status */}
      <div className="mt-2 flex justify-between items-center text-xs text-mc-muted">
        <span className="capitalize">{agent.status}</span>
        <span>{formatLastSeen(agent.lastSeen)}</span>
      </div>
    </div>
  );
}

export function OfficeView() {
  const { agents, loading: agentsLoading } = useAgents();
  const { tasks, loading: tasksLoading } = useTasks();

  if (agentsLoading || tasksLoading) {
    return <div className="p-4 text-mc-muted">Loading office...</div>;
  }

  const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'working');
  const idleAgents = agents.filter(a => a.status === 'idle');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-mc-border">
        <h2 className="text-lg font-semibold text-mc-text">🏢 Mission Control Office</h2>
        <p className="text-sm text-mc-muted mt-1">
          {activeAgents.length} working • {idleAgents.length} idle • {agents.length} total
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Office Floor */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {agents.map(agent => (
            <AgentAvatar key={agent.id} agent={agent} tasks={tasks} />
          ))}
        </div>

        {/* Activity Log */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-mc-muted mb-3">TEAM STATUS</h3>
          <div className="bg-mc-surface rounded-xl p-4 border border-mc-border">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-mc-text">Active: {activeAgents.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-mc-text">Idle: {idleAgents.length}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-mc-border">
              <p className="text-xs text-mc-muted">
                💡 Tip: Click on an agent to assign them a task
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
