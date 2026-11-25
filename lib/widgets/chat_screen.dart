import 'dart:ui';
import 'package:flutter/material.dart';
import '../i18n/translations.dart';
import '../models/chat_message.dart';
import '../models/profile.dart';
import '../services/ad_service.dart';
import '../services/ai_service.dart';
import 'media_view_dialog.dart';
import 'quiz_tab.dart';
import 'unlock_gallery_sheet.dart';

class ChatScreen extends StatefulWidget {
  final Profile profile;
  final String currentLang;
  final String? initialNotificationMessage;
  final String? initialNotificationImage;

  const ChatScreen({
    super.key,
    required this.profile,
    required this.currentLang,
    this.initialNotificationMessage,
    this.initialNotificationImage,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final List<ChatMessage> _messages = [];
  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  int _userMsgCount = 0;
  int _bonusMessages = 0;
  bool _isTyping = false;

  static const int _baseFreeLimit = 5;
  int get _maxFreeMessages => _baseFreeLimit + _bonusMessages;
  bool get _isLocked => _userMsgCount >= _maxFreeMessages;

  @override
  void initState() {
    super.initState();
    _initChat();
  }

  void _initChat() {
    final greeting = widget.profile.greetingMessage.isNotEmpty
        ? widget.profile.greetingMessage
        : widget.profile.lastMessage;

    _messages.add(
      ChatMessage(
        id: 'init_msg_${widget.profile.id}',
        sender: MessageSender.bot,
        text: greeting,
        timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
      ),
    );

    // If navigated from a notification, insert the notification message & image
    if (widget.initialNotificationMessage != null &&
        widget.initialNotificationMessage!.isNotEmpty &&
        widget.initialNotificationMessage != greeting) {
      _messages.add(
        ChatMessage(
          id: 'notif_msg_${DateTime.now().millisecondsSinceEpoch}',
          sender: MessageSender.bot,
          text: widget.initialNotificationMessage!,
          hasPhoto: widget.initialNotificationImage != null &&
              widget.initialNotificationImage!.isNotEmpty,
          photoUrl: widget.initialNotificationImage,
          isPhotoUnlocked: true,
          timestamp: DateTime.now(),
        ),
      );
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _handleSendMessage([String? customText]) async {
    final text = customText ?? _inputController.text.trim();
    if (text.isEmpty || _isLocked || _isTyping) return;

    if (customText == null) {
      _inputController.clear();
    }
    final newCount = _userMsgCount + 1;

    setState(() {
      _userMsgCount = newCount;
      _messages.add(
        ChatMessage(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          sender: MessageSender.user,
          text: text,
          timestamp: DateTime.now(),
        ),
      );
      _isTyping = true;
    });

    _scrollToBottom();

    // Check if any chatMedia item triggers at this message count
    ChatMediaItem? matchingChatMedia;
    for (final m in widget.profile.chatMedia) {
      if (m.triggerAfterMessages == newCount) {
        matchingChatMedia = m;
        break;
      }
    }

    if (matchingChatMedia != null || (newCount == 2 && widget.profile.chatMedia.isEmpty)) {
      await Future.delayed(Duration(milliseconds: widget.profile.typingDelayMs));
      if (!mounted) return;

      final isVideo = matchingChatMedia?.isVideo ?? false;
      final mediaUrl = matchingChatMedia?.url ?? widget.profile.avatarUrl;
      final defaultText = isVideo
          ? 'I just recorded this private video for you... want to watch? 🎥'
          : 'I just took this private photo for you... want to see? 🔒';
      final textToSend = (matchingChatMedia?.caption.isNotEmpty == true)
          ? matchingChatMedia!.caption
          : defaultText;

      setState(() {
        _messages.add(
          ChatMessage(
            id: 'chat_media_${DateTime.now().millisecondsSinceEpoch}',
            sender: MessageSender.bot,
            text: textToSend,
            timestamp: DateTime.now(),
            hasMedia: true,
            mediaUrl: mediaUrl,
            mediaType: isVideo ? 'video' : 'image',
            isMediaUnlocked: false,
          ),
        );
        _isTyping = false;
      });
      _scrollToBottom();
      return;
    }

    // Call AI service with persona customization
    final reply = await AiService.sendMessage(
      userMessage: text,
      history: _messages,
      lang: widget.currentLang,
      customSystemPrompt: widget.profile.systemPrompt,
      personaName: widget.profile.name,
    );

    // Realistic delay simulating typing
    await Future.delayed(Duration(milliseconds: widget.profile.typingDelayMs));
    if (!mounted) return;

    setState(() {
      _isTyping = false;
      _messages.add(
        ChatMessage(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          sender: MessageSender.bot,
          text: reply,
          timestamp: DateTime.now(),
        ),
      );
    });

    _scrollToBottom();
  }

  void _unlockPhoto(ChatMessage msg) {
    AdService.openDirectLink(customUrl: widget.profile.adsterraDirectLink);
    setState(() {
      msg.isPhotoUnlocked = true;
    });
  }

  void _unlockMoreMessages() {
    AdService.openDirectLink(customUrl: widget.profile.adsterraDirectLink);
    setState(() {
      _bonusMessages += 5;
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = AppTranslations.getStrings(widget.currentLang);
    final themeColor = _parseColor(widget.profile.themeAccent);

    return Scaffold(
      backgroundColor: const Color(0xFF0D0D12),
      appBar: AppBar(
        backgroundColor: const Color(0xFF161622),
        elevation: 1,
        titleSpacing: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: themeColor.withOpacity(0.3),
                  backgroundImage: NetworkImage(widget.profile.avatarUrl),
                  onBackgroundImageError: (_, __) {},
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    width: 11,
                    height: 11,
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981),
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFF161622), width: 2),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    widget.profile.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    _isTyping
                        ? (t['typing'] ?? 'typing...')
                        : (t['online'] ?? 'Online Now'),
                    style: TextStyle(
                      color: _isTyping ? const Color(0xFFFF3366) : const Color(0xFF10B981),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Private Vault',
            icon: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.lock_outline, color: Color(0xFFA855F7), size: 24),
                if (widget.profile.unlockMedia.isNotEmpty)
                  Positioned(
                    top: -4,
                    right: -4,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEC4899),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        '${widget.profile.unlockMedia.length}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: () {
              UnlockGallerySheet.show(context, widget.profile, onUnlocked: () {
                if (mounted) setState(() {});
              });
            },
          ),
          IconButton(
            tooltip: 'Secret Quiz',
            icon: const Icon(Icons.photo_library_outlined, color: Colors.white70),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => Scaffold(
                    backgroundColor: const Color(0xFF0D0D12),
                    appBar: AppBar(
                      backgroundColor: const Color(0xFF161622),
                      title: Text('${widget.profile.name} - Photos'),
                    ),
                    body: QuizTab(
                      currentLang: widget.currentLang,
                      profile: widget.profile,
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Daily Scenario Subtitle Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFF161622).withOpacity(0.85),
              border: Border(
                bottom: BorderSide(
                  color: Colors.white.withOpacity(0.06),
                ),
              ),
            ),
            child: Row(
              children: [
                const Icon(Icons.favorite, size: 14, color: Color(0xFFFF3366)),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    widget.profile.lastMessage,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: _isLocked
                        ? Colors.red.withOpacity(0.2)
                        : Colors.white.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${_maxFreeMessages - _userMsgCount} ${t['freeMessagesLeft'] ?? 'left'}',
                    style: TextStyle(
                      color: _isLocked ? Colors.redAccent : Colors.white60,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Message Thread
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
              itemCount: _messages.length + (_isTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isTyping) {
                  return _buildTypingIndicator(t);
                }
                return _buildMessageItem(_messages[index], t);
              },
            ),
          ),

          // Message Lock Banner (After 5 messages)
          if (_isLocked) _buildLockBanner(t),

          // Quick Reply Suggestions
          if (!_isLocked) _buildQuickReplyChips(),

          // Bottom Input Bar
          _buildInputBar(t),
        ],
      ),
    );
  }

  Widget _buildMessageItem(ChatMessage msg, Map<String, String> t) {
    final isUser = msg.sender == MessageSender.user;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isUser) ...[
            CircleAvatar(
              radius: 14,
              backgroundImage: NetworkImage(widget.profile.avatarUrl),
              onBackgroundImageError: (_, __) {},
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isUser
                    ? const Color(0xFFFF3366)
                    : const Color(0xFF1E1E2D),
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isUser ? 16 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 16),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment:
                    isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                children: [
                  if (msg.hasPhoto) ...[
                    _buildPrivatePhotoBubble(msg, t),
                    const SizedBox(height: 8),
                  ],
                  Text(
                    msg.text,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatTime(msg.timestamp),
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.5),
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrivatePhotoBubble(ChatMessage msg, Map<String, String> t) {
    final isVideo = msg.isVideo;
    final mediaUrl = msg.mediaUrl ?? widget.profile.avatarUrl;

    return GestureDetector(
      onTap: () {
        if (msg.isMediaUnlocked) {
          MediaViewDialog.show(
            context,
            url: mediaUrl,
            mediaType: msg.mediaType,
            title: isVideo ? 'Private Video' : 'Private Photo',
          );
        }
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: 220,
          color: Colors.black,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              Stack(
                alignment: Alignment.center,
                children: [
                  ImageFiltered(
                    imageFilter: ImageFilter.blur(
                      sigmaX: msg.isMediaUnlocked ? 0 : 20,
                      sigmaY: msg.isMediaUnlocked ? 0 : 20,
                    ),
                    child: Image.network(
                      mediaUrl,
                      width: 220,
                      height: 180,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        width: 220,
                        height: 180,
                        color: Colors.grey[900],
                        child: const Icon(Icons.broken_image, color: Colors.white54),
                      ),
                    ),
                  ),

                  // Top Type Badge
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: isVideo ? const Color(0xFFA855F7) : const Color(0xFFEC4899),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        isVideo ? '▶ VIDEO' : '📷 PHOTO',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),

                  // Locked Overlay
                  if (!msg.isMediaUnlocked) ...[
                    Container(
                      width: 220,
                      height: 180,
                      color: Colors.black.withOpacity(0.45),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.lock_rounded, size: 36, color: Color(0xFFFF3366)),
                        const SizedBox(height: 6),
                        Text(
                          isVideo ? 'Private Video 🔒' : (t['privatePhotoLocked'] ?? 'Private Photo 🔒'),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 10),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFF3366),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          ),
                          onPressed: () => _unlockPhoto(msg),
                          child: Text(
                            t['tapToUnlockPhoto'] ?? 'Unlock 🔓',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ],

                  // Play Button Overlay if Unlocked Video
                  if (msg.isMediaUnlocked && isVideo)
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.play_arrow, color: Colors.white, size: 32),
                    ),
                ],
              ),
              if (msg.isMediaUnlocked)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                  color: const Color(0xFF1E1E2D),
                  child: Text(
                    isVideo ? 'Tap to play video 🎬' : 'Tap to zoom photo 🔍',
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTypingIndicator(Map<String, String> t) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          CircleAvatar(
            radius: 14,
            backgroundImage: NetworkImage(widget.profile.avatarUrl),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFF1E1E2D),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const SizedBox(
                  width: 12,
                  height: 12,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: Color(0xFFFF3366),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  t['typing'] ?? 'typing...',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLockBanner(Map<String, String> t) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E2D),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFF3366).withOpacity(0.4)),
      ),
      child: Column(
        children: [
          Text(
            t['messagesLockedTitle'] ?? 'Daily Free Limit Reached! 🔒',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            t['messagesLockedDesc'] ??
                'Unlock 5 more messages to continue chatting with ${widget.profile.name}!',
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF3366),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              icon: const Icon(Icons.lock_open, size: 18),
              label: Text(
                t['unlockMoreMessages'] ?? 'Unlock +5 Messages 🔓',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              onPressed: _unlockMoreMessages,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickReplyChips() {
    final chips = [
      'Tell me more about you! 😊',
      'Send me a selfie! 📸',
      'What are you doing today? ✨',
    ];

    return Container(
      height: 38,
      margin: const EdgeInsets.only(bottom: 6),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: chips.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          return ActionChip(
            backgroundColor: const Color(0xFF1E1E2D),
            side: BorderSide(color: Colors.white.withOpacity(0.1)),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            label: Text(
              chips[index],
              style: const TextStyle(color: Colors.white70, fontSize: 12),
            ),
            onPressed: () => _handleSendMessage(chips[index]),
          );
        },
      ),
    );
  }

  Widget _buildInputBar(Map<String, String> t) {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 6, 12, 12),
      decoration: const BoxDecoration(
        color: Color(0xFF161622),
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF1E1E2D),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withOpacity(0.08)),
                ),
                child: TextField(
                  controller: _inputController,
                  enabled: !_isLocked,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: _isLocked
                        ? (t['messagesLockedTitle'] ?? 'Chat locked')
                        : '${t['typePlaceholder'] ?? 'Reply to'} ${widget.profile.name}...',
                    hintStyle: const TextStyle(color: Colors.white38, fontSize: 13),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    border: InputBorder.none,
                  ),
                  onSubmitted: (_) => _handleSendMessage(),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              decoration: const BoxDecoration(
                color: Color(0xFFFF3366),
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(Icons.send, color: Colors.white, size: 20),
                onPressed: _isLocked ? null : () => _handleSendMessage(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _parseColor(String hex) {
    try {
      final clean = hex.replaceAll('#', '');
      return Color(int.parse('FF$clean', radix: 16));
    } catch (_) {
      return const Color(0xFFFF3366);
    }
  }

  String _formatTime(DateTime dt) {
    final hour = dt.hour.toString().padLeft(2, '0');
    final minute = dt.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }
}
