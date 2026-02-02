import { Agent, Task } from '../types';

interface HeaderProps {
  agents: Agent[];
  tasks: Task[];
}

function formatDateTime() {
  const now = new Date();
  return now.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();
}

export function Header({ agents, tasks }: HeaderProps) {
  const activeCount = agents.filter(a => a.status === 'active').length;
  const queuedCount = tasks.filter(t => t.status !== 'done').length;

  return (
    <header className="bg-mc-card border-b border-mc-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦞</span>
          <h1 className="text-lg font-bold text-mc-text tracking-tight">MISSION CONTROL</h1>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-mc-bg text-mc-muted">
          SPRK
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-mc-muted">
            <span className="font-semibold text-mc-text">{activeCount}</span> AGENTS ACTIVE
          </span>
          <span className="text-mc-muted">
            <span className="font-semibold text-mc-text">{queuedCount}</span> TASKS IN QUEUE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-mc-muted font-mono">{formatDateTime()}</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-500 font-semibold">ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
