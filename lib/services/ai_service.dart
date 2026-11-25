import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../i18n/translations.dart';
import '../models/chat_message.dart';

class AiService {
  static int _fallbackIndex = 0;

  /// Sends the message to Gemini API, Groq API, or localized fallback
  static Future<String> sendMessage({
    required String userMessage,
    required List<ChatMessage> history,
    required String lang,
    String? customSystemPrompt,
    String? personaName,
  }) async {
    final String apiKey = AppConfig.aiApiKey.trim();
    final String provider = AppConfig.aiProvider.toLowerCase().trim();

    // 1. Try Gemini API if configured
    if (apiKey.isNotEmpty && provider == 'gemini') {
      try {
        final reply = await _callGeminiApi(
          userMessage: userMessage,
          history: history,
          lang: lang,
          apiKey: apiKey,
          customPrompt: customSystemPrompt,
        );
        if (reply != null && reply.isNotEmpty) {
          return reply;
        }
      } catch (e) {
        debugPrint('Gemini API call failed, falling back to local: $e');
      }
    }

    // 2. Try Groq API if configured
    if (apiKey.isNotEmpty && provider == 'groq') {
      try {
        final reply = await _callGroqApi(
          userMessage: userMessage,
          history: history,
          lang: lang,
          apiKey: apiKey,
          customPrompt: customSystemPrompt,
        );
        if (reply != null && reply.isNotEmpty) {
          return reply;
        }
      } catch (e) {
        debugPrint('Groq API call failed, falling back to local: $e');
      }
    }

    // 3. High quality localized fallback
    return _getLocalFallbackReply(lang);
  }

  static Future<String?> _callGeminiApi({
    required String userMessage,
    required List<ChatMessage> history,
    required String lang,
    required String apiKey,
    String? customPrompt,
  }) async {
    final systemPrompt = customPrompt?.isNotEmpty == true
        ? customPrompt!
        : AppTranslations.getSystemPrompt(lang);
    final url = Uri.parse(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey',
    );

    // Build contents with conversation history
    final List<Map<String, dynamic>> contents = [];

    for (final msg in history) {
      if (msg.hasPhoto) continue;
      contents.add({
        'role': msg.sender == MessageSender.user ? 'user' : 'model',
        'parts': [
          {'text': msg.text}
        ]
      });
    }

    // Append latest user message
    contents.add({
      'role': 'user',
      'parts': [
        {'text': userMessage}
      ]
    });

    final body = jsonEncode({
      'systemInstruction': {
        'parts': [
          {'text': systemPrompt}
        ]
      },
      'contents': contents,
      'generationConfig': {
        'temperature': 0.85,
        'maxOutputTokens': 150,
      }
    });

    final response = await http
        .post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: body,
        )
        .timeout(const Duration(seconds: 12));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final candidates = data['candidates'] as List?;
      if (candidates != null && candidates.isNotEmpty) {
        final text =
            candidates[0]['content']['parts'][0]['text'] as String?;
        return text?.trim();
      }
    }
    return null;
  }

  static Future<String?> _callGroqApi({
    required String userMessage,
    required List<ChatMessage> history,
    required String lang,
    required String apiKey,
    String? customPrompt,
  }) async {
    final systemPrompt = customPrompt?.isNotEmpty == true
        ? customPrompt!
        : AppTranslations.getSystemPrompt(lang);
    final url = Uri.parse('https://api.groq.com/openai/v1/chat/completions');

    final List<Map<String, String>> messages = [
      {'role': 'system', 'content': systemPrompt}
    ];

    for (final msg in history) {
      if (msg.hasPhoto) continue;
      messages.add({
        'role': msg.sender == MessageSender.user ? 'user' : 'assistant',
        'content': msg.text,
      });
    }

    messages.add({'role': 'user', 'content': userMessage});

    final body = jsonEncode({
      'model': AppConfig.groqModel,
      'messages': messages,
      'temperature': 0.85,
      'max_tokens': 150,
    });

    final response = await http
        .post(
          url,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $apiKey',
          },
          body: body,
        )
        .timeout(const Duration(seconds: 12));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final choices = data['choices'] as List?;
      if (choices != null && choices.isNotEmpty) {
        final text = choices[0]['message']['content'] as String?;
        return text?.trim();
      }
    }
    return null;
  }

  static String _getLocalFallbackReply(String lang) {
    final replies = AppTranslations.getFallbackReplies(lang);
    if (replies.isEmpty) {
      return "I'm so glad we're talking! Tell me more about you 😉";
    }

    final reply = replies[_fallbackIndex % replies.length];
    _fallbackIndex++;
    return reply;
  }
}
