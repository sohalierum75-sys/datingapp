import 'package:flutter/material.dart';
import '../i18n/translations.dart';

class LanguageSelectorSheet extends StatelessWidget {
  final String currentLang;
  final ValueChanged<String> onLanguageSelected;

  const LanguageSelectorSheet({
    super.key,
    required this.currentLang,
    required this.onLanguageSelected,
  });

  static void show(
    BuildContext context, {
    required String currentLang,
    required ValueChanged<String> onLanguageSelected,
  }) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF161622),
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => LanguageSelectorSheet(
        currentLang: currentLang,
        onLanguageSelected: onLanguageSelected,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = AppTranslations.getStrings(currentLang);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  t['selectLanguage'] ?? 'Choose Language',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white70),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 10),
            ConstrainedBox(
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.55,
              ),
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: AppTranslations.supportedLanguages.length,
                separatorBuilder: (_, __) =>
                    const Divider(color: Colors.white10, height: 1),
                itemBuilder: (ctx, idx) {
                  final lang = AppTranslations.supportedLanguages[idx];
                  final isSelected = lang.code == currentLang;

                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    leading: Text(
                      lang.flag,
                      style: const TextStyle(fontSize: 26),
                    ),
                    title: Text(
                      lang.name,
                      style: TextStyle(
                        color: isSelected
                            ? const Color(0xFFFF3366)
                            : Colors.white,
                        fontWeight:
                            isSelected ? FontWeight.bold : FontWeight.w500,
                        fontSize: 15,
                      ),
                    ),
                    trailing: isSelected
                        ? const Icon(Icons.check_circle,
                            color: Color(0xFFFF3366))
                        : null,
                    onTap: () {
                      onLanguageSelected(lang.code);
                      Navigator.pop(context);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
