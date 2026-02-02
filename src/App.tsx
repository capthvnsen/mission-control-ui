import { useState } from 'react';
import { useAgents, useTasks, useActivities } from './hooks/useData';
import { Header } from './components/Header';
import { AgentSidebar } from './components/AgentSidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { ActivityFeed } from './components/ActivityFeed';
import { TaskDetail } from './components/TaskDetail';
import { Task } from './types';

function App() {
  const { agents, loading: agentsLoading } = useAgents();
  const { tasks, loading: tasksLoading } = useTasks();
  const { activities } = useActivities();
  
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (agentsLoading || tasksLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-mc-bg">
        <div className="text-mc-muted">Loading Mission Control...</div>
      </div>
    );
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'kanban' | 'activity'>('kanban');

  return (
    <div className="h-screen flex flex-col bg-mc-bg">
      <Header agents={agents} tasks={tasks} onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: Always visible sidebar */}
        {/* Mobile: Overlay menu */}
        <div className={`
          fixed inset-0 z-40 lg:hidden
          ${mobileMenuOpen ? 'block' : 'hidden'}
        `}>
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-mc-bg">
            <AgentSidebar
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={(id) => {
                setSelectedAgentId(id);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
        
        <div className="hidden lg:block">
          <AgentSidebar
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
          />
        </div>
        
        {/* Mobile: Tabbed view */}
        <div className="flex-1 flex flex-col lg:contents">
          <div className="lg:hidden flex border-b border-mc-border">
            <button
              onClick={() => setMobileView('kanban')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                mobileView === 'kanban'
                  ? 'text-mc-accent border-b-2 border-mc-accent'
                  : 'text-mc-muted'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setMobileView('activity')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                mobileView === 'activity'
                  ? 'text-mc-accent border-b-2 border-mc-accent'
                  : 'text-mc-muted'
              }`}
            >
              Activity
            </button>
          </div>
          
          <div className={`flex-1 ${mobileView === 'kanban' ? 'block' : 'hidden'} lg:block lg:flex-1`}>
            <KanbanBoard
              tasks={tasks}
              agents={agents}
              filterAgentId={selectedAgentId}
              onTaskClick={setSelectedTask}
            />
          </div>
          
          <div className={`flex-1 ${mobileView === 'activity' ? 'block' : 'hidden'} lg:block lg:w-80`}>
            <ActivityFeed
              activities={activities}
              agents={agents}
            />
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          agents={agents}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}

export default App;
