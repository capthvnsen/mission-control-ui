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

  return (
    <div className="h-screen flex flex-col bg-mc-bg">
      <Header agents={agents} tasks={tasks} />
      
      <div className="flex-1 flex overflow-hidden">
        <AgentSidebar
          agents={agents}
          selectedAgentId={selectedAgentId}
          onSelectAgent={setSelectedAgentId}
        />
        
        <KanbanBoard
          tasks={tasks}
          agents={agents}
          filterAgentId={selectedAgentId}
          onTaskClick={setSelectedTask}
        />
        
        <ActivityFeed
          activities={activities}
          agents={agents}
        />
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
