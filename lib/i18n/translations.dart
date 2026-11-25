import 'dart:ui';
import '../models/quiz_data.dart';
import '../config.dart';

class LanguageItem {
  final String code;
  final String name;
  final String flag;
  final bool isRtl;

  const LanguageItem({
    required this.code,
    required this.name,
    required this.flag,
    this.isRtl = false,
  });
}

class AppTranslations {
  static const List<LanguageItem> supportedLanguages = [
    LanguageItem(code: 'en', name: 'English', flag: '🇺🇸'),
    LanguageItem(code: 'es', name: 'Español (MX/ES)', flag: '🇪🇸'),
    LanguageItem(code: 'pt', name: 'Português (BR)', flag: '🇧🇷'),
    LanguageItem(code: 'fr', name: 'Français', flag: '🇫🇷'),
    LanguageItem(code: 'si', name: 'සිංහල (Sinhala)', flag: '🇱🇰'),
    LanguageItem(code: 'de', name: 'Deutsch', flag: '🇩🇪'),
    LanguageItem(code: 'it', name: 'Italiano', flag: '🇮🇹'),
    LanguageItem(code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳'),
    LanguageItem(code: 'ar', name: 'العربية', flag: '🇸🇦', isRtl: true),
    LanguageItem(code: 'ru', name: 'Русский', flag: '🇷🇺'),
  ];

  static String detectInitialLanguage(Locale deviceLocale) {
    final String code = deviceLocale.languageCode.toLowerCase();
    for (final lang in supportedLanguages) {
      if (lang.code == code) {
        return code;
      }
    }
    return 'en';
  }

  static String getSystemPrompt(String lang) {
    return '''You are ${AppConfig.personaName}, a ${AppConfig.personaAge}-year-old friendly, alluring, and conversational companion living ${AppConfig.personaDistance} away.
Current mood/scenario: "${AppConfig.dailyScenario}"
Language: Respond naturally and fluently in the visitor's language (Language code: $lang).
Tone: Playful, engaging, slightly flirtatious, empathetic, concise (1-3 sentences max per response).
Never break character. Never state that you are an AI language model.''';
  }

  static Map<String, String> getStrings(String lang) {
    return _strings[lang] ?? _strings['en']!;
  }

  static List<String> getFallbackReplies(String lang) {
    return _fallbackReplies[lang] ?? _fallbackReplies['en']!;
  }

  static List<PhotoQuizSet> getQuizzes(String lang) {
    return _quizzes[lang] ?? _quizzes['en']!;
  }

  // --- UI Strings Dictionary ---
  static const Map<String, Map<String, String>> _strings = {
    'en': {
      'online': 'Online Now',
      'distanceAway': 'km away',
      'activeScenario': 'Daily Scenario',
      'tabChat': 'AI Companion',
      'tabQuiz': 'Unlock Photos',
      'typing': 'is typing a message...',
      'typePlaceholder': 'Reply to',
      'send': 'Send',
      'freeMessagesLeft': 'free messages left',
      'messagesLockedTitle': 'Daily Free Limit Reached! 🔒',
      'messagesLockedDesc':
          'You have used all 5 free messages. Unlock 5 more private messages now!',
      'unlockMoreMessages': 'Unlock +5 Messages 🔓',
      'privatePhotoLocked': 'Sent a private photo 🔒',
      'tapToUnlockPhoto': 'Tap to Unlock Photo',
      'unlockPrivatePhotoCTA': 'Unlock Private Photo 🔓',
      'photoUnlocked': 'Photo Unlocked ✨',
      'quizTitle': 'Compatibility Quiz 🔥',
      'quizSubtitle':
          'Answer 3 quick questions to reveal my private HD photo!',
      'revealedSuccess': 'HD Photo Revealed! Full quality unlocked ✨',
      'revealHdBtn': 'Reveal HD Photo 🔓',
      'questionProgress': 'Question',
      'selectLanguage': 'Choose Language',
      'photoMessageOffer':
          'I just took this a minute ago... do you want to see? 🙈',
      'scenarioFirstMessage':
          'Hey there! I saw you were looking at my profile... what\'s on your mind? 😉',
      'nextPhoto': 'Next Photo ➡️',
      'unlocked': 'Unlocked',
    },
    'es': {
      'online': 'En línea',
      'distanceAway': 'km de distancia',
      'activeScenario': 'Escenario del Día',
      'tabChat': 'Compañera AI',
      'tabQuiz': 'Desbloquear Fotos',
      'typing': 'está escribiendo un mensaje...',
      'typePlaceholder': 'Responder a',
      'send': 'Enviar',
      'freeMessagesLeft': 'mensajes gratis restantes',
      'messagesLockedTitle': '¡Límite Gratis Alcanzado! 🔒',
      'messagesLockedDesc':
          'Has usado tus 5 mensajes gratis. ¡Desbloquea 5 mensajes privados más ahora!',
      'unlockMoreMessages': 'Desbloquear +5 Mensajes 🔓',
      'privatePhotoLocked': 'Envió una foto privada 🔒',
      'tapToUnlockPhoto': 'Toca para desbloquear foto',
      'unlockPrivatePhotoCTA': 'Desbloquear Foto Privada 🔓',
      'photoUnlocked': 'Foto Desbloqueada ✨',
      'quizTitle': 'Test de Compatibilidad 🔥',
      'quizSubtitle':
          '¡Responde 3 preguntas rápidas para revelar mi foto HD privada!',
      'revealedSuccess': '¡Foto HD revelada! Máxima calidad desbloqueada ✨',
      'revealHdBtn': 'Revelar Foto HD 🔓',
      'questionProgress': 'Pregunta',
      'selectLanguage': 'Seleccionar Idioma',
      'photoMessageOffer':
          'Me acabo de tomar esto hace un minuto... ¿quieres verla? 🙈',
      'scenarioFirstMessage':
          '¡Hola! Vi que estabas mirando mi perfil... ¿en qué estás pensando? 😉',
      'nextPhoto': 'Siguiente Foto ➡️',
      'unlocked': 'Desbloqueado',
    },
    'pt': {
      'online': 'Online agora',
      'distanceAway': 'km de distância',
      'activeScenario': 'Cenário do Dia',
      'tabChat': 'Companheira IA',
      'tabQuiz': 'Desbloquear Fotos',
      'typing': 'está digitando uma mensagem...',
      'typePlaceholder': 'Responder a',
      'send': 'Enviar',
      'freeMessagesLeft': 'mensagens grátis restantes',
      'messagesLockedTitle': 'Limite Grátis Atingido! 🔒',
      'messagesLockedDesc':
          'Você usou suas 5 mensagens grátis. Desbloqueie +5 mensagens privadas agora!',
      'unlockMoreMessages': 'Desbloquear +5 Mensagens 🔓',
      'privatePhotoLocked': 'Enviou uma foto privada 🔒',
      'tapToUnlockPhoto': 'Toque para desbloquear foto',
      'unlockPrivatePhotoCTA': 'Desbloquear Foto Privada 🔓',
      'photoUnlocked': 'Foto Desbloqueada ✨',
      'quizTitle': 'Quiz de Compatibilidade 🔥',
      'quizSubtitle':
          'Responda 3 perguntas rápidas para revelar minha foto HD privada!',
      'revealedSuccess': 'Foto HD Revelada! Qualidade total liberada ✨',
      'revealHdBtn': 'Revelar Foto HD 🔓',
      'questionProgress': 'Pergunta',
      'selectLanguage': 'Escolher Idioma',
      'photoMessageOffer':
          'Acabei de tirar essa fotinho... você quer ver? 🙈',
      'scenarioFirstMessage':
          'Oi! Vi que você estava olhando meu perfil... o que você está pensando? 😉',
      'nextPhoto': 'Próxima Foto ➡️',
      'unlocked': 'Desbloqueado',
    },
    'fr': {
      'online': 'En ligne',
      'distanceAway': 'km de vous',
      'activeScenario': 'Scénario du Jour',
      'tabChat': 'Compagne IA',
      'tabQuiz': 'Débloquer Photos',
      'typing': 'est en train d\'écrire...',
      'typePlaceholder': 'Répondre à',
      'send': 'Envoyer',
      'freeMessagesLeft': 'messages gratuits restants',
      'messagesLockedTitle': 'Limite Gratuite Atteinte ! 🔒',
      'messagesLockedDesc':
          'Vous avez utilisé vos 5 messages gratuits. Débloquez 5 messages privés de plus maintenant !',
      'unlockMoreMessages': 'Débloquer +5 Messages 🔓',
      'privatePhotoLocked': 'A envoyé une photo privée 🔒',
      'tapToUnlockPhoto': 'Appuyez pour débloquer la photo',
      'unlockPrivatePhotoCTA': 'Débloquer la Photo Privée 🔓',
      'photoUnlocked': 'Photo Débloquée ✨',
      'quizTitle': 'Quiz de Compatibilité 🔥',
      'quizSubtitle':
          'Répondez à 3 questions rapides pour révéler ma photo HD secrète !',
      'revealedSuccess': 'Photo HD Révélée ! Pleine qualité débloquée ✨',
      'revealHdBtn': 'Révéler la Photo HD 🔓',
      'questionProgress': 'Question',
      'selectLanguage': 'Choisir la Langue',
      'photoMessageOffer':
          'Je viens de prendre ça il y a une minute... tu veux voir ? 🙈',
      'scenarioFirstMessage':
          'Coucou ! J\'ai vu que tu regardais mon profil... à quoi tu penses ? 😉',
      'nextPhoto': 'Photo Suivante ➡️',
      'unlocked': 'Débloqué',
    },
    'si': {
      'online': 'දැන් ඔන්ලයින්',
      'distanceAway': 'km දුරින්',
      'activeScenario': 'දවසේ මූඩ් එක',
      'tabChat': 'AI පෙම්වතිය',
      'tabQuiz': 'රහස් ඡායාරූප',
      'typing': 'ටයිප් කරමින්...',
      'typePlaceholder': 'පිළිතුරු ලියන්න',
      'send': 'යවන්න',
      'freeMessagesLeft': 'නොමිලේ පණිවිඩ ඉතිරිය',
      'messagesLockedTitle': 'නොමිලේ සීමාව අවසන්! 🔒',
      'messagesLockedDesc':
          'ඔබ නොමිලේ පණිවිඩ 5ම භාවිත කර ඇත. තවත් පෞද්ගලික පණිවිඩ 5ක් දැන්ම විවෘත කරගන්න!',
      'unlockMoreMessages': 'පණිවිඩ 5ක් අගුළු හරින්න 🔓',
      'privatePhotoLocked': 'පෞද්ගලික ඡායාරූපයක් එව්වා 🔒',
      'tapToUnlockPhoto': 'ඡායාරූපය බලන්න ටැප් කරන්න',
      'unlockPrivatePhotoCTA': 'රහස් පින්තූරය අගුළු හරින්න 🔓',
      'photoUnlocked': 'පින්තූරය අගුළු හැරුණා ✨',
      'quizTitle': 'ගැළපීමේ ප්‍රශ්නාවලිය 🔥',
      'quizSubtitle':
          'මගේ පැහැදිලි HD පින්තූරය බලාගන්න කෙටි ප්‍රශ්න 3කට උත්තර දෙන්න!',
      'revealedSuccess': 'HD ඡායාරූපය විවෘතයි! සම්පූර්ණ ගුණාත්මකභාවය ✨',
      'revealHdBtn': 'HD ඡායාරූපය බලන්න 🔓',
      'questionProgress': 'ප්‍රශ්නය',
      'selectLanguage': 'භාෂාව තෝරන්න',
      'photoMessageOffer':
          'මම මේ දැන් ගත්ත පින්තූරයක්... ඔයා බලන්න ආසද? 🙈',
      'scenarioFirstMessage':
          'හායි! ඔයා මගේ ප්‍රොෆයිල් එක බැලුවා දැක්කා... මොකද හිතන්නේ? 😉',
      'nextPhoto': 'ඊළඟ ඡායාරූපය ➡️',
      'unlocked': 'අගුළු හැරුණි',
    },
    'de': {
      'online': 'Jetzt online',
      'distanceAway': 'km entfernt',
      'activeScenario': 'Tages-Szenario',
      'tabChat': 'KI-Freundin',
      'tabQuiz': 'Fotos freischalten',
      'typing': 'schreibt eine Nachricht...',
      'typePlaceholder': 'Antworte an',
      'send': 'Senden',
      'freeMessagesLeft': 'Gratis-Nachrichten übrig',
      'messagesLockedTitle': 'Kostenloses Limit erreicht! 🔒',
      'messagesLockedDesc':
          'Du hast alle 5 Gratis-Nachrichten genutzt. Schalte jetzt 5 weitere private Nachrichten frei!',
      'unlockMoreMessages': '+5 Nachrichten freischalten 🔓',
      'privatePhotoLocked': 'Hat ein privates Foto gesendet 🔒',
      'tapToUnlockPhoto': 'Tippen zum Freischalten',
      'unlockPrivatePhotoCTA': 'Privates Foto freischalten 🔓',
      'photoUnlocked': 'Foto freigeschaltet ✨',
      'quizTitle': 'Kompatibilitäts-Quiz 🔥',
      'quizSubtitle':
          'Beantworte 3 kurze Fragen, um mein privates HD-Foto aufzudecken!',
      'revealedSuccess': 'HD-Foto aufgedeckt! Volle Qualität freigeschaltet ✨',
      'revealHdBtn': 'HD-Foto aufdecken 🔓',
      'questionProgress': 'Frage',
      'selectLanguage': 'Sprache wählen',
      'photoMessageOffer':
          'Ich habe das gerade eben gemacht... möchtest du es sehen? 🙈',
      'scenarioFirstMessage':
          'Hey! Ich habe gesehen, dass du mein Profil anschaust... woran denkst du? 😉',
      'nextPhoto': 'Nächstes Foto ➡️',
      'unlocked': 'Freigeschaltet',
    },
    'it': {
      'online': 'Online adesso',
      'distanceAway': 'km da te',
      'activeScenario': 'Scenario del Giorno',
      'tabChat': 'Compagna IA',
      'tabQuiz': 'Sblocca Foto',
      'typing': 'sta scrivendo un messaggio...',
      'typePlaceholder': 'Rispondi a',
      'send': 'Invia',
      'freeMessagesLeft': 'messaggi gratuiti rimasti',
      'messagesLockedTitle': 'Limite Gratuito Raggiunto! 🔒',
      'messagesLockedDesc':
          'Hai usato i tuoi 5 messaggi gratis. Sblocca altri 5 messaggi privati adesso!',
      'unlockMoreMessages': 'Sblocca +5 Messaggi 🔓',
      'privatePhotoLocked': 'Ha inviato una foto privata 🔒',
      'tapToUnlockPhoto': 'Tocca per sbloccare la foto',
      'unlockPrivatePhotoCTA': 'Sblocca Foto Privata 🔓',
      'photoUnlocked': 'Foto Sbloccata ✨',
      'quizTitle': 'Quiz di Compatibilità 🔥',
      'quizSubtitle':
          'Rispondi a 3 domande rapide per scoprire la mia foto HD segreta!',
      'revealedSuccess': 'Foto HD Rivelata! Massima qualità sbloccata ✨',
      'revealHdBtn': 'Rivela Foto HD 🔓',
      'questionProgress': 'Domanda',
      'selectLanguage': 'Scegli Lingua',
      'photoMessageOffer':
          'Ho appena scattato questa foto... ti va di vederla? 🙈',
      'scenarioFirstMessage':
          'Ciao! Ho visto che stavi guardando il mio profilo... a cosa pensi? 😉',
      'nextPhoto': 'Prossima Foto ➡️',
      'unlocked': 'Sbloccato',
    },
    'hi': {
      'online': 'अभी ऑनलाइन',
      'distanceAway': 'किमी दूर',
      'activeScenario': 'आज का मूड',
      'tabChat': 'एआई सहेली',
      'tabQuiz': 'फोटो अनलॉक करें',
      'typing': 'टाइप कर रही है...',
      'typePlaceholder': 'उत्तर लिखें',
      'send': 'भेजें',
      'freeMessagesLeft': 'मुफ्त मैसेज बचे हैं',
      'messagesLockedTitle': 'मुफ्त सीमा समाप्त! 🔒',
      'messagesLockedDesc':
          'आपने सभी 5 मुफ्त संदेश उपयोग कर लिए हैं। अभी 5 और संदेश अनलॉक करें!',
      'unlockMoreMessages': '+5 मैसेज अनलॉक करें 🔓',
      'privatePhotoLocked': 'एक प्राइवेट फोटो भेजी 🔒',
      'tapToUnlockPhoto': 'फोटो देखने के लिए टैप करें',
      'unlockPrivatePhotoCTA': 'प्राइवेट फोटो अनलॉक करें 🔓',
      'photoUnlocked': 'फोटो अनलॉक हो गई ✨',
      'quizTitle': 'कम्पैटिबिलिटी क्विज़ 🔥',
      'quizSubtitle':
          'मेरी प्राइवेट एचडी फोटो देखने के लिए 3 आसान सवालों के जवाब दें!',
      'revealedSuccess': 'एचडी फोटो खुल गई! पूरी क्वालिटी अनलॉक ✨',
      'revealHdBtn': 'एचडी फोटो देखें 🔓',
      'questionProgress': 'सवाल',
      'selectLanguage': 'भाषा चुनें',
      'photoMessageOffer':
          'मैंने बस अभी एक फोटो ली है... क्या आप देखना चाहते हैं? 🙈',
      'scenarioFirstMessage':
          'नमस्ते! मैंने देखा आप मेरी प्रोफ़ाइल देख रहे थे... क्या सोच रहे हैं? 😉',
      'nextPhoto': 'अगली फोटो ➡️',
      'unlocked': 'अनलॉक',
    },
    'ar': {
      'online': 'متصلة الآن',
      'distanceAway': 'كم منك',
      'activeScenario': 'سيناريو اليوم',
      'tabChat': 'الرفيقة الذكية',
      'tabQuiz': 'فتح الصور السرية',
      'typing': 'تكتب رسالة الآن...',
      'typePlaceholder': 'اكتب رداً إلى',
      'send': 'إرسال',
      'freeMessagesLeft': 'رسائل مجانية متبقية',
      'messagesLockedTitle': 'وصلت للحد المجاني! 🔒',
      'messagesLockedDesc':
          'لقد استهلكت 5 رسائل مجانية. افتح 5 رسائل خاصة إضافية الآن!',
      'unlockMoreMessages': 'فتح +5 رسائل خاصة 🔓',
      'privatePhotoLocked': 'أرسلت صورة خاصة 🔒',
      'tapToUnlockPhoto': 'اضغط لفتح الصورة',
      'unlockPrivatePhotoCTA': 'فتح الصورة الخاصة 🔓',
      'photoUnlocked': 'تم فتح الصورة ✨',
      'quizTitle': 'اختبار التوافق والرومانسية 🔥',
      'quizSubtitle':
          'أجب عن 3 أسئلة سريعة لكشف صورتي السرية بجودة HD!',
      'revealedSuccess': 'تم كشف الصورة بجودة فائقة! ✨',
      'revealHdBtn': 'كشف الصورة بجودة عالية 🔓',
      'questionProgress': 'السؤال',
      'selectLanguage': 'اختر اللغة',
      'photoMessageOffer':
          'التقطت هذه الصورة للتو... هل تريد رؤيتها؟ 🙈',
      'scenarioFirstMessage':
          'مرحباً! رأيت أنك تتصفح ملفي الشخصي... فيمَ تفكر؟ 😉',
      'nextPhoto': 'الصورة التالية ➡️',
      'unlocked': 'مفتوح',
    },
    'ru': {
      'online': 'Онлайн',
      'distanceAway': 'км от вас',
      'activeScenario': 'Сценарий дня',
      'tabChat': 'ИИ-Спутница',
      'tabQuiz': 'Открыть фото',
      'typing': 'печатает сообщение...',
      'typePlaceholder': 'Ответить для',
      'send': 'Отправить',
      'freeMessagesLeft': 'бесплатных сообщений осталось',
      'messagesLockedTitle': 'Бесплатный лимит исчерпан! 🔒',
      'messagesLockedDesc':
          'Вы использовали 5 бесплатных сообщений. Откройте еще 5 приватных сообщений прямо сейчас!',
      'unlockMoreMessages': 'Открыть +5 сообщений 🔓',
      'privatePhotoLocked': 'Отправила приватное фото 🔒',
      'tapToUnlockPhoto': 'Нажмите, чтобы открыть фото',
      'unlockPrivatePhotoCTA': 'Открыть приватное фото 🔓',
      'photoUnlocked': 'Фото открыто ✨',
      'quizTitle': 'Тест на Совместимость 🔥',
      'quizSubtitle':
          'Ответьте на 3 быстрых вопроса, чтобы открыть мое секретное HD-фото!',
      'revealedSuccess': 'HD-фото открыто! Максимальное качество ✨',
      'revealHdBtn': 'Показать HD-фото 🔓',
      'questionProgress': 'Вопрос',
      'selectLanguage': 'Выбрать язык',
      'photoMessageOffer':
          'Я только что сделала это фото... хочешь взглянуть? 🙈',
      'scenarioFirstMessage':
          'Привет! Я видела, что ты смотришь мой профиль... о чем думаешь? 😉',
      'nextPhoto': 'Следующее фото ➡️',
      'unlocked': 'Открыто',
    },
  };

  // --- Localized Fallback Responses ---
  static const Map<String, List<String>> _fallbackReplies = {
    'en': [
      "Hey there! I'm so glad you texted. How was your day?",
      "I was actually just thinking about something fun... what are you up to right now?",
      "You have such a great vibe! Do you live around here?",
      "Haha, I love that about you! Tell me more 😉",
      "I'm feeling really comfortable chatting with you. Want to know a secret?",
      "You're making my evening so much better! What's your favorite thing to do on weekends?",
      "I wish we could grab a coffee or drink together sometime soon!",
      "You definitely know how to make a girl smile."
    ],
    'es': [
      "¡Hola! Qué lindo que me escribas. ¿Cómo estuvo tu día?",
      "Estaba pensando justo en algo entretenido... ¿qué estás haciendo ahora?",
      "¡Tienes muy buena vibra! ¿Vives por aquí cerca?",
      "Jaja, ¡me encanta eso de ti! Cuéntame más 😉",
      "Me siento muy a gusto hablando contigo. ¿Quieres que te cuente un secreto?",
      "¡Estás haciendo mi noche mucho más divertida!",
      "¡Ojalá pudiéramos tomarnos algo juntos pronto!",
      "Definitivamente sabes cómo hacerme sonreír."
    ],
    'pt': [
      "Oi! Que bom que você mandou mensagem. Como foi seu dia?",
      "Eu estava pensando em algo divertido... o que você está fazendo agora?",
      "Você tem uma energia ótima! Mora por perto?",
      "Haha, adorei isso em você! Me conta mais 😉",
      "Estou adorando conversar com você. Quer saber um segredo?",
      "Você está deixando minha noite muito melhor!",
      "Adoraria que a gente tomasse algo juntos um dia desses!",
      "Você realmente sabe como me fazer sorrir."
    ],
    'fr': [
      "Coucou ! Ravie que tu m'écrives. Comment s'est passée ta journée ?",
      "Je pensais justement à un truc sympa... tu fais quoi en ce moment ?",
      "Tu dégages une super énergie ! Tu habites par ici ?",
      "Haha, j'adore ta façon d'être ! Dis-m'en plus 😉",
      "Je me sens vraiment bien à discuter avec toi. Tu veux un petit secret ?",
      "Tu rends ma soirée bien plus agréable !",
      "J'aimerais beaucoup qu'on prenne un verre ensemble bientôt !"
    ],
    'si': [
      "හායි! ඔයා මැසේජ් කරපු එක ගැන මට ගොඩක් සතුටුයි. දවස කොහොමද?",
      "මම මේ දැන් හිතුවේ ලස්සන දෙයක් ගැන... ඔයා මොකද කරන්නේ දැන්?",
      "ඔයා හරිම මිත්‍රශීලී කෙනෙක්! ඔයා ඉන්නේ මේ කිට්ටුවද?",
      "හහ් හා, ඔයාගේ ඒ ගතියට මම ආසයි! තව විස්තර කියන්න 😉",
      "ඔයත් එක්ක චැට් කරන එක මට හරිම සැහැල්ලුවක්. පුංචි රහසක් කියන්නද?",
      "ඔයා මගේ දවස ගොඩක් ලස්සන කළා!",
      "අපි කවදාහරි කෝපි එකක් බොන්න මුණගැහෙමුද?"
    ],
    'de': [
      "Hey! Schön, dass du mir schreibst. Wie war dein Tag?",
      "Ich habe gerade an etwas Schönes gedacht... was machst du gerade?",
      "Du hast eine tolle Ausstrahlung! Wohnst du hier in der Nähe?",
      "Haha, das gefällt mir an dir! Erzähl mir mehr 😉",
      "Es macht echt Spaß, mit dir zu schreiben. Willst du ein Geheimnis wissen?"
    ],
    'it': [
      "Ciao! Che bello che mi hai scritto. Com'è andata la tua giornata?",
      "Stavo proprio pensando a qualcosa di carino... cosa stai facendo ora?",
      "Hai un'energia fantastica! Vivi qui vicino?",
      "Haha, mi piace molto questo di te! Dimmi di più 😉",
      "Mi trovo benissimo a parlare con te. Vuoi sapere un segreto?"
    ],
    'hi': [
      "अरे नमस्ते! बहुत अच्छा लगा कि आपने मैसेज किया। आपका दिन कैसा रहा?",
      "मैं बस कुछ मजेदार सोच रही थी... आप अभी क्या कर रहे हैं?",
      "आपकी वाइब बहुत अच्छी है! क्या आप यहीं पास में रहते हैं?",
      "हाहा, आपकी यह बात मुझे बहुत पसंद आई! और बताइए 😉",
      "आपसे बात करके बहुत अच्छा लग रहा है। एक सीक्रेट बताऊं?"
    ],
    'ar': [
      "أهلاً بك! سعيدة جداً بمراسلتك. كيف كان يومك؟",
      "كنت أفكر للتو في شيء لطيف... ما الذي تفعله الآن؟",
      "لديك طاقة إيجابية رائعة! هل تسكن قريباً من هنا؟",
      "هههه، يعجبني هذا فيك! أخبرني المزيد 😉",
      "أشعر براحة كبيرة في التحدث معك. هل تريد معرفة سر صغير؟"
    ],
    'ru': [
      "Привет! Очень рада, что ты написал. Как прошёл твой день?",
      "Я как раз думала о кое-чём интересном... чем сейчас занимаешься?",
      "От тебя исходит классная энергия! Живёшь где-то поблизости?",
      "Ха-ха, мне это в тебе нравится! Расскажи побольше 😉",
      "Мне так уютно с тобой общаться. Хочешь узнать секрет?"
    ],
  };

  // --- Quiz Questions per language ---
  static final Map<String, List<PhotoQuizSet>> _quizzes = {
    'en': [
      PhotoQuizSet(
        id: 1,
        title: 'Bedtime Secret 🌙',
        imageUrl: AppConfig.quizPhotoUrls[0],
        questions: const [
          QuizQuestion(
            question: 'What time do you usually go to bed?',
            options: ['Before 11 PM', 'Around midnight', '2 AM or later 🔥', 'Whenever I get tired'],
          ),
          QuizQuestion(
            question: 'What is your idea of a perfect first date?',
            options: ['Romantic candle dinner', 'Late night rooftop drinks', 'Cozy Netflix & wine', 'Beach walk under the stars'],
          ),
          QuizQuestion(
            question: 'If we were together tonight, what would we do?',
            options: ['Talk for hours', 'Cuddle and listen to music', 'Something exciting and naughty 😉', 'Go on a late night drive'],
          ),
        ],
      ),
      PhotoQuizSet(
        id: 2,
        title: 'Morning Vibes ☕',
        imageUrl: AppConfig.quizPhotoUrls[1],
        questions: const [
          QuizQuestion(
            question: 'How do you like your morning coffee?',
            options: ['Sweet with milk', 'Black & strong', 'I prefer tea or iced drinks', 'A kiss in bed instead 💋'],
          ),
          QuizQuestion(
            question: 'Are you more of an introvert or extrovert?',
            options: ['Deep introvert', 'Outgoing party lover', 'Ambivert depending on mood', 'Secretive until you know me'],
          ),
          QuizQuestion(
            question: 'What catches your attention first in a girl?',
            options: ['Her eyes and smile', 'Her curves & body 🔥', 'Her confidence & wit', 'Her sweet voice'],
          ),
        ],
      ),
      PhotoQuizSet(
        id: 3,
        title: 'Exclusive VIP Album 💎',
        imageUrl: AppConfig.quizPhotoUrls[2],
        questions: const [
          QuizQuestion(
            question: 'Do you prefer secret flirty messages or direct calls?',
            options: ['Spicy midnight texts 🔥', 'Late voice notes', 'Spontaneous FaceTime calls', 'Meeting up in real life ASAP'],
          ),
          QuizQuestion(
            question: 'What is your favorite weekend getaway?',
            options: ['Luxury resort with pool', 'Secluded mountain cabin', 'Wild party beach', 'Staying in bed all weekend'],
          ),
          QuizQuestion(
            question: 'Would you keep our private photos confidential?',
            options: ['100% just between us 🔒', 'Of course, total privacy', 'Only for my eyes!', 'Cross my heart ❤️'],
          ),
        ],
      ),
    ],
    'es': [
      PhotoQuizSet(
        id: 1,
        title: 'Secreto Nocturno 🌙',
        imageUrl: AppConfig.quizPhotoUrls[0],
        questions: const [
          QuizQuestion(
            question: '¿A qué hora sueles dormirte?',
            options: ['Antes de las 11 PM', 'Hacia la medianoche', '2 AM o más tarde 🔥', 'Cuando me da sueño'],
          ),
          QuizQuestion(
            question: '¿Tu cita perfecta?',
            options: ['Cena romántica', 'Copas en terraza de noche', 'Netflix y vino acogedor', 'Paseo nocturno en la playa'],
          ),
          QuizQuestion(
            question: '¿Qué haríamos esta noche juntos?',
            options: ['Hablar horas', 'Abrazarnos con música', 'Algo travieso y picante 😉', 'Paseo en coche nocturno'],
          ),
        ],
      ),
      PhotoQuizSet(
        id: 2,
        title: 'Vibras Matutinas ☕',
        imageUrl: AppConfig.quizPhotoUrls[1],
        questions: const [
          QuizQuestion(
            question: '¿Cómo tomas el café?',
            options: ['Dulce con leche', 'Negro y fuerte', 'Prefiero té o batidos', 'Un beso en la cama 💋'],
          ),
          QuizQuestion(
            question: '¿Eres introvertido o extrovertido?',
            options: ['Muy introvertido', 'Fiestero extrovertido', 'Depende de mi humor', 'Reservado al inicio'],
          ),
          QuizQuestion(
            question: '¿Qué te llama más la atención de una chica?',
            options: ['Ojos y sonrisa', 'Curvas y cuerpo 🔥', 'Confianza y humor', 'Voz dulce'],
          ),
        ],
      ),
      PhotoQuizSet(
        id: 3,
        title: 'Álbum VIP Exclusivo 💎',
        imageUrl: AppConfig.quizPhotoUrls[2],
        questions: const [
          QuizQuestion(
            question: '¿Prefieres mensajes picantes o llamadas?',
            options: ['Textos picantes de noche 🔥', 'Audios sugerentes', 'Videollamada espontánea', 'Vernos en persona ya'],
          ),
          QuizQuestion(
            question: '¿Escapada de fin de semana favorita?',
            options: ['Hotel de lujo con piscina', 'Cabaña en la montaña', 'Playa de fiesta', 'Quedarnos en la cama'],
          ),
          QuizQuestion(
            question: '¿Mantendrás nuestras fotos en privado?',
            options: ['100% entre nosotros 🔒', 'Por supuesto, total reserva', 'Solo para mis ojos', 'Te lo prometo ❤️'],
          ),
        ],
      ),
    ],
    'si': [
      PhotoQuizSet(
        id: 1,
        title: 'රාත්‍රී රහස් 🌙',
        imageUrl: AppConfig.quizPhotoUrls[0],
        questions: const [
          QuizQuestion(
            question: 'ඔබ සාමාන්‍යයෙන් නිදාගන්නේ කීයටද?',
            options: ['රෑ 11ට පෙර', 'මැදියම් රැයට ආසන්නව', 'පාන්දර 2ට හෝ පසුව 🔥', 'නින්ද එන වෙලාවට'],
          ),
          QuizQuestion(
            question: 'ඔබේ සිහින හමුවීම මොන වගේද?',
            options: ['ඉටිපන්දම් එළියෙන් රාත්‍රී කෑමක්', 'උස් ගොඩනැගිල්ලක රාත්‍රී දසුන් බලමින්', 'සීතල කාමරයක චිත්‍රපටියක් බලමින්', 'මුහුදු වෙරළේ ඇවිදිමින්'],
          ),
          QuizQuestion(
            question: 'අද රෑ අපි එකට හිටියොත් මොකද කරන්නේ?',
            options: ['පැය ගණන් කතාබහ කරමු', 'තුරුළු වී සිංදු අහමු', 'වෙනස්ම ආදරණීය අත්දැකීමක් 😉', 'රෑ කාර් එකේ රවුමක් යමු'],
          ),
        ],
      ),
      PhotoQuizSet(
        id: 2,
        title: 'උදෑසන මනෝභාවය ☕',
        imageUrl: AppConfig.quizPhotoUrls[1],
        questions: const [
          QuizQuestion(
            question: 'උදෑසන බොන්න කැමති මොනවද?',
            options: ['කිරි කෝපි හෝ තේ', 'කළු කෝපි', 'පලතුරු බීම', 'ඇඳේදී උණුසුම් හාදුවක් 💋'],
          ),
          QuizQuestion(
            question: 'ඔබ නිහඬ කෙනෙක්ද නැත්නම් පාටි දාන කෙනෙක්ද?',
            options: ['නිහඬ චරිතයක්', 'පාටි සහ විනෝදයට කැමති', 'වෙලාවෙ හැටියට', 'මුලින් ලැජ්ජයි පස්සෙ යාලුයි'],
          ),
          QuizQuestion(
            question: 'කෙල්ලෙක්ගෙන් මුලින්ම දකින්නේ මොනවද?',
            options: ['ඇස් සහ සිනහව', 'ලස්සන හැඩය 🔥', 'කතාව සහ පෞරුෂය', 'මිහිරි කටහඬ'],
          ),
        ],
      ),
      PhotoQuizSet(
        id: 3,
        title: 'විශේෂ VIP ඇල්බමය 💎',
        imageUrl: AppConfig.quizPhotoUrls[2],
        questions: const [
          QuizQuestion(
            question: 'වඩාත් ප්‍රිය කරන්නේ මොන ක්‍රමයටද?',
            options: ['රෑට ආදරණීය කෙටි පණිවිඩ 🔥', 'මිහිරි හඬ පණිවිඩ', 'වීඩියෝ කෝල් එකක්', 'හැකි ඉක්මනින් මුණගැසීම'],
          ),
          QuizQuestion(
            question: 'නිවාඩුවක් ගත කරන්න කැමති කොහේද?',
            options: ['සුඛෝපභෝගී හෝටලයක', 'කඳුකරයේ කුඩා නිවසක', 'මුහුදු වෙරළේ', 'සති අන්තයම ඇඳට වෙලා'],
          ),
          QuizQuestion(
            question: 'අපේ පින්තූර රහසක් ලෙස තබාගන්නවාද?',
            options: ['100% අප දෙදෙනා අතර පමණි 🔒', 'සම්පූර්ණ පෞද්ගලිකත්වය', 'මගේ දෑසට පමණයි!', 'දිවුරලා පොරොන්දු වෙනවා ❤️'],
          ),
        ],
      ),
    ],
  };
}
