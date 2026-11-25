import 'package:flutter/material.dart';
import '../i18n/translations.dart';
import '../models/profile.dart';
import '../services/analytics_service.dart';
import '../services/profile_service.dart';
import 'chat_screen.dart';
import 'language_selector_sheet.dart';

class ChatListScreen extends StatefulWidget {
  final String currentLang;
  final ValueChanged<String> onLanguageChanged;

  const ChatListScreen({
    super.key,
    required this.currentLang,
    required this.onLanguageChanged,
  });

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen>
    with WidgetsBindingObserver {
  List<Profile> _allProfiles = [];
  List<Profile> _filteredProfiles = [];
  bool _isLoading = true;
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadProfiles();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _searchController.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _loadProfiles();
      AnalyticsService.onResume();
    } else if (state == AppLifecycleState.paused) {
      AnalyticsService.onPause();
    }
  }

  Future<void> _loadProfiles() async {
    final profiles = await ProfileService.getProfiles();
    if (!mounted) return;
    profiles.sort((a, b) {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
    setState(() {
      _allProfiles = profiles;
      _applyFilter(_searchQuery);
      _isLoading = false;
    });
  }

  void _applyFilter(String query) {
    _searchQuery = query.toLowerCase().trim();
    List<Profile> filtered;
    if (_searchQuery.isEmpty) {
      filtered = List.from(_allProfiles);
    } else {
      filtered = _allProfiles
          .where((p) => p.name.toLowerCase().contains(_searchQuery))
          .toList();
    }
    filtered.sort((a, b) {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
    _filteredProfiles = filtered;
  }

  void _openChat(Profile profile) {
    setState(() {
      profile.isRead = true;
    });
    ProfileService.markProfileAsRead(profile.id);

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => ChatScreen(
          profile: profile,
          currentLang: widget.currentLang,
        ),
      ),
    ).then((_) {
      if (mounted) setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    final activeLangObj = AppTranslations.supportedLanguages.firstWhere(
      (l) => l.code == widget.currentLang,
      orElse: () => AppTranslations.supportedLanguages.first,
    );

    final onlineCount = _allProfiles.where((p) => p.isOnline).length;

    return Scaffold(
      backgroundColor: const Color(0xFF0D0D12),
      appBar: AppBar(
        backgroundColor: const Color(0xFF161622),
        elevation: 0,
        titleSpacing: 16,
        title: Row(
          children: [
            const Text(
              'Chats',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(width: 8),
            ValueListenableBuilder<int>(
              valueListenable: AnalyticsService.liveOnlineUsers,
              builder: (context, liveCount, _) {
                final displayCount = liveCount > 0 ? liveCount : onlineCount;
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 7,
                        height: 7,
                        decoration: const BoxDecoration(
                          color: Color(0xFF10B981),
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 5),
                      Text(
                        '$displayCount Online',
                        style: const TextStyle(
                          color: Color(0xFF10B981),
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Change Language',
            icon: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.08),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(activeLangObj.flag, style: const TextStyle(fontSize: 14)),
                  const SizedBox(width: 4),
                  Text(
                    activeLangObj.code.toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
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
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // WhatsApp / imo Search Bar
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
            color: const Color(0xFF161622),
            child: Container(
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E2D),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white.withOpacity(0.06)),
              ),
              child: TextField(
                controller: _searchController,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                onChanged: (val) {
                  setState(() {
                    _applyFilter(val);
                  });
                },
                decoration: InputDecoration(
                  hintText: 'Search contacts or personas...',
                  hintStyle: const TextStyle(color: Colors.white38, fontSize: 13),
                  prefixIcon: const Icon(Icons.search, color: Colors.white38, size: 20),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear, color: Colors.white38, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            setState(() {
                              _applyFilter('');
                            });
                          },
                        )
                      : null,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),

          // Contacts List
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: Color(0xFFFF3366)),
                  )
                : RefreshIndicator(
                    color: const Color(0xFFFF3366),
                    backgroundColor: const Color(0xFF161622),
                    onRefresh: _loadProfiles,
                    child: _filteredProfiles.isEmpty
                        ? ListView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            children: const [
                              SizedBox(height: 100),
                              Center(
                                child: Text(
                                  'No contacts found',
                                  style: TextStyle(color: Colors.white38, fontSize: 14),
                                ),
                              ),
                            ],
                          )
                        : ListView.separated(
                            physics: const AlwaysScrollableScrollPhysics(),
                            itemCount: _filteredProfiles.length,
                            separatorBuilder: (_, __) => Divider(
                              height: 1,
                              indent: 78,
                              color: Colors.white.withOpacity(0.06),
                            ),
                            itemBuilder: (context, index) {
                              final profile = _filteredProfiles[index];
                              return _buildChatRow(profile);
                            },
                          ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatRow(Profile profile) {
    return InkWell(
      onTap: () => _openChat(profile),
      splashColor: const Color(0xFFFF3366).withOpacity(0.12),
      highlightColor: const Color(0xFFFF3366).withOpacity(0.06),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            // Left: Circular Avatar with Bright Green Online Dot
            Stack(
              clipBehavior: Clip.none,
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: const Color(0xFF1E1E2D),
                  backgroundImage: NetworkImage(profile.avatarUrl),
                  onBackgroundImageError: (_, __) {},
                ),
                if (profile.isOnline)
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981),
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFF0D0D12), width: 2.5),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF10B981).withOpacity(0.4),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 14),

            // Center: Bold Name & Single-line preview of lastMessage
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          profile.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: profile.isRead ? FontWeight.w600 : FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(
                        Icons.verified,
                        color: Color(0xFF38BDF8),
                        size: 15,
                      ),
                      if (profile.isPinned) ...[
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.push_pin_rounded,
                          color: Color(0xFFF59E0B),
                          size: 14,
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 5),
                  Text(
                    profile.lastMessage,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: profile.isRead ? Colors.white54 : Colors.white70,
                      fontSize: 13,
                      fontWeight: profile.isRead ? FontWeight.normal : FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),

            // Right: Formatted Timestamp on top, Unread Badge below
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  _formatRelativeTime(profile.updatedAt),
                  style: TextStyle(
                    color: !profile.isRead
                        ? const Color(0xFFFF3366)
                        : Colors.white38,
                    fontSize: 11,
                    fontWeight: !profile.isRead ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
                const SizedBox(height: 6),
                if (!profile.isRead)
                  Container(
                    width: 20,
                    height: 20,
                    alignment: Alignment.center,
                    decoration: const BoxDecoration(
                      color: Color(0xFFFF3366),
                      shape: BoxShape.circle,
                    ),
                    child: const Text(
                      '1',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  )
                else
                  const SizedBox(height: 20),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatRelativeTime(String isoString) {
    if (isoString.isEmpty) return 'Just now';
    try {
      final dt = DateTime.parse(isoString);
      final diff = DateTime.now().difference(dt);
      if (diff.inMinutes < 1) return 'Just now';
      if (diff.inMinutes < 60) return '${diff.inMinutes}m';
      if (diff.inHours < 24) return '${diff.inHours}h';
      if (diff.inDays < 7) return '${diff.inDays}d';
      return '${dt.month}/${dt.day}';
    } catch (_) {
      return 'Just now';
    }
  }
}
