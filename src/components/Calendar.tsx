import { useState } from 'react';
import { useCalendar } from '../hooks/useData';
import { CalendarEvent } from '../types';

const TYPE_COLORS: Record<string, string> = {
  cron: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  task: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  meeting: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  reminder: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const TYPE_LABELS: Record<string, string> = {
  cron: '⏰ Cron',
  task: '📋 Task',
  meeting: '📅 Meeting',
  reminder: '🔔 Reminder',
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function isUpcoming(isoString: string): boolean {
  const date = new Date(isoString);
  const now = new Date();
  return date > now;
}

export function Calendar() {
  const { events, loading } = useCalendar();
  const [filter, setFilter] = useState<'all' | 'cron' | 'task'>('all');

  const filteredEvents = events
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const upcomingEvents = filteredEvents.filter(e => isUpcoming(e.startTime));
  const pastEvents = filteredEvents.filter(e => !isUpcoming(e.startTime));

  if (loading) {
    return <div className="p-4 text-mc-muted">Loading calendar...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-mc-border">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-mc-text">Calendar</h2>
          <div className="flex gap-2">
            {(['all', 'cron', 'task'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-mc-accent text-white'
                    : 'bg-mc-surface text-mc-muted hover:text-mc-text'
                }`}
              >
                {f === 'all' ? 'All' : f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {upcomingEvents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-mc-muted mb-3">UPCOMING</h3>
            <div className="space-y-2">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {pastEvents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-mc-muted mb-3">PAST</h3>
            <div className="space-y-2 opacity-60">
              {pastEvents.slice(0, 10).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center text-mc-muted py-8">
            No events found
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <div className="p-3 bg-mc-surface rounded-lg border border-mc-border hover:border-mc-accent/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-mc-text">{event.title}</h4>
          {event.description && (
            <p className="text-xs text-mc-muted mt-1">{event.description}</p>
          )}
        </div>
        <span className={`px-2 py-0.5 text-xs rounded-full border ${TYPE_COLORS[event.type]}`}>
          {TYPE_LABELS[event.type]}
        </span>
      </div>
      
      <div className="flex items-center gap-3 mt-2 text-xs text-mc-muted">
        <span className="flex items-center gap-1">
          📅 {formatDate(event.startTime)}
        </span>
        <span>🕐 {formatTime(event.startTime)}</span>
        {event.recurring && (
          <span className="text-blue-400">🔄 Recurring</span>
        )}
      </div>
    </div>
  );
}
