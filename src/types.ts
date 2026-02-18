export interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: 'active' | 'idle' | 'blocked' | 'working';
  currentTaskId: string | null;
  sessionKey: string;
  model: string;
  heartbeatOffset: number;
  lastSeen: string | null;
  avatar?: string;
  desk?: string;
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

// Content Pipeline Types
export type ContentStage = 'idea' | 'script' | 'thumbnail' | 'filming' | 'editing' | 'published';

export interface ContentItem {
  id: string;
  title: string;
  platform: 'youtube' | 'linkedin' | 'twitter' | 'blog' | 'instagram';
  stage: ContentStage;
  idea?: string;
  script?: string;
  thumbnailPrompt?: string;
  thumbnailUrl?: string;
  notes?: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  publishedUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  type: 'cron' | 'task' | 'meeting' | 'reminder';
  agentId?: string;
  taskId?: string;
  recurring?: boolean;
  recurrenceRule?: string;
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

export const CONTENT_STAGES: ContentStage[] = ['idea', 'script', 'thumbnail', 'filming', 'editing', 'published'];

export const CONTENT_STAGE_LABELS: Record<ContentStage, string> = {
  idea: '💡 Ideas',
  script: '✍️ Script',
  thumbnail: '🖼️ Thumbnail',
  filming: '🎬 Filming',
  editing: '✂️ Editing',
  published: '✅ Published',
};
