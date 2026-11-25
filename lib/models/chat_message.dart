enum MessageSender { user, bot }

class ChatMessage {
  final String id;
  final MessageSender sender;
  final String text;
  final DateTime timestamp;
  final bool hasMedia;
  final String? mediaUrl;
  final String mediaType; // 'image' or 'video'
  bool isMediaUnlocked;

  bool get isVideo => mediaType.toLowerCase() == 'video';

  // Backward-compatible properties
  bool get hasPhoto => hasMedia && !isVideo;
  String? get photoUrl => mediaUrl;
  bool get isPhotoUnlocked => isMediaUnlocked;
  set isPhotoUnlocked(bool val) => isMediaUnlocked = val;

  ChatMessage({
    required this.id,
    required this.sender,
    required this.text,
    required this.timestamp,
    bool? hasMedia,
    this.mediaUrl,
    this.mediaType = 'image',
    bool? isMediaUnlocked,
    bool? hasPhoto,
    String? photoUrl,
    bool? isPhotoUnlocked,
  })  : hasMedia = hasMedia ?? (hasPhoto ?? (mediaUrl != null || photoUrl != null)),
        isMediaUnlocked = isMediaUnlocked ?? (isPhotoUnlocked ?? true);
}
