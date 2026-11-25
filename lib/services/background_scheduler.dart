import 'dart:convert';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:workmanager/workmanager.dart';
import '../config.dart';
import 'notification_service.dart';

@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((taskName, inputData) async {
    try {
      return await BackgroundScheduler.executeNotificationTask();
    } catch (e) {
      debugPrint('BackgroundScheduler worker task execution error: $e');
      return true;
    }
  });
}

class BackgroundScheduler {
  static const String taskName = 'companion_random_notification';

  /// Initialize WorkManager background worker
  static Future<void> initialize() async {
    try {
      await Workmanager().initialize(
        callbackDispatcher,
        isInDebugMode: false,
      );

      // Register periodic background sync (every 30 mins) as base heartbeat
      await Workmanager().registerPeriodicTask(
        'periodic_companion_sync',
        taskName,
        frequency: const Duration(minutes: 30),
        constraints: Constraints(
          networkType: NetworkType.connected,
        ),
        existingWorkPolicy: ExistingWorkPolicy.keep,
      );

      // Also register initial randomized one-off task
      await Workmanager().registerOneOffTask(
        'initial_companion_random_${DateTime.now().millisecondsSinceEpoch}',
        taskName,
        initialDelay: const Duration(minutes: 20),
        existingWorkPolicy: ExistingWorkPolicy.replace,
      );
    } catch (e) {
      debugPrint('Failed to initialize Workmanager: $e');
    }
  }

  /// Executes remote notification checks, rules evaluation, and notification firing
  static Future<bool> executeNotificationTask() async {
    try {
      // 1. Fetch remote App Config & notification settings
      final configUri = Uri.parse(AppConfig.apiConfigUrl);
      final configRes = await http.get(configUri).timeout(const Duration(seconds: 10));

      Map<String, dynamic> config = {};
      List<dynamic> templates = [];

      if (configRes.statusCode == 200) {
        final data = jsonDecode(configRes.body);
        if (data is Map<String, dynamic>) {
          config = data;
          if (data['templates'] is List) {
            templates = data['templates'];
          }
        }
      }

      final bool notificationsEnabled = config['notificationsEnabled'] != false;
      if (!notificationsEnabled) {
        debugPrint('Remote notifications disabled by admin config.');
        return true;
      }

      final int minInterval = (config['minIntervalMinutes'] as num?)?.toInt() ?? 30;
      final int maxInterval = (config['maxIntervalMinutes'] as num?)?.toInt() ?? 180;
      final int quietStart = (config['quietHoursStart'] as num?)?.toInt() ?? 23;
      final int quietEnd = (config['quietHoursEnd'] as num?)?.toInt() ?? 7;

      // 2. Evaluate Quiet Hours
      final now = DateTime.now();
      final currentHour = now.hour;
      bool isQuiet = false;
      if (quietStart > quietEnd) {
        // e.g. 23:00 to 07:00
        isQuiet = currentHour >= quietStart || currentHour < quietEnd;
      } else if (quietStart < quietEnd) {
        // e.g. 01:00 to 06:00
        isQuiet = currentHour >= quietStart && currentHour < quietEnd;
      }

      if (isQuiet) {
        debugPrint('Currently in quiet hours ($quietStart:00 to $quietEnd:00). Skipping notification.');
        _scheduleNextRandomTask(minInterval, maxInterval);
        return true;
      }

      // 3. Fetch public active profiles
      final profilesUri = Uri.parse(AppConfig.apiProfilesUrl);
      final profilesRes = await http.get(profilesUri).timeout(const Duration(seconds: 10));
      List<dynamic> profiles = [];

      if (profilesRes.statusCode == 200) {
        final data = jsonDecode(profilesRes.body);
        if (data is Map && data['profiles'] is List) {
          profiles = data['profiles'];
        }
      }

      if (profiles.isEmpty) {
        debugPrint('No active profiles found for notifications.');
        return true;
      }

      // 4. Select a template
      final random = Random();
      Map<String, dynamic> selectedTemplate;

      if (templates.isNotEmpty) {
        final idx = random.nextInt(templates.length);
        selectedTemplate = Map<String, dynamic>.from(templates[idx]);
      } else {
        selectedTemplate = {
          'profileId': 'all',
          'type': 'text',
          'message': 'Hey there! Thinking about you ❤️ Hope you are having a nice day.',
          'imageUrl': null,
        };
      }

      // 5. Select target profile
      final targetProfileId = selectedTemplate['profileId']?.toString();
      Map<String, dynamic> targetProfile;

      if (targetProfileId != null && targetProfileId != 'all') {
        final found = profiles.firstWhere(
          (p) => p['id']?.toString() == targetProfileId,
          orElse: () => profiles[random.nextInt(profiles.length)],
        );
        targetProfile = Map<String, dynamic>.from(found);
      } else {
        targetProfile = Map<String, dynamic>.from(profiles[random.nextInt(profiles.length)]);
      }

      // 6. Initialize local notifications & display
      await NotificationService.init();

      final notifId = DateTime.now().millisecondsSinceEpoch ~/ 1000;
      final senderName = targetProfile['name']?.toString() ?? 'SecretChat';
      final message = selectedTemplate['message']?.toString() ?? 'Hey there! ❤️';
      final String? imageUrl = selectedTemplate['type'] == 'image_text'
          ? selectedTemplate['imageUrl']?.toString()
          : null;

      await NotificationService.showNotification(
        id: notifId,
        title: senderName,
        body: message,
        imageUrl: imageUrl,
        payload: {
          'profileId': targetProfile['id'],
          'profileSlug': targetProfile['slug'],
          'profileName': senderName,
          'message': message,
          'imageUrl': imageUrl,
        },
      );

      // 7. Chain next randomized one-off task
      _scheduleNextRandomTask(minInterval, maxInterval);

      return true;
    } catch (e) {
      debugPrint('Background notification execution error: $e');
      return true;
    }
  }

  static void _scheduleNextRandomTask(int minInterval, int maxInterval) {
    try {
      final random = Random();
      final min = minInterval.clamp(15, 1440);
      final max = maxInterval.clamp(min, 1440);
      final randomMinutes = min + random.nextInt(max - min + 1);

      Workmanager().registerOneOffTask(
        'notif_${DateTime.now().millisecondsSinceEpoch}',
        taskName,
        initialDelay: Duration(minutes: randomMinutes),
        existingWorkPolicy: ExistingWorkPolicy.replace,
      );
    } catch (e) {
      debugPrint('Failed to schedule next random task: $e');
    }
  }
}
