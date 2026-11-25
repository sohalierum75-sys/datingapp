class ChatMediaItem {
  final String id;
  final String url;
  final String mediaType; // 'image' or 'video'
  final String caption;
  final int triggerAfterMessages;

  ChatMediaItem({
    required this.id,
    required this.url,
    this.mediaType = 'image',
    this.caption = '',
    this.triggerAfterMessages = 2,
  });

  bool get isVideo => mediaType.toLowerCase() == 'video';

  factory ChatMediaItem.fromJson(Map<String, dynamic> json) {
    return ChatMediaItem(
      id: json['id']?.toString() ?? '',
      url: json['url']?.toString() ?? '',
      mediaType: json['mediaType']?.toString() ??
          (json['type']?.toString() ?? 'image'),
      caption: json['caption']?.toString() ?? '',
      triggerAfterMessages:
          (json['triggerAfterMessages'] as num?)?.toInt() ?? 2,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'url': url,
        'mediaType': mediaType,
        'caption': caption,
        'triggerAfterMessages': triggerAfterMessages,
      };
}

class UnlockMediaItem {
  final String id;
  final String url;
  final String mediaType; // 'image' or 'video'
  final String title;
  final String unlockType; // 'free', 'ad', 'chat'

  UnlockMediaItem({
    required this.id,
    required this.url,
    this.mediaType = 'image',
    this.title = '',
    this.unlockType = 'free',
  });

  bool get isVideo => mediaType.toLowerCase() == 'video';

  factory UnlockMediaItem.fromJson(Map<String, dynamic> json) {
    return UnlockMediaItem(
      id: json['id']?.toString() ?? '',
      url: json['url']?.toString() ?? '',
      mediaType: json['mediaType']?.toString() ??
          (json['type']?.toString() ?? 'image'),
      title: json['title']?.toString() ?? '',
      unlockType: json['unlockType']?.toString() ?? 'free',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'url': url,
        'mediaType': mediaType,
        'title': title,
        'unlockType': unlockType,
      };
}

class QuizPhotoSlot {
  final int slot;
  final String label;
  final String imageUrl;

  QuizPhotoSlot({
    required this.slot,
    this.label = '',
    required this.imageUrl,
  });

  factory QuizPhotoSlot.fromJson(Map<String, dynamic> json) {
    return QuizPhotoSlot(
      slot: (json['slot'] as num?)?.toInt() ?? 1,
      label: json['label']?.toString() ?? '',
      imageUrl: json['imageUrl']?.toString() ?? (json['url']?.toString() ?? ''),
    );
  }

  Map<String, dynamic> toJson() => {
        'slot': slot,
        'label': label,
        'imageUrl': imageUrl,
      };
}

class Profile {
  final String id;
  final String slug;
  final String name;
  final String avatarUrl;
  final String lastMessage;
  final String greetingMessage;
  final String systemPrompt;
  final String chatScript;
  final String adsterraDirectLink;
  final String themeAccent;
  final int typingDelayMs;
  final bool isOnline;
  final String updatedAt;
  final bool isPinned;
  final List<ChatMediaItem> chatMedia;
  final List<UnlockMediaItem> unlockMedia;
  final List<QuizPhotoSlot> quizPhotos;
  bool isRead;

  Profile({
    required this.id,
    required this.slug,
    required this.name,
    required this.avatarUrl,
    required this.lastMessage,
    required this.greetingMessage,
    required this.systemPrompt,
    this.chatScript = '',
    required this.adsterraDirectLink,
    this.themeAccent = '#FF3366',
    this.typingDelayMs = 1200,
    this.isOnline = true,
    required this.updatedAt,
    this.isPinned = false,
    this.chatMedia = const [],
    this.unlockMedia = const [],
    this.quizPhotos = const [],
    this.isRead = false,
  });

  factory Profile.fromJson(Map<String, dynamic> json) {
    final rawChatMedia = json['chatMedia'];
    final List<ChatMediaItem> parsedChatMedia = [];
    if (rawChatMedia is List) {
      for (final item in rawChatMedia) {
        if (item is Map<String, dynamic>) {
          parsedChatMedia.add(ChatMediaItem.fromJson(item));
        }
      }
    }

    final rawUnlockMedia = json['unlockMedia'];
    final List<UnlockMediaItem> parsedUnlockMedia = [];
    if (rawUnlockMedia is List) {
      for (final item in rawUnlockMedia) {
        if (item is Map<String, dynamic>) {
          parsedUnlockMedia.add(UnlockMediaItem.fromJson(item));
        }
      }
    }

    final rawQuizPhotos = json['quizPhotos'];
    final List<QuizPhotoSlot> parsedQuizPhotos = [];
    if (rawQuizPhotos is List) {
      for (final item in rawQuizPhotos) {
        if (item is Map<String, dynamic>) {
          parsedQuizPhotos.add(QuizPhotoSlot.fromJson(item));
        }
      }
    }

    return Profile(
      id: json['id']?.toString() ?? '',
      slug: json['slug']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Companion',
      avatarUrl: json['avatarUrl']?.toString() ??
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      lastMessage: json['lastMessage']?.toString() ?? 'Hey there! ❤️',
      greetingMessage: json['greetingMessage']?.toString() ??
          'Hey there! ❤️ Nice to meet you. Thanks for stopping by!',
      systemPrompt: json['systemPrompt']?.toString() ?? '',
      chatScript: json['chatScript']?.toString() ?? '',
      adsterraDirectLink: json['adsterraDirectLink']?.toString() ??
          'https://www.highperformanceformat.com/d9j8y2v4?key=adsterra_companion_link',
      themeAccent: json['themeAccent']?.toString() ?? '#FF3366',
      typingDelayMs: (json['typingDelayMs'] as num?)?.toInt() ?? 1200,
      isOnline: json['isOnline'] == true,
      updatedAt: json['updatedAt']?.toString() ?? '',
      isPinned: json['isPinned'] == true,
      chatMedia: parsedChatMedia,
      unlockMedia: parsedUnlockMedia,
      quizPhotos: parsedQuizPhotos,
      isRead: json['isRead'] == true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'slug': slug,
      'name': name,
      'avatarUrl': avatarUrl,
      'lastMessage': lastMessage,
      'greetingMessage': greetingMessage,
      'systemPrompt': systemPrompt,
      'chatScript': chatScript,
      'adsterraDirectLink': adsterraDirectLink,
      'themeAccent': themeAccent,
      'typingDelayMs': typingDelayMs,
      'isOnline': isOnline,
      'updatedAt': updatedAt,
      'isPinned': isPinned,
      'chatMedia': chatMedia.map((m) => m.toJson()).toList(),
      'unlockMedia': unlockMedia.map((m) => m.toJson()).toList(),
      'quizPhotos': quizPhotos.map((q) => q.toJson()).toList(),
      'isRead': isRead,
    };
  }
}
