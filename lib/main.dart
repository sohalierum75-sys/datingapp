import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'config.dart';
import 'i18n/translations.dart';
import 'models/profile.dart';
import 'services/analytics_service.dart';
import 'services/background_scheduler.dart';
import 'services/notification_service.dart';
import 'services/profile_service.dart';
import 'widgets/chat_list_screen.dart';
import 'widgets/chat_screen.dart';
import 'widgets/language_selector_sheet.dart';
import 'widgets/quiz_tab.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
String currentAppLanguage = 'en';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize notification service and handle deep-link navigation on notification tap
  await NotificationService.init(onSelect: (payload) async {
    final profileId = payload['profileId']?.toString();
    final profileSlug = payload['profileSlug']?.toString();
    final message = payload['message']?.toString();
    final imageUrl = payload['imageUrl']?.toString();

    final profiles = await ProfileService.getProfiles();
    Profile? matchedProfile;

    if (profileId != null) {
      final matches = profiles.where((p) => p.id == profileId || p.slug == profileSlug);
      if (matches.isNotEmpty) {
        matchedProfile = matches.first;
      } else if (profiles.isNotEmpty) {
        matchedProfile = profiles.first;
      }
    } else if (profiles.isNotEmpty) {
      matchedProfile = profiles.first;
    }

    if (matchedProfile != null) {
      navigatorKey.currentState?.push(
        MaterialPageRoute(
          builder: (_) => ChatScreen(
            profile: matchedProfile!,
            currentLang: currentAppLanguage,
            initialNotificationMessage: message,
            initialNotificationImage: imageUrl,
          ),
        ),
      );
    }
  });

  // Initialize WorkManager background scheduler
  await BackgroundScheduler.initialize();

  // Start analytics & live session heartbeat
  await AnalyticsService.start();

  runApp(const CompanionApp());
}

class CompanionApp extends StatefulWidget {
  const CompanionApp({super.key});

  @override
  State<CompanionApp> createState() => _CompanionAppState();
}

class _CompanionAppState extends State<CompanionApp> {
  late String _currentLang;

  @override
  void initState() {
    super.initState();
    // 1. Detect device's locale automatically on app start
    final deviceLocale = PlatformDispatcher.instance.locale;
    _currentLang = AppTranslations.detectInitialLanguage(deviceLocale);
    currentAppLanguage = _currentLang;
  }

  void _changeLanguage(String newLang) {
    setState(() {
      _currentLang = newLang;
      currentAppLanguage = newLang;
    });
  }

  @override
  Widget build(BuildContext context) {
    final activeLangObj = AppTranslations.supportedLanguages.firstWhere(
      (l) => l.code == _currentLang,
      orElse: () => AppTranslations.supportedLanguages.first,
    );

    return MaterialApp(
      navigatorKey: navigatorKey,
      title: '${AppConfig.personaName} - AI Companion',
      debugShowCheckedModeBanner: false,
      locale: Locale(_currentLang),
      supportedLocales: AppTranslations.supportedLanguages.map(
        (l) => Locale(l.code),
      ),
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0D0D12),
        primaryColor: const Color(0xFFFF3366),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFFF3366),
          secondary: Color(0xFFFF5E8A),
          surface: Color(0xFF161622),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF161622),
          elevation: 0,
          scrolledUnderElevation: 0,
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: Color(0xFF161622),
          selectedItemColor: Color(0xFFFF3366),
          unselectedItemColor: Colors.white54,
          type: BottomNavigationBarType.fixed,
        ),
      ),
      home: Directionality(
        textDirection:
            activeLangObj.isRtl ? TextDirection.rtl : TextDirection.ltr,
        child: MainScreen(
          currentLang: _currentLang,
          onLanguageChanged: _changeLanguage,
        ),
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  final String currentLang;
  final ValueChanged<String> onLanguageChanged;

  const MainScreen({
    super.key,
    required this.currentLang,
    required this.onLanguageChanged,
  });

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _activeTabIndex = 0;

  @override
  Widget build(BuildContext context) {
    final t = AppTranslations.getStrings(widget.currentLang);

    return Scaffold(
      body: IndexedStack(
        index: _activeTabIndex,
        children: [
          // Tab 1: WhatsApp / imo Style Chats Inbox (Listing all landing page personas)
          ChatListScreen(
            currentLang: widget.currentLang,
            onLanguageChanged: widget.onLanguageChanged,
          ),

          // Tab 2: "Unlock the Photo" Quiz
          Scaffold(
            backgroundColor: const Color(0xFF0D0D12),
            appBar: AppBar(
              backgroundColor: const Color(0xFF161622),
              title: Text(
                t['tabQuiz'] ?? 'Unlock Photos',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              actions: [
                IconButton(
                  tooltip: 'Change Language',
                  icon: const Icon(Icons.language, color: Colors.white70),
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (_) => LanguageSelectorSheet(
                        currentLang: widget.currentLang,
                        onLanguageSelected: widget.onLanguageChanged,
                      ),
                    );
                  },
                ),
              ],
            ),
            body: QuizTab(currentLang: widget.currentLang),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(
            top: BorderSide(color: Colors.white.withOpacity(0.06)),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _activeTabIndex,
          onTap: (index) {
            setState(() {
              _activeTabIndex = index;
            });
          },
          items: [
            BottomNavigationBarItem(
              icon: const Icon(Icons.chat_bubble_outline_rounded),
              activeIcon: const Icon(Icons.chat_bubble_rounded),
              label: t['tabChat'] ?? 'Chats',
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.photo_library_outlined),
              activeIcon: const Icon(Icons.photo_library_rounded),
              label: t['tabQuiz'] ?? 'Photos',
            ),
          ],
        ),
      ),
    );
  }
}
