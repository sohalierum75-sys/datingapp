/**
 * Cloudflare D1 Database Repository & KV Caching Helpers
 */

import { generateVisitorHash } from './auth.js';

export class DatabaseService {
  constructor(db, kv) {
    this.db = db;
    this.kv = kv;
  }

  /**
   * Safe initialization: ensures admin user exists if database was just created
   */
  async ensureAdminUser(defaultUsername = 'admin', defaultPassword = 'AdminPassword123!') {
    try {
      // Safe migrations for newer columns
      await this.db.prepare('ALTER TABLE pages ADD COLUMN app_download_enabled INTEGER NOT NULL DEFAULT 1').run().catch(() => {});
      await this.db.prepare("ALTER TABLE pages ADD COLUMN apk_download_url TEXT DEFAULT '/app.apk'").run().catch(() => {});
      await this.db.prepare('ALTER TABLE pages ADD COLUMN is_visible_in_app INTEGER NOT NULL DEFAULT 1').run().catch(() => {});
      await this.db.prepare('ALTER TABLE pages ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0').run().catch(() => {});
      await this.db.prepare("ALTER TABLE pages ADD COLUMN chat_media_json TEXT DEFAULT '[]'").run().catch(() => {});
      await this.db.prepare("ALTER TABLE pages ADD COLUMN unlock_media_json TEXT DEFAULT '[]'").run().catch(() => {});
      await this.db.prepare("ALTER TABLE pages ADD COLUMN quiz_photos_json TEXT DEFAULT '[]'").run().catch(() => {});
      await this.db.prepare("ALTER TABLE app_config ADD COLUMN default_quiz_photos_json TEXT DEFAULT '[]'").run().catch(() => {});

      // Uploaded Media Table (KV backed metadata & D1 fallback for images and videos)
      await this.db.prepare(`
        CREATE TABLE IF NOT EXISTS uploaded_media (
          id TEXT PRIMARY KEY,
          content_type TEXT NOT NULL,
          media_type TEXT NOT NULL,
          size INTEGER NOT NULL,
          data TEXT,
          created_at INTEGER NOT NULL
        )
      `).run().catch(() => {});

      // App Config Table for Remote Notification & Sync Settings
      await this.db.prepare(`
        CREATE TABLE IF NOT EXISTS app_config (
          id TEXT PRIMARY KEY,
          notifications_enabled INTEGER NOT NULL DEFAULT 1,
          min_interval_minutes INTEGER NOT NULL DEFAULT 30,
          max_interval_minutes INTEGER NOT NULL DEFAULT 180,
          quiet_hours_start INTEGER NOT NULL DEFAULT 23,
          quiet_hours_end INTEGER NOT NULL DEFAULT 7,
          updated_at INTEGER NOT NULL
        )
      `).run().catch(() => {});

      // Notification Templates Table
      await this.db.prepare(`
        CREATE TABLE IF NOT EXISTS notification_templates (
          id TEXT PRIMARY KEY,
          profile_id TEXT NOT NULL DEFAULT 'random',
          type TEXT NOT NULL DEFAULT 'text',
          message_text TEXT NOT NULL,
          image_url TEXT,
          created_at INTEGER NOT NULL
        )
      `).run().catch(() => {});

      // Uploaded Images Table
      await this.db.prepare(`
        CREATE TABLE IF NOT EXISTS uploaded_images (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          mime_type TEXT NOT NULL,
          created_at INTEGER NOT NULL
        )
      `).run().catch(() => {});

      // Real-Time Stats Events Table
      await this.db.prepare(`
        CREATE TABLE IF NOT EXISTS stats_events (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          source TEXT NOT NULL,
          client_id TEXT NOT NULL,
          page_slug TEXT,
          date_key TEXT NOT NULL,
          created_at INTEGER NOT NULL
        )
      `).run().catch(() => {});

      // Real-Time Active Sessions Table (for 2-minute live online users tracking)
      await this.db.prepare(`
        CREATE TABLE IF NOT EXISTS active_sessions (
          client_id TEXT PRIMARY KEY,
          source TEXT NOT NULL,
          last_seen INTEGER NOT NULL
        )
      `).run().catch(() => {});

      await this.db.prepare('CREATE INDEX IF NOT EXISTS idx_stats_type_date ON stats_events(type, date_key)').run().catch(() => {});
      await this.db.prepare('CREATE INDEX IF NOT EXISTS idx_stats_created ON stats_events(created_at)').run().catch(() => {});
      await this.db.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON active_sessions(last_seen)').run().catch(() => {});

      // Auto-seed global app config if not present
      const existingConfig = await this.db.prepare('SELECT id FROM app_config WHERE id = ?').bind('global').first().catch(() => null);
      if (!existingConfig) {
        await this.db.prepare(`
          INSERT INTO app_config (id, notifications_enabled, min_interval_minutes, max_interval_minutes, quiet_hours_start, quiet_hours_end, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind('global', 1, 30, 180, 23, 7, Date.now()).run().catch(() => {});
      }

      // Auto-seed notification templates if empty
      const templatesCount = await this.db.prepare('SELECT COUNT(*) as count FROM notification_templates').first().catch(() => null);
      if (!templatesCount || templatesCount.count === 0) {
        const defaults = [
          {
            id: 'tpl-1',
            profileId: 'random',
            type: 'text',
            messageText: 'I just woke up thinking of you... ❤️ Reply when you are free!'
          },
          {
            id: 'tpl-2',
            profileId: 'random',
            type: 'image_text',
            messageText: 'I took this sweet photo just for you... do you like it? 📸✨',
            imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
          },
          {
            id: 'tpl-3',
            profileId: 'random',
            type: 'text',
            messageText: 'Hey stranger! Don\'t leave me hanging today 😉 Tap to chat!'
          },
          {
            id: 'tpl-4',
            profileId: 'random',
            type: 'image_text',
            messageText: 'Look at my new outfit today! What do you think? 🔥💋',
            imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
          }
        ];
        for (const tpl of defaults) {
          await this.db.prepare(`
            INSERT INTO notification_templates (id, profile_id, type, message_text, image_url, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(tpl.id, tpl.profileId, tpl.type, tpl.messageText, tpl.imageUrl || null, Date.now()).run().catch(() => {});
        }
      }

      const user = await this.db.prepare('SELECT id FROM admin_users LIMIT 1').first();
      if (!user) {
        const { hashPassword } = await import('./auth.js');
        const { hash, salt } = await hashPassword(defaultPassword);
        const id = crypto.randomUUID();
        const now = Date.now();
        await this.db.prepare(
          'INSERT INTO admin_users (id, username, password_hash, salt, created_at) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, defaultUsername, hash, salt, now).run();
        console.log(`Created default admin user: ${defaultUsername}`);
      }
    } catch (err) {
      console.warn('ensureAdminUser warning (schema might not be run yet):', err.message);
    }
  }

  // --- Auth & Sessions ---
  async getUserByUsername(username) {
    return await this.db.prepare('SELECT * FROM admin_users WHERE username = ?').bind(username).first();
  }

  async createSession(userId, ttlHours = 72) {
    const { generateToken } = await import('./auth.js');
    const token = generateToken(32);
    const id = crypto.randomUUID();
    const now = Date.now();
    const expiresAt = now + (ttlHours * 60 * 60 * 1000);

    await this.db.prepare(
      'INSERT INTO admin_sessions (id, user_id, token, expires_at, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, userId, token, expiresAt, now).run();

    return { token, expiresAt };
  }

  async validateSession(token) {
    if (!token) return null;
    const now = Date.now();
    const session = await this.db.prepare(
      'SELECT s.*, u.username FROM admin_sessions s JOIN admin_users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > ?'
    ).bind(token, now).first();

    return session || null;
  }

  async deleteSession(token) {
    if (!token) return;
    await this.db.prepare('DELETE FROM admin_sessions WHERE token = ?').bind(token).run();
  }

  // --- Pages (CRUD & KV Caching) ---
  async getPageBySubdomain(subdomain) {
    const cleanSub = subdomain.toLowerCase().trim();
    const cacheKey = `page:${cleanSub}`;

    // 1. Try KV Edge Cache first for free, millisecond responses
    if (this.kv) {
      try {
        const cached = await this.kv.get(cacheKey, 'json');
        if (cached) return cached;
      } catch (e) {
        console.warn('KV read error:', e.message);
      }
    }

    // 2. Query Cloudflare D1
    const page = await this.db.prepare(
      'SELECT * FROM pages WHERE LOWER(subdomain) = ?'
    ).bind(cleanSub).first();

    if (page && this.kv) {
      try {
        // Cache in KV for 1 hour (auto-invalidated on edits)
        await this.kv.put(cacheKey, JSON.stringify(page), { expirationTtl: 3600 });
      } catch (e) {
        console.warn('KV put error:', e.message);
      }
    }

    return page || null;
  }

  async getAllPages() {
    const { results } = await this.db.prepare(
      'SELECT * FROM pages ORDER BY updated_at DESC'
    ).all();
    return results || [];
  }

  async createPage(data) {
    const id = crypto.randomUUID();
    const now = Date.now();
    const cleanSub = (data.subdomain || '').toLowerCase().trim();

    const adPopunder = data.ad_popunder_enabled !== undefined ? (Number(data.ad_popunder_enabled) ? 1 : 0) : 0;
    const adSocialbar = data.ad_socialbar_enabled !== undefined ? (Number(data.ad_socialbar_enabled) ? 1 : 0) : 0;
    const appDownloadEnabled = data.app_download_enabled !== undefined ? (Number(data.app_download_enabled) ? 1 : 0) : 1;
    const apkDownloadUrl = data.apk_download_url !== undefined && data.apk_download_url !== null && data.apk_download_url !== '' ? data.apk_download_url.trim() : '/app.apk';
    const chatMediaJson = typeof data.chat_media_json === 'string' ? data.chat_media_json : JSON.stringify(data.chat_media_json || data.chatMedia || []);
    const unlockMediaJson = typeof data.unlock_media_json === 'string' ? data.unlock_media_json : JSON.stringify(data.unlock_media_json || data.unlockMedia || []);
    const quizPhotosJson = typeof data.quiz_photos_json === 'string' ? data.quiz_photos_json : JSON.stringify(data.quiz_photos_json || data.quizPhotos || []);

    await this.db.prepare(`
      INSERT INTO pages (
        id, subdomain, title, status, persona_name, avatar_url, chat_message,
        typing_delay_ms, routing_mode, routing_target, fallback_url, cta_buttons_json,
        og_title, og_description, og_image, theme_accent,
        ad_popunder_enabled, ad_socialbar_enabled, ad_popunder_code, ad_socialbar_code,
        monetag_direct_link, ad_url, ad_popunder, ad_socialbar,
        app_download_enabled, apk_download_url,
        chat_media_json, unlock_media_json, quiz_photos_json,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      cleanSub,
      data.title || `${data.persona_name || 'Profile'} Page`,
      data.status || 'published',
      data.persona_name || 'Nethmi',
      data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      data.chat_message || 'Hey there! ❤️ Thanks for visiting my page.',
      Number(data.typing_delay_ms) || 1500,
      data.routing_mode || 'direct',
      data.routing_target || 'https://example.com',
      data.fallback_url || 'https://example.com',
      typeof data.cta_buttons_json === 'string' ? data.cta_buttons_json : JSON.stringify(data.cta_buttons_json || []),
      data.og_title || `${data.persona_name || 'Influencer'} ✨ - Online Now`,
      data.og_description || 'Check out my official profile and links.',
      data.og_image || data.avatar_url || '',
      data.theme_accent || '#e91e63',
      adPopunder,
      adSocialbar,
      data.ad_popunder || data.ad_popunder_code || null,
      data.ad_socialbar || data.ad_socialbar_code || null,
      data.monetag_direct_link || null,
      data.ad_url || null,
      data.ad_popunder || data.ad_popunder_code || null,
      data.ad_socialbar || data.ad_socialbar_code || null,
      appDownloadEnabled,
      apkDownloadUrl,
      chatMediaJson,
      unlockMediaJson,
      quizPhotosJson,
      now,
      now
    ).run();

    // Invalidate KV
    if (this.kv) {
      await this.kv.delete(`page:${cleanSub}`).catch(() => {});
    }

    return await this.getPageBySubdomain(cleanSub);
  }

  async updatePage(id, data) {
    const now = Date.now();
    const existing = await this.db.prepare('SELECT * FROM pages WHERE id = ?').bind(id).first();
    if (!existing) return null;

    const cleanSub = (data.subdomain || existing.subdomain).toLowerCase().trim();

    const adPopunder = data.ad_popunder_enabled !== undefined ? (Number(data.ad_popunder_enabled) ? 1 : 0) : existing.ad_popunder_enabled;
    const adSocialbar = data.ad_socialbar_enabled !== undefined ? (Number(data.ad_socialbar_enabled) ? 1 : 0) : existing.ad_socialbar_enabled;
    const appDownloadEnabled = data.app_download_enabled !== undefined ? (Number(data.app_download_enabled) ? 1 : 0) : (existing.app_download_enabled !== undefined ? existing.app_download_enabled : 1);
    const apkDownloadUrl = data.apk_download_url !== undefined ? (data.apk_download_url ? data.apk_download_url.trim() : '/app.apk') : (existing.apk_download_url || '/app.apk');
    const chatMediaJson = data.chat_media_json !== undefined ? (typeof data.chat_media_json === 'string' ? data.chat_media_json : JSON.stringify(data.chat_media_json)) : (data.chatMedia !== undefined ? JSON.stringify(data.chatMedia) : (existing.chat_media_json || '[]'));
    const unlockMediaJson = data.unlock_media_json !== undefined ? (typeof data.unlock_media_json === 'string' ? data.unlock_media_json : JSON.stringify(data.unlock_media_json)) : (data.unlockMedia !== undefined ? JSON.stringify(data.unlockMedia) : (existing.unlock_media_json || '[]'));
    const quizPhotosJson = data.quiz_photos_json !== undefined ? (typeof data.quiz_photos_json === 'string' ? data.quiz_photos_json : JSON.stringify(data.quiz_photos_json)) : (data.quizPhotos !== undefined ? JSON.stringify(data.quizPhotos) : (existing.quiz_photos_json || '[]'));

    await this.db.prepare(`
      UPDATE pages SET
        subdomain = ?,
        title = ?,
        status = ?,
        persona_name = ?,
        avatar_url = ?,
        chat_message = ?,
        typing_delay_ms = ?,
        routing_mode = ?,
        routing_target = ?,
        fallback_url = ?,
        cta_buttons_json = ?,
        og_title = ?,
        og_description = ?,
        og_image = ?,
        theme_accent = ?,
        ad_popunder_enabled = ?,
        ad_socialbar_enabled = ?,
        ad_popunder_code = ?,
        ad_socialbar_code = ?,
        monetag_direct_link = ?,
        ad_url = ?,
        ad_popunder = ?,
        ad_socialbar = ?,
        app_download_enabled = ?,
        apk_download_url = ?,
        chat_media_json = ?,
        unlock_media_json = ?,
        quiz_photos_json = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
      cleanSub,
      data.title ?? existing.title,
      data.status ?? existing.status,
      data.persona_name ?? existing.persona_name,
      data.avatar_url ?? existing.avatar_url,
      data.chat_message ?? existing.chat_message,
      Number(data.typing_delay_ms) || existing.typing_delay_ms,
      data.routing_mode ?? existing.routing_mode,
      data.routing_target ?? existing.routing_target,
      data.fallback_url ?? existing.fallback_url,
      typeof data.cta_buttons_json === 'string' ? data.cta_buttons_json : JSON.stringify(data.cta_buttons_json || []),
      data.og_title ?? existing.og_title,
      data.og_description ?? existing.og_description,
      data.og_image ?? existing.og_image,
      data.theme_accent ?? existing.theme_accent,
      adPopunder ?? 1,
      adSocialbar ?? 1,
      data.ad_popunder !== undefined ? data.ad_popunder : (data.ad_popunder_code !== undefined ? data.ad_popunder_code : existing.ad_popunder_code),
      data.ad_socialbar !== undefined ? data.ad_socialbar : (data.ad_socialbar_code !== undefined ? data.ad_socialbar_code : existing.ad_socialbar_code),
      data.monetag_direct_link !== undefined ? data.monetag_direct_link : existing.monetag_direct_link,
      data.ad_url !== undefined ? data.ad_url : existing.ad_url,
      data.ad_popunder !== undefined ? data.ad_popunder : (data.ad_popunder_code !== undefined ? data.ad_popunder_code : existing.ad_popunder),
      data.ad_socialbar !== undefined ? data.ad_socialbar : (data.ad_socialbar_code !== undefined ? data.ad_socialbar_code : existing.ad_socialbar),
      appDownloadEnabled,
      apkDownloadUrl,
      chatMediaJson,
      unlockMediaJson,
      quizPhotosJson,
      now,
      id
    ).run();

    // Invalidate KV for both old and new subdomains
    if (this.kv) {
      await this.kv.delete(`page:${existing.subdomain}`).catch(() => {});
      await this.kv.delete(`page:${cleanSub}`).catch(() => {});
    }

    return await this.getPageBySubdomain(cleanSub);
  }

  async deletePage(id) {
    const existing = await this.db.prepare('SELECT subdomain FROM pages WHERE id = ?').bind(id).first();
    if (existing) {
      if (this.kv) {
        await this.kv.delete(`page:${existing.subdomain}`).catch(() => {});
      }
      await this.db.prepare('DELETE FROM pages WHERE id = ?').bind(id).run();
      await this.db.prepare('DELETE FROM analytics_events WHERE page_id = ?').bind(id).run();
      return true;
    }
    return false;
  }

  // --- Analytics Tracking & Aggregation ---
  async trackEvent(payload) {
    const id = crypto.randomUUID();
    const now = Date.now();
    const visitorHash = await generateVisitorHash(payload.ip, payload.userAgent);

    await this.db.prepare(`
      INSERT INTO analytics_events (
        id, page_id, subdomain, event_type, cta_label, referrer, device_type, platform, visitor_hash, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      payload.pageId,
      payload.subdomain,
      payload.eventType, // 'page_view' | 'cta_click'
      payload.ctaLabel || null,
      payload.referrer ? payload.referrer.slice(0, 255) : 'direct',
      payload.deviceType || 'mobile',
      payload.platform || 'other',
      visitorHash,
      now
    ).run();
  }

  async getPageAnalytics(pageId) {
    // Total Page Views
    const viewsRow = await this.db.prepare(
      "SELECT COUNT(*) as count FROM analytics_events WHERE page_id = ? AND event_type = 'page_view'"
    ).bind(pageId).first();

    // Unique Visitors
    const visitorsRow = await this.db.prepare(
      "SELECT COUNT(DISTINCT visitor_hash) as count FROM analytics_events WHERE page_id = ? AND event_type = 'page_view'"
    ).bind(pageId).first();

    // Total CTA Clicks
    const clicksRow = await this.db.prepare(
      "SELECT COUNT(*) as count FROM analytics_events WHERE page_id = ? AND event_type = 'cta_click'"
    ).bind(pageId).first();

    // Top Referrers
    const { results: referrers } = await this.db.prepare(`
      SELECT referrer, COUNT(*) as count 
      FROM analytics_events 
      WHERE page_id = ? 
      GROUP BY referrer 
      ORDER BY count DESC 
      LIMIT 10
    `).bind(pageId).all();

    // Platforms / Devices
    const { results: platforms } = await this.db.prepare(`
      SELECT platform, COUNT(*) as count 
      FROM analytics_events 
      WHERE page_id = ? 
      GROUP BY platform 
      ORDER BY count DESC 
      LIMIT 10
    `).bind(pageId).all();

    // CTA Button Performance
    const { results: ctaStats } = await this.db.prepare(`
      SELECT cta_label, COUNT(*) as count 
      FROM analytics_events 
      WHERE page_id = ? AND event_type = 'cta_click'
      GROUP BY cta_label 
      ORDER BY count DESC
    `).bind(pageId).all();

    const views = viewsRow?.count || 0;
    const clicks = clicksRow?.count || 0;
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : 0;

    return {
      views,
      uniqueVisitors: visitorsRow?.count || 0,
      clicks,
      ctr: `${ctr}%`,
      referrers: referrers || [],
      platforms: platforms || [],
      ctaStats: ctaStats || []
    };
  }

  async getGlobalAnalytics() {
    const totalViews = await this.db.prepare(
      "SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view'"
    ).first();

    const totalClicks = await this.db.prepare(
      "SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'cta_click'"
    ).first();

    const totalVisitors = await this.db.prepare(
      "SELECT COUNT(DISTINCT visitor_hash) as count FROM analytics_events WHERE event_type = 'page_view'"
    ).first();

    const views = totalViews?.count || 0;
    const clicks = totalClicks?.count || 0;
    const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : 0;

    return {
      views,
      clicks,
      uniqueVisitors: totalVisitors?.count || 0,
      ctr: `${ctr}%`
    };
  }

  // --- Remote App Management & Notification System ---

  async getAppConfig() {
    try {
      const row = await this.db.prepare('SELECT * FROM app_config WHERE id = ?').bind('global').first();
      let defaultQuizPhotos = [];
      if (row && row.default_quiz_photos_json) {
        try {
          defaultQuizPhotos = JSON.parse(row.default_quiz_photos_json);
        } catch (_) {}
      }
      if (!Array.isArray(defaultQuizPhotos) || defaultQuizPhotos.length === 0) {
        defaultQuizPhotos = [
          { slot: 1, label: 'Photo 1', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
          { slot: 2, label: 'Photo 2', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
          { slot: 3, label: 'Photo 3', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' }
        ];
      }

      if (!row) {
        return {
          notificationsEnabled: true,
          minIntervalMinutes: 30,
          maxIntervalMinutes: 180,
          quietHoursStart: 23,
          quietHoursEnd: 7,
          defaultQuizPhotos
        };
      }
      return {
        notificationsEnabled: row.notifications_enabled === 1,
        minIntervalMinutes: Number(row.min_interval_minutes) || 30,
        maxIntervalMinutes: Number(row.max_interval_minutes) || 180,
        quietHoursStart: Number(row.quiet_hours_start) ?? 23,
        quietHoursEnd: Number(row.quiet_hours_end) ?? 7,
        defaultQuizPhotos
      };
    } catch (_) {
      return {
        notificationsEnabled: true,
        minIntervalMinutes: 30,
        maxIntervalMinutes: 180,
        quietHoursStart: 23,
        quietHoursEnd: 7,
        defaultQuizPhotos: [
          { slot: 1, label: 'Photo 1', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
          { slot: 2, label: 'Photo 2', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
          { slot: 3, label: 'Photo 3', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' }
        ]
      };
    }
  }

  async updateAppConfig(data) {
    const notificationsEnabled = data.notificationsEnabled !== undefined ? (data.notificationsEnabled ? 1 : 0) : 1;
    const minIntervalMinutes = Number(data.minIntervalMinutes) || 30;
    const maxIntervalMinutes = Number(data.maxIntervalMinutes) || 180;
    const quietHoursStart = data.quietHoursStart !== undefined ? Number(data.quietHoursStart) : 23;
    const quietHoursEnd = data.quietHoursEnd !== undefined ? Number(data.quietHoursEnd) : 7;
    const defaultQuizPhotosJson = data.defaultQuizPhotos !== undefined
      ? (typeof data.defaultQuizPhotos === 'string' ? data.defaultQuizPhotos : JSON.stringify(data.defaultQuizPhotos))
      : (data.default_quiz_photos_json !== undefined ? data.default_quiz_photos_json : undefined);
    const now = Date.now();

    if (defaultQuizPhotosJson !== undefined) {
      await this.db.prepare(`
        INSERT INTO app_config (id, notifications_enabled, min_interval_minutes, max_interval_minutes, quiet_hours_start, quiet_hours_end, default_quiz_photos_json, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          notifications_enabled = excluded.notifications_enabled,
          min_interval_minutes = excluded.min_interval_minutes,
          max_interval_minutes = excluded.max_interval_minutes,
          quiet_hours_start = excluded.quiet_hours_start,
          quiet_hours_end = excluded.quiet_hours_end,
          default_quiz_photos_json = excluded.default_quiz_photos_json,
          updated_at = excluded.updated_at
      `).bind('global', notificationsEnabled, minIntervalMinutes, maxIntervalMinutes, quietHoursStart, quietHoursEnd, defaultQuizPhotosJson, now).run();
    } else {
      await this.db.prepare(`
        INSERT INTO app_config (id, notifications_enabled, min_interval_minutes, max_interval_minutes, quiet_hours_start, quiet_hours_end, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          notifications_enabled = excluded.notifications_enabled,
          min_interval_minutes = excluded.min_interval_minutes,
          max_interval_minutes = excluded.max_interval_minutes,
          quiet_hours_start = excluded.quiet_hours_start,
          quiet_hours_end = excluded.quiet_hours_end,
          updated_at = excluded.updated_at
      `).bind('global', notificationsEnabled, minIntervalMinutes, maxIntervalMinutes, quietHoursStart, quietHoursEnd, now).run();
    }

    return await this.getAppConfig();
  }

  async getQuizPhotos(profileId = 'default') {
    const defaultFallback = [
      { slot: 1, label: 'Photo 1', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
      { slot: 2, label: 'Photo 2', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
      { slot: 3, label: 'Photo 3', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' }
    ];

    if (!profileId || profileId === 'default' || profileId === 'global') {
      const cfg = await this.getAppConfig();
      return Array.isArray(cfg.defaultQuizPhotos) && cfg.defaultQuizPhotos.length > 0
        ? cfg.defaultQuizPhotos
        : defaultFallback;
    }

    // Try finding page by id or subdomain
    let page = await this.db.prepare('SELECT * FROM pages WHERE id = ?').bind(profileId).first().catch(() => null);
    if (!page) {
      page = await this.db.prepare('SELECT * FROM pages WHERE LOWER(subdomain) = ?').bind(profileId.toLowerCase()).first().catch(() => null);
    }

    if (page && page.quiz_photos_json) {
      try {
        const parsed = JSON.parse(page.quiz_photos_json);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure all 3 slots exist
          return [1, 2, 3].map(slot => {
            const existingSlot = parsed.find(p => Number(p.slot) === slot);
            if (existingSlot && existingSlot.imageUrl) return existingSlot;
            const defSlot = defaultFallback.find(p => p.slot === slot);
            return {
              slot,
              label: `Photo ${slot}`,
              imageUrl: slot === 1 ? (page.avatar_url || defSlot.imageUrl) : defSlot.imageUrl
            };
          });
        }
      } catch (_) {}
    }

    // Fallback: inherit slot 1 from profile avatar if available, otherwise global default
    const globalConfig = await this.getAppConfig();
    const globalDefault = globalConfig.defaultQuizPhotos || defaultFallback;
    return [1, 2, 3].map(slot => {
      const def = globalDefault.find(p => p.slot === slot) || defaultFallback[slot - 1];
      return {
        slot,
        label: `Photo ${slot}`,
        imageUrl: (slot === 1 && page && page.avatar_url) ? page.avatar_url : def.imageUrl
      };
    });
  }

  async saveQuizPhotos(profileId, quizPhotos) {
    const formatted = [1, 2, 3].map(slot => {
      const item = Array.isArray(quizPhotos) ? quizPhotos.find(p => Number(p.slot) === slot) : null;
      return {
        slot,
        label: `Photo ${slot}`,
        imageUrl: item?.imageUrl || ''
      };
    });
    const photosJson = JSON.stringify(formatted);

    if (!profileId || profileId === 'default' || profileId === 'global') {
      await this.db.prepare(`
        INSERT INTO app_config (id, default_quiz_photos_json, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          default_quiz_photos_json = excluded.default_quiz_photos_json,
          updated_at = excluded.updated_at
      `).bind('global', photosJson, Date.now()).run();

      if (this.kv) {
        await this.kv.put('app:quiz_photos:default', photosJson).catch(() => {});
      }
      return formatted;
    }

    // Find target page
    let page = await this.db.prepare('SELECT * FROM pages WHERE id = ?').bind(profileId).first().catch(() => null);
    if (!page) {
      page = await this.db.prepare('SELECT * FROM pages WHERE LOWER(subdomain) = ?').bind(profileId.toLowerCase()).first().catch(() => null);
    }

    if (page) {
      await this.db.prepare('UPDATE pages SET quiz_photos_json = ?, updated_at = ? WHERE id = ?')
        .bind(photosJson, Date.now(), page.id).run();
      if (this.kv) {
        await this.kv.delete(`page:${page.subdomain.toLowerCase()}`).catch(() => {});
      }
    }

    return formatted;
  }

  async getNotificationTemplates() {
    try {
      const { results } = await this.db.prepare('SELECT * FROM notification_templates ORDER BY created_at DESC').all();
      return (results || []).map(r => ({
        id: r.id,
        profileId: r.profile_id || 'random',
        type: r.type || 'text',
        messageText: r.message_text,
        imageUrl: r.image_url || null,
        createdAt: r.created_at
      }));
    } catch (_) {
      return [];
    }
  }

  async createNotificationTemplate(data) {
    const id = crypto.randomUUID();
    const profileId = data.profileId || 'random';
    const type = data.type === 'image_text' ? 'image_text' : 'text';
    const messageText = data.messageText || 'Hey there! ❤️';
    const imageUrl = type === 'image_text' ? (data.imageUrl || null) : null;
    const now = Date.now();

    await this.db.prepare(`
      INSERT INTO notification_templates (id, profile_id, type, message_text, image_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, profileId, type, messageText, imageUrl, now).run();

    return { id, profileId, type, messageText, imageUrl, createdAt: now };
  }

  async deleteNotificationTemplate(id) {
    await this.db.prepare('DELETE FROM notification_templates WHERE id = ?').bind(id).run();
    return true;
  }

  async updatePageAppVisibility(id, { isVisibleInApp, isPinned }) {
    const existing = await this.db.prepare('SELECT * FROM pages WHERE id = ?').bind(id).first();
    if (!existing) return null;

    const visibleVal = isVisibleInApp !== undefined ? (isVisibleInApp ? 1 : 0) : (existing.is_visible_in_app !== undefined ? existing.is_visible_in_app : 1);
    const pinnedVal = isPinned !== undefined ? (isPinned ? 1 : 0) : (existing.is_pinned !== undefined ? existing.is_pinned : 0);

    await this.db.prepare('UPDATE pages SET is_visible_in_app = ?, is_pinned = ?, updated_at = ? WHERE id = ?')
      .bind(visibleVal, pinnedVal, Date.now(), id).run();

    if (this.kv) {
      await this.kv.delete(`page:${existing.subdomain}`).catch(() => {});
    }
    return await this.getPageBySubdomain(existing.subdomain);
  }

  async saveUploadedImage(base64Data, mimeType = 'image/jpeg') {
    const id = crypto.randomUUID();
    const now = Date.now();
    await this.db.prepare('INSERT INTO uploaded_images (id, data, mime_type, created_at) VALUES (?, ?, ?, ?)')
      .bind(id, base64Data, mimeType, now).run();
    return id;
  }

  async getUploadedImage(id) {
    return await this.db.prepare('SELECT * FROM uploaded_images WHERE id = ?').bind(id).first();
  }

  // --- Manual Media Upload & Serving (Images & Videos without R2) ---
  async saveUploadedMedia({ id, contentType, mediaType, size, arrayBuffer, base64Data }) {
    const mediaId = id || crypto.randomUUID();
    const now = Date.now();

    // 1. Store binary and metadata in Cloudflare KV (supports up to 25MB per key)
    if (this.kv) {
      if (arrayBuffer) {
        await this.kv.put(`media:data:${mediaId}`, arrayBuffer);
      } else if (base64Data) {
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        await this.kv.put(`media:data:${mediaId}`, bytes.buffer);
      }
      await this.kv.put(`media:meta:${mediaId}`, JSON.stringify({
        contentType,
        mediaType,
        size,
        createdAt: now
      }));
    }

    // 2. Index in D1 table uploaded_media (storing small base64 inline for D1 resilience)
    const storeD1Data = (size < 600000 && base64Data) ? base64Data : null;
    await this.db.prepare(`
      INSERT INTO uploaded_media (id, content_type, media_type, size, data, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(mediaId, contentType, mediaType, size, storeD1Data, now).run().catch(() => {});

    return { id: mediaId, contentType, mediaType, size };
  }

  async getUploadedMedia(id) {
    let meta = null;
    let data = null;

    // 1. Try reading from KV
    if (this.kv) {
      const metaStr = await this.kv.get(`media:meta:${id}`);
      if (metaStr) {
        try {
          meta = JSON.parse(metaStr);
        } catch (_) {}
        data = await this.kv.get(`media:data:${id}`, { type: 'arrayBuffer' });
      }
    }

    // 2. Fallback to D1
    if (!data) {
      const row = await this.db.prepare('SELECT * FROM uploaded_media WHERE id = ?').bind(id).first();
      if (row) {
        meta = {
          contentType: row.content_type,
          mediaType: row.media_type,
          size: row.size,
          createdAt: row.created_at
        };
        if (row.data) {
          const binary = atob(row.data);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          data = bytes.buffer;
        }
      }
    }

    return { meta, data };
  }

  // --- Real-Time Live Stats & Event Tracking ---
  async trackStatsEvent({ type, clientId, source = 'web', pageSlug = null, ip = '', userAgent = '' }) {
    const validTypes = ['visit', 'download', 'app_install', 'heartbeat'];
    const eventType = validTypes.includes(type) ? type : 'visit';
    const eventSource = source === 'app' ? 'app' : 'web';
    const now = Date.now();
    const dateKey = new Date(now).toISOString().slice(0, 10);
    const id = crypto.randomUUID();

    let finalClientId = clientId && typeof clientId === 'string' && clientId.trim().length > 0
      ? clientId.trim()
      : null;

    if (!finalClientId) {
      finalClientId = await generateVisitorHash(ip, userAgent);
    }

    // 1. Update active session for 2-minute live online users tracking
    await this.db.prepare(`
      INSERT INTO active_sessions (client_id, source, last_seen)
      VALUES (?, ?, ?)
      ON CONFLICT(client_id) DO UPDATE SET source = excluded.source, last_seen = excluded.last_seen
    `).bind(finalClientId, eventSource, now).run().catch(() => {});

    // Update Cloudflare KV TTL if available
    if (this.kv) {
      await this.kv.put(`online:${eventSource}:${finalClientId}`, String(now), { expirationTtl: 120 }).catch(() => {});
    }

    // Heartbeats only update active_sessions / KV, not saved to event logs
    if (eventType === 'heartbeat') {
      return { ok: true, type: eventType, clientId: finalClientId };
    }

    // 2. Prevent rapid duplicate download spam from same clientId within 2 minutes
    if (eventType === 'download') {
      const recent = await this.db.prepare(`
        SELECT id FROM stats_events 
        WHERE type = 'download' AND client_id = ? AND created_at >= ? 
        LIMIT 1
      `).bind(finalClientId, now - 120000).first().catch(() => null);

      if (recent) {
        return { ok: true, deduplicated: true, type: eventType, clientId: finalClientId };
      }
    }

    // 3. Insert into stats_events
    await this.db.prepare(`
      INSERT INTO stats_events (id, type, source, client_id, page_slug, date_key, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(id, eventType, eventSource, finalClientId, pageSlug || null, dateKey, now).run().catch(() => {});

    return { ok: true, id, type: eventType, clientId: finalClientId };
  }

  async getRealtimeStats() {
    const now = Date.now();
    const activeThreshold = now - 120000; // 2 minutes (120s)
    const todayStr = new Date(now).toISOString().slice(0, 10);

    // 1. Live Online Users (broken down by web vs app)
    const activeRows = await this.db.prepare(`
      SELECT source, COUNT(*) as count 
      FROM active_sessions 
      WHERE last_seen >= ? 
      GROUP BY source
    `).bind(activeThreshold).all().catch(() => ({ results: [] }));

    let onlineWeb = 0;
    let onlineApp = 0;
    for (const row of (activeRows?.results || [])) {
      if (row.source === 'app') onlineApp = row.count || 0;
      else if (row.source === 'web') onlineWeb = row.count || 0;
    }

    // 2. Total App Downloads (including downloads & installs)
    const downloadsRow = await this.db.prepare(`
      SELECT COUNT(*) as count FROM stats_events WHERE type IN ('download', 'app_install')
    `).first().catch(() => ({ count: 0 }));
    const totalDownloads = downloadsRow?.count || 0;

    // 3. Today's Visits & Uniques
    const todayVisitsRow = await this.db.prepare(`
      SELECT COUNT(*) as count FROM stats_events WHERE type = 'visit' AND date_key = ?
    `).bind(todayStr).first().catch(() => ({ count: 0 }));

    const todayUniquesRow = await this.db.prepare(`
      SELECT COUNT(DISTINCT client_id) as count FROM stats_events WHERE type = 'visit' AND date_key = ?
    `).bind(todayStr).first().catch(() => ({ count: 0 }));

    const todayDownloadsRow = await this.db.prepare(`
      SELECT COUNT(*) as count FROM stats_events WHERE type IN ('download', 'app_install') AND date_key = ?
    `).bind(todayStr).first().catch(() => ({ count: 0 }));

    // 4. Total Visits (all-time)
    const totalVisitsRow = await this.db.prepare(`
      SELECT COUNT(*) as count FROM stats_events WHERE type = 'visit'
    `).first().catch(() => ({ count: 0 }));

    // Include legacy analytics page_view events if any exist
    const legacyViewsRow = await this.db.prepare(`
      SELECT COUNT(*) as count FROM analytics_events WHERE event_type = 'page_view'
    `).first().catch(() => ({ count: 0 }));

    const totalVisits = (totalVisitsRow?.count || 0) + (legacyViewsRow?.count || 0);

    // 5. Last 7 Days aggregation (from 6 days ago to today)
    const last7Dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      last7Dates.push(d.toISOString().slice(0, 10));
    }

    const oldestDate = last7Dates[0];
    const historyRows = await this.db.prepare(`
      SELECT date_key,
        SUM(CASE WHEN type = 'visit' THEN 1 ELSE 0 END) as visits,
        SUM(CASE WHEN type IN ('download', 'app_install') THEN 1 ELSE 0 END) as downloads
      FROM stats_events
      WHERE date_key >= ?
      GROUP BY date_key
    `).bind(oldestDate).all().catch(() => ({ results: [] }));

    const historyMap = {};
    for (const row of (historyRows?.results || [])) {
      historyMap[row.date_key] = {
        visits: Number(row.visits) || 0,
        downloads: Number(row.downloads) || 0
      };
    }

    const last7Days = last7Dates.map(date => ({
      date,
      visits: historyMap[date]?.visits || 0,
      downloads: historyMap[date]?.downloads || 0
    }));

    return {
      totalDownloads,
      onlineNow: {
        total: onlineWeb + onlineApp,
        web: onlineWeb,
        app: onlineApp
      },
      today: {
        visits: todayVisitsRow?.count || 0,
        uniqueVisitors: todayUniquesRow?.count || 0,
        downloads: todayDownloadsRow?.count || 0
      },
      totalVisits,
      last7Days
    };
  }
}

