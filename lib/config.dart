/// Central configuration for the AI Companion App
/// All monetization links, API keys, persona settings, and photo URLs are stored here.
class AppConfig {
  /// API endpoint providing dynamic landing page personas
  static const String apiProfilesUrl =
      'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev/api/app-profiles';

  /// API endpoint providing remote app configuration & notification templates
  static const String apiConfigUrl =
      'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev/api/app-config';

  /// API endpoint for analytics and real-time tracking
  static const String apiTrackUrl =
      'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev/api/track';

  /// API endpoint for real-time live statistics
  static const String apiStatsUrl =
      'https://multi-subdomain-landing-page-builder.krishabro8.workers.dev/api/stats';

  // --- Monetization & Ad Network Configuration ---
  /// Adsterra direct link opened externally via Chrome/external browser
  static const String adsterraDirectLink =
      'https://www.highperformanceformat.com/d9j8y2v4?key=adsterra_companion_link';

  // --- AI API Configuration (Gemini / Groq) ---
  /// Set your Gemini or Groq API key here.
  /// If left empty, the app seamlessly uses high-quality localized fallback responses.
  static const String aiApiKey = '';

  /// Supported providers: 'gemini' | 'groq' | 'fallback'
  static const String aiProvider = 'gemini';

  /// Groq model name if using groq (e.g., 'llama-3.1-8b-instant' or 'mixtral-8x7b-32768')
  static const String groqModel = 'llama-3.1-8b-instant';

  // --- Persona Details ---
  static const String personaName = 'Sophia';
  static const int personaAge = 22;
  static const String personaDistance = '2 km';
  static const String dailyScenario =
      'Chilling at home, looking for a sweet chat ❤️';

  // --- Photos & Media Assets ---
  /// Avatar shown in header and companion chat bubbles
  static const String avatarUrl =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  /// Blurred private photo sent after message #2 in Tab 1
  static const String chatPrivatePhotoUrl =
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80';

  /// 3 HD Private Photos used in Tab 2 ("Unlock the Photo" Quiz)
  static const List<String> quizPhotoUrls = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  ];
}
