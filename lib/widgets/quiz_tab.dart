import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../i18n/translations.dart';
import '../models/profile.dart';
import '../models/quiz_data.dart';
import '../services/ad_service.dart';
import 'media_view_dialog.dart';

class QuizTab extends StatefulWidget {
  final String currentLang;
  final Profile? profile;

  const QuizTab({
    super.key,
    required this.currentLang,
    this.profile,
  });

  @override
  State<QuizTab> createState() => _QuizTabState();
}

class _QuizTabState extends State<QuizTab> {
  int _currentPhotoIdx = 0;
  int _currentQuestionIdx = 0;
  bool _isRevealed = false;
  Map<int, bool> _unlockedSlots = {};

  @override
  void initState() {
    super.initState();
    _loadUnlockedState();
  }

  @override
  void didUpdateWidget(covariant QuizTab oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.profile?.id != widget.profile?.id) {
      _currentPhotoIdx = 0;
      _currentQuestionIdx = 0;
      _isRevealed = false;
      _loadUnlockedState();
    }
  }

  String _getSlotPrefsKey(int slot) {
    final profId = widget.profile?.id ?? 'global';
    return 'quiz_unlocked_${profId}_slot_$slot';
  }

  Future<void> _loadUnlockedState() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final map = <int, bool>{};
      for (int i = 0; i < 3; i++) {
        map[i] = prefs.getBool(_getSlotPrefsKey(i + 1)) ?? false;
      }
      if (mounted) {
        setState(() {
          _unlockedSlots = map;
          _isRevealed = _unlockedSlots[_currentPhotoIdx] ?? false;
          if (_isRevealed) {
            _currentQuestionIdx = 3;
          }
        });
      }
    } catch (_) {}
  }

  Future<void> _persistSlotUnlocked(int slot) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_getSlotPrefsKey(slot), true);
    } catch (_) {}
  }

  /// Calculates progressive blur level:
  /// Question 0 -> 20.0
  /// Question 1 -> 12.0
  /// Question 2 -> 5.0
  /// Question 3 (answered) -> 0.0 (or after clicking Reveal HD)
  double get _currentBlurSigma {
    if (_isRevealed) return 0.0;
    switch (_currentQuestionIdx) {
      case 0:
        return 20.0;
      case 1:
        return 12.0;
      case 2:
        return 5.0;
      case 3:
      default:
        return 0.0;
    }
  }

  int get _unlockedPercentage {
    if (_isRevealed) return 100;
    return ((_currentQuestionIdx / 3) * 100).round();
  }

  void _handleSelectOption(int optionIdx) {
    if (_currentQuestionIdx < 2) {
      setState(() {
        _currentQuestionIdx++;
      });
    } else {
      // 3rd question answered!
      setState(() {
        _currentQuestionIdx = 3;
      });
    }
  }

  Future<void> _handleRevealHdPhoto() async {
    await AdService.openAdsterraLink();
    setState(() {
      _isRevealed = true;
      _unlockedSlots[_currentPhotoIdx] = true;
    });
    await _persistSlotUnlocked(_currentPhotoIdx + 1);
  }

  void _handleNextPhoto(int totalPhotos) {
    if (_currentPhotoIdx < totalPhotos - 1) {
      final nextIdx = _currentPhotoIdx + 1;
      final isNextUnlocked = _unlockedSlots[nextIdx] ?? false;
      setState(() {
        _currentPhotoIdx = nextIdx;
        _isRevealed = isNextUnlocked;
        _currentQuestionIdx = isNextUnlocked ? 3 : 0;
      });
    }
  }

  String _getActivePhotoUrl(PhotoQuizSet activeQuiz) {
    if (widget.profile != null && widget.profile!.quizPhotos.isNotEmpty) {
      final slotNum = _currentPhotoIdx + 1;
      final match = widget.profile!.quizPhotos.firstWhere(
        (p) => p.slot == slotNum,
        orElse: () => QuizPhotoSlot(slot: slotNum, imageUrl: ''),
      );
      if (match.imageUrl.isNotEmpty) {
        return match.imageUrl;
      }
      if (slotNum == 1 && widget.profile!.avatarUrl.isNotEmpty) {
        return widget.profile!.avatarUrl;
      }
    }
    return activeQuiz.imageUrl;
  }

  @override
  Widget build(BuildContext context) {
    final t = AppTranslations.getStrings(widget.currentLang);
    final quizzes = AppTranslations.getQuizzes(widget.currentLang);
    final activeQuiz = quizzes[_currentPhotoIdx % quizzes.length];
    final activePhotoUrl = _getActivePhotoUrl(activeQuiz);
    final personaTitle = widget.profile?.name ?? '';

    return Scaffold(
      backgroundColor: const Color(0xFF0D0D12),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Column(
          children: [
            // Header Title & Subtitle
            Text(
              personaTitle.isNotEmpty
                  ? '$personaTitle — ${t['quizTitle'] ?? 'Compatibility Quiz 🔥'}'
                  : (t['quizTitle'] ?? 'Compatibility Quiz 🔥'),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              t['quizSubtitle'] ??
                  'Answer 3 quick questions to reveal my private HD photo!',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.white54, fontSize: 12),
            ),
            const SizedBox(height: 14),

            // Photo Tab Selector (Photo 1, Photo 2, Photo 3)
            _buildPhotoTabBar(quizzes.length),
            const SizedBox(height: 14),

            // Main Blurred Photo Card with ImageFiltered & Tap to View Fullscreen
            _buildBlurredPhotoCard(activePhotoUrl, t),
            const SizedBox(height: 16),

            // Questions Card or Success State
            if (_currentQuestionIdx < 3)
              _buildQuestionsCard(activeQuiz, t)
            else
              _buildCelebrationCard(t, quizzes.length, activePhotoUrl),
          ],
        ),
      ),
    );
  }

  Widget _buildPhotoTabBar(int count) {
    return Row(
      children: List.generate(count, (idx) {
        final isSelected = _currentPhotoIdx == idx;
        final isUnlocked = _unlockedSlots[idx] ?? false;

        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              left: idx == 0 ? 0 : 4,
              right: idx == count - 1 ? 0 : 4,
            ),
            child: InkWell(
              onTap: () {
                final slotUnlocked = _unlockedSlots[idx] ?? false;
                setState(() {
                  _currentPhotoIdx = idx;
                  _isRevealed = slotUnlocked;
                  _currentQuestionIdx = slotUnlocked ? 3 : 0;
                });
              },
              borderRadius: BorderRadius.circular(10),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected
                      ? const Color(0xFFFF3366).withOpacity(0.18)
                      : Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: isSelected
                        ? const Color(0xFFFF3366)
                        : Colors.white.withOpacity(0.08),
                  ),
                ),
                child: Center(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        '📸 Photo ${idx + 1}',
                        style: TextStyle(
                          color: isSelected
                              ? const Color(0xFFFF3366)
                              : Colors.white60,
                          fontWeight:
                              isSelected ? FontWeight.bold : FontWeight.w500,
                          fontSize: 12,
                        ),
                      ),
                      if (isUnlocked) ...[
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.check_circle_rounded,
                          color: Color(0xFF10B981),
                          size: 13,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _buildBlurredPhotoCard(String imageUrl, Map<String, String> t) {
    return GestureDetector(
      onTap: () {
        if (_isRevealed) {
          MediaViewDialog.show(
            context,
            url: imageUrl,
            mediaType: 'image',
            title: widget.profile != null
                ? '${widget.profile!.name} - Photo ${_currentPhotoIdx + 1}'
                : 'Photo ${_currentPhotoIdx + 1}',
          );
        }
      },
      child: Container(
        width: double.infinity,
        height: 330,
        decoration: BoxDecoration(
          color: const Color(0xFF191924),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: _isRevealed
                ? const Color(0xFF10B981).withOpacity(0.6)
                : Colors.white.withOpacity(0.12),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Image filtered with progressive blur (20 -> 12 -> 5 -> 0)
            ImageFiltered(
              imageFilter: ImageFilter.blur(
                sigmaX: _currentBlurSigma,
                sigmaY: _currentBlurSigma,
              ),
              child: AnimatedScale(
                scale: _isRevealed ? 1.0 : 1.08,
                duration: const Duration(milliseconds: 600),
                curve: Curves.easeOut,
                child: Image.network(
                  imageUrl,
                  fit: BoxFit.cover,
                  loadingBuilder: (context, child, loadingProgress) {
                    if (loadingProgress == null) return child;
                    return const Center(
                      child: CircularProgressIndicator(
                        color: Color(0xFFFF3366),
                      ),
                    );
                  },
                  errorBuilder: (_, __, ___) => Container(
                    color: const Color(0xFF1F1F2E),
                    child: const Center(
                      child: Icon(Icons.broken_image_rounded, color: Colors.white24, size: 50),
                    ),
                  ),
                ),
              ),
            ),

            // Percentage unlocked badge on top-left
            Positioned(
              top: 12,
              left: 12,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.7),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white24),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _isRevealed
                          ? '🔓 100%'
                          : '🔒 $_unlockedPercentage%',
                      style: TextStyle(
                        color: _isRevealed
                            ? const Color(0xFF10B981)
                            : const Color(0xFFFF3366),
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      t['unlocked'] ?? 'Unlocked',
                      style: const TextStyle(color: Colors.white, fontSize: 11),
                    ),
                  ],
                ),
              ),
            ),

            // Tap to view full screen badge when revealed
            if (_isRevealed)
              Positioned(
                bottom: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: const Color(0xFF10B981).withOpacity(0.5)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.fullscreen_rounded, color: Color(0xFF10B981), size: 14),
                      SizedBox(width: 4),
                      Text(
                        'Tap to View Fullscreen',
                        style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),

            // 3rd Question Completed -> Reveal HD Photo Overlay Banner
            if (_currentQuestionIdx >= 3 && !_isRevealed)
              Container(
                color: Colors.black.withOpacity(0.6),
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('🎉', style: TextStyle(fontSize: 40)),
                    const SizedBox(height: 8),
                    Text(
                      t['revealedSuccess'] ??
                          'HD Photo Revealed! Full quality unlocked ✨',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _handleRevealHdPhoto,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF3366),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(24),
                        ),
                        elevation: 6,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.lock_open_rounded, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            t['revealHdBtn'] ?? 'Reveal HD Photo 🔓',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuestionsCard(PhotoQuizSet activeQuiz, Map<String, String> t) {
    final activeQuestion = activeQuiz.questions[_currentQuestionIdx];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF161622),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Question Progress Indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${t['questionProgress'] ?? 'Question'} ${_currentQuestionIdx + 1} / 3',
                style: const TextStyle(
                  color: Color(0xFFFF3366),
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                activeQuiz.title,
                style: const TextStyle(color: Colors.white54, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 8),
          // Progress bar
          LinearProgressIndicator(
            value: (_currentQuestionIdx + 1) / 3,
            backgroundColor: Colors.white12,
            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFFF3366)),
            borderRadius: BorderRadius.circular(4),
          ),
          const SizedBox(height: 14),

          // Question Text
          Text(
            activeQuestion.question,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 14),

          // Multiple-choice options
          ...List.generate(activeQuestion.options.length, (optIdx) {
            final optionText = activeQuestion.options[optIdx];
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: InkWell(
                onTap: () => _handleSelectOption(optIdx),
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1F2E),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white.withOpacity(0.06)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 22,
                        height: 22,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFFFF3366)),
                        ),
                        child: Center(
                          child: Text(
                            String.fromCharCode(65 + optIdx),
                            style: const TextStyle(
                              color: Color(0xFFFF3366),
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          optionText,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                          ),
                        ),
                      ),
                      const Icon(
                        Icons.chevron_right,
                        color: Colors.white24,
                        size: 18,
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildCelebrationCard(Map<String, String> t, int totalPhotos, String activePhotoUrl) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF161622),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF10B981).withOpacity(0.4)),
      ),
      child: Column(
        children: [
          const Icon(
            Icons.check_circle_rounded,
            color: Color(0xFF10B981),
            size: 40,
          ),
          const SizedBox(height: 8),
          Text(
            t['revealedSuccess'] ??
                'HD Photo Revealed! Full quality unlocked ✨',
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Tap the photo above to open in full screen HD viewer.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 12),
          ),
          const SizedBox(height: 14),
          if (_currentPhotoIdx < totalPhotos - 1)
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _handleNextPhoto(totalPhotos),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF3366),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                ),
                child: Text(
                  t['nextPhoto'] ?? 'Next Photo ➡️',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
