/**
 * Cloudflare Worker Core Traffic Routing & Multi-Subdomain Engine
 */

import { DatabaseService } from './db.js';
import { verifyPassword } from './auth.js';
import { renderLandingPage, renderNotFoundPage, renderAppRedirectPage } from './templates.js';
import { renderAdminApp } from './admin_ui.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = (request.headers.get('Host') || '').toLowerCase().split(':')[0];
    const rootDomain = (env.ROOT_DOMAIN || 'careersuite.cc').toLowerCase();
    
    const db = new DatabaseService(env.DB, env.PAGE_CACHE);

    // Auto-seed admin user safely in background if table exists
    ctx.waitUntil(db.ensureAdminUser(env.ADMIN_DEFAULT_USER || 'admin'));

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCors();
    }

    // -------------------------------------------------------------
    // 1. PUBLIC ANALYTICS TRACKING BEACON
    // -------------------------------------------------------------
    if (url.pathname === '/api/analytics/track' && request.method === 'POST') {
      try {
        const payload = await request.json();
        const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
        const userAgent = request.headers.get('User-Agent') || '';
        
        ctx.waitUntil(
          db.trackEvent({
            ...payload,
            ip: clientIp,
            userAgent
          })
        );
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
      }
    }

    // -------------------------------------------------------------
    // 1.1 REAL-TIME EVENT & LIVE STATS TRACKING (Web & Mobile App)
    // -------------------------------------------------------------
    if (url.pathname === '/api/track' && request.method === 'POST') {
      try {
        const payload = await request.json();
        const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
        const userAgent = request.headers.get('User-Agent') || '';

        const result = await db.trackStatsEvent({
          ...payload,
          ip: clientIp,
          userAgent
        });

        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            ...corsHeaders()
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }
    }

    if (url.pathname === '/api/stats' && (request.method === 'GET' || request.method === 'HEAD')) {
      try {
        const stats = await db.getRealtimeStats();
        return new Response(JSON.stringify(stats), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            ...corsHeaders()
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }
    }

    // -------------------------------------------------------------
    // 1.5 PUBLIC PROFILES FEED FOR MOBILE CHAT APP
    // -------------------------------------------------------------
    if (url.pathname === '/api/app-profiles' && (request.method === 'GET' || request.method === 'HEAD')) {
      try {
        const pages = await db.getAllPages();
        const rootDomain = (env.ROOT_DOMAIN || 'careersuite.cc').toLowerCase();
        
        const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
        
        // Filter out any page where is_visible_in_app is 0 (false)
        const visiblePages = (pages || []).filter(page => page.is_visible_in_app !== 0);

        const profiles = visiblePages.map(page => {
          let avatarUrl = page.avatar_url || page.og_image || defaultAvatar;
          if (avatarUrl.startsWith('/')) {
            avatarUrl = `https://${rootDomain}${avatarUrl}`;
          }

          const directLink = page.ad_url || page.monetag_direct_link || page.routing_target || 'https://www.highperformanceformat.com/d9j8y2v4?key=adsterra_companion_link';

          let chatMedia = [];
          try {
            chatMedia = JSON.parse(page.chat_media_json || '[]');
          } catch (_) {}

          let unlockMedia = [];
          try {
            unlockMedia = JSON.parse(page.unlock_media_json || '[]');
          } catch (_) {}

          if (!Array.isArray(unlockMedia) || unlockMedia.length === 0) {
            unlockMedia = [
              {
                id: `${page.id || page.subdomain}-unlock-1`,
                url: avatarUrl,
                mediaType: 'image',
                title: 'Secret Golden Hour Selfie ✨',
                unlockType: 'free'
              },
              {
                id: `${page.id || page.subdomain}-unlock-2`,
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
                mediaType: 'image',
                title: 'Late Night Balcony View 🌙',
                unlockType: 'ad'
              },
              {
                id: `${page.id || page.subdomain}-unlock-3`,
                url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
                mediaType: 'image',
                title: 'Cozy Morning Coffee ☕',
                unlockType: 'chat'
              }
            ];
          }

          let quizPhotos = [];
          if (page.quiz_photos_json) {
            try {
              quizPhotos = JSON.parse(page.quiz_photos_json);
            } catch (_) {}
          }
          if (!Array.isArray(quizPhotos) || quizPhotos.length === 0) {
            quizPhotos = [
              { slot: 1, label: 'Photo 1', imageUrl: avatarUrl },
              { slot: 2, label: 'Photo 2', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
              { slot: 3, label: 'Photo 3', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' }
            ];
          }

          return {
            id: page.id || page.subdomain,
            slug: page.subdomain,
            name: page.persona_name || page.title || 'Sophia',
            avatarUrl: avatarUrl,
            lastMessage: page.chat_message || page.og_description || 'Hey there! Tap to chat ❤️',
            greetingMessage: page.chat_message || 'Hey there! ❤️ Nice to meet you. Thanks for stopping by!',
            systemPrompt: `You are ${page.persona_name || 'Sophia'}, a friendly, charismatic, and affectionate AI companion. Keep your messages engaging, flirtatious, sweet, and authentic. Reply in the same language the user uses.`,
            chatScript: page.chat_message || '',
            chatMedia: Array.isArray(chatMedia) ? chatMedia : [],
            unlockMedia: unlockMedia,
            quizPhotos: quizPhotos,
            isVisibleInApp: true,
            isPinned: page.is_pinned === 1,
            quizData: [
              {
                id: 1,
                title: "Secret Dream Date 🌙",
                photoUrl: avatarUrl,
                questions: [
                  {
                    question: "Where would you take me on our first date?",
                    options: ["Rooftop Cocktail Lounge 🥂", "Romantic Sunset Beach Walk 🌅", "Late Night City Drive 🚗"]
                  },
                  {
                    question: "What's your favorite late night vibe?",
                    options: ["Cozy Movie Marathon 🎬", "Deep Conversations & Wine 🍷", "Dancing Till Dawn 💃"]
                  },
                  {
                    question: "What caught your eye about me first?",
                    options: ["Your Captivating Eyes ✨", "Your Sweet Smile 😊", "Your Confident Vibe 🔥"]
                  }
                ]
              }
            ],
            adsterraDirectLink: directLink,
            themeAccent: page.theme_accent || '#FF3366',
            typingDelayMs: page.typing_delay_ms || 1200,
            isOnline: true,
            updatedAt: page.updated_at ? new Date(page.updated_at).toISOString() : new Date().toISOString()
          };
        });

        // Always ensure Sophia is included if not present
        if (!profiles.some(p => p.slug === 'sophia' || p.name.toLowerCase() === 'sophia')) {
          profiles.unshift({
            id: 'sophia-official',
            slug: 'sophia',
            name: 'Sophia',
            avatarUrl: defaultAvatar,
            lastMessage: 'Chilling at home in comfy clothes, looking for a sweet chat ❤️',
            greetingMessage: 'Hey there! ❤️ Thanks for visiting my chat. What are you up to today?',
            systemPrompt: 'You are Sophia, a charming, sweet 22-year-old companion. Speak casually and warm.',
            isVisibleInApp: true,
            isPinned: true,
            chatMedia: [
              {
                id: 'sophia-chat-1',
                url: defaultAvatar,
                mediaType: 'image',
                caption: 'Just took this selfie at home for you! 🥰',
                triggerAfterMessages: 2
              }
            ],
            unlockMedia: [
              {
                id: 'sophia-unlock-1',
                url: defaultAvatar,
                mediaType: 'image',
                title: 'Secret Golden Hour Selfie ✨',
                unlockType: 'free'
              },
              {
                id: 'sophia-unlock-2',
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
                mediaType: 'image',
                title: 'Late Night Balcony View 🌙',
                unlockType: 'ad'
              },
              {
                id: 'sophia-unlock-3',
                url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
                mediaType: 'image',
                title: 'Cozy Morning Coffee ☕',
                unlockType: 'chat'
              }
            ],
            quizPhotos: [
              { slot: 1, label: 'Photo 1', imageUrl: defaultAvatar },
              { slot: 2, label: 'Photo 2', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
              { slot: 3, label: 'Photo 3', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' }
            ],
            quizData: [],
            adsterraDirectLink: 'https://www.highperformanceformat.com/d9j8y2v4?key=adsterra_companion_link',
            themeAccent: '#FF3366',
            typingDelayMs: 1200,
            isOnline: true,
            updatedAt: new Date().toISOString()
          });
        }

        // Sort pinned profiles to the top
        profiles.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

        return new Response(JSON.stringify({ ok: true, count: profiles.length, profiles }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=15, s-maxage=30',
            ...corsHeaders()
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }
    }

    // -------------------------------------------------------------
    // 1.6 REMOTE APP CONFIG & NOTIFICATION TEMPLATES (PUBLIC API)
    // -------------------------------------------------------------
    if (url.pathname === '/api/app-config' && (request.method === 'GET' || request.method === 'HEAD')) {
      try {
        const config = await db.getAppConfig();
        const templates = await db.getNotificationTemplates();
        const rootDomain = (env.ROOT_DOMAIN || 'careersuite.cc').toLowerCase();

        // Ensure full absolute image URLs for image_text templates
        const formattedTemplates = templates.map(tpl => {
          let imgUrl = tpl.imageUrl;
          if (imgUrl && imgUrl.startsWith('/')) {
            imgUrl = `https://${rootDomain}${imgUrl}`;
          }
          return {
            ...tpl,
            imageUrl: imgUrl
          };
        });

        return new Response(JSON.stringify({
          ok: true,
          ...config,
          templates: formattedTemplates
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=15, s-maxage=30',
            ...corsHeaders()
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }
    }

    // -------------------------------------------------------------
    // 1.7 PUBLIC IMAGE UPLOAD SERVING (/api/uploads/:id)
    // -------------------------------------------------------------
    if (url.pathname.startsWith('/api/uploads/') && request.method === 'GET') {
      const id = url.pathname.split('/')[3];
      const imgRow = await db.getUploadedImage(id);
      if (!imgRow) {
        return new Response('Image not found', { status: 404 });
      }

      try {
        // Strip data URL prefix if present (e.g. data:image/png;base64,...)
        let rawBase64 = imgRow.data;
        if (rawBase64.includes(',')) {
          rawBase64 = rawBase64.split(',')[1];
        }
        const binaryStr = atob(rawBase64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        return new Response(bytes, {
          headers: {
            'Content-Type': imgRow.mime_type || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
            ...corsHeaders()
          }
        });
      } catch (err) {
        return new Response('Corrupted image data', { status: 500 });
      }
    }

    // -------------------------------------------------------------
    // 1.8 R2-FREE MANUAL MEDIA UPLOAD API (Images & Videos up to 25MB via KV)
    // -------------------------------------------------------------
    if (url.pathname === '/api/media/upload' && (request.method === 'POST' || request.method === 'OPTIONS')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders() });
      }

      try {
        const contentTypeHeader = request.headers.get('Content-Type') || '';
        let fileBuffer;
        let mimeType = 'image/jpeg';
        let fileName = '';

        if (contentTypeHeader.includes('multipart/form-data')) {
          const formData = await request.formData();
          const file = formData.get('file');
          if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded in form data' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders() }
            });
          }
          fileBuffer = await file.arrayBuffer();
          mimeType = file.type || 'application/octet-stream';
          fileName = file.name || '';
        } else if (contentTypeHeader.includes('application/json')) {
          const jsonBody = await request.json();
          let rawBase64 = jsonBody.data || jsonBody.base64 || '';
          if (rawBase64.includes(',')) {
            rawBase64 = rawBase64.split(',')[1];
          }
          mimeType = jsonBody.mimeType || jsonBody.contentType || 'image/jpeg';
          fileName = jsonBody.fileName || '';
          const binaryStr = atob(rawBase64);
          const len = binaryStr.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          fileBuffer = bytes.buffer;
        } else {
          fileBuffer = await request.arrayBuffer();
          mimeType = contentTypeHeader || 'application/octet-stream';
        }

        const isVideo = mimeType.startsWith('video/') ||
          fileName.endsWith('.mp4') || fileName.endsWith('.mov') ||
          fileName.endsWith('.webm') || fileName.endsWith('.m4v');
        const mediaType = isVideo ? 'video' : 'image';
        const finalMime = mimeType && mimeType !== 'application/octet-stream'
          ? mimeType
          : (isVideo ? 'video/mp4' : 'image/jpeg');

        const mediaId = crypto.randomUUID();
        await db.saveUploadedMedia({
          id: mediaId,
          contentType: finalMime,
          mediaType,
          size: fileBuffer.byteLength,
          arrayBuffer: fileBuffer
        });

        const rootDomain = (env.ROOT_DOMAIN || 'careersuite.cc').toLowerCase();
        const originUrl = url.origin && !url.origin.includes('example.com') ? url.origin : `https://${rootDomain}`;
        const mediaUrl = `${originUrl}/api/media/${mediaId}`;

        return new Response(JSON.stringify({
          success: true,
          id: mediaId,
          url: mediaUrl,
          mediaType,
          size: fileBuffer.byteLength,
          contentType: finalMime
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }
    }

    // -------------------------------------------------------------
    // 1.9 MEDIA STREAMING WITH HTTP RANGE SUPPORT (/api/media/:id)
    // -------------------------------------------------------------
    if (url.pathname.startsWith('/api/media/') && (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders() });
      }

      const mediaId = url.pathname.replace('/api/media/', '').split('/')[0].split('?')[0];
      if (!mediaId || mediaId === 'upload') {
        return new Response('Media ID missing', { status: 400 });
      }

      const { meta, data } = await db.getUploadedMedia(mediaId);
      if (!data || !meta) {
        return new Response('Media item not found', { status: 404 });
      }

      const totalSize = data.byteLength;
      const contentType = meta.contentType || (meta.mediaType === 'video' ? 'video/mp4' : 'image/jpeg');

      // Range request support for smooth MP4 video playback in Android
      const rangeHeader = request.headers.get('Range');
      if (rangeHeader && rangeHeader.startsWith('bytes=')) {
        const parts = rangeHeader.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

        if (isNaN(start) || start >= totalSize || end >= totalSize || start > end) {
          return new Response(null, {
            status: 416,
            headers: {
              'Content-Range': `bytes */${totalSize}`,
              'Accept-Ranges': 'bytes',
              ...corsHeaders()
            }
          });
        }

        const chunk = data.slice(start, end + 1);
        return new Response(chunk, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${totalSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': String(chunk.byteLength),
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            ...corsHeaders()
          }
        });
      }

      return new Response(data, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(totalSize),
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
          ...corsHeaders()
        }
      });
    }

    // -------------------------------------------------------------
    // 2. ADMIN AUTHENTICATION API ROUTES
    // -------------------------------------------------------------
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      try {
        const { username, password } = await request.json();
        if (!username || !password) {
          return jsonResponse({ error: 'Username and password required' }, 400);
        }
        const user = await db.getUserByUsername(username);
        if (!user) {
          return jsonResponse({ error: 'Invalid username or password' }, 401);
        }
        const isValid = await verifyPassword(password, user.password_hash, user.salt);
        if (!isValid) {
          return jsonResponse({ error: 'Invalid username or password' }, 401);
        }

        const session = await db.createSession(user.id);
        return jsonResponse({ token: session.token, username: user.username });
      } catch (e) {
        return jsonResponse({ error: e.message }, 500);
      }
    }

    if (url.pathname === '/api/auth/me' && request.method === 'GET') {
      const user = await requireAuth(request, db);
      if (!user) return jsonResponse({ error: 'Unauthorized' }, 401);
      return jsonResponse({ user: { id: user.id, username: user.username } });
    }

    if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
      const token = getBearerToken(request);
      if (token) await db.deleteSession(token);
      return jsonResponse({ ok: true });
    }

    // -------------------------------------------------------------
    // 3. ADMIN MANAGEMENT API (PAGES & ANALYTICS)
    // -------------------------------------------------------------
    if (url.pathname.startsWith('/api/')) {
      const authUser = await requireAuth(request, db);
      if (!authUser) {
        return jsonResponse({ error: 'Unauthorized access' }, 401);
      }

      // GET /api/pages - List all subdomains
      if (url.pathname === '/api/pages' && request.method === 'GET') {
        const pages = await db.getAllPages();
        return jsonResponse(pages);
      }

      // POST /api/pages - Create new subdomain landing page
      if (url.pathname === '/api/pages' && request.method === 'POST') {
        try {
          const body = await request.json();
          if (!body.subdomain) {
            return jsonResponse({ error: 'Subdomain prefix is required' }, 400);
          }
          const cleanSub = body.subdomain.toLowerCase().trim();
          const existing = await db.getPageBySubdomain(cleanSub);
          if (existing) {
            return jsonResponse({ error: `Subdomain '${cleanSub}' already exists` }, 409);
          }
          const created = await db.createPage(body);
          return jsonResponse(created, 201);
        } catch (e) {
          return jsonResponse({ error: e.message }, 500);
        }
      }

      // PUT /api/pages/:id - Update landing page
      if (url.pathname.startsWith('/api/pages/') && request.method === 'PUT') {
        try {
          const id = url.pathname.split('/')[3];
          const body = await request.json();
          const updated = await db.updatePage(id, body);
          if (!updated) return jsonResponse({ error: 'Page not found' }, 404);
          return jsonResponse(updated);
        } catch (e) {
          return jsonResponse({ error: e.message }, 500);
        }
      }

      // DELETE /api/pages/:id - Delete landing page
      if (url.pathname.startsWith('/api/pages/') && request.method === 'DELETE') {
        const id = url.pathname.split('/')[3];
        const success = await db.deletePage(id);
        return jsonResponse({ ok: success });
      }

      // GET /api/analytics/:pageId - Get page statistics
      if (url.pathname.startsWith('/api/analytics/') && request.method === 'GET') {
        const pageId = url.pathname.split('/')[3];
        const stats = await db.getPageAnalytics(pageId);
        return jsonResponse(stats);
      }

      // GET /api/admin/overview - Global dashboard totals
      if (url.pathname === '/api/admin/overview' && request.method === 'GET') {
        const stats = await db.getGlobalAnalytics();
        return jsonResponse(stats);
      }

      // -------------------------------------------------------------
      // APP MANAGER ADMIN ENDPOINTS
      // -------------------------------------------------------------
      // GET /api/admin/app-manager - Retrieve app config, templates, and landing pages
      if (url.pathname === '/api/admin/app-manager' && request.method === 'GET') {
        const config = await db.getAppConfig();
        const templates = await db.getNotificationTemplates();
        const pages = await db.getAllPages();
        return jsonResponse({ ok: true, config, templates, pages });
      }

      // POST /api/admin/app-config - Update global random notification settings
      if (url.pathname === '/api/admin/app-config' && request.method === 'POST') {
        const body = await request.json();
        const updated = await db.updateAppConfig(body);
        return jsonResponse({ ok: true, config: updated });
      }

      // PUT /api/admin/app-profiles/:id - Update isVisibleInApp and isPinned
      if (url.pathname.startsWith('/api/admin/app-profiles/') && request.method === 'PUT') {
        const id = url.pathname.split('/')[4];
        const body = await request.json();
        const updated = await db.updatePageAppVisibility(id, body);
        return jsonResponse({ ok: true, page: updated });
      }

      // POST /api/admin/notification-templates - Add notification template
      if (url.pathname === '/api/admin/notification-templates' && request.method === 'POST') {
        const body = await request.json();
        const created = await db.createNotificationTemplate(body);
        return jsonResponse({ ok: true, template: created }, 201);
      }

      // DELETE /api/admin/notification-templates/:id - Delete notification template
      if (url.pathname.startsWith('/api/admin/notification-templates/') && request.method === 'DELETE') {
        const id = url.pathname.split('/')[4];
        await db.deleteNotificationTemplate(id);
        return jsonResponse({ ok: true });
      }

      // POST /api/admin/upload-image - Upload image for image_text notification template
      if (url.pathname === '/api/admin/upload-image' && request.method === 'POST') {
        const body = await request.json();
        if (!body.data) return jsonResponse({ error: 'Image data is required' }, 400);
        const imageId = await db.saveUploadedImage(body.data, body.mimeType || 'image/jpeg');
        const imageUrl = `https://${rootDomain}/api/uploads/${imageId}`;
        return jsonResponse({ ok: true, id: imageId, imageUrl });
      }

      // GET /api/admin/quiz-photos - Get 3 unlockable quiz photos for profile or default
      if (url.pathname === '/api/admin/quiz-photos' && request.method === 'GET') {
        const profileId = url.searchParams.get('profileId') || 'default';
        const quizPhotos = await db.getQuizPhotos(profileId);
        return jsonResponse({ ok: true, profileId, quizPhotos });
      }

      // PUT /api/admin/quiz-photos - Save 3 unlockable quiz photos for profile or default
      if (url.pathname === '/api/admin/quiz-photos' && request.method === 'PUT') {
        const body = await request.json();
        const profileId = body.profileId || 'default';
        const quizPhotos = body.quizPhotos || [];
        const saved = await db.saveQuizPhotos(profileId, quizPhotos);
        return jsonResponse({ ok: true, profileId, quizPhotos: saved });
      }
    }

    // -------------------------------------------------------------
    // 4. SUBDOMAIN RESOLUTION & SPECIAL ROUTING
    // -------------------------------------------------------------
    let subdomain = url.searchParams.get('subdomain') || extractSubdomain(host, rootDomain);

    // -------------------------------------------------------------
    // 5. ADMIN DASHBOARD ROUTE (admin.careersuite.cc or /admin path)
    // -------------------------------------------------------------
    const isAdminHost = host === `admin.${rootDomain}` || host.startsWith('admin.');
    const isAdminPath = url.pathname === '/admin' || url.pathname.startsWith('/admin/');

    if (!url.searchParams.has('subdomain') && (isAdminHost || isAdminPath)) {
      return new Response(renderAdminApp(rootDomain), {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    // -------------------------------------------------------------
    // 6. WWW DOMAIN HANDLING (Redirect www.careersuite.cc -> https://careersuite.cc)
    // -------------------------------------------------------------
    if (host === `www.${rootDomain}`) {
      return Response.redirect(`https://${rootDomain}${url.pathname}${url.search}`, 301);
    }

    // -------------------------------------------------------------
    // 6.5 DIRECT ANDROID APK DOWNLOAD ROUTE (Apex & All Subdomains)
    // -------------------------------------------------------------
    if (url.pathname === '/app.apk') {
      const pagesUrl = new URL('https://companion-live.pages.dev/app.apk');
      const pagesHeaders = new Headers(request.headers);
      pagesHeaders.set('Host', 'companion-live.pages.dev');
      try {
        const pagesRes = await fetch(pagesUrl.toString(), {
          method: request.method,
          headers: pagesHeaders
        });
        const respHeaders = new Headers(pagesRes.headers);
        respHeaders.set('Content-Type', 'application/vnd.android.package-archive');
        respHeaders.set('Content-Disposition', 'attachment; filename="app.apk"');
        respHeaders.set('Access-Control-Allow-Origin', '*');
        return new Response(pagesRes.body, {
          status: pagesRes.status,
          statusText: pagesRes.statusText,
          headers: respHeaders
        });
      } catch (err) {
        return new Response('Unable to download APK', { status: 502 });
      }
    }

    // -------------------------------------------------------------
    // 7. APEX DOMAIN -> SERVE CLOUDFLARE PAGES ORIGIN
    // Directly bridges to the verified Cloudflare Pages project (companion-live.pages.dev)
    // -------------------------------------------------------------
    if (!subdomain || host === rootDomain) {
      const pagesUrl = new URL(request.url);
      pagesUrl.hostname = 'companion-live.pages.dev';

      const pagesHeaders = new Headers(request.headers);
      pagesHeaders.set('Host', 'companion-live.pages.dev');

      try {
        const pagesRes = await fetch(pagesUrl.toString(), {
          method: request.method,
          headers: pagesHeaders,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
          redirect: 'follow'
        });

        // Return the clean Pages response
        return new Response(pagesRes.body, {
          status: pagesRes.status,
          statusText: pagesRes.statusText,
          headers: pagesRes.headers
        });
      } catch (err) {
        return new Response('Unable to connect to Cloudflare Pages deployment', { status: 502 });
      }
    }

    // -------------------------------------------------------------
    // 8. SUBDOMAIN LANDING PAGE SERVING (im.careersuite.cc, page.careersuite.cc)
    // -------------------------------------------------------------
    const page = await db.getPageBySubdomain(subdomain);

    // If page doesn't exist, is deleted, or is draft/unpublished -> 404
    if (!page || page.status !== 'published') {
      return new Response(renderNotFoundPage(subdomain), {
        status: 404,
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }

    // External App Router mode (Zero-Click Auto-Redirect)
    if (page.routing_mode === 'app_deep_link' || page.routing_mode === 'AppRouter') {
      return new Response(renderAppRedirectPage(page), {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }

    // Extract visitor country code from Cloudflare request (fallback to 'US')
    const countryCode = request.cf && request.cf.country ? request.cf.country : 'US';

    // Return dynamically generated interactive Pre-lander HTML with Adsterra ads
    return new Response(renderLandingPage(page, countryCode), {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300'
      }
    });
  }
};

/**
 * Robust Subdomain Extraction:
 * - Detects subdomains relative to configured root domain (e.g. *.careersuite.cc)
 * - Excludes 'www' and 'admin'
 * - Ignores internal workers.dev and localhost
 */
function extractSubdomain(host, rootDomain) {
  if (!host) return null;
  const cleanHost = host.toLowerCase().split(':')[0].trim();

  // If host is workers.dev, localhost, or 127.0.0.1, it is not a campaign subdomain
  if (cleanHost.endsWith('.workers.dev') || cleanHost.includes('localhost') || cleanHost.includes('127.0.0.1')) {
    return null;
  }

  // 1. Direct match with configured rootDomain (e.g. im.careersuite.cc with rootDomain careersuite.cc)
  if (rootDomain && cleanHost.endsWith(`.${rootDomain}`)) {
    const sub = cleanHost.slice(0, -(rootDomain.length + 1));
    return sub && sub !== 'www' && sub !== 'admin' ? sub : null;
  }

  // 2. Generic match for 3+ parts (e.g. page.careersuite.cc)
  const parts = cleanHost.split('.');
  if (parts.length >= 3) {
    const sub = parts[0];
    if (sub !== 'www' && sub !== 'admin') {
      return sub;
    }
  }

  return null;
}

async function requireAuth(request, db) {
  const token = getBearerToken(request);
  if (!token) return null;
  return await db.validateSession(token);
}

function getBearerToken(request) {
  const auth = request.headers.get('Authorization') || '';
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return null;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  });
}

function handleCors() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}
