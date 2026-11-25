import 'package:flutter/material.dart';
import 'video_player_widget.dart';

class MediaViewDialog extends StatelessWidget {
  final String url;
  final String mediaType;
  final String title;

  const MediaViewDialog({
    super.key,
    required this.url,
    this.mediaType = 'image',
    this.title = '',
  });

  static void show(
    BuildContext context, {
    required String url,
    String mediaType = 'image',
    String title = '',
  }) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.92),
      builder: (_) => MediaViewDialog(
        url: url,
        mediaType: mediaType,
        title: title,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isVideo = mediaType.toLowerCase() == 'video';

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: EdgeInsets.zero,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Center(
            child: isVideo
                ? VideoPlayerWidget(
                    videoUrl: url,
                    autoPlay: true,
                    loop: true,
                  )
                : InteractiveViewer(
                    minScale: 0.8,
                    maxScale: 4.0,
                    child: Image.network(
                      url,
                      fit: BoxFit.contain,
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return const Center(
                          child: CircularProgressIndicator(
                            color: Color(0xFFEC4899),
                          ),
                        );
                      },
                      errorBuilder: (_, __, ___) => const Center(
                        child: Icon(Icons.broken_image,
                            size: 64, color: Colors.white54),
                      ),
                    ),
                  ),
          ),
          // Top Bar with Title and Close Button
          Positioned(
            top: 40,
            left: 16,
            right: 16,
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    title.isNotEmpty ? title : (isVideo ? 'Video' : 'Photo'),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      shadows: [
                        Shadow(color: Colors.black87, blurRadius: 4),
                      ],
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white, size: 28),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
