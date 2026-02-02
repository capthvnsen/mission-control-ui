# Mission Control UI

Real-time dashboard for monitoring and directing the 10-agent squad.

## Quick Start

```bash
# Install dependencies (already done)
npm install

# Start dev server
npm run dev

# Open in browser
# http://localhost:5173/
```

## Data Files

The UI polls these files every 2 seconds for real-time updates:

- `public/data/agents.json` — Agent roster and status
- `public/data/tasks.json` — Task database
- `public/data/activities.jsonl` — Activity log (append-only)

**Note:** These are also symlinked to `/root/clawd/mission-control/` for easy agent access.

## Components

### Header
Shows system status, agent count, task count, and online indicator.

### Agent Sidebar
10 agent cards with status indicators. Click to filter tasks by agent.

### Kanban Board
5-column task board (Inbox → Done). Click cards to view details.

### Activity Feed
Real-time log of agent actions. Auto-scrolls to latest.

### Task Detail Modal
Full task view with comments, documents, and metadata.

## Customization

### Colors

Edit `tailwind.config.js` to change theme colors:

```js
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',  // Blue
      success: '#10B981',  // Green
      warning: '#F59E0B',  // Yellow
      danger: '#EF4444',   // Red
    }
  }
}
```

### Polling Interval

Edit `src/App.jsx` line 28:

```js
const interval = setInterval(fetchData, 2000)  // milliseconds
```

## Build for Production

```bash
npm run build

# Serves from dist/
npm run preview
```

## Tech Stack

- **Vite 6.4** — Fast dev server and build tool
- **React 18** — UI framework
- **Tailwind CSS 3.4** — Utility-first styling
- **Lucide React** — Icon library

## Future Enhancements

- [ ] Drag-and-drop for Kanban cards
- [ ] Task creation modal
- [ ] Real-time notifications (WebSocket)
- [ ] Agent performance charts
- [ ] Task filters (label, priority, assignee)
- [ ] Dark/light mode toggle
- [ ] Export data (CSV, JSON)

## Troubleshooting

**Port already in use?**

Edit `vite.config.ts` to change port:

```ts
server: {
  port: 3000,  // Change this
  host: true
}
```

**Data not updating?**

Check file permissions on `public/data/*.json`. Agents need read/write access.

**Slow performance?**

Reduce polling interval or implement WebSocket connection for real-time updates.
