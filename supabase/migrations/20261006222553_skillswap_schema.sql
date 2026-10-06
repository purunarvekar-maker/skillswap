/*
# SkillSwap — Student Skill-Exchange Platform Schema

## Overview
Creates the full database schema for SkillSwap, a student skill-exchange platform
with a scrapbook aesthetic. Includes user profiles, skill marketplace, events,
community posts, chat, notes, calendar, progress tracking, toolkit, and archive.

## New Tables (Shared Content — readable by all)
1. `profiles` — Student profiles (username, bio, school, guild, skills, avatar)
2. `skills_marketplace` — Skill cards for the SkillSwipe feature
3. `events` — Community events and workshops
4. `community_posts` — Community feed posts with likes
5. `chat_messages` — Community chat messages
6. `toolkit_items` — Curated tools and resources

## New Tables (User-Specific — owner-scoped)
7. `notes` — Personal study notes with tags
8. `calendar_events` — Personal calendar items
9. `progress_items` — Learning progress tracking
10. `archive_items` — Archived content
11. `learning_sessions` — Scheduled skill exchange sessions

## Security
- RLS enabled on all tables
- Shared content tables: TO anon, authenticated with USING(true)
- User-specific tables: TO authenticated with auth.uid() = user_id ownership checks
- Owner columns default to auth.uid() for seamless inserts
*/

-- ============ SHARED CONTENT TABLES ============

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  full_name text NOT NULL,
  bio text,
  school text,
  year text,
  guild text,
  avatar_emoji text DEFAULT '🎨',
  cover_color text DEFAULT '#800020',
  skills_offered text[] DEFAULT '{}',
  skills_wanted text[] DEFAULT '{}',
  badges text[] DEFAULT '{}',
  streak integer DEFAULT 0,
  total_sessions integer DEFAULT 0,
  rating numeric DEFAULT 5.0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_read_all" ON profiles;
