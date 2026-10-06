import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DEMO_USER } from '@/lib/constants';
import { PageHeader, DoodleHeart, DoodleSparkle, EmptyState } from '@/components/Doodles';

interface Post {
  id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  likes: number;
  tags: string[];
  image_emoji: string;
  created_at: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    })();
  }, []);

  async function handlePost() {
    if (!newPost.trim()) return;
    setPosting(true);
    const { data } = await supabase
      .from('community_posts')
      .insert({
        author_name: DEMO_USER.fullName,
        author_avatar: DEMO_USER.avatarEmoji,
        content: newPost.trim(),
        tags: ['skillswap'],
        image_emoji: '✨',
        likes: 0,
      })
      .select()
      .single();

    if (data) {
      setPosts((prev) => [data, ...prev]);
      setNewPost('');
    }
    setPosting(false);
  }

  function toggleLike(postId: string) {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
        setPosts((posts) =>
          posts.map((p) => (p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
        );
      } else {
        next.add(postId);
        setPosts((posts) =>
          posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
        );
      }
      return next;
    });
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Community Feed" subtitle="Share your progress, ask for help, and cheer on your peers." emoji="💬" />

      {/* Compose box */}
      <div className="paper-card p-4 mb-6 relative" style={{ transform: 'rotate(-0.3deg)' }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-butter text-xl border-2 border-cherry-200 flex-shrink-0">
            {DEMO_USER.avatarEmoji}
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with the community..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-paper-300 bg-white/60 focus:border-cherry focus:outline-none transition-colors text-sm resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                {['🎨', '📚', '🔥', '✨', '💡'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewPost((prev) => prev + ' ' + emoji)}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePost}
                disabled={!newPost.trim() || posting}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <EmptyState emoji="🔄" title="Loading posts..." />
      ) : posts.length === 0 ? (
        <EmptyState emoji="📭" title="No posts yet" subtitle="Be the first to share something!" />
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => {
            const isLiked = likedPosts.has(post.id);
            const postTime = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <div
                key={post.id}
                className="paper-card p-5 relative"
                style={{ transform: `rotate(${i % 2 === 0 ? 0.3 : -0.3}deg)` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-200 text-2xl border-2 border-paper-300 flex-shrink-0">
                    {post.author_avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-cherry">{post.author_name}</p>
                    <p className="text-xs text-paper-400">{postTime}</p>
                  </div>
                  <span className="text-3xl">{post.image_emoji}</span>
                </div>

                <p className="text-sm text-paper-600 mb-3 leading-relaxed">{post.content}</p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="pill-tag bg-paper-200 text-paper-500">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-3 border-t border-paper-200">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm font-bold transition-all hover:scale-105 ${
                      isLiked ? 'text-cherry' : 'text-paper-400'
                    }`}
                  >
                    <DoodleHeart size={18} filled={isLiked} color={isLiked ? '#800020' : '#C9BBA8'} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-bold text-paper-400 hover:text-cherry transition-colors">
                    💬 Comment
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-bold text-paper-400 hover:text-cherry transition-colors">
                    🔗 Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
