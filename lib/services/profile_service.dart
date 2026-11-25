import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config.dart';
import '../models/profile.dart';

class ProfileService {
  static const String _cacheKey = 'cached_landing_page_profiles_v1';
  static const String _readProfilesKey = 'read_profiles_set_v1';

  /// Fetches profiles from network with instant local cache fallback
  static Future<List<Profile>> getProfiles() async {
    final prefs = await SharedPreferences.getInstance();
    final readIds = prefs.getStringList(_readProfilesKey)?.toSet() ?? <String>{};

    // 1. Try to fetch fresh profiles from network
    try {
      final response = await http
          .get(Uri.parse(AppConfig.apiProfilesUrl))
          .timeout(const Duration(seconds: 6));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is Map && data['profiles'] is List) {
          final List rawList = data['profiles'];
          final profiles = rawList
              .map((item) => Profile.fromJson(Map<String, dynamic>.from(item)))
              .toList();

          if (profiles.isNotEmpty) {
            // Update local cache
            await prefs.setString(_cacheKey, response.body);

            // Apply read status
            for (var p in profiles) {
              p.isRead = readIds.contains(p.id) || readIds.contains(p.slug);
            }
            return profiles;
          }
        }
      }
    } catch (e) {
      debugPrint('Network fetch failed for profiles ($e), falling back to cache');
    }

    // 2. Fallback to cached JSON in SharedPreferences
    final cachedJson = prefs.getString(_cacheKey);
    if (cachedJson != null && cachedJson.isNotEmpty) {
      try {
        final data = jsonDecode(cachedJson);
        if (data is Map && data['profiles'] is List) {
          final List rawList = data['profiles'];
          final profiles = rawList
              .map((item) => Profile.fromJson(Map<String, dynamic>.from(item)))
              .toList();

          if (profiles.isNotEmpty) {
            for (var p in profiles) {
              p.isRead = readIds.contains(p.id) || readIds.contains(p.slug);
            }
            return profiles;
          }
        }
      } catch (e) {
        debugPrint('Cache parsing failed: $e');
      }
    }

    // 3. Built-in rich default personas if app is launched with zero network & cache
    return _getDefaultProfiles(readIds);
  }

  /// Mark a profile as read so the badge disappears
  static Future<void> markProfileAsRead(String profileId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final readIds = prefs.getStringList(_readProfilesKey)?.toSet() ?? <String>{};
      readIds.add(profileId);
      await prefs.setStringList(_readProfilesKey, readIds.toList());
    } catch (e) {
      debugPrint('Failed to mark profile as read: $e');
    }
  }

  /// Default personas based on actual landing pages
  static List<Profile> _getDefaultProfiles(Set<String> readIds) {
    final list = [
      Profile(
        id: 'sophia-official',
        slug: 'sophia',
        name: 'Sophia',
        avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        lastMessage: 'Chilling at home, looking for a sweet chat ❤️',
        greetingMessage:
            'Hey there! ❤️ Thanks for visiting my chat. What are you up to today?',
        systemPrompt:
            'You are Sophia, a charming, sweet 22-year-old companion. Speak casually and warmly.',
        adsterraDirectLink: AppConfig.adsterraDirectLink,
        themeAccent: '#FF3366',
        typingDelayMs: 1200,
        isOnline: true,
        updatedAt: DateTime.now().toIso8601String(),
        isRead: readIds.contains('sophia-official') || readIds.contains('sophia'),
      ),
      Profile(
        id: 'valeria-guadalupe',
        slug: 'ivaleria',
        name: 'Valeria Guadalupe',
        avatarUrl:
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiCSw6PgDAFoMtJ_hVE3w2tcN6A8QOuvk_x85L8Hcu2beRMmhV1XLBRtHMAvxt6n1pgtOHsbQNyQnmx8O0p4pPASLbgy50arpBZbMDZTB6Rp_uZrPPq4MQ8tMxXgv7YctPGrgY0SDYsguHFJjQaod9feeE-21FJpz1Td6NRY9zWOvFCVv2XPBNWhaCt-QM/s1600/Woman_taking_selfie_in_doorway_5ce4406a_2K.jpg',
        lastMessage:
            'Al hombre que se gane mi corazón lo voy a tratar como un verdadero rey todos los días de su vida. 😘💕💕',
        greetingMessage:
            'Al hombre que se gane mi corazón lo voy a tratar como un verdadero rey todos los días de su vida. 😘💕💕',
        systemPrompt:
            'You are Valeria Guadalupe, an affectionate, passionate companion. Speak warmly and charmingly.',
        adsterraDirectLink: 'https://uplcm.com/4/9962944',
        themeAccent: '#E91E63',
        typingDelayMs: 1500,
        isOnline: true,
        updatedAt: DateTime.now().subtract(const Duration(minutes: 15)).toIso8601String(),
        isRead: readIds.contains('valeria-guadalupe') || readIds.contains('ivaleria'),
      ),
      Profile(
        id: 'elena-profile',
        slug: 'elena',
        name: 'Elena',
        avatarUrl:
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhIAwMdYXNvyW4sIlone6EPrYmouunv2kNi_cPfcu2WV-opdOCFP6fS6ZqYl3ROagELX6ktNRMFX26G9wSqTacju5UjUJsoo4zJBPH1UFUSzNBvld-XqUDm1K1tCUH-PP1snBOpmdHYJvkNF_taCU2GDHatunjmkUDkqNpvRozl7oCJuj0oEkj3oGknkec/s1600/Woman_taking_selfie_outdoors_4e8c8a66.jpg',
        lastMessage:
            'Al hombre que me entregue su corazón, le prometo cuidarlo como mi tesoro más grande 🥰💕',
        greetingMessage:
            'Al hombre que me entregue su corazón, le prometo cuidarlo como mi tesoro más grande y defenderlo de todo. 🥰💕',
        systemPrompt:
            'You are Elena, a sweet, faithful companion. Keep your messages heartfelt and lovely.',
        adsterraDirectLink: 'https://uplcm.com/4/9962944',
        themeAccent: '#E91E63',
        typingDelayMs: 1500,
        isOnline: true,
        updatedAt: DateTime.now().subtract(const Duration(hours: 1)).toIso8601String(),
        isRead: readIds.contains('elena-profile') || readIds.contains('elena'),
      ),
      Profile(
        id: 'abril-valentina',
        slug: 'abril',
        name: 'Abril Valentina',
        avatarUrl:
            'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgwqrNSs-h34Aaq_-EQb_zLPkuM8LnfKOQkVhmKvFW_pkMR5Gu0TQSEXJaLyRtZrgtfl2rez1e-ppc3AF_aWTjvkgl_4ys85Dty8QeeFNYSyFftN2VjWFUghfbf3D_FZTKGjXq54o8JN-YLbNRjaJrwv5GjQ-WeUA6WjB5PQySTpY4uhI4sPGotaZPMKwU/s1600/Woman_posing_for_selfie_outdoors_3d4eaa53_2K.jpg',
        lastMessage:
            'Ofrezco lealtad incondicional para ese hombre trabajador que busca una mujer de verdad 😘💕',
        greetingMessage:
            'Ofrezco lealtad incondicional para ese hombre trabajador que busca una mujer de verdad para salir adelante juntos 😘💕😊',
        systemPrompt:
            'You are Abril Valentina, loving and loyal. Speak with warmth and excitement.',
        adsterraDirectLink: 'https://uplcm.com/4/9962944',
        themeAccent: '#E91E63',
        typingDelayMs: 1500,
        isOnline: true,
        updatedAt: DateTime.now().subtract(const Duration(hours: 3)).toIso8601String(),
        isRead: readIds.contains('abril-valentina') || readIds.contains('abril'),
      ),
    ];
    return list;
  }
}
