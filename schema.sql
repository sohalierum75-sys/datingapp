-- ============================================================================
-- Safe Database Schema for Cloudflare D1
-- Uses IF NOT EXISTS everywhere to guarantee zero data loss during migrations
-- ============================================================================

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

-- 2. Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- 3. Landing Pages Table
CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    subdomain TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published', -- 'published' or 'draft'
    
    -- Persona / Chat pre-lander fields
    persona_name TEXT NOT NULL DEFAULT 'Nethmi',
    avatar_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    chat_message TEXT NOT NULL DEFAULT 'Hey there! ❤️ Thanks for visiting my page. Tap below to see what I have just uploaded for you!',
    typing_delay_ms INTEGER NOT NULL DEFAULT 1500,
    
    -- Traffic Routing Engine
    routing_mode TEXT NOT NULL DEFAULT 'direct', -- 'direct', 'chrome_intent', 'app_deep_link'
    routing_target TEXT NOT NULL DEFAULT 'https://example.com', -- Ad URL or code, or username
    fallback_url TEXT NOT NULL DEFAULT 'https://example.com',
    
    -- CTA Buttons (JSON array string: [{"label":"Reply in Private Chat", "color":"#ff4081"}, ...])
    cta_buttons_json TEXT NOT NULL DEFAULT '[{"label":"Reply in Private Chat ❤️","color":"#e91e63"},{"label":"View Private Gallery 📸","color":"#9c27b0"}]',
    
    -- Dynamic SEO & Open Graph Tags
    og_title TEXT NOT NULL DEFAULT 'Online Now ✨ - Connect with me',
    og_description TEXT NOT NULL DEFAULT 'Check out my profile, photos, and exclusive links.',
    og_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    theme_accent TEXT NOT NULL DEFAULT '#e91e63',
    
    -- Advertising Controls
    ad_popunder_enabled INTEGER NOT NULL DEFAULT 0,
    ad_socialbar_enabled INTEGER NOT NULL DEFAULT 0,
    ad_popunder_code TEXT,
    ad_socialbar_code TEXT,
    ad_popunder TEXT,
    ad_socialbar TEXT,

    -- Monetag Direct Link Integration
    monetag_direct_link TEXT,

    -- Dynamic Background Ad URL (Direct Link / Pop-under redirect)
    ad_url TEXT,

    -- App Download & Mobile App Visibility Settings
    app_download_enabled INTEGER NOT NULL DEFAULT 1,
    apk_download_url TEXT DEFAULT '/app.apk',
    is_visible_in_app INTEGER NOT NULL DEFAULT 1,
    is_pinned INTEGER NOT NULL DEFAULT 0,

    -- Chat Media & Unlockable Gallery (JSON arrays of media objects)
    chat_media_json TEXT NOT NULL DEFAULT '[]',
    unlock_media_json TEXT NOT NULL DEFAULT '[]',
    quiz_photos_json TEXT NOT NULL DEFAULT '[]',

    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- 4. Remote App Config Table
CREATE TABLE IF NOT EXISTS app_config (
    id TEXT PRIMARY KEY,
    notifications_enabled INTEGER NOT NULL DEFAULT 1,
    min_interval_minutes INTEGER NOT NULL DEFAULT 30,
    max_interval_minutes INTEGER NOT NULL DEFAULT 180,
    quiet_hours_start INTEGER NOT NULL DEFAULT 23,
    quiet_hours_end INTEGER NOT NULL DEFAULT 7,
    default_quiz_photos_json TEXT NOT NULL DEFAULT '[]',
    updated_at INTEGER NOT NULL
);

-- 5. Notification Templates Table
CREATE TABLE IF NOT EXISTS notification_templates (
    id TEXT PRIMARY KEY,
    profile_id TEXT NOT NULL DEFAULT 'random',
    type TEXT NOT NULL DEFAULT 'text', -- 'text' or 'image_text'
    message_text TEXT NOT NULL,
    image_url TEXT,
    created_at INTEGER NOT NULL
);

-- 6. Uploaded Notification & Media Images Table
CREATE TABLE IF NOT EXISTS uploaded_images (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

-- 6b. Uploaded Media Table (KV backed metadata & D1 fallback for images and videos)
CREATE TABLE IF NOT EXISTS uploaded_media (
    id TEXT PRIMARY KEY,
    content_type TEXT NOT NULL,
    media_type TEXT NOT NULL, -- 'image' or 'video'
    size INTEGER NOT NULL,
    data TEXT,
    created_at INTEGER NOT NULL
);

-- 7. Real-Time Stats Events Table
CREATE TABLE IF NOT EXISTS stats_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,         -- 'visit', 'download', 'app_install', 'heartbeat'
    source TEXT NOT NULL,       -- 'web', 'app'
    client_id TEXT NOT NULL,
    page_slug TEXT,
    date_key TEXT NOT NULL,     -- 'YYYY-MM-DD'
    created_at INTEGER NOT NULL
);

-- 8. Real-Time Active Sessions Table (for 2-minute live online users tracking)
CREATE TABLE IF NOT EXISTS active_sessions (
    client_id TEXT PRIMARY KEY,
    source TEXT NOT NULL,       -- 'web', 'app'
    last_seen INTEGER NOT NULL
);

-- 9. Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL,
    subdomain TEXT NOT NULL,
    event_type TEXT NOT NULL, -- 'page_view', 'cta_click'
    cta_label TEXT,
    referrer TEXT,
    device_type TEXT, -- 'mobile', 'tablet', 'desktop'
    platform TEXT,   -- 'android_fb', 'ios_fb', 'android', 'ios', 'windows', 'mac', 'other'
    visitor_hash TEXT, -- anonymized daily hash of IP + UA for unique visitor count
    created_at INTEGER NOT NULL
);

-- Indexes for lightning-fast queries and reporting
CREATE INDEX IF NOT EXISTS idx_pages_subdomain ON pages(subdomain);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_analytics_page_created ON analytics_events(page_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_subdomain ON analytics_events(subdomain, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON admin_sessions(token);

