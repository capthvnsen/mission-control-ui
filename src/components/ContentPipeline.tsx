import { useState } from 'react';
import { useContent } from '../hooks/useData';
import { ContentItem, CONTENT_STAGES, CONTENT_STAGE_LABELS, ContentStage } from '../types';

const PLATFORM_EMOJI: Record<string, string> = {
  youtube: '🎬',
  linkedin: '💼',
  twitter: '🐦',
  blog: '📝',
  instagram: '📸',
};

export function ContentPipeline() {
  const { items, loading, refetch } = useContent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', platform: 'youtube' as const, idea: '' });

  const itemsByStage = CONTENT_STAGES.reduce((acc, stage) => {
    acc[stage] = items.filter(item => item.stage === stage);
    return acc;
  }, {} as Record<ContentStage, ContentItem[]>);

  const moveItem = async (itemId: string, newStage: ContentStage) => {
    await fetch(`/api/content/${itemId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    });
    refetch();
  };

  const createItem = async () => {
    if (!newItem.title.trim()) return;
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    setNewItem({ title: '', platform: 'youtube', idea: '' });
    setShowAddForm(false);
    refetch();
  };

  if (loading) {
    return <div className="p-4 text-mc-muted">Loading content pipeline...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-mc-border flex justify-between items-center">
        <h2 className="text-lg font-semibold text-mc-text">Content Pipeline</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-3 py-1.5 bg-mc-accent text-white text-sm rounded-lg hover:bg-mc-accent/80 transition-colors"
        >
          + Add Content
        </button>
      </div>

      {showAddForm && (
        <div className="p-4 border-b border-mc-border bg-mc-surface">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Content title..."
              value={newItem.title}
              onChange={e => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full px-3 py-2 bg-mc-bg border border-mc-border rounded-lg text-mc-text text-sm"
            />
            <div className="flex gap-2">
              <select
                value={newItem.platform}
                onChange={e => setNewItem({ ...newItem, platform: e.target.value as any })}
                className="px-3 py-2 bg-mc-bg border border-mc-border rounded-lg text-mc-text text-sm"
              >
                <option value="youtube">YouTube</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="blog">Blog</option>
                <option value="instagram">Instagram</option>
              </select>
              <input
                type="text"
                placeholder="Quick idea..."
                value={newItem.idea}
                onChange={e => setNewItem({ ...newItem, idea: e.target.value })}
                className="flex-1 px-3 py-2 bg-mc-bg border border-mc-border rounded-lg text-mc-text text-sm"
              />
              <button
                onClick={createItem}
                className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-500"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-mc-border text-mc-text text-sm rounded-lg hover:bg-mc-bg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 p-4 min-w-max h-full">
          {CONTENT_STAGES.map(stage => (
            <div key={stage} className="w-64 flex flex-col bg-mc-surface rounded-xl">
              <div className="p-3 border-b border-mc-border">
                <h3 className="font-medium text-mc-text text-sm">
                  {CONTENT_STAGE_LABELS[stage]}
                </h3>
                <span className="text-xs text-mc-muted">
                  {itemsByStage[stage].length} items
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {itemsByStage[stage].map(item => (
                  <div
                    key={item.id}
                    className="p-3 bg-mc-bg rounded-lg border border-mc-border hover:border-mc-accent/50 transition-colors cursor-pointer group"
                    onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{PLATFORM_EMOJI[item.platform]}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-mc-text truncate">{item.title}</h4>
                        {item.idea && (
                          <p className="text-xs text-mc-muted line-clamp-2 mt-1">{item.idea}</p>
                        )}
                      </div>
                    </div>
                    
                    {editingId === item.id && (
                      <div className="mt-3 pt-3 border-t border-mc-border">
                        <p className="text-xs text-mc-muted mb-2">Move to:</p>
                        <div className="flex flex-wrap gap-1">
                          {CONTENT_STAGES.filter(s => s !== stage).map(s => (
                            <button
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation();
                                moveItem(item.id, s);
                              }}
                              className="px-2 py-1 text-xs bg-mc-surface rounded hover:bg-mc-accent/20 text-mc-muted hover:text-mc-accent transition-colors"
                            >
                              {CONTENT_STAGE_LABELS[s].split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {itemsByStage[stage].length === 0 && (
                  <div className="p-4 text-center text-mc-muted text-sm">
                    No content
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
