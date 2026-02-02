export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: 'active' | 'idle' | 'blocked';
  currentTaskId: string | null;
  sessionKey: string;
  model: string;
  heartbeatOffset: number;
  lastSeen: string | null;
}

export interface Comment {
  id: string;
  from: string;
  content: string;
  at: string;
  mentions?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done';
  priority?: 'high' | 'medium' | 'low';
  assigneeIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string | null;
  labels?: string[];
  comments: Comment[];
  subscribers: string[];
  documents?: { name: string; path: string }[];
}

export interface Activity {
  ts: string;
  type: string;
  agent: string;
  taskId?: string;
  msg: string;
}

export interface AgentsData {
  agents: Agent[];
}

export interface TasksData {
  tasks: Task[];
  nextId: number;
}

export type TaskStatus = Task['status'];

export const STATUS_COLUMNS: TaskStatus[] = ['inbox', 'assigned', 'in_progress', 'review', 'done'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  inbox: 'INBOX',
  assigned: 'ASSIGNED',
  in_progress: 'IN PROGRESS',
  review: 'REVIEW',
  done: 'DONE',
};
