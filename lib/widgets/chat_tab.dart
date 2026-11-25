import 'dart:ui';
import 'package:flutter/material.dart';
import '../config.dart';
import '../i18n/translations.dart';
import '../models/chat_message.dart';
import '../services/ad_service.dart';
import '../services/ai_service.dart';

class ChatTab extends StatefulWidget {
  final String currentLang;

  const ChatTab({
    super.key,
    required this.currentLang,
  });

  @override
  State<ChatTab> createState() => _ChatTabState();
}

class _ChatTabState extends State<ChatTab> {
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

  @override
  void didUpdateWidget(covariant ChatTab oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.currentLang != widget.currentLang && _messages.isNotEmpty) {
      // Refresh initial greeting if language was changed before user typed
      if (_userMsgCount == 0 && _messages.length == 1) {
        final t = AppTranslations.getStrings(widget.currentLang);
        setState(() {
          _messages[0] = ChatMessage(
            id: 'init_msg',
            sender: MessageSender.bot,
            text: t['scenarioFirstMessage'] ??
                'Hey there! I saw you were looking at my profile... what\'s on your mind? 😉',
            timestamp: DateTime.now(),
          );
        });
      }
    }
  }

  void _initChat() {
    final t = AppTranslations.getStrings(widget.currentLang);
    _messages.add(
      ChatMessage(
        id: 'init_msg',
        sender: MessageSender.bot,
        text: t['scenarioFirstMessage'] ??
            'Hey there! I saw you were looking at my profile... what\'s on your mind? 😉',
        timestamp: DateTime.now(),
      ),
    );
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

  Future<void> _handleSendMessage() async {
    final text = _inputController.text.trim();
    if (text.isEmpty || _isLocked || _isTyping) return;

    _inputController.clear();
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

    // Simulate realistic typing delay
    await Future.delayed(const Duration(milliseconds: 1000));

    // Message #2 Hook: Automatically insert private photo bubble
    if (newCount == 2) {
      final t = AppTranslations.getStrings(widget.currentLang);
      setState(() {
        _isTyping = false;
        _messages.add(
          ChatMessage(
            id: DateTime.now().millisecondsSinceEpoch.toString(),
            sender: MessageSender.bot,
            text: t['photoMessageOffer'] ??
                'I just took this a minute ago... do you want to see? 🙈',
            timestamp: DateTime.now(),
            hasPhoto: true,
            photoUrl: AppConfig.chatPrivatePhotoUrl,
            isPhotoUnlocked: false,
          ),
        );
      });
      _scrollToBottom();
      return;
    }

    // Normal AI conversation
    final reply = await AiService.sendMessage(
      userMessage: text,
      history: _messages,
      lang: widget.currentLang,
    );

    if (mounted) {
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
  }

  Future<void> _unlockPhoto(ChatMessage message) async {
    await AdService.openAdsterraLink();
    setState(() {
      message.isPhotoUnlocked = true;
    });
  }

  Future<void> _unlockMoreMessages() async {
    await AdService.openAdsterraLink();
    setState(() {
      _bonusMessages += 5;
    });
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    final t = AppTranslations.getStrings(widget.currentLang);
    final int remaining = (_maxFreeMessages - _userMsgCount).clamp(0, 999);

    return Scaffold(
      backgroundColor: const Color(0xFF0D0D12),
      body: Column(
        children: [
          // 1. Persona Daily Scenario Header Banner
          _buildPersonaHeader(t),

          // 2. Free Messages Pill Counter
          _buildCounterPill(t, remaining),

          // 3. Chat Messages List
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: _messages.length + (_isTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isTyping) {
                  return _buildTypingIndicator(t);
                }
                final msg = _messages[index];
                return _buildMessageItem(msg, t);
              },
            ),
          ),

          // 4. Bottom Input Bar or Lock Gating Banner
          _isLocked ? _buildLockedBanner(t) : _buildInputBar(t),
        ],
      ),
    );
  }

  Widget _buildPersonaHeader(Map<String, String> t) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF161622),
        border: Border(
          bottom: BorderSide(color: Colors.white.withOpacity(0.06)),
        ),
      ),
      child: Row(
        children: [
          // Avatar with green online dot
          Stack(
            children: [
              Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: const Color(0xFFFF3366),
                    width: 2,
                  ),
                ),
                child: CircleAvatar(
                  radius: 22,
                  backgroundImage: NetworkImage(AppConfig.avatarUrl),
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: const Color(0xFF161622),
                      width: 2,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 12),
          // Persona Name & Scenario
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      AppConfig.personaName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '• ${AppConfig.personaDistance}',
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Row(
                  children: [
                    const Text('✨ ', style: TextStyle(fontSize: 12)),
                    Expanded(
                      child: Text(
                        AppConfig.dailyScenario,
                        style: const TextStyle(
                          color: Color(0xFFFF809F),
                          fontSize: 12,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCounterPill(Map<String, String> t, int remaining) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.02),
        border: Border(
          bottom: BorderSide(color: Colors.white.withOpacity(0.04)),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            t['freeMessagesLeft'] ?? 'free messages left',
            style: const TextStyle(color: Colors.white54, fontSize: 11),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: _isLocked
                  ? const Color(0xFFFF3366).withOpacity(0.15)
                  : const Color(0xFF10B981).withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              '$remaining / $_maxFreeMessages',
              style: TextStyle(
                color: _isLocked
                    ? const Color(0xFFFF3366)
                    : const Color(0xFF10B981),
                fontWeight: FontWeight.bold,
                fontSize: 11,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageItem(ChatMessage msg, Map<String, String> t) {
    final isUser = msg.sender == MessageSender.user;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment:
            isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isUser) ...[
            CircleAvatar(
              radius: 14,
              backgroundImage: NetworkImage(AppConfig.avatarUrl),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Column(
              crossAxisAlignment:
                  isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                // Text Bubble
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    gradient: isUser
                        ? const LinearGradient(
                            colors: [Color(0xFFFF3366), Color(0xFFFF5E8A)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          )
                        : null,
                    color: isUser ? null : const Color(0xFF1F1F2E),
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(18),
                      topRight: const Radius.circular(18),
                      bottomLeft: Radius.circular(isUser ? 18 : 4),
                      bottomRight: Radius.circular(isUser ? 4 : 18),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Text(
                    msg.text,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      height: 1.35,
                    ),
                  ),
                ),

                // Private Photo Bubble (if applicable)
                if (msg.hasPhoto && msg.photoUrl != null) ...[
                  const SizedBox(height: 8),
                  _buildPrivatePhotoCard(msg, t),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrivatePhotoCard(ChatMessage msg, Map<String, String> t) {
    final bool unlocked = msg.isPhotoUnlocked;

    return Container(
      width: 220,
      height: 280,
      decoration: BoxDecoration(
        color: const Color(0xFF161622),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: unlocked
              ? const Color(0xFF10B981).withOpacity(0.5)
              : const Color(0xFFFF3366).withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Image filtered with blur if locked
          ImageFiltered(
            imageFilter: ImageFilter.blur(
              sigmaX: unlocked ? 0 : 18,
              sigmaY: unlocked ? 0 : 18,
            ),
            child: Image.network(
              msg.photoUrl!,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                color: const Color(0xFF1F1F2E),
                child: const Center(
                  child: Icon(Icons.broken_image_rounded, color: Colors.white24, size: 40),
                ),
              ),
            ),
          ),

          // Locked Overlay with Unlock CTA
          if (!unlocked)
            Container(
              color: Colors.black.withOpacity(0.45),
              padding: const EdgeInsets.all(12),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white24),
                    ),
                    child: const Icon(
                      Icons.lock_rounded,
                      color: Color(0xFFFF3366),
                      size: 28,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    t['privatePhotoLocked'] ?? 'Sent a private photo 🔒',
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 14),
                  ElevatedButton(
                    onPressed: () => _unlockPhoto(msg),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF3366),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 8,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      elevation: 4,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.lock_open_rounded, size: 16),
                        const SizedBox(width: 6),
                        Text(
                          t['unlockPrivatePhotoCTA'] ?? 'Unlock Photo 🔓',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

          // Unlocked badge indicator
          if (unlocked)
            Positioned(
              top: 10,
              right: 10,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.9),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.check, size: 12, color: Colors.white),
                    const SizedBox(width: 4),
                    Text(
                      t['photoUnlocked'] ?? 'Photo Unlocked ✨',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
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

  Widget _buildTypingIndicator(Map<String, String> t) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          CircleAvatar(
            radius: 14,
            backgroundImage: NetworkImage(AppConfig.avatarUrl),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFF1F1F2E),
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
                    valueColor:
                        AlwaysStoppedAnimation<Color>(Color(0xFFFF3366)),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '${AppConfig.personaName} ${t['typing'] ?? 'is typing a message...'}',
                  style: const TextStyle(color: Colors.white60, fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLockedBanner(Map<String, String> t) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF161622),
        border: Border(
          top: BorderSide(color: const Color(0xFFFF3366).withOpacity(0.3)),
        ),
      ),
      child: Column(
        children: [
          Text(
            t['messagesLockedTitle'] ?? 'Daily Free Limit Reached! 🔒',
            style: const TextStyle(
              color: Color(0xFFFF3366),
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            t['messagesLockedDesc'] ??
                'You have used all 5 free messages. Unlock 5 more private messages now!',
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white70, fontSize: 12),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _unlockMoreMessages,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF3366),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
                elevation: 4,
              ),
              child: Text(
                t['unlockMoreMessages'] ?? 'Unlock +5 Messages 🔓',
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputBar(Map<String, String> t) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF161622),
        border: Border(
          top: BorderSide(color: Colors.white.withOpacity(0.06)),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF0D0D12),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white12),
                ),
                child: TextField(
                  controller: _inputController,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _handleSendMessage(),
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: InputDecoration(
                    hintText:
                        '${t['typePlaceholder'] ?? 'Reply to'} ${AppConfig.personaName}...',
                    hintStyle:
                        const TextStyle(color: Colors.white38, fontSize: 13),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [Color(0xFFFF3366), Color(0xFFFF5E8A)],
                ),
              ),
              child: IconButton(
                icon: const Icon(Icons.send_rounded,
                    color: Colors.white, size: 20),
                onPressed: _handleSendMessage,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _inputController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
}
