import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, PillTag, EmptyState, DoodleStar } from '@/components/Doodles';

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  host: string | null;
  category: string | null;
  capacity: number;
  registered: number;
  emoji: string;
  color: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (data) setEvents(data);
      setLoading(false);
    })();
  }, []);

  const categories = [...new Set(events.map((e) => e.category).filter(Boolean))] as string[];
  const filtered = filter ? events.filter((e) => e.category === filter) : events;

  function toggleRegister(eventId: string, currentRegistered: number, capacity: number) {
    setRegistered((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
        setEvents((events) =>
          events.map((e) => (e.id === eventId ? { ...e, registered: Math.max(0, e.registered - 1) } : e))
        );
      } else {
        if (currentRegistered >= capacity) return prev;
        next.add(eventId);
        setEvents((events) =>
          events.map((e) => (e.id === eventId ? { ...e, registered: e.registered + 1 } : e))
        );
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Events" subtitle="Workshops, jams, and gatherings across campus." emoji="📌" />
        <EmptyState emoji="🔄" title="Loading events..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Events" subtitle="Workshops, jams, and gatherings across campus." emoji="📌" />

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter(null)}
          className={`pill-tag transition-all ${!filter ? 'bg-cherry text-white border border-cherry' : 'bg-paper-200 text-paper-500 border border-paper-300'}`}
        >
          All Events
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`pill-tag transition-all ${filter === cat ? 'bg-cherry text-white border border-cherry' : 'bg-paper-200 text-paper-500 border border-paper-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((event, i) => {
          const eventDate = new Date(event.date);
          const isRegistered = registered.has(event.id);
          const isFull = event.registered >= event.capacity;

          return (
            <div
              key={event.id}
              className="paper-card paper-card-hover overflow-hidden"
              style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
            >
              {/* Event header */}
              <div
                className="p-5 relative overflow-hidden"
                style={{ backgroundColor: event.color + '15' }}
              >
                <div className="halftone-bg absolute inset-0 opacity-30" />
                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex gap-3">
                    <div
                      className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    >
                      <span className="text-[10px] uppercase">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-xl leading-none">{eventDate.getDate()}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-cherry text-sm leading-snug">{event.title}</h3>
                      <p className="text-xs text-paper-400 mt-0.5">
                        {eventDate.toLocaleDateString('en-US', { weekday: 'short' })} · {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl">{event.emoji}</span>
                </div>
              </div>

              {/* Event body */}
              <div className="p-5">
                {event.description && (
                  <p className="text-sm text-paper-500 mb-3 line-clamp-2">{event.description}</p>
                )}

                <div className="space-y-1.5 mb-4">
                  {event.location && (
                    <p className="text-xs text-paper-400 flex items-center gap-1.5">
                      📍 {event.location}
                    </p>
                  )}
                  {event.host && (
                    <p className="text-xs text-paper-400 flex items-center gap-1.5">
                      👤 Hosted by {event.host}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {event.category && <PillTag color="cherry">{event.category}</PillTag>}
                    <span className={`text-xs font-bold ${isFull ? 'text-cherry-700' : 'text-paper-400'}`}>
                      {event.registered}/{event.capacity} registered
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-paper-200 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (event.registered / event.capacity) * 100)}%`,
                      backgroundColor: event.color,
                    }}
                  />
                </div>

                <button
                  onClick={() => toggleRegister(event.id, event.registered, event.capacity)}
                  disabled={isFull && !isRegistered}
                  className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isRegistered
                      ? 'bg-mint-light text-green-800 border-2 border-mint-dark'
                      : isFull
                      ? 'bg-paper-200 text-paper-400 cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {isRegistered ? '✓ Registered!' : isFull ? 'Sold Out' : 'Register Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
