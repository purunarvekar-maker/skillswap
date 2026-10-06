import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, EmptyState, TapeStrip, DoodleStar, DoodleSparkle } from '@/components/Doodles';
import { NOTE_COLORS } from '@/lib/constants';

interface Note {
  id: string;
  title: string;
  content: string | null;
  tags: string[];
  color: string;
  pinned: boolean;
  created_at: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState(NOTE_COLORS[0]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('notes').select('*').order('pinned', { ascending: false }).order('created_at', { ascending: false });
      if (data) setNotes(data);
      setLoading(false);
    })();
  }, []);

  async function saveNote() {
    if (!title.trim()) return;
    const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    if (editingId) {
      const { data } = await supabase
        .from('notes')
        .update({ title: title.trim(), content, tags: tagArray, color })
        .eq('id', editingId)
        .select()
        .single();
      if (data) {
        setNotes((prev) => prev.map((n) => (n.id === editingId ? data : n)));
      }
    } else {
      const { data } = await supabase
        .from('notes')
        .insert({ title: title.trim(), content, tags: tagArray, color })
        .select()
        .single();
      if (data) setNotes((prev) => [data, ...prev]);
    }

    resetForm();
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setTitle('');
    setContent('');
    setTags('');
    setColor(NOTE_COLORS[0]);
  }

  function editNote(note: Note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content || '');
    setTags(note.tags.join(', '));
    setColor(note.color);
    setShowForm(true);
  }

  async function togglePin(note: Note) {
    const { data } = await supabase.from('notes').update({ pinned: !note.pinned }).eq('id', note.id).select().single();
    if (data) {
      setNotes((prev) => {
        const updated = prev.map((n) => (n.id === note.id ? data : n));
        return updated.sort((a, b) => Number(b.pinned) - Number(a.pinned));
      });
    }
  }

  async function deleteNote(id: string) {
    await supabase.from('notes').delete().eq('id', id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered = notes.filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Notes" subtitle="Jot down ideas, tips, and reflections from your learning journey." emoji="📝" />
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm whitespace-nowrap">
          + New Note
        </button>
      </div>

      {showForm && (
        <div className="paper-card p-5 mb-6 animate-slide-up relative" style={{ backgroundColor: color, transform: 'rotate(-0.5deg)' }}>
          <TapeStrip className="-top-3 left-6" style={{ transform: 'rotate(-8deg)' }} />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full bg-transparent border-b-2 border-paper-300 focus:border-cherry focus:outline-none text-lg font-bold text-cherry mb-3 pb-1"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={4}
            className="w-full bg-transparent border-2 border-paper-200 rounded-xl focus:border-cherry focus:outline-none text-sm text-paper-600 p-3 resize-none"
          />
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tags, comma, separated"
              className="flex-1 min-w-[120px] px-3 py-2 rounded-lg bg-white/50 border border-paper-300 focus:outline-none text-xs"
            />
            <div className="flex gap-1.5">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-cherry scale-110' : 'border-paper-300'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button onClick={saveNote} className="btn-primary text-sm">{editingId ? 'Update' : 'Save'}</button>
            <button onClick={resetForm} className="btn-ghost text-sm">Cancel</button>
          </div>
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes..."
        className="w-full px-5 py-3 rounded-xl border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none transition-colors text-sm mb-4"
      />

      {loading ? (
        <EmptyState emoji="🔄" title="Loading notes..." />
      ) : filtered.length === 0 ? (
        <EmptyState emoji="📝" title="No notes yet" subtitle="Create your first sticky note to get started!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note, i) => (
            <div
              key={note.id}
              className="p-4 rounded-2xl border-2 border-paper-200 paper-card-hover relative group"
              style={{
                backgroundColor: note.color,
                transform: `rotate(${i % 3 === 0 ? -1 : i % 3 === 1 ? 1 : -0.5}deg)`,
              }}
            >
              {note.pinned && (
                <div className="absolute -top-2 -right-2 text-lg sticker">
                  📌
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-cherry text-sm">{note.title}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => togglePin(note)} className="text-xs text-paper-400 hover:text-cherry">
                    {note.pinned ? '📌' : '📍'}
                  </button>
                  <button onClick={() => editNote(note)} className="text-xs text-paper-400 hover:text-cherry">
                    ✏️
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="text-xs text-paper-400 hover:text-cherry">
                    🗑️
                  </button>
                </div>
              </div>
              {note.content && (
                <p className="text-xs text-paper-600 line-clamp-4 mb-3 whitespace-pre-wrap">{note.content}</p>
              )}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-paper-400 font-medium">#{tag}</span>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-paper-400 mt-2">
                {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Sticker decoration */}
      <div className="mt-8 flex items-center justify-center gap-3 text-paper-300">
        <DoodleStar size={20} />
        <span className="font-display text-lg">Stickies corner</span>
        <DoodleSparkle size={18} />
      </div>
    </div>
  );
}
