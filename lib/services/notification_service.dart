import 'dart:convert';
import 'dart:io';
import 'dart:ui';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

class NotificationService {
  static final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();

  static Function(Map<String, dynamic>)? onNotificationTapped;

  static const String channelId = 'companion_notifications';
  static const String channelName = 'Companion Messages';
  static const String channelDescription =
      'Real-time messages and photos from your favorite companions';

  /// Initialize local notifications and configure channels
  static Future<void> init({Function(Map<String, dynamic>)? onSelect}) async {
    onNotificationTapped = onSelect;

    const androidSettings = AndroidInitializationSettings('@drawable/ic_launcher');
    const initSettings = InitializationSettings(android: androidSettings);

    await _notificationsPlugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        if (response.payload != null && response.payload!.isNotEmpty) {
          try {
            final data = jsonDecode(response.payload!);
            if (data is Map<String, dynamic> && onNotificationTapped != null) {
              onNotificationTapped!(data);
            }
          } catch (e) {
            debugPrint('Failed to parse notification payload: $e');
          }
        }
      },
    );

    // Create high importance notification channel on Android
    final androidImpl = _notificationsPlugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    if (androidImpl != null) {
      const androidChannel = AndroidNotificationChannel(
        channelId,
        channelName,
        description: channelDescription,
        importance: Importance.max,
        playSound: true,
        enableVibration: true,
      );
      await androidImpl.createNotificationChannel(androidChannel);

      // Request notification permission for Android 13+
      await androidImpl.requestNotificationsPermission();
    }
  }

  /// Downloads remote image to temporary file for BigPictureStyle notification
  static Future<String?> _downloadAndSaveFile(String url, String fileName) async {
    try {
      final response = await http
          .get(Uri.parse(url))
          .timeout(const Duration(seconds: 10));
      if (response.statusCode == 200) {
        final directory = await getTemporaryDirectory();
        final filePath = '${directory.path}/$fileName';
        final file = File(filePath);
        await file.writeAsBytes(response.bodyBytes);
        return filePath;
      }
    } catch (e) {
      debugPrint('Failed to download image for notification: $e');
    }
    return null;
  }

  /// Display a notification immediately with optional image attachment
  static Future<void> showNotification({
    required int id,
    required String title,
    required String body,
    String? imageUrl,
    Map<String, dynamic>? payload,
  }) async {
    String? bigPicturePath;
    if (imageUrl != null && imageUrl.isNotEmpty) {
      bigPicturePath = await _downloadAndSaveFile(
        imageUrl,
        'notif_img_${id}_${DateTime.now().millisecondsSinceEpoch}.jpg',
      );
    }

    BigPictureStyleInformation? bigPictureStyleInformation;
    if (bigPicturePath != null) {
      bigPictureStyleInformation = BigPictureStyleInformation(
        FilePathAndroidBitmap(bigPicturePath),
        contentTitle: title,
        summaryText: body,
        hideExpandedLargeIcon: false,
      );
    }

    final androidDetails = AndroidNotificationDetails(
      channelId,
      channelName,
      channelDescription: channelDescription,
      importance: Importance.max,
      priority: Priority.high,
      styleInformation: bigPictureStyleInformation,
      color: const Color(0xFFEC4899),
      ledColor: const Color(0xFFEC4899),
      ledOnMs: 1000,
      ledOffMs: 500,
      icon: '@drawable/ic_launcher',
    );

    final notificationDetails = NotificationDetails(android: androidDetails);

    final payloadStr = payload != null ? jsonEncode(payload) : null;

    await _notificationsPlugin.show(
      id,
      title,
      body,
      notificationDetails,
      payload: payloadStr,
    );
  }
}
