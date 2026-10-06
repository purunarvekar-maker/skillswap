import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { DEMO_USER } from '@/lib/constants';
import { DoodleCat, DoodleSparkle } from '@/components/Doodles';

interface Message {
  id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  is_me: boolean;
  created_at: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
      if (data) setMessages(data);
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    })();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim()) return;
    setSending(true);
    const { data } = await supabase
      .from('chat_messages')
      .insert({
        sender_name: DEMO_USER.fullName,
        sender_avatar: DEMO_USER.avatarEmoji,
        content: input.trim(),
        is_me: true,
      })
      .select()
      .single();

    if (data) {
      setMessages((prev) => [...prev, data]);
      setInput('');
    }
    setSending(false);
  }

  const onlineUsers = [
    { name: 'Aria Chen', avatar: '🎨' },
    { name: 'Dev Patel', avatar: '💻' },
    { name: 'Yuki Tanaka', avatar: '📸' },
    { name: 'Sofia Reyes', avatar: '🍳' },
    { name: 'Luna Martinez', avatar: '🖌️' },
    { name: 'Kai Anderson', avatar: '🧘' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <DoodleCat size={80} />
        <p className="font-display text-2xl text-cherry mt-4">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-cherry">Community Chat 💭</h1>
          <p className="text-xs text-paper-400">Chat with skill-swap peers in real-time</p>
        </div>
        <div className="flex -space-x-2">
          {onlineUsers.slice(0, 5).map((user) => (
            <div key={user.name} className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-200 border-2 border-paper-50 text-sm">
              {user.avatar}
            </div>
          ))}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint border-2 border-paper-50 text-[10px] font-bold text-green-800">
            +{onlineUsers.length - 5}
          </div>
        </div>
      </div>

      {/* Online users bar */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-2 border-b border-paper-200">
        {onlineUsers.map((user) => (
          <div key={user.name} className="flex items-center gap-1.5 bg-paper-100 rounded-full px-3 py-1 flex-shrink-0">
            <span className="text-sm">{user.avatar}</span>
            <span className="text-xs font-bold text-paper-500">{user.name.split(' ')[0]}</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.is_me ? 'flex-row-reverse' : ''} animate-slide-up`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-lg flex-shrink-0 ${
              msg.is_me ? 'bg-butter border-2 border-cherry-200' : 'bg-paper-200 border-2 border-paper-300'
            }`}>
              {msg.sender_avatar}
            </div>
            <div className={`max-w-[75%] ${msg.is_me ? 'items-end' : ''}`}>
              <div className={`text-xs font-bold mb-0.5 ${msg.is_me ? 'text-cherry text-right' : 'text-paper-500'}`}>
                {msg.is_me ? 'You' : msg.sender_name}
              </div>
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm ${
                  msg.is_me
                    ? 'bg-cherry text-white rounded-br-md'
                    : 'bg-white border-2 border-paper-200 text-paper-600 rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
              <p className={`text-[10px] text-paper-400 mt-0.5 ${msg.is_me ? 'text-right' : ''}`}>
                {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-3 paper-card p-2 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-xl bg-paper-100 border-2 border-transparent focus:border-cherry focus:outline-none text-sm transition-colors"
        />
        <button
          onClick={() => setInput((prev) => prev + ' ✨')}
          className="text-xl hover:scale-125 transition-transform"
        >
          <DoodleSparkle size={22} />
        </button>
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
