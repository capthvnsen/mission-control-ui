import { Agent, Task } from '../types';

type View = 'tasks' | 'content' | 'calendar' | 'office';

interface HeaderProps {
  agents: Agent[];
  tasks: Task[];
  currentView: View;
  onViewChange: (view: View) => void;
  onMenuClick?: () => void;
}

const VIEW_TABS: { id: View; label: string; emoji: string }[] = [
  { id: 'tasks', label: 'Tasks', emoji: '📋' },
  { id: 'content', label: 'Content', emoji: '🎬' },
  { id: 'calendar', label: 'Calendar', emoji: '📅' },
  { id: 'office', label: 'Office', emoji: '🏢' },
];

export function Header({ agents, tasks, currentView, onViewChange, onMenuClick }: HeaderProps) {
  const activeCount = agents.filter(a => a.status === 'active' || a.status === 'working').length;
  const queuedCount = tasks.filter(t => t.status !== 'done').length;

  return (
    <header className="bg-mc-card border-b border-mc-border">
      {/* Top bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-mc-text hover:bg-mc-bg rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xl">🦞</span>
            <h1 className="text-base lg:text-lg font-bold text-mc-text tracking-tight">MISSION CONTROL</h1>
          </div>
          <span className="hidden sm:inline text-xs px-2 py-0.5 rounded bg-mc-bg text-mc-muted">
            SPRK
          </span>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          {/* Desktop stats */}
          <div className="hidden lg:flex items-center gap-4 text-sm">
            <span className="text-mc-muted">
              <span className="font-semibold text-mc-text">{activeCount}</span> ACTIVE
            </span>
            <span className="text-mc-muted">
              <span className="font-semibold text-mc-text">{queuedCount}</span> QUEUED
            </span>
          </div>
          
          {/* Mobile stats - compact */}
          <div className="flex lg:hidden items-center gap-2 text-xs">
            <span className="text-mc-text font-semibold">{activeCount}</span>
            <span className="text-mc-muted">active</span>
            <span className="text-mc-muted">•</span>
            <span className="text-mc-text font-semibold">{queuedCount}</span>
            <span className="text-mc-muted">queued</span>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="hidden sm:inline text-xs text-green-500 font-semibold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="px-4 flex gap-1 overflow-x-auto">
        {VIEW_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap
              ${currentView === tab.id
                ? 'bg-mc-bg text-mc-text border-t border-x border-mc-border -mb-px'
                : 'text-mc-muted hover:text-mc-text hover:bg-mc-bg/50'
              }
            `}
          >
            <span className="mr-1.5">{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
