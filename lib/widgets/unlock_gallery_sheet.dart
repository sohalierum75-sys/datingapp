import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/profile.dart';
import '../services/ad_service.dart';
import 'media_view_dialog.dart';

class UnlockGallerySheet extends StatefulWidget {
  final Profile profile;
  final VoidCallback? onUnlocked;

  const UnlockGallerySheet({
    super.key,
    required this.profile,
    this.onUnlocked,
  });

  static Future<void> show(BuildContext context, Profile profile,
      {VoidCallback? onUnlocked}) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0D0D12),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => UnlockGallerySheet(
        profile: profile,
        onUnlocked: onUnlocked,
      ),
    );
  }

  @override
  State<UnlockGallerySheet> createState() => _UnlockGallerySheetState();
}

class _UnlockGallerySheetState extends State<UnlockGallerySheet> {
  final Set<String> _unlockedIds = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUnlockedStatus();
  }

  Future<void> _loadUnlockedStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final unlocked = <String>{};
    for (final item in widget.profile.unlockMedia) {
      final key = 'unlock_${widget.profile.id}_${item.id}';
      if (prefs.getBool(key) == true || item.unlockType == 'free') {
        unlocked.add(item.id);
      }
    }
    if (mounted) {
      setState(() {
        _unlockedIds.addAll(unlocked);
        _isLoading = false;
      });
    }
  }

  Future<void> _handleUnlock(UnlockMediaItem item) async {
    final prefs = await SharedPreferences.getInstance();
    final key = 'unlock_${widget.profile.id}_${item.id}';

    if (item.unlockType == 'ad') {
      AdService.openDirectLink(customUrl: widget.profile.adsterraDirectLink);
    }

    await prefs.setBool(key, true);
    if (mounted) {
      setState(() {
        _unlockedIds.add(item.id);
      });
      widget.onUnlocked?.call();
    }

    if (mounted) {
      MediaViewDialog.show(
        context,
        url: item.url,
        mediaType: item.mediaType,
        title: item.title,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final mediaList = widget.profile.unlockMedia;

    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      expand: false,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Color(0xFF0D0D12),
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              // Handle Bar
              Center(
                child: Container(
                  margin: const EdgeInsets.symmetric(vertical: 12),
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white24,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              // Sheet Header
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFA855F7).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.lock_outline,
                          color: Color(0xFFA855F7), size: 22),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '${widget.profile.name}\'s Private Vault',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Exclusive Photos & Videos • ${mediaList.length} items',
                            style: const TextStyle(
                              color: Colors.white54,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white54),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
              ),

              const Divider(color: Colors.white10),

              // Grid Content
              Expanded(
                child: _isLoading
                    ? const Center(
                        child: CircularProgressIndicator(
                          color: Color(0xFFA855F7),
                        ),
                      )
                    : mediaList.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Icon(Icons.photo_library_outlined,
                                    size: 48, color: Colors.white24),
                                SizedBox(height: 12),
                                Text(
                                  'No private vault items uploaded yet.',
                                  style: TextStyle(
                                      color: Colors.white54, fontSize: 13),
                                ),
                              ],
                            ),
                          )
                        : GridView.builder(
                            controller: scrollController,
                            padding: const EdgeInsets.all(16),
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 12,
                              mainAxisSpacing: 12,
                              childAspectRatio: 0.8,
                            ),
                            itemCount: mediaList.length,
                            itemBuilder: (context, index) {
                              final item = mediaList[index];
                              final isUnlocked = _unlockedIds.contains(item.id);

                              return _buildVaultCard(item, isUnlocked);
                            },
                          ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildVaultCard(UnlockMediaItem item, bool isUnlocked) {
    final isVideo = item.isVideo;

    return GestureDetector(
      onTap: () {
        if (isUnlocked) {
          MediaViewDialog.show(
            context,
            url: item.url,
            mediaType: item.mediaType,
            title: item.title,
          );
        } else {
          _handleUnlock(item);
        }
      },
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF161622),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isUnlocked
                ? const Color(0xFF10B981).withOpacity(0.4)
                : const Color(0xFFA855F7).withOpacity(0.3),
            width: 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Media Image Thumbnail
            Image.network(
              item.url,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                color: const Color(0xFF1F1F2E),
                child: const Icon(Icons.broken_image, color: Colors.white24),
              ),
            ),

            // Heavy Blur Filter for Locked Items
            if (!isUnlocked)
              BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                child: Container(
                  color: Colors.black.withOpacity(0.4),
                ),
              ),

            // Top Type Badge
            Positioned(
              top: 8,
              left: 8,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: isVideo
                      ? const Color(0xFFA855F7).withOpacity(0.9)
                      : const Color(0xFFEC4899).withOpacity(0.9),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isVideo ? Icons.videocam : Icons.photo,
                      color: Colors.white,
                      size: 11,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isVideo ? 'VIDEO' : 'PHOTO',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Center Lock Icon / Play Button
            Center(
              child: isUnlocked
                  ? Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.55),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isVideo ? Icons.play_arrow : Icons.fullscreen,
                        color: Colors.white,
                        size: 26,
                      ),
                    )
                  : Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFA855F7).withOpacity(0.85),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFA855F7).withOpacity(0.5),
                            blurRadius: 12,
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.lock,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
            ),

            // Bottom Caption & CTA Bar
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      Colors.black.withOpacity(0.9),
                      Colors.black.withOpacity(0.0),
                    ],
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      item.title.isNotEmpty
                          ? item.title
                          : (isVideo ? 'Private Video' : 'Private Photo'),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      isUnlocked
                          ? '✓ Unlocked • Tap to view'
                          : (item.unlockType == 'ad'
                              ? '🔒 Tap to Unlock Free'
                              : '🔒 Tap to Unlock'),
                      style: TextStyle(
                        color: isUnlocked
                            ? const Color(0xFF10B981)
                            : const Color(0xFFA855F7),
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
