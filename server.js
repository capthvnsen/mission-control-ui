import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..');

const app = express();
app.use(cors());
app.use(express.json());

// Read JSON file helper
function readJSON(filename) {
  const path = join(DATA_DIR, filename);
  if (!existsSync(path)) {
    return null;
  }
  return JSON.parse(readFileSync(path, 'utf-8'));
}

// Write JSON file helper
function writeJSON(filename, data) {
  const path = join(DATA_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2));
}

// Read JSONL file helper
function readJSONL(filename, limit = 50) {
  const path = join(DATA_DIR, filename);
  if (!existsSync(path)) {
    return [];
  }
  const lines = readFileSync(path, 'utf-8')
    .trim()
    .split('\n')
    .filter(line => line.trim());
  
  return lines
    .slice(-limit)
    .reverse()
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// API Routes
app.get('/api/agents', (req, res) => {
  const data = readJSON('agents.json');
  if (!data) {
    return res.status(404).json({ error: 'agents.json not found' });
  }
  res.json(data);
});

app.get('/api/tasks', (req, res) => {
  const data = readJSON('tasks.json');
  if (!data) {
    return res.status(404).json({ error: 'tasks.json not found' });
  }
  res.json(data);
});

app.get('/api/activities', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const activities = readJSONL('activities.jsonl', limit);
  res.json(activities);
});

app.post('/api/tasks', (req, res) => {
  const data = readJSON('tasks.json') || { tasks: [], nextId: 1 };
  const newTask = {
    id: `task-${String(data.nextId).padStart(3, '0')}`,
    title: req.body.title || 'Untitled',
    description: req.body.description || '',
    status: req.body.status || 'inbox',
    priority: req.body.priority || 'medium',
    assigneeIds: req.body.assigneeIds || [],
    createdBy: req.body.createdBy || 'alan-main',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: req.body.dueDate || null,
    labels: req.body.labels || [],
    comments: [],
    subscribers: [req.body.createdBy || 'alan-main'],
  };
  
  data.tasks.push(newTask);
  data.nextId++;
  writeJSON('tasks.json', data);
  res.json(newTask);
});

app.patch('/api/tasks/:id/status', (req, res) => {
  const data = readJSON('tasks.json');
  if (!data) {
    return res.status(404).json({ error: 'tasks.json not found' });
  }
  
  const task = data.tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  task.status = req.body.status;
  task.updatedAt = new Date().toISOString();
  writeJSON('tasks.json', data);
  res.json(task);
});

app.get('/api/content', (req, res) => {
  const data = readJSON('content.json');
  if (!data) {
    return res.status(404).json({ error: 'content.json not found' });
  }
  res.json(data);
});

app.get('/api/calendar', (req, res) => {
  const data = readJSON('calendar.json');
  if (!data) {
    return res.status(404).json({ error: 'calendar.json not found' });
  }
  res.json(data);
});

app.post('/api/content', (req, res) => {
  const data = readJSON('content.json') || { items: [], nextId: 1 };
  const newItem = {
    id: `content-${String(data.nextId).padStart(3, '0')}`,
    title: req.body.title || 'Untitled',
    platform: req.body.platform || 'youtube',
    stage: req.body.stage || 'idea',
    idea: req.body.idea || '',
    script: req.body.script || '',
    thumbnailPrompt: req.body.thumbnailPrompt || '',
    assigneeId: req.body.assigneeId || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: req.body.dueDate || null,
  };
  
  data.items.push(newItem);
  data.nextId++;
  writeJSON('content.json', data);
  res.json(newItem);
});

app.patch('/api/content/:id/stage', (req, res) => {
  const data = readJSON('content.json');
  if (!data) {
    return res.status(404).json({ error: 'content.json not found' });
  }
  
  const item = data.items.find(i => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Content item not found' });
  }
  
  item.stage = req.body.stage;
  item.updatedAt = new Date().toISOString();
  writeJSON('content.json', data);
  res.json(item);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Mission Control API running on http://localhost:${PORT}`);
});
