import 'package:flutter/foundation.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config.dart';

class AdService {
  /// Opens the Adsterra direct monetization link in an external application (Chrome / default browser)
  static Future<bool> openAdsterraLink() async {
    return openDirectLink(customUrl: AppConfig.adsterraDirectLink);
  }

  /// Opens any custom ad direct link in external application
  static Future<bool> openDirectLink({String? customUrl}) async {
    final String target = (customUrl != null && customUrl.trim().isNotEmpty)
        ? customUrl.trim()
        : AppConfig.adsterraDirectLink;
    final Uri uri = Uri.parse(target);

    try {
      final bool launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (!launched) {
        return await launchUrl(uri, mode: LaunchMode.platformDefault);
      }
      return launched;
    } catch (e) {
      debugPrint('AdService: Failed to launch ad link: $e');
      return false;
    }
  }
}