CREATE POLICY "profiles_read_all" ON profiles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS skills_marketplace (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  student_avatar text DEFAULT '🧑‍🎨',
  skill_name text NOT NULL,
  skill_category text NOT NULL,
  description text,
  tags text[] DEFAULT '{}',
  level text DEFAULT 'Intermediate',
  color text DEFAULT '#800020',
  rating numeric DEFAULT 5.0,
  sessions_taught integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills_marketplace ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "skills_marketplace_read" ON skills_marketplace;
CREATE POLICY "skills_marketplace_read" ON skills_marketplace FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "skills_marketplace_insert" ON skills_marketplace;
CREATE POLICY "skills_marketplace_insert" ON skills_marketplace FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "skills_marketplace_update" ON skills_marketplace;
CREATE POLICY "skills_marketplace_update" ON skills_marketplace FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  location text,
  host text,
  category text,
  capacity integer DEFAULT 30,
  registered integer DEFAULT 0,
  emoji text DEFAULT '📌',
  color text DEFAULT '#800020',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_read" ON events;
CREATE POLICY "events_read" ON events FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "events_insert" ON events;
CREATE POLICY "events_insert" ON events FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "events_update" ON events;
CREATE POLICY "events_update" ON events FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_avatar text DEFAULT '🎨',
  content text NOT NULL,
  likes integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  image_emoji text DEFAULT '✨',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "posts_read" ON community_posts;
CREATE POLICY "posts_read" ON community_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "posts_insert" ON community_posts;
CREATE POLICY "posts_insert" ON community_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "posts_update" ON community_posts;
CREATE POLICY "posts_update" ON community_posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_avatar text DEFAULT '😊',
  content text NOT NULL,
  is_me boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "chat_read" ON chat_messages;
CREATE POLICY "chat_read" ON chat_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "chat_insert" ON chat_messages;
CREATE POLICY "chat_insert" ON chat_messages FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS toolkit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  emoji text DEFAULT '🛠️',
  color text DEFAULT '#800020',
  rating numeric DEFAULT 5.0,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE toolkit_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "toolkit_read" ON toolkit_items;
CREATE POLICY "toolkit_read" ON toolkit_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "toolkit_insert" ON toolkit_items;
CREATE POLICY "toolkit_insert" ON toolkit_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============ USER-SPECIFIC TABLES ============

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  tags text[] DEFAULT '{}',
  color text DEFAULT '#FFF9E6',
  pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notes_select_own" ON notes;
CREATE POLICY "notes_select_own" ON notes FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "notes_insert_own" ON notes;
CREATE POLICY "notes_insert_own" ON notes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notes_update_own" ON notes;
CREATE POLICY "notes_update_own" ON notes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notes_delete_own" ON notes;
CREATE POLICY "notes_delete_own" ON notes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  date date NOT NULL,
  time text,
  type text DEFAULT 'session',
  color text DEFAULT '#800020',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "calendar_select_own" ON calendar_events;
CREATE POLICY "calendar_select_own" ON calendar_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "calendar_insert_own" ON calendar_events;
CREATE POLICY "calendar_insert_own" ON calendar_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "calendar_update_own" ON calendar_events;
CREATE POLICY "calendar_update_own" ON calendar_events FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "calendar_delete_own" ON calendar_events;
CREATE POLICY "calendar_delete_own" ON calendar_events FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS progress_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  progress integer DEFAULT 0,
  total_milestones integer DEFAULT 10,
  completed_milestones integer DEFAULT 0,
  category text,
  color text DEFAULT '#800020',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE progress_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "progress_select_own" ON progress_items;
CREATE POLICY "progress_select_own" ON progress_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "progress_insert_own" ON progress_items;
CREATE POLICY "progress_insert_own" ON progress_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "progress_update_own" ON progress_items;
CREATE POLICY "progress_update_own" ON progress_items FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "progress_delete_own" ON progress_items;
CREATE POLICY "progress_delete_own" ON progress_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS archive_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL,
  content text,
  emoji text DEFAULT '📦',
  color text DEFAULT '#800020',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE archive_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "archive_select_own" ON archive_items;
CREATE POLICY "archive_select_own" ON archive_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "archive_insert_own" ON archive_items;
CREATE POLICY "archive_insert_own" ON archive_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "archive_delete_own" ON archive_items;
CREATE POLICY "archive_delete_own" ON archive_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_name text NOT NULL,
  partner_avatar text DEFAULT '🧑‍🎨',
  skill text NOT NULL,
  status text DEFAULT 'upcoming',
  date timestamptz,
  duration_minutes integer DEFAULT 60,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sessions_select_own" ON learning_sessions;
CREATE POLICY "sessions_select_own" ON learning_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "sessions_insert_own" ON learning_sessions;
CREATE POLICY "sessions_insert_own" ON learning_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "sessions_update_own" ON learning_sessions;
CREATE POLICY "sessions_update_own" ON learning_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "sessions_delete_own" ON learning_sessions;
CREATE POLICY "sessions_delete_own" ON learning_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ SEED DATA ============

-- Skills Marketplace
INSERT INTO skills_marketplace (student_name, student_avatar, skill_name, skill_category, description, tags, level, color, rating, sessions_taught) VALUES
('Aria Chen', '🎨', 'Watercolor Painting', 'Visual Arts', 'Learn loose, expressive watercolor techniques from washes to wet-on-wet.', '{"painting","watercolor","art","beginner"}', 'Expert', '#800020', 5.0, 24),
('Marcus Okafor', '🎸', 'Acoustic Guitar', 'Music', 'From basic chords to fingerpicking patterns — let''s make music together.', '{"music","guitar","acoustic","chords"}', 'Advanced', '#5B0015', 4.9, 18),
('Yuki Tanaka', '📸', 'Film Photography', 'Photography', 'Master manual 35mm cameras, develop your own film, and scan like a pro.', '{"photography","film","analog","darkroom"}', 'Expert', '#800020', 5.0, 31),
('Sofia Reyes', '🍳', 'Sourdough Baking', 'Culinary', 'From starter maintenance to scoring beautiful loaves — the complete bread journey.', '{"baking","bread","sourdough","fermentation"}', 'Advanced', '#5B0015', 4.8, 15),
('Dev Patel', '💻', 'Web Development', 'Technology', 'Build your first website with HTML, CSS, and a sprinkle of JavaScript magic.', '{"coding","web","html","css","javascript"}', 'Expert', '#800020', 4.9, 42),
('Luna Martinez', '🖌️', 'Digital Illustration', 'Visual Arts', 'Procreate basics, brush making, and character design from sketch to final.', '{"digital","illustration","procreate","design"}', 'Advanced', '#5B0015', 5.0, 27),
('Kai Anderson', '🧘', 'Mindfulness & Meditation', 'Wellness', 'Daily practices for focus, stress relief, and creative clarity.', '{"wellness","meditation","mindfulness","mental-health"}', 'Intermediate', '#800020', 4.7, 12),
('Zara Khoury', '✍️', 'Creative Writing', 'Language', 'Short fiction, poetry, and finding your unique narrative voice.', '{"writing","poetry","fiction","creative"}', 'Expert', '#5B0015', 5.0, 33),
('Theo Nakamura', '🎲', 'Game Design Basics', 'Technology', 'Board game mechanics, prototyping, and playtesting your first game.', '{"games","design","prototyping","board-games"}', 'Intermediate', '#800020', 4.6, 9),
('Iris Volkov', '🎭', 'Improv Comedy', 'Performance', 'Yes-and! Build confidence, quick thinking, and collaborative storytelling.', '{"comedy","improv","performance","theater"}', 'Advanced', '#5B0015', 4.8, 21),
('Felix Park', '📊', 'Data Storytelling', 'Technology', 'Turn spreadsheets into compelling visual narratives with charts and design.', '{"data","visualization","charts","storytelling"}', 'Expert', '#800020', 4.9, 16),
('Maya Singh', '🌱', 'Urban Gardening', 'Life Skills', 'Grow herbs, veggies, and flowers in small spaces — balcony gardens welcome!', '{"gardening","plants","urban","sustainability"}', 'Intermediate', '#5B0015', 4.7, 8)
ON CONFLICT DO NOTHING;

-- Events
INSERT INTO events (title, description, date, location, host, category, capacity, registered, emoji, color) VALUES
('Watercolor Sunset Workshop', 'Paint a golden hour landscape with wet-on-wet techniques. All materials provided!', '2026-10-12 15:00:00', 'Art Studio B — Design Building', 'Aria Chen', 'Workshop', 20, 14, '🌅', '#800020'),
('Open Mic & Skill Showcase Night', 'Perform, demo a skill, or just cheer on your peers. Sign-up at the door!', '2026-10-15 19:00:00', 'Student Center Mainstage', 'Iris Volkov', 'Social', 80, 52, '🎤', '#5B0015'),
('Hackathon: Build in 24 Hours', 'Team up and build a working prototype. Mentors, food, and caffeine provided.', '2026-10-20 09:00:00', 'Innovation Lab — Engineering Wing', 'Dev Patel', 'Competition', 50, 38, '⚡', '#800020'),
('Film Photography Walk', 'Bring your 35mm camera! We''ll explore campus, shoot, and discuss composition.', '2026-10-14 14:00:00', 'Meet at the Quad Fountain', 'Yuki Tanaka', 'Outdoor', 15, 11, '📷', '#5B0015'),
('Sourdough Starter Clinic', 'Get your starter bubbling and learn feeding schedules. Take home a jar of starter!', '2026-10-18 11:00:00', 'Culinary Kitchen — East Hall', 'Sofia Reyes', 'Workshop', 12, 9, '🍞', '#800020'),
('Game Design Jam Weekend', 'Prototype a board game in 48 hours. Playtest with real players at the finale!', '2026-10-25 10:00:00', 'Game Lab — Design Building', 'Theo Nakamura', 'Competition', 30, 22, '🎲', '#5B0015'),
('Mindful Mornings', 'Start your week with guided meditation and journaling. Tea provided.', '2026-10-09 08:00:00', 'Garden Room — Wellness Center', 'Kai Anderson', 'Wellness', 25, 17, '🧘', '#800020'),
('Creative Writing Circle', 'Share works in progress, give and receive feedback in a supportive group.', '2026-10-11 16:00:00', 'Library Reading Room 2', 'Zara Khoury', 'Discussion', 15, 10, '✍️', '#5B0015'),
('Digital Art Showcase', 'Exhibition of student digital illustrations, animations, and concept art.', '2026-10-22 18:00:00', 'Gallery Space — Design Building', 'Luna Martinez', 'Exhibition', 100, 64, '🖼️', '#800020'),
('Guitar Circle Jam', 'All levels welcome! Bring an acoustic guitar or just come to listen and sing along.', '2026-10-16 17:00:00', 'Campus Fire Pit', 'Marcus Okafor', 'Social', 30, 19, '🎸', '#5B0015')
ON CONFLICT DO NOTHING;

-- Community Posts
INSERT INTO community_posts (author_name, author_avatar, content, likes, tags, image_emoji) VALUES
('Aria Chen', '🎨', 'Just finished a 30-day watercolor challenge! Here''s my favorite piece — a misty mountain sunrise. Never thought I''d improve this much in a month! 🏔️', 47, '{"watercolor","challenge","art"}', '🏔️'),
('Dev Patel', '💻', 'Hosting an impromptu debugging session tomorrow at 3pm in the Innovation Lab. Bring your broken code and we''ll fix it together! No question is too basic.', 31, '{"coding","debugging","study-group"}', '🔧'),
('Yuki Tanaka', '📸', 'Found an old Pentax K1000 at the thrift store for $15! It still works perfectly. Sometimes the best gear is the oldest gear 📷', 58, '{"photography","film","vintage"}', '📷'),
('Sofia Reyes', '🍳', 'Day 47 of my sourdough journey: finally getting an ear! The crumb is still a bit tight but I''m so proud of this loaf. Recipe in comments!', 42, '{"baking","sourdough","progress"}', '🍞'),
('Luna Martinez', '🖌️', 'Made a new Procreate brush set inspired by vintage comic book halftones! Free download for anyone in the SkillSwap community 💜', 67, '{"digital-art","procreate","freebie"}', '🎨'),
('Kai Anderson', '🧘', 'Reminder: rest is productive too. If you''re feeling burned out, take a breath. The work will still be there. Your wellbeing comes first.', 89, '{"wellness","mindfulness","self-care"}', '🌿'),
('Zara Khoury', '✍️', 'Writing prompt of the week: Write about a skill you wish you had, from the perspective of someone who has it but lost it. Tag me if you share!', 35, '{"writing","prompt","creative"}', '📝'),
('Theo Nakamura', '🎲', 'My board game prototype just hit 100 playtests! The mechanics finally feel balanced. Huge thanks to everyone who playtested and gave feedback!', 28, '{"game-design","milestone","prototyping"}', '🎲'),
('Iris Volkov', '🎭', 'Improv taught me that "yes, and" isn''t just a comedy rule — it''s a life philosophy. What''s one way you''ve said "yes, and" this week?', 52, '{"improv","philosophy","mindset"}', '🎭'),
('Maya Singh', '🌱', 'My balcony garden update: the tomatoes are finally ripening and the basil is out of control! Urban gardening is the best therapy 🍅🌿', 38, '{"gardening","urban","plants"}', '🌱'),
('Felix Park', '📊', 'Hot take: the best data visualization tells a story that makes you feel something. Charts aren''t just numbers — they''re narratives. What chart moved you?', 44, '{"data","storytelling","design"}', '📊'),
('Marcus Okafor', '🎸', 'Learned to play "Blackbird" by fingerpicking today after 3 weeks of practice. The feeling when your fingers finally know where to go is unmatched!', 51, '{"music","guitar","milestone"}', '🎵')
ON CONFLICT DO NOTHING;

-- Chat Messages
INSERT INTO chat_messages (sender_name, sender_avatar, content, is_me, created_at) VALUES
('Aria Chen', '🎨', 'Hey everyone! Who''s coming to the watercolor workshop this Saturday?', false, '2026-10-06 09:15:00'),
('Dev Patel', '💻', 'I''ll be there! Need a break from screens for a day 😄', false, '2026-10-06 09:18:00'),
('Sofia Reyes', '🍳', 'Counting me in too! Can I bring some sourdough snacks?', false, '2026-10-06 09:20:00'),
('Poorva Narvekar', '✨', 'Yes please Sofia! Your bread is legendary 🍞', true, '2026-10-06 09:22:00'),
('Yuki Tanaka', '📸', 'I''ll document the whole thing on film. Going to be a beautiful session!', false, '2026-10-06 09:25:00'),
('Luna Martinez', '🖌️', 'I made everyone digital name tags with halftone patterns! Check your DMs', false, '2026-10-06 09:30:00'),
('Poorva Narvekar', '✨', 'These are SO cute Luna! I love the scrapbook vibe 💜', true, '2026-10-06 09:32:00'),
('Kai Anderson', '🧘', 'Reminder to hydrate and stretch before the workshop! Painting is surprisingly physical', false, '2026-10-06 09:35:00'),
('Marcus Okafor', '🎸', 'I''ll bring my guitar for some ambient music during the session', false, '2026-10-06 09:40:00'),
('Zara Khoury', '✍️', 'This is giving me an idea for a creative writing prompt about art and music collaboration!', false, '2026-10-06 09:42:00')
ON CONFLICT DO NOTHING;

-- Toolkit Items
INSERT INTO toolkit_items (name, description, category, emoji, color, rating, link) VALUES
('Procreate', 'Industry-standard digital illustration app for iPad. Powerful brushes and intuitive interface.', 'Design', '🖌️', '#800020', 4.9, 'https://procreate.com'),
('Figma', 'Collaborative design tool for UI/UX, prototyping, and design systems. Free for students.', 'Design', '🎯', '#5B0015', 4.8, 'https://figma.com'),
('Notion', 'All-in-one workspace for notes, databases, and project organization. Great for study planning.', 'Productivity', '📝', '#800020', 4.7, 'https://notion.so'),
('Anki', 'Spaced repetition flashcards. Scientifically proven to help you remember anything forever.', 'Study', '🃏', '#5B0015', 4.6, 'https://apps.ankiweb.net'),
('GarageBand', 'Free music production studio for Mac and iOS. Record, edit, and produce your first track.', 'Music', '🎵', '#800020', 4.5, 'https://apple.com/mac/garageband'),
('Canva', 'Drag-and-drop design for posters, presentations, and social media. Student Pro is free.', 'Design', '🖼️', '#5B0015', 4.7, 'https://canva.com'),
('Obsidian', 'Markdown-based knowledge graph for connected notes and second brain building.', 'Productivity', '🧠', '#800020', 4.8, 'https://obsidian.md'),
('LightZone', 'Open-source photo editing with zone-based exposure control. Great for film scans.', 'Photography', '📷', '#5B0015', 4.3, 'https://lightzoneproject.org'),
('Trello', 'Visual kanban boards for tracking projects, skill progress, and collaboration.', 'Productivity', '📋', '#800020', 4.5, 'https://trello.com'),
('Miro', 'Infinite collaborative whiteboard for brainstorming, mind maps, and game design.', 'Brainstorming', '💡', '#5B0015', 4.6, 'https://miro.com')
ON CONFLICT DO NOTHING;
