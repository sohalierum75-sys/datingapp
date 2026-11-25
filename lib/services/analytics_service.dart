import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config.dart';

class LiveStats {
  final int totalDownloads;
  final int onlineTotal;
  final int onlineWeb;
  final int onlineApp;
  final int todayVisits;
  final int todayUnique;
  final int todayDownloads;
  final int totalVisits;

  const LiveStats({
    this.totalDownloads = 0,
    this.onlineTotal = 0,
    this.onlineWeb = 0,
    this.onlineApp = 0,
    this.todayVisits = 0,
    this.todayUnique = 0,
    this.todayDownloads = 0,
    this.totalVisits = 0,
  });

  factory LiveStats.fromJson(Map<String, dynamic> json) {
    final online = json['onlineNow'] as Map<String, dynamic>? ?? {};
    final today = json['today'] as Map<String, dynamic>? ?? {};
    return LiveStats(
      totalDownloads: json['totalDownloads'] as int? ?? 0,
      onlineTotal: online['total'] as int? ?? 0,
      onlineWeb: online['web'] as int? ?? 0,
      onlineApp: online['app'] as int? ?? 0,
      todayVisits: today['visits'] as int? ?? 0,
      todayUnique: today['uniqueVisitors'] as int? ?? 0,
      todayDownloads: today['downloads'] as int? ?? 0,
      totalVisits: json['totalVisits'] as int? ?? 0,
    );
  }
}

class AnalyticsService {
  static const String _keyClientId = 'cs_client_id';
  static const String _keyInstallTracked = 'cs_app_install_tracked';

  static String? _cachedClientId;
  static Timer? _heartbeatTimer;
  static final ValueNotifier<int> liveOnlineUsers = ValueNotifier<int>(0);

  /// Generates a cryptographically random RFC 4122 UUID v4
  static String _generateUuid() {
    final rnd = Random.secure();
    final values = List<int>.generate(16, (i) => rnd.nextInt(256));
    values[6] = (values[6] & 0x0f) | 0x40; // Version 4
    values[8] = (values[8] & 0x3f) | 0x80; // Variant RFC 4122

    final buffer = StringBuffer();
    for (int i = 0; i < 16; i++) {
      if (i == 4 || i == 6 || i == 8 || i == 10) buffer.write('-');
      buffer.write(values[i].toRadixString(16).padLeft(2, '0'));
    }
    return buffer.toString();
  }

  /// Get or create persistent anonymous client ID
  static Future<String> getOrCreateClientId() async {
    if (_cachedClientId != null && _cachedClientId!.isNotEmpty) {
      return _cachedClientId!;
    }
    final prefs = await SharedPreferences.getInstance();
    var id = prefs.getString(_keyClientId);
    if (id == null || id.isEmpty) {
      id = _generateUuid();
      await prefs.setString(_keyClientId, id);
    }
    _cachedClientId = id;
    return id;
  }

  /// Track single event to POST /api/track
  static Future<bool> trackEvent(String type, {String? pageSlug}) async {
    try {
      final clientId = await getOrCreateClientId();
      final url = Uri.parse(AppConfig.apiTrackUrl);
      final body = jsonEncode({
        'type': type,
        'clientId': clientId,
        'source': 'app',
        if (pageSlug != null) 'pageSlug': pageSlug,
      });

      final res = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: body,
      ).timeout(const Duration(seconds: 8));

      return res.statusCode >= 200 && res.statusCode < 300;
    } catch (e) {
      if (kDebugMode) {
        print('[Analytics] Error tracking event $type: $e');
      }
      return false;
    }
  }

  /// Start lifecycle tracking: track install (once), track visit, and start 60s heartbeat
  static Future<void> start() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final installTracked = prefs.getBool(_keyInstallTracked) ?? false;
      if (!installTracked) {
        final success = await trackEvent('app_install');
        if (success) {
          await prefs.setBool(_keyInstallTracked, true);
        }
      }

      // Track active app session visit
      await trackEvent('visit');

      // Cancel any existing heartbeat timer
      _heartbeatTimer?.cancel();

      // Send heartbeat every 60 seconds while app is in foreground
      _heartbeatTimer = Timer.periodic(const Duration(seconds: 60), (_) {
        trackEvent('heartbeat');
      });

      // Fetch initial live stats
      await fetchStats();
    } catch (e) {
      if (kDebugMode) {
        print('[Analytics] Error starting analytics service: $e');
      }
    }
  }

  /// Pause heartbeat on app paused/backgrounded
  static void onPause() {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = null;
  }

  /// Resume heartbeat on app resumed
  static void onResume() {
    trackEvent('heartbeat');
    _heartbeatTimer?.cancel();
    _heartbeatTimer = Timer.periodic(const Duration(seconds: 60), (_) {
      trackEvent('heartbeat');
    });
    fetchStats();
  }

  /// Fetch live stats from GET /api/stats
  static Future<LiveStats?> fetchStats() async {
    try {
      final url = Uri.parse(AppConfig.apiStatsUrl);
      final res = await http.get(url).timeout(const Duration(seconds: 8));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body) as Map<String, dynamic>;
        final stats = LiveStats.fromJson(data);
        liveOnlineUsers.value = stats.onlineTotal;
        return stats;
      }
    } catch (e) {
      if (kDebugMode) {
        print('[Analytics] Error fetching live stats: $e');
      }
    }
    return null;
  }
}
