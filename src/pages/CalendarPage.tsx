import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, EmptyState, DoodleStar } from '@/components/Doodles';

interface CalEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  type: string;
  color: string;
  description: string | null;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newType, setNewType] = useState('session');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('calendar_events').select('*').order('date', { ascending: true });
      if (data) setEvents(data);
      setLoading(false);
    })();
  }, []);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = events.reduce((acc, e) => {
    const dateKey = e.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(e);
    return acc;
  }, {} as Record<string, CalEvent[]>);

  const todayStr = new Date().toISOString().split('T')[0];
  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

  async function addEvent() {
    if (!newTitle.trim() || !newDate) return;
    const typeColors: Record<string, string> = {
      session: '#800020',
      workshop: '#5B0015',
      social: '#D6C7E8',
      deadline: '#FFE89A',
    };
    const { data } = await supabase
      .from('calendar_events')
      .insert({
        title: newTitle.trim(),
        date: newDate,
        time: newTime || null,
        type: newType,
        color: typeColors[newType] || '#800020',
      })
      .select()
      .single();

    if (data) {
      setEvents((prev) => [...prev, data].sort((a, b) => a.date.localeCompare(b.date)));
      setNewTitle('');
      setNewDate('');
      setNewTime('');
      setShowAddForm(false);
    }
  }

  async function deleteEvent(id: string) {
    await supabase.from('calendar_events').delete().eq('id', id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Calendar" subtitle="Plan your skill exchange schedule." emoji="🗓️" />
        <EmptyState emoji="🔄" title="Loading calendar..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Calendar" subtitle="Plan your skill exchange schedule." emoji="🗓️" />
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary text-sm whitespace-nowrap"
        >
          + Add Event
        </button>
      </div>

      {showAddForm && (
        <div className="paper-card p-4 mb-6 animate-slide-up" style={{ transform: 'rotate(-0.5deg)' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Event title"
              className="px-3 py-2 rounded-lg border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none text-sm col-span-2"
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none text-sm"
            />
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none text-sm"
            />
          </div>
          <div className="flex gap-2 mt-3">
            {['session', 'workshop', 'social', 'deadline'].map((t) => (
              <button
                key={t}
                onClick={() => setNewType(t)}
                className={`pill-tag capitalize ${newType === t ? 'bg-cherry text-white border border-cherry' : 'bg-paper-200 text-paper-500 border border-paper-300'}`}
              >
                {t}
              </button>
            ))}
            <button onClick={addEvent} className="btn-primary text-sm ml-auto">Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 paper-card p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-paper-200 transition-colors"
            >
              ←
            </button>
            <h2 className="font-display text-2xl font-bold text-cherry">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-paper-200 transition-colors"
            >
              →
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-bold text-paper-400 uppercase py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = eventsByDate[dateStr] || [];
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-start transition-all text-sm relative ${
                    isSelected
                      ? 'bg-cherry text-white'
                      : isToday
                      ? 'bg-butter border-2 border-butter-dark'
                      : 'hover:bg-paper-200'
                  }`}
                >
                  <span className={`font-bold ${isSelected ? 'text-white' : isToday ? 'text-cherry-800' : 'text-paper-500'}`}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: isSelected ? '#FFFDF5' : e.color }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day events */}
        <div>
          <h2 className="font-display text-2xl font-bold text-cherry mb-4">
            {selectedDate
              ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
              : 'Select a day'}
          </h2>
          {selectedEvents.length === 0 ? (
            <EmptyState emoji="📅" title="No events" subtitle="Click + Add Event to schedule something." />
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="paper-card p-3 flex items-start gap-3 group"
                  style={{ borderLeft: `4px solid ${event.color}` }}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-cherry">{event.title}</h3>
                    {event.time && <p className="text-xs text-paper-400 mt-0.5">🕐 {event.time}</p>}
                    {event.description && <p className="text-xs text-paper-500 mt-1">{event.description}</p>}
                    <span className="inline-block mt-1.5 pill-tag bg-paper-200 text-paper-500 capitalize">{event.type}</span>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-paper-300 hover:text-cherry transition-colors text-sm opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
