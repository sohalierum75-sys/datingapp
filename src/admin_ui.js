/**
 * Production-Ready Admin Dashboard UI (Self-Contained Single Page App)
 * Directly served by Cloudflare Worker with zero client-side build step required.
 */

export function renderAdminApp(rootDomain = 'yourdomain.com') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page Builder - Cloudflare Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #09090b;
      --card-bg: #131316;
      --border: #27272a;
      --primary: #ec4899;
      --primary-hover: #db2777;
      --accent: #8b5cf6;
      --text: #f4f4f5;
      --text-muted: #a1a1aa;
      --success: #10b981;
      --danger: #ef4444;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    body { background-color: var(--bg); color: var(--text); min-height: 100vh; display: flex; flex-direction: column; }
    
    /* Navbar */
    header {
      background: var(--card-bg);
      border-bottom: 1px solid var(--border);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 40;
    }
    .logo-area { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 18px; }
    .logo-badge {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: #fff;
      padding: 6px 10px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
    }
    .btn {
      padding: 9px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-primary:hover { background: var(--primary-hover); }
    .btn-secondary { background: #27272a; color: #fff; border: 1px solid #3f3f46; }
    .btn-secondary:hover { background: #3f3f46; }
    .btn-danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
    .btn-danger:hover { background: rgba(239, 68, 68, 0.3); }
    .btn-sm { padding: 5px 10px; font-size: 12px; border-radius: 6px; }

    /* Layout */
    main { flex: 1; max-width: 1200px; width: 100%; margin: 0 auto; padding: 28px 20px; }
    
    /* Login Screen */
    #auth-view { max-width: 400px; margin: 80px auto; background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-muted); }
    .form-control { width: 100%; background: #1c1c21; border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 14px; outline: none; }
    .form-control:focus { border-color: var(--primary); }
    .form-hint { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

    /* Stats Grid */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px; }
    .stat-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; }
    .stat-label { font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 28px; font-weight: 800; margin-top: 6px; color: #fff; }
    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(0.92); } }

    /* Tables */
    .table-container { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-top: 16px; }
    table { width: 100%; border-collapse: collapse; text-align: left; }
    th { background: #18181c; padding: 12px 18px; font-size: 12px; color: var(--text-muted); font-weight: 600; border-bottom: 1px solid var(--border); }
    td { padding: 16px 18px; border-bottom: 1px solid var(--border); font-size: 14px; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
    .badge-published { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .badge-draft { background: rgba(161, 161, 170, 0.15); color: #a1a1aa; }
    .page-avatar-thumb { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }

    /* Modal */
    .modal-backdrop { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); z-index: 50; align-items: center; justify-content: center; padding: 20px; }
    .modal { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; padding: 28px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .modal-title { font-size: 18px; font-weight: 700; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <header>
    <div class="logo-area">
      <div class="logo-badge">PRO</div>
      <span>Landing Page Builder</span>
    </div>
    <div id="nav-actions" style="display:none; align-items: center; gap: 10px;">
      <button class="btn btn-secondary btn-sm" id="tab-btn-pages" onclick="switchTab('pages')" style="background: #27272a; border-color: var(--primary);">🌐 Subdomains</button>
      <button class="btn btn-secondary btn-sm" id="tab-btn-app-mgr" onclick="switchTab('app-mgr')">📲 App Manager</button>
      <span id="user-display" style="font-size: 13px; color: var(--text-muted); margin-left: 6px;"></span>
      <button class="btn btn-secondary btn-sm" onclick="logout()">Logout</button>
    </div>
  </header>

  <main>
    <!-- LOGIN VIEW -->
    <div id="auth-view">
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Admin Login</h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">Manage your subdomains, traffic routing, and analytics.</p>
      <div id="login-error" style="display:none; color: var(--danger); font-size: 12px; margin-bottom: 12px;"></div>
      <form onsubmit="handleLogin(event)">
        <div class="form-group">
          <label>Username</label>
          <input type="text" id="login-username" class="form-control" required value="admin">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="login-password" class="form-control" required placeholder="••••••••">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Sign In</button>
      </form>
    </div>

    <!-- DASHBOARD VIEW -->
    <div id="app-view" style="display:none;">
      <!-- TAB 1: SUBDOMAINS -->
      <div id="view-pages">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800;">Campaign Subdomains</h1>
            <p style="font-size: 13px; color: var(--text-muted);">Active multi-subdomain routing for <strong>*.${rootDomain}</strong></p>
          </div>
          <button class="btn btn-primary" onclick="openCreateModal()">+ Create Landing Page</button>
        </div>

        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card" style="border-color: rgba(16, 185, 129, 0.4); background: linear-gradient(135deg, rgba(16,185,129,0.06), rgba(28,28,33,1));">
            <div class="stat-label" style="display: flex; align-items: center; gap: 6px; color: #10b981;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; box-shadow: 0 0 8px #10b981; animation: pulse 2s infinite;"></span>
              Live Online Now
            </div>
            <div class="stat-value" id="stat-online-total" style="color: #10b981;">0</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
              🌐 <span id="stat-online-web">0</span> Web &nbsp;•&nbsp; 📲 <span id="stat-online-app">0</span> App
            </div>
          </div>
          <div class="stat-card" style="border-color: rgba(236, 72, 153, 0.4); background: linear-gradient(135deg, rgba(236,72,153,0.06), rgba(28,28,33,1));">
            <div class="stat-label" style="color: var(--primary);">📲 Total App Downloads</div>
            <div class="stat-value" id="stat-total-downloads" style="color: var(--primary);">0</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
              Today: +<span id="stat-today-downloads">0</span> downloads
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">📅 Today's Traffic</div>
            <div class="stat-value" id="stat-today-visits">0</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
              👥 <span id="stat-today-uniques">0</span> unique visitors
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-label">🌐 All-Time Visits</div>
            <div class="stat-value" id="stat-total-visits-all">0</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
              <span id="stat-total-pages">0</span> active subdomains
            </div>
          </div>
        </div>

        <!-- 7-Day Performance Trends Card -->
        <div class="stat-card" style="margin-bottom: 28px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; flex-wrap:wrap; gap:8px;">
            <div class="stat-label" style="font-size: 13px; color: #fff;">📊 Last 7 Days Activity & Download Trends</div>
            <span style="font-size: 11px; color: var(--text-muted); display:flex; align-items:center; gap:6px;">
              <span style="width:6px; height:6px; border-radius:50%; background:#10b981;"></span> Real-time auto-refresh (15s)
            </span>
          </div>
          <div class="table-container" style="margin-top: 0;">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Visits</th>
                  <th>App Downloads</th>
                  <th>Conversion Rate</th>
                </tr>
              </thead>
              <tbody id="stats-7days-tbody">
                <tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Loading 7-day stats...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pages Table -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Influencer / Persona</th>
                <th>Subdomain Link</th>
                <th>Routing Mode</th>
                <th>Adsterra Ads</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="pages-tbody">
              <tr><td colspan="6" style="text-align:center; color: var(--text-muted);">Loading pages...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: APP MANAGER -->
      <div id="view-app-mgr" style="display:none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h1 style="font-size: 24px; font-weight: 800;">📲 Mobile App & Notifications Manager</h1>
            <p style="font-size: 13px; color: var(--text-muted);">Manage in-app profiles, top pinning, and remote random push notifications for the Flutter Android app.</p>
          </div>
          <div id="app-profiles-badge" class="badge badge-published" style="font-size: 13px; padding: 6px 14px;">0 Profiles Active in App</div>
        </div>

        <!-- App Profiles Table -->
        <div class="stat-card" style="margin-bottom: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px;">
            <div class="stat-label" style="font-size: 14px; color: #fff;">👤 App Profile Visibility & Pinning</div>
            <span style="font-size: 12px; color: var(--text-muted);">Profiles automatically sync to the Android app in real time</span>
          </div>
          <div class="table-container" style="margin-top: 0;">
            <table>
              <thead>
                <tr>
                  <th>Persona</th>
                  <th>Subdomain</th>
                  <th style="text-align: center;">Show in App</th>
                  <th style="text-align: center;">Pin to Top 📌</th>
                </tr>
              </thead>
              <tbody id="app-profiles-tbody">
                <tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Loading app profiles...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Global Notification Settings Form -->
        <div class="stat-card" style="margin-bottom: 24px;">
          <div class="stat-label" style="font-size: 14px; color: #fff; margin-bottom: 16px;">⚙️ Random Notification Schedule & Rules</div>
          <form id="app-config-form" onsubmit="handleSaveAppConfig(event)">
            <div style="background: rgba(236, 72, 153, 0.08); border: 1px solid rgba(236, 72, 153, 0.25); border-radius: 12px; padding: 14px; margin-bottom: 18px;">
              <label style="display:flex; align-items:center; gap: 10px; cursor:pointer; font-size: 14px; font-weight: 700; color: var(--primary); margin: 0;">
                <input type="checkbox" id="cfg-enabled" style="width: 20px; height: 20px; accent-color: var(--primary);" checked>
                <span>Enable Background Random Notifications on Android Devices</span>
              </label>
              <div class="form-hint" style="margin-left: 30px;">When enabled, the app's WorkManager triggers random persona messages according to the rules below.</div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>Minimum Interval (Minutes)</label>
                <input type="number" id="cfg-min-interval" class="form-control" required min="15" max="1440" value="30">
                <div class="form-hint">Shortest delay before a random notification can fire.</div>
              </div>
              <div class="form-group">
                <label>Maximum Interval (Minutes)</label>
                <input type="number" id="cfg-max-interval" class="form-control" required min="15" max="1440" value="180">
                <div class="form-hint">Longest delay before the next notification fires.</div>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>Quiet Hours Start (Hour 0-23)</label>
                <input type="number" id="cfg-quiet-start" class="form-control" required min="0" max="23" value="23">
                <div class="form-hint">23 = 11:00 PM. No notifications will fire during quiet hours.</div>
              </div>
              <div class="form-group">
                <label>Quiet Hours End (Hour 0-23)</label>
                <input type="number" id="cfg-quiet-end" class="form-control" required min="0" max="23" value="7">
                <div class="form-hint">7 = 7:00 AM morning.</div>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap: 10px; align-items:center;">
              <span id="cfg-status" style="font-size: 13px; color: var(--success); display:none;">✓ Settings Saved!</span>
              <button type="submit" class="btn btn-primary" id="cfg-save-btn">Save Notification Rules</button>
            </div>
          </form>
        </div>

        <!-- Template Builder & Android Preview -->
        <div class="stat-card" style="margin-bottom: 24px;">
          <div class="stat-label" style="font-size: 14px; color: #fff; margin-bottom: 16px;">✨ Create Notification Template</div>
          
          <div class="grid-2" style="gap: 24px;">
            <!-- Builder Form -->
            <form id="tpl-form" onsubmit="handleCreateTemplate(event)">
              <div class="form-group">
                <label>Target Sender Profile</label>
                <select id="tpl-profile-id" class="form-control" onchange="updateTplPreview()">
                  <option value="all">🎲 Random Active Profile</option>
                </select>
                <div class="form-hint">Choose a specific persona or let the app pick randomly among active profiles.</div>
              </div>

              <div class="form-group">
                <label>Notification Mode</label>
                <select id="tpl-type" class="form-control" onchange="toggleTplMode()">
                  <option value="text">💬 Text Message Only</option>
                  <option value="image_text">📸 Image + Message (Big Picture Style)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Notification Message Text</label>
                <textarea id="tpl-message" class="form-control" rows="3" required placeholder="e.g. Hey! Are you free right now? ❤️" oninput="updateTplPreview()"></textarea>
                <div class="form-hint" style="display:flex; justify-content:space-between;">
                  <span>Keep it conversational & engaging</span>
                  <span id="tpl-char-count">0 chars</span>
                </div>
              </div>

              <div id="tpl-image-section" style="display:none; background: #1c1c21; border: 1px solid var(--border); border-radius: 12px; padding: 14px; margin-bottom: 16px;">
                <label style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 8px; display:block;">Attachment Image</label>
                
                <div class="form-group">
                  <label style="font-size: 11px;">Upload Image File</label>
                  <input type="file" id="tpl-file-input" accept="image/*" class="form-control" onchange="handleImageFileUpload(event)" style="padding: 6px;">
                  <div id="tpl-upload-status" class="form-hint" style="color: var(--accent);"></div>
                </div>

                <div class="form-group" style="margin-bottom: 0;">
                  <label style="font-size: 11px;">Or Direct Image URL</label>
                  <input type="url" id="tpl-image-url" class="form-control" placeholder="https://..." oninput="updateTplPreview()">
                </div>
              </div>

              <button type="submit" class="btn btn-primary" id="tpl-submit-btn" style="width: 100%; justify-content: center;">+ Add Notification Template</button>
            </form>

            <!-- Android Live Preview Card -->
            <div>
              <div style="font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">📱 Android System Preview</div>
              
              <div style="background: #1e1e24; border: 1px solid #33333d; border-radius: 16px; padding: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
                <!-- Notification Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                  <div style="display:flex; align-items:center; gap: 8px;">
                    <div style="width: 20px; height: 20px; background: var(--primary); border-radius: 5px; display:flex; align-items:center; justify-content:center; font-size: 10px; font-weight: bold; color:#fff;">💬</div>
                    <span style="font-size: 12px; font-weight: 600; color: #a1a1aa;">SecretChat</span>
                    <span style="font-size: 10px; color: #71717a;">• now</span>
                  </div>
                  <span style="font-size: 11px; color: #71717a;">v</span>
                </div>

                <!-- Notification Content -->
                <div style="display:flex; gap: 12px; align-items:flex-start;">
                  <img id="prev-avatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                  <div style="flex:1;">
                    <div id="prev-sender" style="font-weight: 700; font-size: 14px; color: #fff;">Nethmi</div>
                    <div id="prev-message" style="font-size: 13px; color: #e4e4e7; margin-top: 2px;">Hey there! Are you free right now? ❤️</div>
                  </div>
                </div>

                <!-- Big Picture Image Preview -->
                <div id="prev-big-pic-container" style="display:none; margin-top: 12px; border-radius: 12px; overflow:hidden; max-height: 180px; border: 1px solid #33333d;">
                  <img id="prev-big-pic" src="" style="width: 100%; height: 180px; object-fit: cover; display:block;">
                </div>
              </div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 8px; text-align: center;">Tapping this notification inside Android opens the chat directly and inserts the message.</div>
            </div>
          </div>
        </div>

        <!-- Active Notification Templates List -->
        <div class="stat-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 14px;">
            <div class="stat-label" style="font-size: 14px; color: #fff;">📋 Active Notification Templates (<span id="tpl-count">0</span>)</div>
          </div>
          <div class="table-container" style="margin-top: 0;">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Target Persona</th>
                  <th>Message</th>
                  <th>Attachment</th>
                  <th style="text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody id="templates-tbody">
                <tr><td colspan="5" style="text-align:center; color: var(--text-muted);">Loading templates...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- COMPATIBILITY QUIZ — UNLOCK PHOTOS (PHOTO 1, 2, 3) -->
        <div class="stat-card" style="border: 1px solid rgba(236, 72, 153, 0.35); background: linear-gradient(180deg, #181820 0%, #121216 100%);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom: 18px;">
            <div>
              <div style="font-size: 16px; font-weight: 800; color: #fff; display:flex; align-items:center; gap:8px;">
                <span>🔥 Compatibility Quiz — Unlock Photos (Photos 1, 2, 3)</span>
                <span class="badge" style="background: rgba(236,72,153,0.2); color: var(--primary);">Synced with Android App</span>
              </div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                Upload and customize the 3 progressive unlock photos used in the "Unlock Photos" Compatibility Quiz screen.
              </div>
            </div>

            <!-- Profile Selector Dropdown -->
            <div style="display:flex; align-items:center; gap:10px;">
              <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); margin:0;">Select Profile:</label>
              <select id="quiz-photo-profile-select" class="form-control" style="width: auto; min-width: 220px; font-weight: 600;" onchange="loadQuizPhotosForSelectedProfile()">
                <option value="default">🌟 Global Default (All Profiles)</option>
              </select>
              <div id="quiz-save-status" style="font-size: 12px; color: var(--success); font-weight: 600; display:none;">✓ Saved!</div>
            </div>
          </div>

          <!-- 3 Slot Cards Grid -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
            <!-- Slot 1 -->
            <div class="stat-card" style="background: #1e1e26; border: 1px solid #2e2e38; padding: 14px; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 13px; font-weight: 700; color: #fff;">📸 Photo 1 (Slot 1)</span>
                <label style="font-size: 11px; color: var(--text-muted); cursor:pointer; display:flex; align-items:center; gap:4px;">
                  <input type="checkbox" id="quiz-blur-toggle-1" onchange="toggleSlotBlurPreview(1)" style="accent-color: var(--primary);">
                  <span>Preview Blurred</span>
                </label>
              </div>

              <!-- Preview Image Container -->
              <div style="position:relative; width:100%; height: 200px; border-radius: 10px; overflow:hidden; background: #0f0f13; border: 1px solid #33333e;">
                <img id="quiz-preview-img-1" src="" style="width:100%; height:100%; object-fit: cover; transition: filter 0.3s ease;">
                <div id="quiz-blur-overlay-1" style="position:absolute; inset:0; display:none; align-items:center; justify-content:center; background: rgba(0,0,0,0.3); font-size:12px; font-weight:bold; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,0.8);">
                  🔒 0% Unlocked
                </div>
              </div>

              <div style="margin-top: 10px; display:flex; gap: 8px;">
                <input type="file" id="quiz-file-input-1" accept="image/*" style="display:none;" onchange="handleQuizPhotoFileSelected(event, 1)">
                <button type="button" class="btn btn-secondary btn-sm" style="flex:1; font-size: 11px;" onclick="document.getElementById('quiz-file-input-1').click()">📁 Replace Photo</button>
                <button type="button" class="btn btn-danger btn-sm" style="font-size: 11px;" onclick="removeQuizPhotoSlot(1)">✕ Remove</button>
              </div>
              <div id="quiz-slot-status-1" style="font-size: 11px; color: var(--accent); margin-top: 4px; min-height: 16px;"></div>
            </div>

            <!-- Slot 2 -->
            <div class="stat-card" style="background: #1e1e26; border: 1px solid #2e2e38; padding: 14px; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 13px; font-weight: 700; color: #fff;">📸 Photo 2 (Slot 2)</span>
                <label style="font-size: 11px; color: var(--text-muted); cursor:pointer; display:flex; align-items:center; gap:4px;">
                  <input type="checkbox" id="quiz-blur-toggle-2" onchange="toggleSlotBlurPreview(2)" style="accent-color: var(--primary);">
                  <span>Preview Blurred</span>
                </label>
              </div>

              <!-- Preview Image Container -->
              <div style="position:relative; width:100%; height: 200px; border-radius: 10px; overflow:hidden; background: #0f0f13; border: 1px solid #33333e;">
                <img id="quiz-preview-img-2" src="" style="width:100%; height:100%; object-fit: cover; transition: filter 0.3s ease;">
                <div id="quiz-blur-overlay-2" style="position:absolute; inset:0; display:none; align-items:center; justify-content:center; background: rgba(0,0,0,0.3); font-size:12px; font-weight:bold; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,0.8);">
                  🔒 0% Unlocked
                </div>
              </div>

              <div style="margin-top: 10px; display:flex; gap: 8px;">
                <input type="file" id="quiz-file-input-2" accept="image/*" style="display:none;" onchange="handleQuizPhotoFileSelected(event, 2)">
                <button type="button" class="btn btn-secondary btn-sm" style="flex:1; font-size: 11px;" onclick="document.getElementById('quiz-file-input-2').click()">📁 Replace Photo</button>
                <button type="button" class="btn btn-danger btn-sm" style="font-size: 11px;" onclick="removeQuizPhotoSlot(2)">✕ Remove</button>
              </div>
              <div id="quiz-slot-status-2" style="font-size: 11px; color: var(--accent); margin-top: 4px; min-height: 16px;"></div>
            </div>

            <!-- Slot 3 -->
            <div class="stat-card" style="background: #1e1e26; border: 1px solid #2e2e38; padding: 14px; position:relative;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 13px; font-weight: 700; color: #fff;">📸 Photo 3 (Slot 3)</span>
                <label style="font-size: 11px; color: var(--text-muted); cursor:pointer; display:flex; align-items:center; gap:4px;">
                  <input type="checkbox" id="quiz-blur-toggle-3" onchange="toggleSlotBlurPreview(3)" style="accent-color: var(--primary);">
                  <span>Preview Blurred</span>
                </label>
              </div>

              <!-- Preview Image Container -->
              <div style="position:relative; width:100%; height: 200px; border-radius: 10px; overflow:hidden; background: #0f0f13; border: 1px solid #33333e;">
                <img id="quiz-preview-img-3" src="" style="width:100%; height:100%; object-fit: cover; transition: filter 0.3s ease;">
                <div id="quiz-blur-overlay-3" style="position:absolute; inset:0; display:none; align-items:center; justify-content:center; background: rgba(0,0,0,0.3); font-size:12px; font-weight:bold; color:#fff; text-shadow:0 1px 4px rgba(0,0,0,0.8);">
                  🔒 0% Unlocked
                </div>
              </div>

              <div style="margin-top: 10px; display:flex; gap: 8px;">
                <input type="file" id="quiz-file-input-3" accept="image/*" style="display:none;" onchange="handleQuizPhotoFileSelected(event, 3)">
                <button type="button" class="btn btn-secondary btn-sm" style="flex:1; font-size: 11px;" onclick="document.getElementById('quiz-file-input-3').click()">📁 Replace Photo</button>
                <button type="button" class="btn btn-danger btn-sm" style="font-size: 11px;" onclick="removeQuizPhotoSlot(3)">✕ Remove</button>
              </div>
              <div id="quiz-slot-status-3" style="font-size: 11px; color: var(--accent); margin-top: 4px; min-height: 16px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- CREATE / EDIT MODAL -->
  <div id="page-modal" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title" id="modal-title">Create Landing Page</h3>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">✕</button>
      </div>

      <form onsubmit="handleSavePage(event)">
        <input type="hidden" id="edit-id">

        <div class="grid-2">
          <div class="form-group">
            <label>Subdomain Prefix</label>
            <div style="display:flex; align-items:center;">
              <input type="text" id="p-subdomain" class="form-control" required placeholder="e.g. nethmi" style="border-top-right-radius: 0; border-bottom-right-radius: 0;">
              <span style="background: #27272a; padding: 10px; font-size: 13px; color: var(--text-muted); border: 1px solid var(--border); border-left: none; border-top-right-radius: 10px; border-bottom-right-radius: 10px;">.${rootDomain}</span>
            </div>
            <div class="form-hint">Visitors access https://[subdomain].${rootDomain}</div>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="p-status" class="form-control">
              <option value="published">Published (Live)</option>
              <option value="draft">Draft (Offline)</option>
            </select>
          </div>
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 10px; margin-bottom: 12px; font-weight: 700; font-size: 14px; color: var(--primary);">
          ✨ Pre-lander Persona & Chat Experience
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Persona Name</label>
            <input type="text" id="p-persona-name" class="form-control" required placeholder="e.g. Nethmi">
          </div>
          <div class="form-group">
            <label>Typing Animation Delay (ms)</label>
            <input type="number" id="p-typing-delay" class="form-control" required value="1500" min="500" max="6000">
          </div>
        </div>

        <div class="form-group">
          <label>Profile Avatar URL</label>
          <input type="url" id="p-avatar-url" class="form-control" required placeholder="https://images.unsplash.com/...">
        </div>

        <div class="form-group">
          <label>Chat Message</label>
          <textarea id="p-chat-message" class="form-control" rows="3" required placeholder="Hey there! Thanks for visiting my page..."></textarea>
        </div>

        <!-- SECTION A: CHAT MEDIA -->
        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 16px; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-weight: 700; font-size: 13px; color: var(--primary);">📸 Section A — Chat Media (Photos & Videos sent during chat)</div>
            <div class="form-hint">Upload photos & videos sent automatically as replies or milestone triggers in chat.</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('p-chat-media-file').click()">+ Upload Chat Media</button>
          <input type="file" id="p-chat-media-file" accept="image/*,video/*" multiple style="display:none;" onchange="handleMediaFilesSelected(event, 'chat')">
        </div>
        <div id="p-chat-upload-status" style="font-size: 12px; color: var(--accent); margin-bottom: 8px; display:none;"></div>
        <div id="p-chat-media-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;"></div>

        <!-- SECTION B: UNLOCK MEDIA GALLERY -->
        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 16px; margin-bottom: 10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-weight: 700; font-size: 13px; color: #a855f7;">🔒 Section B — App Unlock Gallery (Exclusive Vault Media)</div>
            <div class="form-hint">Exclusive photos & videos unlockable inside the Android app private vault.</div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('p-unlock-media-file').click()">+ Upload Vault Media</button>
          <input type="file" id="p-unlock-media-file" accept="image/*,video/*" multiple style="display:none;" onchange="handleMediaFilesSelected(event, 'unlock')">
        </div>
        <div id="p-unlock-upload-status" style="font-size: 12px; color: var(--accent); margin-bottom: 8px; display:none;"></div>
        <div id="p-unlock-media-list" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;"></div>

        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 10px; margin-bottom: 12px; font-weight: 700; font-size: 14px; color: var(--accent);">
          🚀 Smart Traffic Routing Engine (CTAs)
        </div>

        <div class="form-group">
          <label>CTA Routing Mode</label>
          <select id="p-routing-mode" class="form-control" onchange="updateRoutingHelp()">
            <option value="direct">Option 1: Direct Link Mode (Standard Web URL)</option>
            <option value="chrome_intent">Option A: Chrome Intent Mode (Escape Android FB In-App Browser)</option>
            <option value="app_deep_link">Option B: External App Router (Instant Auto-Redirect)</option>
            <option value="AppRouter">Option C: AppRouter Mode (Instant Auto-Redirect)</option>
          </select>
          <div id="routing-hint" class="form-hint" style="color: var(--accent); margin-top: 6px;"></div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label id="target-label">Target Destination URL / Ad Code / Username</label>
            <input type="text" id="p-routing-target" class="form-control" required placeholder="e.g. highratecpm.com/code or username">
          </div>
          <div class="form-group">
            <label>Fallback Web URL (for App Deep Link)</label>
            <input type="url" id="p-fallback-url" class="form-control" placeholder="https://x.com/username">
          </div>
        </div>

        <div class="form-group">
          <label>Background Ad URL (Direct Link)</label>
          <input type="url" id="p-ad-url" class="form-control" placeholder="https://example.com/direct-link">
          <div class="form-hint">Optional pop-under redirect executed 600ms after opening the app in External App Router mode.</div>
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 10px; margin-bottom: 12px; font-weight: 700; font-size: 14px; color: #10b981;">
          📢 Adsterra Dynamic Monetization Scripts
        </div>

        <div class="form-group">
          <label>Adsterra Popunder Script (Optional)</label>
          <textarea id="p-ad-popunder" class="form-control" rows="3" placeholder="<script data-cfasync=&quot;false&quot; src=&quot;https://...&quot;></script>"></textarea>
          <div class="form-hint">Paste full Adsterra Popunder script code here. It will be injected dynamically before &lt;/body&gt;.</div>
        </div>

        <div class="form-group">
          <label>Adsterra Social Bar Script (Optional)</label>
          <textarea id="p-ad-socialbar" class="form-control" rows="3" placeholder="<script data-cfasync=&quot;false&quot; src=&quot;https://...&quot;></script>"></textarea>
          <div class="form-hint">Paste full Adsterra Social Bar script code here. It will be injected dynamically before &lt;/body&gt;.</div>
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 10px; margin-bottom: 12px; font-weight: 700; font-size: 14px; color: #38bdf8;">
          💰 Monetag Direct Link Settings
        </div>

        <div class="form-group">
          <label>Monetag Direct Link URL</label>
          <input type="url" id="p-monetag-link" class="form-control" placeholder="https://otieuwai.net/4/...">
          <div class="form-hint">When a button below is toggled to use Monetag, clicking it opens this Monetag link in a new tab while keeping the landing page open in the current tab.</div>
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 10px; margin-bottom: 12px; font-weight: 700; font-size: 14px; color: var(--primary);">
          🔘 CTA Action Buttons (Select Monetag Per Button)
        </div>

        <div id="cta-buttons-container" style="display:flex; flex-direction:column; gap: 10px; margin-bottom: 12px;"></div>
        <button type="button" class="btn btn-secondary btn-sm" onclick="addCtaButtonRow()" style="margin-bottom: 14px;">+ Add CTA Button</button>

        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 10px; margin-bottom: 12px; font-weight: 700; font-size: 14px; color: #22c55e;">
          📱 App Download & Install Settings
        </div>

        <div style="margin-bottom: 14px; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px; padding: 12px 14px;">
          <label style="display:flex; align-items:center; gap: 10px; cursor:pointer; font-size: 13px; color: #22c55e; font-weight: 700; margin: 0;">
            <input type="checkbox" id="p-app-download-enabled" style="width: 18px; height: 18px; accent-color: #22c55e;" checked>
            <span>Show App Download Prompts (Top Sticky Button & Download Card)</span>
          </label>
          <div class="form-hint" style="margin-left: 28px; color: var(--text-muted);">Displays prominent app download buttons (Android .APK direct download + 1-Click PWA installer) on this landing page.</div>
        </div>

        <div class="form-group">
          <label>App Download URL (APK Link)</label>
          <input type="text" id="p-apk-url" class="form-control" placeholder="/app.apk or https://yourdomain.com/app.apk" value="/app.apk">
          <div class="form-hint">Direct link to your Android .apk file. Defaults to <code>/app.apk</code> if left blank.</div>
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 16px; margin-top: 10px; margin-bottom: 12px; font-weight: 700; font-size: 14px;">
          🏷️ Open Graph & Social SEO Metadata
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>OG Social Title</label>
            <input type="text" id="p-og-title" class="form-control" placeholder="Online Now ✨ - Connect with me">
          </div>
          <div class="form-group">
            <label>Theme Accent Color</label>
            <input type="color" id="p-theme-accent" class="form-control" value="#e91e63" style="height: 42px; padding: 4px;">
          </div>
        </div>

        <div class="form-group">
          <label>OG Description</label>
          <input type="text" id="p-og-desc" class="form-control" placeholder="Check out my exclusive profile and photos.">
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" id="save-btn">Save & Publish</button>
        </div>
      </form>
    </div>
  </div>

  <!-- ANALYTICS MODAL -->
  <div id="analytics-modal" class="modal-backdrop">
    <div class="modal" style="max-width: 760px;">
      <div class="modal-header">
        <h3 class="modal-title" id="analytics-modal-title">Subdomain Analytics</h3>
        <button class="btn btn-secondary btn-sm" onclick="closeAnalyticsModal()">✕</button>
      </div>
      <div class="stats-grid" style="margin-bottom: 20px;">
        <div class="stat-card">
          <div class="stat-label">Page Views</div>
          <div class="stat-value" id="a-views">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Unique Visitors</div>
          <div class="stat-value" id="a-visitors">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">CTA Clicks</div>
          <div class="stat-value" id="a-clicks" style="color: var(--primary);">0</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Click-Through Rate</div>
          <div class="stat-value" id="a-ctr" style="color: var(--success);">0%</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="stat-card">
          <div class="stat-label" style="margin-bottom: 12px;">Top Traffic Sources (Referrers)</div>
          <div id="a-referrers" style="font-size: 13px; color: var(--text-muted);">None recorded yet</div>
        </div>
        <div class="stat-card">
          <div class="stat-label" style="margin-bottom: 12px;">Device & Platform Breakdown</div>
          <div id="a-platforms" style="font-size: 13px; color: var(--text-muted);">None recorded yet</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let token = localStorage.getItem('lp_token');
    let pages = [];
    const rootDomain = '${rootDomain}';

    function init() {
      if (token) {
        checkSession();
      } else {
        showAuthView();
      }
      updateRoutingHelp();
    }

    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
        if (res.ok) {
          const data = await res.json();
          document.getElementById('user-display').textContent = 'Logged in as ' + data.user.username;
          showAppView();
          loadPages();
          loadGlobalStats();
        } else {
          logout();
        }
      } catch (e) {
        logout();
      }
    }

    async function handleLogin(e) {
      e.preventDefault();
      const u = document.getElementById('login-username').value;
      const p = document.getElementById('login-password').value;
      const err = document.getElementById('login-error');
      err.style.display = 'none';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: u, password: p })
        });
        const data = await res.json();
        if (res.ok && data.token) {
          token = data.token;
          localStorage.setItem('lp_token', token);
          checkSession();
        } else {
          err.textContent = data.error || 'Invalid credentials';
          err.style.display = 'block';
        }
      } catch (e) {
        err.textContent = 'Server connection error';
        err.style.display = 'block';
      }
    }

    function logout() {
      if (token) {
        fetch('/api/auth/logout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } }).catch(()=>{});
      }
      localStorage.removeItem('lp_token');
      token = null;
      showAuthView();
    }

    function showAuthView() {
      document.getElementById('auth-view').style.display = 'block';
      document.getElementById('app-view').style.display = 'none';
      document.getElementById('nav-actions').style.display = 'none';
    }

    function showAppView() {
      document.getElementById('auth-view').style.display = 'none';
      document.getElementById('app-view').style.display = 'block';
      document.getElementById('nav-actions').style.display = 'flex';
      loadRealtimeStats();
      if (!window._statsInterval) {
        window._statsInterval = setInterval(loadRealtimeStats, 15000);
      }
    }

    async function loadPages() {
      try {
        const res = await fetch('/api/pages', { headers: { 'Authorization': 'Bearer ' + token } });
        pages = await res.json();
        renderPagesTable();
        loadRealtimeStats();
      } catch (e) {
        console.error(e);
      }
    }

    async function loadGlobalStats() {
      try {
        const res = await fetch('/api/admin/overview', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        const elTotalPages = document.getElementById('stat-total-pages');
        if (elTotalPages) elTotalPages.textContent = pages.length;
        loadRealtimeStats();
      } catch (e) {}
    }

    async function loadRealtimeStats() {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) return;
        const data = await res.json();

        if (data.onlineNow) {
          const elTotal = document.getElementById('stat-online-total');
          const elWeb = document.getElementById('stat-online-web');
          const elApp = document.getElementById('stat-online-app');
          if (elTotal) elTotal.textContent = data.onlineNow.total || 0;
          if (elWeb) elWeb.textContent = data.onlineNow.web || 0;
          if (elApp) elApp.textContent = data.onlineNow.app || 0;
        }

        const elDownloads = document.getElementById('stat-total-downloads');
        if (elDownloads) elDownloads.textContent = data.totalDownloads || 0;

        if (data.today) {
          const elTodayVisits = document.getElementById('stat-today-visits');
          const elTodayUniques = document.getElementById('stat-today-uniques');
          const elTodayDl = document.getElementById('stat-today-downloads');
          if (elTodayVisits) elTodayVisits.textContent = data.today.visits || 0;
          if (elTodayUniques) elTodayUniques.textContent = data.today.uniqueVisitors || 0;
          if (elTodayDl) elTodayDl.textContent = data.today.downloads || 0;
        }

        const elTotalVisits = document.getElementById('stat-total-visits-all');
        if (elTotalVisits) elTotalVisits.textContent = data.totalVisits || 0;

        const tbody7 = document.getElementById('stats-7days-tbody');
        if (tbody7 && Array.isArray(data.last7Days)) {
          if (data.last7Days.length === 0) {
            tbody7.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding: 18px;">No activity recorded in the last 7 days yet.</td></tr>';
          } else {
            tbody7.innerHTML = data.last7Days.map(row => {
              const visits = row.visits || 0;
              const downloads = row.downloads || 0;
              const conv = visits > 0 ? ((downloads / visits) * 100).toFixed(1) + '%' : '0.0%';
              return \`
                <tr>
                  <td style="font-weight:600; font-family:monospace;">\${row.date}</td>
                  <td>\${visits.toLocaleString()}</td>
                  <td><span class="badge" style="background:rgba(236,72,153,0.15); color:var(--primary);">📲 \${downloads.toLocaleString()}</span></td>
                  <td style="color:var(--text-muted);">\${conv}</td>
                </tr>
              \`;
            }).join('');
          }
        }
      } catch (e) {
        console.error('Failed to load realtime stats:', e);
      }
    }

    function renderPagesTable() {
      const tbody = document.getElementById('pages-tbody');
      if (pages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 32px; color: var(--text-muted);">No subdomains created yet. Click "+ Create Landing Page" to start.</td></tr>';
        return;
      }

      tbody.innerHTML = pages.map(p => {
        const url = 'https://' + p.subdomain + '.' + rootDomain;
        const localPreviewUrl = '/?subdomain=' + encodeURIComponent(p.subdomain);
        return \`
          <tr>
            <td>
              <div style="display:flex; align-items:center; gap: 10px;">
                <img class="page-avatar-thumb" src="\${p.avatar_url}" onerror="this.src='https://via.placeholder.com/40'">
                <div>
                  <div style="font-weight: 700;">\${escapeHtml(p.persona_name)}</div>
                  <div style="font-size: 11px; color: var(--text-muted);">\${escapeHtml(p.title)}</div>
                </div>
              </div>
            </td>
            <td>
              <a href="\${localPreviewUrl}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">
                \${p.subdomain}.\${rootDomain} ↗
              </a>
            </td>
            <td>
              <span style="font-size: 12px; font-weight: 600; color: var(--accent);">\${formatMode(p.routing_mode)}</span>
            </td>
            <td>
              <div style="display:flex; flex-direction:column; gap: 4px; font-size: 11px;">
                <span style="color: \${(p.ad_popunder || p.ad_popunder_code) ? '#10b981' : '#71717a'}; font-weight: 600;">
                  \${(p.ad_popunder || p.ad_popunder_code) ? '✓ Popunder Set' : '○ Popunder None'}
                </span>
                <span style="color: \${(p.ad_socialbar || p.ad_socialbar_code) ? '#10b981' : '#71717a'}; font-weight: 600;">
                  \${(p.ad_socialbar || p.ad_socialbar_code) ? '✓ Social Bar Set' : '○ Social Bar None'}
                </span>
                <span style="color: \${p.monetag_direct_link ? '#38bdf8' : '#71717a'}; font-weight: 600;">
                  \${p.monetag_direct_link ? '💰 Monetag: ON' : '○ Monetag: OFF'}
                </span>
                <span style="color: \${p.ad_url ? '#f59e0b' : '#71717a'}; font-weight: 600;">
                  \${p.ad_url ? '🎯 Background Ad: ON' : '○ Background Ad: OFF'}
                </span>
                <span style="color: \${p.app_download_enabled !== 0 ? '#22c55e' : '#71717a'}; font-weight: 600;">
                  \${p.app_download_enabled !== 0 ? '📲 App Download: ON' : '○ App Download: OFF'}
                </span>
              </div>
            </td>
            <td>
              <span class="badge \${p.status === 'published' ? 'badge-published' : 'badge-draft'}">
                \${p.status === 'published' ? '● Live' : '○ Draft'}
              </span>
            </td>
            <td style="text-align: right;">
              <button class="btn btn-secondary btn-sm" onclick="openAnalyticsModal('\${p.id}', '\${p.subdomain}')">📊 Stats</button>
              <button class="btn btn-secondary btn-sm" onclick="openEditModal('\${p.id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deletePage('\${p.id}')">Delete</button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function formatMode(mode) {
      if (mode === 'chrome_intent') return 'Intent: Chrome Escape';
      if (mode === 'app_deep_link' || mode === 'AppRouter') return 'App Router (Auto-Redirect)';
      return 'Direct Link';
    }

    let currentCtaButtons = [];
    let currentChatMedia = [];
    let currentUnlockMedia = [];

    async function compressImageFile(file) {
      if (!file.type || !file.type.startsWith('image/')) return file;
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const maxDim = 1280;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) {
                resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
              } else {
                resolve(file);
              }
            }, 'image/jpeg', 0.82);
          };
          img.onerror = () => resolve(file);
          img.src = e.target.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
      });
    }

    async function handleMediaFilesSelected(e, targetSection) {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const statusEl = document.getElementById(targetSection === 'chat' ? 'p-chat-upload-status' : 'p-unlock-upload-status');
      statusEl.style.display = 'block';

      for (let i = 0; i < files.length; i++) {
        let f = files[i];
        statusEl.textContent = 'Processing & uploading (' + (i + 1) + '/' + files.length + '): ' + f.name + '...';

        try {
          if (f.type && f.type.startsWith('image/')) {
            f = await compressImageFile(f);
          }
          const fd = new FormData();
          fd.append('file', f);

          const res = await fetch('/api/media/upload', {
            method: 'POST',
            body: fd
          });

          if (!res.ok) {
            alert('Failed to upload ' + f.name);
            continue;
          }

          const data = await res.json();
          if (data.success && data.url) {
            if (targetSection === 'chat') {
              currentChatMedia.push({
                id: data.id,
                url: data.url,
                mediaType: data.mediaType || (f.type.startsWith('video/') ? 'video' : 'image'),
                caption: f.type.startsWith('video/') ? 'Sent you a private video clip! 🎥' : 'Sent you a private selfie! 📸',
                triggerAfterMessages: (currentChatMedia.length + 1) * 2
              });
              renderChatMediaList();
            } else {
              currentUnlockMedia.push({
                id: data.id,
                url: data.url,
                mediaType: data.mediaType || (f.type.startsWith('video/') ? 'video' : 'image'),
                title: f.type.startsWith('video/') ? 'Exclusive Private Video 🎥' : 'Exclusive VIP Photo 📸',
                unlockType: currentUnlockMedia.length === 0 ? 'free' : (currentUnlockMedia.length === 1 ? 'ad' : 'chat')
              });
              renderUnlockMediaList();
            }
          }
        } catch (err) {
          console.error(err);
          alert('Error uploading ' + f.name + ': ' + err.message);
        }
      }

      statusEl.style.display = 'none';
      e.target.value = '';
    }

    function renderChatMediaList() {
      const el = document.getElementById('p-chat-media-list');
      if (!el) return;
      if (currentChatMedia.length === 0) {
        el.innerHTML = '<div style="font-size:12px; color:var(--text-muted); font-style:italic;">No chat photos or videos uploaded yet.</div>';
        return;
      }
      el.innerHTML = currentChatMedia.map((m, idx) => \`
        <div style="background:#18181c; border:1px solid var(--border); border-radius:12px; padding:10px; display:flex; gap:12px; align-items:center;">
          <div style="position:relative; width:64px; height:64px; flex-shrink:0; border-radius:8px; overflow:hidden; background:#000;">
            \${m.mediaType === 'video'
              ? \`<video src="\${m.url}" style="width:100%; height:100%; object-fit:cover;"></video><div style="position:absolute; top:2px; left:2px; background:rgba(0,0,0,0.7); color:#fff; font-size:9px; font-weight:800; padding:1px 4px; border-radius:4px;">▶ VIDEO</div>\`
              : \`<img src="\${m.url}" style="width:100%; height:100%; object-fit:cover;"><div style="position:absolute; top:2px; left:2px; background:rgba(236,72,153,0.8); color:#fff; font-size:9px; font-weight:800; padding:1px 4px; border-radius:4px;">📷 PHOTO</div>\`
            }
          </div>
          <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
            <input type="text" class="form-control" placeholder="Caption (e.g. Sent you a selfie!)" value="\${escapeHtml(m.caption || '')}" oninput="currentChatMedia[\${idx}].caption = this.value" style="padding:6px 10px; font-size:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:11px; color:var(--text-muted);">Trigger after message:</span>
              <input type="number" class="form-control" min="1" max="50" value="\${m.triggerAfterMessages || 2}" onchange="currentChatMedia[\${idx}].triggerAfterMessages = Number(this.value)" style="width:70px; padding:4px 8px; font-size:12px;">
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            \${idx > 0 ? \`<button type="button" class="btn btn-secondary btn-sm" style="padding:2px 6px;" onclick="moveChatMedia(\${idx}, -1)">▲</button>\` : ''}
            \${idx < currentChatMedia.length - 1 ? \`<button type="button" class="btn btn-secondary btn-sm" style="padding:2px 6px;" onclick="moveChatMedia(\${idx}, 1)">▼</button>\` : ''}
            <button type="button" class="btn btn-danger btn-sm" style="padding:2px 6px;" onclick="removeChatMedia(\${idx})">✕</button>
          </div>
        </div>
      \`).join('');
    }

    function moveChatMedia(idx, delta) {
      const target = idx + delta;
      if (target >= 0 && target < currentChatMedia.length) {
        const item = currentChatMedia.splice(idx, 1)[0];
        currentChatMedia.splice(target, 0, item);
        renderChatMediaList();
      }
    }

    function removeChatMedia(idx) {
      currentChatMedia.splice(idx, 1);
      renderChatMediaList();
    }

    function renderUnlockMediaList() {
      const el = document.getElementById('p-unlock-media-list');
      if (!el) return;
      if (currentUnlockMedia.length === 0) {
        el.innerHTML = '<div style="font-size:12px; color:var(--text-muted); font-style:italic;">No unlockable vault media uploaded yet.</div>';
        return;
      }
      el.innerHTML = currentUnlockMedia.map((m, idx) => \`
        <div style="background:#18181c; border:1px solid var(--border); border-radius:12px; padding:10px; display:flex; gap:12px; align-items:center;">
          <div style="position:relative; width:64px; height:64px; flex-shrink:0; border-radius:8px; overflow:hidden; background:#000;">
            \${m.mediaType === 'video'
              ? \`<video src="\${m.url}" style="width:100%; height:100%; object-fit:cover;"></video><div style="position:absolute; top:2px; left:2px; background:rgba(168,85,247,0.9); color:#fff; font-size:9px; font-weight:800; padding:1px 4px; border-radius:4px;">▶ VIDEO</div>\`
              : \`<img src="\${m.url}" style="width:100%; height:100%; object-fit:cover;"><div style="position:absolute; top:2px; left:2px; background:rgba(168,85,247,0.9); color:#fff; font-size:9px; font-weight:800; padding:1px 4px; border-radius:4px;">🔒 PHOTO</div>\`
            }
          </div>
          <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
            <input type="text" class="form-control" placeholder="Teaser Title (e.g. Secret Balcony Video)" value="\${escapeHtml(m.title || '')}" oninput="currentUnlockMedia[\${idx}].title = this.value" style="padding:6px 10px; font-size:12px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:11px; color:var(--text-muted);">Unlock Rule:</span>
              <select class="form-control" onchange="currentUnlockMedia[\${idx}].unlockType = this.value" style="padding:4px 8px; font-size:12px;">
                <option value="free" \${m.unlockType === 'free' ? 'selected' : ''}>Free Tap-to-Unlock 🎁</option>
                <option value="ad" \${m.unlockType === 'ad' ? 'selected' : ''}>Watch Ad / Visit Link 📺</option>
                <option value="chat" \${m.unlockType === 'chat' ? 'selected' : ''}>Unlock After 5 Chats 💬</option>
              </select>
            </div>
          </div>
          <div>
            <button type="button" class="btn btn-danger btn-sm" style="padding:2px 8px;" onclick="removeUnlockMedia(\${idx})">✕</button>
          </div>
        </div>
      \`).join('');
    }

    function removeUnlockMedia(idx) {
      currentUnlockMedia.splice(idx, 1);
      renderUnlockMediaList();
    }

    function renderCtaButtonsEditor(buttons) {
      currentCtaButtons = Array.isArray(buttons) && buttons.length > 0 ? buttons : [
        { label: 'Reply in Private Chat ❤️', color: '#e91e63', use_monetag: true },
        { label: 'View Private Photos 📸', color: '#9c27b0', use_monetag: false }
      ];
      
      const container = document.getElementById('cta-buttons-container');
      if (!container) return;
      container.innerHTML = currentCtaButtons.map((btn, idx) => \`
        <div style="background: #18181c; border: 1px solid var(--border); border-radius: 12px; padding: 12px; display:flex; flex-direction:column; gap: 8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size: 12px; font-weight: 700; color: var(--text-muted);">Button #\${idx + 1}</span>
            \${currentCtaButtons.length > 1 ? \`<button type="button" class="btn btn-danger btn-sm" style="padding: 2px 8px; font-size: 11px;" onclick="removeCtaButtonRow(\${idx})">Remove</button>\` : ''}
          </div>
          <div class="grid-2">
            <div>
              <label style="font-size: 11px; color: var(--text-muted); display:block; margin-bottom: 4px;">Button Label</label>
              <input type="text" class="form-control" value="\${escapeHtml(btn.label)}" oninput="updateCtaButtonField(\${idx}, 'label', this.value)">
            </div>
            <div>
              <label style="font-size: 11px; color: var(--text-muted); display:block; margin-bottom: 4px;">Button Accent Color</label>
              <input type="color" class="form-control" style="height: 40px; padding: 2px;" value="\${btn.color || '#e91e63'}" onchange="updateCtaButtonField(\${idx}, 'color', this.value)">
            </div>
          </div>
          <div style="margin-top: 4px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px; padding: 8px 10px;">
            <label style="display:flex; align-items:center; gap: 8px; cursor:pointer; font-size: 12px; color: #38bdf8; font-weight: 600; margin: 0;">
              <input type="checkbox" style="width: 16px; height: 16px; accent-color: #38bdf8;" \${btn.use_monetag ? 'checked' : ''} onchange="updateCtaButtonField(\${idx}, 'use_monetag', this.checked)">
              <span>💰 Use Monetag Direct Link (Opens link in New Tab, keeps landing page open)</span>
            </label>
          </div>
        </div>
      \`).join('');
    }

    function addCtaButtonRow() {
      currentCtaButtons.push({ label: 'New Action Button ✨', color: '#8b5cf6', use_monetag: true });
      renderCtaButtonsEditor(currentCtaButtons);
    }

    function removeCtaButtonRow(idx) {
      currentCtaButtons.splice(idx, 1);
      renderCtaButtonsEditor(currentCtaButtons);
    }

    function updateCtaButtonField(idx, field, value) {
      if (currentCtaButtons[idx]) {
        currentCtaButtons[idx][field] = value;
      }
    }

    function openCreateModal() {
      document.getElementById('edit-id').value = '';
      document.getElementById('modal-title').textContent = 'Create New Landing Page';
      document.getElementById('p-subdomain').value = '';
      document.getElementById('p-subdomain').disabled = false;
      document.getElementById('p-status').value = 'published';
      document.getElementById('p-persona-name').value = 'Nethmi';
      document.getElementById('p-typing-delay').value = 1500;
      document.getElementById('p-avatar-url').value = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
      document.getElementById('p-chat-message').value = 'Hey there! ❤️ Thanks for visiting my page. Tap below to see what I have uploaded for you!';
      document.getElementById('p-routing-mode').value = 'direct';
      document.getElementById('p-routing-target').value = 'https://example.com';
      document.getElementById('p-fallback-url').value = '';
      document.getElementById('p-ad-url').value = '';
      document.getElementById('p-ad-popunder').value = '';
      document.getElementById('p-ad-socialbar').value = '';
      document.getElementById('p-monetag-link').value = '';
      document.getElementById('p-app-download-enabled').checked = true;
      document.getElementById('p-apk-url').value = '/app.apk';
      document.getElementById('p-og-title').value = 'Online Now ✨ - Connect with me';
      document.getElementById('p-og-desc').value = 'Check out my official profile and links.';
      document.getElementById('p-theme-accent').value = '#e91e63';
      renderCtaButtonsEditor([
        { label: 'Reply in Private Chat ❤️', color: '#e91e63', use_monetag: true },
        { label: 'View Private Photos 📸', color: '#9c27b0', use_monetag: false }
      ]);
      currentChatMedia = [];
      currentUnlockMedia = [];
      renderChatMediaList();
      renderUnlockMediaList();
      updateRoutingHelp();
      document.getElementById('page-modal').style.display = 'flex';
    }

    function openEditModal(id) {
      const p = pages.find(x => x.id === id);
      if (!p) return;
      document.getElementById('edit-id').value = p.id;
      document.getElementById('modal-title').textContent = 'Edit Landing Page (' + p.subdomain + ')';
      document.getElementById('p-subdomain').value = p.subdomain;
      document.getElementById('p-subdomain').disabled = true;
      document.getElementById('p-status').value = p.status;
      document.getElementById('p-persona-name').value = p.persona_name;
      document.getElementById('p-typing-delay').value = p.typing_delay_ms;
      document.getElementById('p-avatar-url').value = p.avatar_url;
      document.getElementById('p-chat-message').value = p.chat_message;
      document.getElementById('p-routing-mode').value = p.routing_mode;
      document.getElementById('p-routing-target').value = p.routing_target;
      document.getElementById('p-fallback-url').value = p.fallback_url || '';
      document.getElementById('p-ad-url').value = p.ad_url || '';
      document.getElementById('p-ad-popunder').value = p.ad_popunder || p.ad_popunder_code || '';
      document.getElementById('p-ad-socialbar').value = p.ad_socialbar || p.ad_socialbar_code || '';
      document.getElementById('p-monetag-link').value = p.monetag_direct_link || '';
      document.getElementById('p-app-download-enabled').checked = p.app_download_enabled !== 0;
      document.getElementById('p-apk-url').value = p.apk_download_url || '/app.apk';
      document.getElementById('p-og-title').value = p.og_title || '';
      document.getElementById('p-og-desc').value = p.og_description || '';
      document.getElementById('p-theme-accent').value = p.theme_accent || '#e91e63';
      
      let parsedBtns = [];
      try {
        parsedBtns = typeof p.cta_buttons_json === 'string' ? JSON.parse(p.cta_buttons_json) : p.cta_buttons_json;
      } catch (e) {}
      renderCtaButtonsEditor(parsedBtns);

      try {
        currentChatMedia = typeof p.chat_media_json === 'string' ? JSON.parse(p.chat_media_json) : (p.chat_media_json || []);
      } catch (e) { currentChatMedia = []; }
      try {
        currentUnlockMedia = typeof p.unlock_media_json === 'string' ? JSON.parse(p.unlock_media_json) : (p.unlock_media_json || []);
      } catch (e) { currentUnlockMedia = []; }
      renderChatMediaList();
      renderUnlockMediaList();
      
      updateRoutingHelp();
      document.getElementById('page-modal').style.display = 'flex';
    }

    function updateRoutingHelp() {
      const mode = document.getElementById('p-routing-mode').value;
      const hint = document.getElementById('routing-hint');
      const label = document.getElementById('target-label');
      if (mode === 'chrome_intent') {
        label.textContent = 'Ad Destination URL or Code';
        hint.textContent = '💡 On Android FB/IG webviews, creates intent://[target]#Intent;scheme=https;package=com.android.chrome;end to open Chrome.';
      } else if (mode === 'app_deep_link' || mode === 'AppRouter') {
        label.textContent = 'App Target (Username or URI Scheme)';
        hint.textContent = '💡 Instant Auto-Redirect: Skips landing page and immediately redirects visitor to the app URI (with 500ms fallback to web URL).';
      } else {
        label.textContent = 'Direct Target URL';
        hint.textContent = '💡 Regular immediate redirect to destination URL on CTA button click.';
      }
    }

    async function handleSavePage(e) {
      e.preventDefault();
      const id = document.getElementById('edit-id').value;
      const payload = {
        subdomain: document.getElementById('p-subdomain').value.trim().toLowerCase(),
        status: document.getElementById('p-status').value,
        persona_name: document.getElementById('p-persona-name').value.trim(),
        typing_delay_ms: Number(document.getElementById('p-typing-delay').value),
        avatar_url: document.getElementById('p-avatar-url').value.trim(),
        chat_message: document.getElementById('p-chat-message').value.trim(),
        routing_mode: document.getElementById('p-routing-mode').value,
        routing_target: document.getElementById('p-routing-target').value.trim(),
        fallback_url: document.getElementById('p-fallback-url').value.trim(),
        ad_url: document.getElementById('p-ad-url').value.trim(),
        ad_popunder: document.getElementById('p-ad-popunder').value.trim(),
        ad_socialbar: document.getElementById('p-ad-socialbar').value.trim(),
        ad_popunder_code: document.getElementById('p-ad-popunder').value.trim(),
        ad_socialbar_code: document.getElementById('p-ad-socialbar').value.trim(),
        ad_popunder_enabled: document.getElementById('p-ad-popunder').value.trim() ? 1 : 0,
        ad_socialbar_enabled: document.getElementById('p-ad-socialbar').value.trim() ? 1 : 0,
        app_download_enabled: document.getElementById('p-app-download-enabled').checked ? 1 : 0,
        apk_download_url: document.getElementById('p-apk-url').value.trim() || '/app.apk',
        monetag_direct_link: document.getElementById('p-monetag-link').value.trim(),
        cta_buttons_json: JSON.stringify(currentCtaButtons),
        chat_media_json: JSON.stringify(currentChatMedia),
        unlock_media_json: JSON.stringify(currentUnlockMedia),
        og_title: document.getElementById('p-og-title').value.trim(),
        og_description: document.getElementById('p-og-desc').value.trim(),
        theme_accent: document.getElementById('p-theme-accent').value
      };

      const url = id ? ('/api/pages/' + id) : '/api/pages';
      const method = id ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          closeModal();
          loadPages();
          loadGlobalStats();
        } else {
          const err = await res.json();
          alert('Error saving: ' + (err.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Failed to connect to server.');
      }
    }

    async function deletePage(id) {
      if (!confirm('Are you sure you want to delete this subdomain and all its analytics?')) return;
      try {
        const res = await fetch('/api/pages/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
          loadPages();
          loadGlobalStats();
        }
      } catch (e) {}
    }

    async function openAnalyticsModal(id, sub) {
      document.getElementById('analytics-modal-title').textContent = 'Analytics: ' + sub + '.' + rootDomain;
      document.getElementById('analytics-modal').style.display = 'flex';
      
      try {
        const res = await fetch('/api/analytics/' + id, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        document.getElementById('a-views').textContent = data.views || 0;
        document.getElementById('a-visitors').textContent = data.uniqueVisitors || 0;
        document.getElementById('a-clicks').textContent = data.clicks || 0;
        document.getElementById('a-ctr').textContent = data.ctr || '0%';

        const refEl = document.getElementById('a-referrers');
        if (data.referrers && data.referrers.length > 0) {
          refEl.innerHTML = data.referrers.map(r => \`
            <div style="display:flex; justify-content:space-between; margin-bottom: 6px; border-bottom: 1px solid #27272a; padding-bottom: 4px;">
              <span style="color:#fff;">\${escapeHtml(r.referrer || 'Direct')}</span>
              <strong style="color:var(--primary);">\${r.count}</strong>
            </div>
          \`).join('');
        } else {
          refEl.innerHTML = '<span style="color:var(--text-muted);">No referrers recorded yet</span>';
        }

        const platEl = document.getElementById('a-platforms');
        if (data.platforms && data.platforms.length > 0) {
          platEl.innerHTML = data.platforms.map(p => \`
            <div style="display:flex; justify-content:space-between; margin-bottom: 6px; border-bottom: 1px solid #27272a; padding-bottom: 4px;">
              <span style="color:#fff;">\${escapeHtml(p.platform)}</span>
              <strong style="color:var(--accent);">\${p.count}</strong>
            </div>
          \`).join('');
        } else {
          platEl.innerHTML = '<span style="color:var(--text-muted);">No platforms recorded yet</span>';
        }
      } catch (e) {}
    }

    function closeModal() { document.getElementById('page-modal').style.display = 'none'; }
    function closeAnalyticsModal() { document.getElementById('analytics-modal').style.display = 'none'; }

    // ==========================================
    // 📲 APP MANAGER & NOTIFICATIONS CONTROLLERS
    // ==========================================
    let currentTab = 'pages';
    let appManagerData = { config: {}, templates: [], profiles: [] };

    function switchTab(tab) {
      currentTab = tab;
      const btnPages = document.getElementById('tab-btn-pages');
      const btnAppMgr = document.getElementById('tab-btn-app-mgr');
      const viewPages = document.getElementById('view-pages');
      const viewAppMgr = document.getElementById('view-app-mgr');

      if (tab === 'app-mgr') {
        btnPages.style.background = 'transparent';
        btnPages.style.borderColor = '#3f3f46';
        btnAppMgr.style.background = '#27272a';
        btnAppMgr.style.borderColor = 'var(--primary)';
        viewPages.style.display = 'none';
        viewAppMgr.style.display = 'block';
        loadAppManagerData();
      } else {
        btnPages.style.background = '#27272a';
        btnPages.style.borderColor = 'var(--primary)';
        btnAppMgr.style.background = 'transparent';
        btnAppMgr.style.borderColor = '#3f3f46';
        viewPages.style.display = 'block';
        viewAppMgr.style.display = 'none';
        loadPages();
      }
    }

    async function loadAppManagerData() {
      try {
        const res = await fetch('/api/admin/app-manager', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) return;
        appManagerData = await res.json();
        
        renderAppProfiles(appManagerData.profiles || []);
        populateAppConfig(appManagerData.config || {});
        populateProfileSelect(appManagerData.profiles || []);
        renderTemplates(appManagerData.templates || []);
        updateTplPreview();
        populateQuizProfilesDropdown(appManagerData.profiles || []);
        loadQuizPhotosForSelectedProfile();
      } catch (err) {
        console.error('Failed to load App Manager data:', err);
      }
    }

    function renderAppProfiles(profiles) {
      const activeCount = profiles.filter(p => p.isVisibleInApp !== false).length;
      const badge = document.getElementById('app-profiles-badge');
      if (badge) badge.textContent = activeCount + ' Profiles Active in App';

      const tbody = document.getElementById('app-profiles-tbody');
      if (!tbody) return;

      if (profiles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 24px; color: var(--text-muted);">No profiles created yet. Create a landing page first.</td></tr>';
        return;
      }

      tbody.innerHTML = profiles.map(p => \`
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap: 10px;">
              <img class="page-avatar-thumb" src="\${p.avatarUrl}" onerror="this.src='https://via.placeholder.com/40'">
              <div>
                <div style="font-weight: 700; display:flex; align-items:center; gap: 6px;">
                  \${escapeHtml(p.name)}
                  \${p.isPinned ? '<span title="Pinned to top">📌</span>' : ''}
                </div>
                <div style="font-size: 11px; color: var(--text-muted);">@\${escapeHtml(p.slug)}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="font-size: 13px; color: var(--primary);">\${escapeHtml(p.slug)}.\${rootDomain}</span>
          </td>
          <td style="text-align: center;">
            <label style="cursor:pointer; display:inline-flex; align-items:center; gap: 6px;">
              <input type="checkbox" style="width: 18px; height: 18px; accent-color: var(--success);" \${p.isVisibleInApp !== false ? 'checked' : ''} onchange="toggleAppVisibility('\${p.id}', this.checked)">
              <span style="font-size: 12px; font-weight: 600; color: \${p.isVisibleInApp !== false ? 'var(--success)' : 'var(--text-muted)'};">\${p.isVisibleInApp !== false ? 'Visible' : 'Hidden'}</span>
            </label>
          </td>
          <td style="text-align: center;">
            <label style="cursor:pointer; display:inline-flex; align-items:center; gap: 6px;">
              <input type="checkbox" style="width: 18px; height: 18px; accent-color: #f59e0b;" \${p.isPinned ? 'checked' : ''} onchange="toggleAppPin('\${p.id}', this.checked)">
              <span style="font-size: 12px; font-weight: 600; color: \${p.isPinned ? '#f59e0b' : 'var(--text-muted)'};">\${p.isPinned ? 'Pinned 📌' : 'Normal'}</span>
            </label>
          </td>
        </tr>
      \`).join('');
    }

    async function toggleAppVisibility(id, isVisibleInApp) {
      try {
        const res = await fetch('/api/admin/app-profiles/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ isVisibleInApp })
        });
        if (res.ok) {
          const prof = appManagerData.profiles.find(p => p.id === id);
          if (prof) prof.isVisibleInApp = isVisibleInApp;
          renderAppProfiles(appManagerData.profiles);
          populateProfileSelect(appManagerData.profiles);
        }
      } catch (err) {
        alert('Failed to update profile visibility.');
      }
    }

    async function toggleAppPin(id, isPinned) {
      try {
        const res = await fetch('/api/admin/app-profiles/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ isPinned })
        });
        if (res.ok) {
          const prof = appManagerData.profiles.find(p => p.id === id);
          if (prof) prof.isPinned = isPinned;
          renderAppProfiles(appManagerData.profiles);
        }
      } catch (err) {
        alert('Failed to update pin status.');
      }
    }

    function populateAppConfig(cfg) {
      const chk = document.getElementById('cfg-enabled');
      if (chk) chk.checked = cfg.notificationsEnabled !== false;
      const minI = document.getElementById('cfg-min-interval');
      if (minI) minI.value = cfg.minIntervalMinutes || 30;
      const maxI = document.getElementById('cfg-max-interval');
      if (maxI) maxI.value = cfg.maxIntervalMinutes || 180;
      const qStart = document.getElementById('cfg-quiet-start');
      if (qStart) qStart.value = cfg.quietHoursStart != null ? cfg.quietHoursStart : 23;
      const qEnd = document.getElementById('cfg-quiet-end');
      if (qEnd) qEnd.value = cfg.quietHoursEnd != null ? cfg.quietHoursEnd : 7;
    }

    async function handleSaveAppConfig(e) {
      e.preventDefault();
      const statusEl = document.getElementById('cfg-status');
      const payload = {
        notificationsEnabled: document.getElementById('cfg-enabled').checked,
        minIntervalMinutes: Number(document.getElementById('cfg-min-interval').value),
        maxIntervalMinutes: Number(document.getElementById('cfg-max-interval').value),
        quietHoursStart: Number(document.getElementById('cfg-quiet-start').value),
        quietHoursEnd: Number(document.getElementById('cfg-quiet-end').value)
      };

      try {
        const res = await fetch('/api/admin/app-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          if (statusEl) {
            statusEl.style.display = 'inline';
            setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
          }
        } else {
          alert('Failed to save notification settings.');
        }
      } catch (err) {
        alert('Connection error while saving settings.');
      }
    }

    function populateProfileSelect(profiles) {
      const select = document.getElementById('tpl-profile-id');
      if (!select) return;
      const currentVal = select.value;
      const active = profiles.filter(p => p.isVisibleInApp !== false);
      let html = '<option value="all">🎲 Random Active Profile</option>';
      html += active.map(p => \`<option value="\${p.id}">\${escapeHtml(p.name)} (@\${escapeHtml(p.slug)})</option>\`).join('');
      select.innerHTML = html;
      if (currentVal) select.value = currentVal;
    }

    function toggleTplMode() {
      const mode = document.getElementById('tpl-type').value;
      const sec = document.getElementById('tpl-image-section');
      if (sec) sec.style.display = mode === 'image_text' ? 'block' : 'none';
      updateTplPreview();
    }

    async function handleImageFileUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const statusEl = document.getElementById('tpl-upload-status');
      if (statusEl) statusEl.textContent = 'Uploading image...';

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/api/admin/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({
              dataUrl: reader.result,
              filename: file.name,
              mimeType: file.type || 'image/jpeg'
            })
          });
          const data = await res.json();
          if (res.ok && data.url) {
            document.getElementById('tpl-image-url').value = data.url;
            if (statusEl) statusEl.textContent = '✓ Uploaded successfully!';
            updateTplPreview();
          } else {
            if (statusEl) statusEl.textContent = 'Upload failed: ' + (data.error || 'Server error');
          }
        } catch (err) {
          if (statusEl) statusEl.textContent = 'Upload error: ' + err.message;
        }
      };
      reader.readAsDataURL(file);
    }

    function updateTplPreview() {
      const msgInput = document.getElementById('tpl-message');
      const charCount = document.getElementById('tpl-char-count');
      const text = msgInput ? msgInput.value : '';
      if (charCount) charCount.textContent = text.length + ' chars';

      const prevMsg = document.getElementById('prev-message');
      if (prevMsg) prevMsg.textContent = text || 'Hey there! Are you free right now? ❤️';

      const profileSelect = document.getElementById('tpl-profile-id');
      const prevSender = document.getElementById('prev-sender');
      const prevAvatar = document.getElementById('prev-avatar');

      let senderName = 'Nethmi';
      let avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';

      if (profileSelect && profileSelect.value !== 'all') {
        const prof = (appManagerData.profiles || []).find(p => p.id === profileSelect.value);
        if (prof) {
          senderName = prof.name;
          avatarUrl = prof.avatarUrl;
        }
      } else if (appManagerData.profiles && appManagerData.profiles.length > 0) {
        senderName = appManagerData.profiles[0].name;
        avatarUrl = appManagerData.profiles[0].avatarUrl;
      }

      if (prevSender) prevSender.textContent = senderName;
      if (prevAvatar) prevAvatar.src = avatarUrl;

      const typeSelect = document.getElementById('tpl-type');
      const imgUrlInput = document.getElementById('tpl-image-url');
      const bigPicContainer = document.getElementById('prev-big-pic-container');
      const bigPic = document.getElementById('prev-big-pic');

      if (typeSelect && typeSelect.value === 'image_text' && imgUrlInput && imgUrlInput.value.trim()) {
        if (bigPicContainer) bigPicContainer.style.display = 'block';
        if (bigPic) bigPic.src = imgUrlInput.value.trim();
      } else {
        if (bigPicContainer) bigPicContainer.style.display = 'none';
      }
    }

    async function handleCreateTemplate(e) {
      e.preventDefault();
      const profileId = document.getElementById('tpl-profile-id').value;
      const type = document.getElementById('tpl-type').value;
      const message = document.getElementById('tpl-message').value.trim();
      const imageUrl = document.getElementById('tpl-image-url').value.trim();

      if (type === 'image_text' && !imageUrl) {
        alert('Please provide an image URL or upload an image for "Image + Message" templates.');
        return;
      }

      try {
        const res = await fetch('/api/admin/notification-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ profileId, type, message, imageUrl })
        });
        if (res.ok) {
          document.getElementById('tpl-message').value = '';
          document.getElementById('tpl-image-url').value = '';
          const fileInp = document.getElementById('tpl-file-input');
          if (fileInp) fileInp.value = '';
          const statusEl = document.getElementById('tpl-upload-status');
          if (statusEl) statusEl.textContent = '';
          loadAppManagerData();
        } else {
          const data = await res.json();
          alert('Error creating template: ' + (data.error || 'Server error'));
        }
      } catch (err) {
        alert('Connection error.');
      }
    }

    function renderTemplates(templates) {
      const countEl = document.getElementById('tpl-count');
      if (countEl) countEl.textContent = templates.length;

      const tbody = document.getElementById('templates-tbody');
      if (!tbody) return;

      if (templates.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 24px; color: var(--text-muted);">No notification templates configured. Create one above!</td></tr>';
        return;
      }

      tbody.innerHTML = templates.map(t => {
        let targetName = '🎲 Random Active Profile';
        if (t.profileId && t.profileId !== 'all') {
          const prof = (appManagerData.profiles || []).find(p => p.id === t.profileId);
          if (prof) targetName = prof.name + ' (@' + prof.slug + ')';
        }

        const isImg = t.type === 'image_text';
        return \`
          <tr>
            <td>
              <span class="badge" style="background: \${isImg ? 'rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)'}; color: \${isImg ? 'var(--accent)' : 'var(--primary)'};">
                \${isImg ? '📸 Image + Text' : '💬 Text'}
              </span>
            </td>
            <td style="font-weight: 600; font-size: 13px;">\${escapeHtml(targetName)}</td>
            <td style="font-size: 13px; max-width: 320px;">\${escapeHtml(t.message)}</td>
            <td>
              \${t.imageUrl ? \`<img src="\${t.imageUrl}" style="width: 48px; height: 36px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border);" onerror="this.style.display='none'">\` : '<span style="color:var(--text-muted); font-size:12px;">—</span>'}
            </td>
            <td style="text-align: right;">
              <button class="btn btn-danger btn-sm" onclick="deleteTemplate('\${t.id}')">Delete</button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    async function deleteTemplate(id) {
      if (!confirm('Are you sure you want to delete this notification template?')) return;
      try {
        const res = await fetch('/api/admin/notification-templates/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
          loadAppManagerData();
        }
      } catch (err) {
        alert('Failed to delete template.');
      }
    }

    // --- Compatibility Quiz Photos Uploader & Viewer ---
    let currentQuizPhotos = [
      { slot: 1, label: 'Photo 1', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
      { slot: 2, label: 'Photo 2', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
      { slot: 3, label: 'Photo 3', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' }
    ];

    function populateQuizProfilesDropdown(profiles) {
      const select = document.getElementById('quiz-photo-profile-select');
      if (!select) return;
      const currentVal = select.value;
      let html = '<option value="default">🌟 Global Default (All Profiles)</option>';
      (profiles || []).forEach(p => {
        html += '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.name) + ' (@' + escapeHtml(p.slug) + ')</option>';
      });
      select.innerHTML = html;
      if (currentVal) select.value = currentVal;
    }

    async function loadQuizPhotosForSelectedProfile() {
      const select = document.getElementById('quiz-photo-profile-select');
      const profileId = select ? select.value : 'default';

      try {
        const res = await fetch('/api/admin/quiz-photos?profileId=' + encodeURIComponent(profileId), {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.quizPhotos) && data.quizPhotos.length > 0) {
            currentQuizPhotos = data.quizPhotos;
          }
        }
      } catch (err) {
        console.error('Error fetching quiz photos:', err);
      }
      renderQuizPhotosSlots();
    }

    function renderQuizPhotosSlots() {
      [1, 2, 3].forEach(slot => {
        const item = currentQuizPhotos.find(p => Number(p.slot) === slot) || { slot, imageUrl: '' };
        const imgEl = document.getElementById('quiz-preview-img-' + slot);
        if (imgEl) {
          imgEl.src = item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Photo';
        }
      });
    }

    function toggleSlotBlurPreview(slot) {
      const toggle = document.getElementById('quiz-blur-toggle-' + slot);
      const imgEl = document.getElementById('quiz-preview-img-' + slot);
      const overlayEl = document.getElementById('quiz-blur-overlay-' + slot);
      const isBlurred = toggle && toggle.checked;

      if (imgEl) {
        imgEl.style.filter = isBlurred ? 'blur(16px)' : 'none';
      }
      if (overlayEl) {
        overlayEl.style.display = isBlurred ? 'flex' : 'none';
      }
    }

    async function handleQuizPhotoFileSelected(e, slot) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const statusEl = document.getElementById('quiz-slot-status-' + slot);
      if (statusEl) statusEl.textContent = 'Compressing image...';

      try {
        // Client-side canvas compression to max 1280px / 82% quality WebP/JPEG
        const compressedBlob = await compressImageToBlob(file, 1280, 0.82);
        if (statusEl) statusEl.textContent = 'Uploading to KV...';

        const formData = new FormData();
        formData.append('file', compressedBlob, file.name.replace(/\\.[^/.]+$/, '') + '.webp');

        const uploadRes = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token },
          body: formData
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Upload failed');
        }

        const uploadData = await uploadRes.json();
        const uploadedUrl = uploadData.url;

        // Update local slot
        let slotItem = currentQuizPhotos.find(p => Number(p.slot) === slot);
        if (!slotItem) {
          slotItem = { slot, label: 'Photo ' + slot, imageUrl: uploadedUrl };
          currentQuizPhotos.push(slotItem);
        } else {
          slotItem.imageUrl = uploadedUrl;
        }

        renderQuizPhotosSlots();
        if (statusEl) statusEl.textContent = '✓ Uploaded successfully!';
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);

        // Auto-save to backend
        await persistQuizPhotos();
      } catch (err) {
        if (statusEl) statusEl.textContent = 'Error: ' + err.message;
      }
    }

    async function removeQuizPhotoSlot(slot) {
      if (!confirm('Remove photo from Slot ' + slot + '? It will reset to default placeholder.')) return;
      let slotItem = currentQuizPhotos.find(p => Number(p.slot) === slot);
      if (slotItem) {
        slotItem.imageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
      }
      renderQuizPhotosSlots();
      await persistQuizPhotos();
    }

    async function persistQuizPhotos() {
      const select = document.getElementById('quiz-photo-profile-select');
      const profileId = select ? select.value : 'default';
      const saveStatus = document.getElementById('quiz-save-status');

      try {
        const res = await fetch('/api/admin/quiz-photos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ profileId, quizPhotos: currentQuizPhotos })
        });
        if (res.ok) {
          if (saveStatus) {
            saveStatus.style.display = 'inline';
            setTimeout(() => { saveStatus.style.display = 'none'; }, 2500);
          }
        }
      } catch (err) {
        console.error('Failed to save quiz photos:', err);
      }
    }

    function compressImageToBlob(file, maxDimension, quality) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = reject;

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas to Blob compression failed'));
              }
            },
            'image/webp',
            quality
          );
        };
        img.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    function escapeHtml(s) {
      if (!s) return '';
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    window.onload = init;
  </script>
</body>
</html>`;
}

