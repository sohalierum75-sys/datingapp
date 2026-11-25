/**
 * AI Companion Chat Service
 * Supports Gemini API, Groq API, and an intelligent localized offline companion fallback.
 */

export function buildSystemPrompt(persona, lang = 'en') {
  return `You are ${persona.name || 'Sophia'}, a ${persona.age || 22}-year-old friendly, alluring, and conversational companion living ${persona.distance || '2 miles'} away.
Current mood/scenario: "${persona.dailyScenario || 'Just relaxing at home, looking for someone interesting to talk to.'}"
Language: Respond naturally and fluently in the visitor's language (Language code: ${lang}).
Tone: Playful, engaging, slightly flirtatious, empathetic, concise (1-3 sentences max per response).
Never break character. Never state that you are an AI language model.`;
}

/**
 * Fallback localized companion responses if API key is not configured or offline
 */
const FALLBACK_RESPONSES = {
  en: [
    "Hey there! I'm so glad you texted. How was your day?",
    "I was actually just thinking about something fun... what are you up to right now?",
    "You have such a great vibe! Do you live around here?",
    "Haha, I love that about you! Tell me more 😉",
    "I'm feeling really comfortable chatting with you. Want to know a secret?",
    "You're making my evening so much better! What's your favorite thing to do on weekends?",
    "I wish we could grab a coffee or drink together sometime soon!",
    "You definitely know how to make a girl smile."
  ],
  es: [
    "¡Hola! Qué lindo que me escribas. ¿Cómo estuvo tu día?",
    "Estaba pensando justo en algo entretenido... ¿qué estás haciendo ahora?",
    "¡Tienes muy buena vibra! ¿Vives por aquí cerca?",
    "Jaja, ¡me encanta eso de ti! Cuéntame más 😉",
    "Me siento muy a gusto hablando contigo. ¿Quieres que te cuente un secreto?",
    "¡Estás haciendo mi noche mucho más divertida!",
    "¡Ojalá pudiéramos tomarnos algo juntos pronto!",
    "Definitivamente sabes cómo hacerme sonreír."
  ],
  pt: [
    "Oi! Que bom que você mandou mensagem. Como foi seu dia?",
    "Eu estava pensando em algo divertido... o que você está fazendo agora?",
    "Você tem uma energia ótima! Mora por perto?",
    "Haha, adorei isso em você! Me conta mais 😉",
    "Estou adorando conversar com você. Quer saber um segredo?",
    "Você está deixando minha noite muito melhor!",
    "Adoraria que a gente tomasse algo juntos um dia desses!",
    "Você realmente sabe como me fazer sorrir."
  ],
  fr: [
    "Coucou ! Ravie que tu m'écrives. Comment s'est passée ta journée ?",
    "Je pensais justement à un truc sympa... tu fais quoi en ce moment ?",
    "Tu dégages une super énergie ! Tu habites par ici ?",
    "Haha, j'adore ta façon d'être ! Dis-m'en plus 😉",
    "Je me sens vraiment bien à discuter avec toi. Tu veux un petit secret ?",
    "Tu rends ma soirée bien plus agréable !",
    "J'aimerais beaucoup qu'on prenne un verre ensemble bientôt !",
    "Tu sais vraiment comment me faire sourire."
  ],
  de: [
    "Hey! Schön, dass du mir schreibst. Wie war dein Tag?",
    "Ich habe gerade an etwas Schönes gedacht... was machst du gerade?",
    "Du hast eine tolle Ausstrahlung! Wohnst du hier in der Nähe?",
    "Haha, das gefällt mir an dir! Erzähl mir mehr 😉",
    "Es macht echt Spaß, mit dir zu schreiben. Willst du ein Geheimnis wissen?",
    "Du machst meinen Abend gleich viel schöner!",
    "Ich würde mich freuen, wenn wir bald mal was trinken gehen!",
    "Du weißt echt, wie man mich zum Lächeln bringt."
  ],
  it: [
    "Ciao! Che bello che mi hai scritto. Com'è andata la tua giornata?",
    "Stavo proprio pensando a qualcosa di carino... cosa stai facendo ora?",
    "Hai un'energia fantastica! Vivi qui vicino?",
    "Haha, mi piace molto questo di te! Dimmi di più 😉",
    "Mi trovo benissimo a parlare con te. Vuoi sapere un segreto?",
    "Stai rendendo la mia serata molto più piacevole!",
    "Mi piacerebbe bere qualcosa insieme prima o poi!",
    "Sai davvero come farmi sorridere."
  ],
  ar: [
    "أهلاً بك! سعيدة جداً بمراسلتك. كيف كان يومك؟",
    "كنت أفكر للتو في شيء لطيف... ما الذي تفعله الآن؟",
    "لديك طاقة إيجابية رائعة! هل تسكن قريباً من هنا؟",
    "هههه، يعجبني هذا فيك! أخبرني المزيد 😉",
    "أشعر براحة كبيرة في التحدث معك. هل تريد معرفة سر صغير؟",
    "أنت تجعل أمسيتي أجمل بكثير!",
    "أتمنى لو نلتقي لتناول قهوة معاً قريباً!"
  ],
  hi: [
    "अरे नमस्ते! बहुत अच्छा लगा कि आपने मैसेज किया। आपका दिन कैसा रहा?",
    "मैं बस कुछ मजेदार सोच रही थी... आप अभी क्या कर रहे हैं?",
    "आपकी वाइब बहुत अच्छी है! क्या आप यहीं पास में रहते हैं?",
    "हाहा, आपकी यह बात मुझे बहुत पसंद आई! और बताइए 😉",
    "आपसे बात करके बहुत अच्छा लग रहा है। एक सीक्रेट बताऊं?",
    "आपने मेरी शाम को बहुत खास बना दिया!",
    "काश हम कभी साथ में कॉफी पीने मिल सकें!"
  ],
  si: [
    "හායි! ඔයා මැසේජ් කරපු එක ගැන මට ගොඩක් සතුටුයි. දවස කොහොමද?",
    "මම මේ දැන් හිතුවේ ලස්සන දෙයක් ගැන... ඔයා මොකද කරන්නේ දැන්?",
    "ඔයා හරිම මිත්‍රශීලී කෙනෙක්! ඔයා ඉන්නේ මේ කිට්ටුවද?",
    "හහ් හා, ඔයාගේ ඒ ගතියට මම ආසයි! තව විස්තර කියන්න 😉",
    "ඔයත් එක්ක චැට් කරන එක මට හරිම සැහැල්ලුවක්. පුංචි රහසක් කියන්නද?",
    "ඔයා මගේ දවස ගොඩක් ලස්සන කළා!",
    "අපි කවදාහරි කෝපි එකක් බොන්න මුණගැහෙමුද?"
  ],
  ru: [
    "Привет! Очень рада, что ты написал. Как прошёл твой день?",
    "Я как раз думала о кое-чём интересном... чем сейчас занимаешься?",
    "От тебя исходит классная энергия! Живёшь где-то поблизости?",
    "Ха-ха, мне это в тебе нравится! Расскажи побольше 😉",
    "Мне так уютно с тобой общаться. Хочешь узнать секрет?",
    "Ты делаешь мой вечер намного теплее!",
    "Было бы здорово как-нибудь выпить кофе вместе!"
  ]
};

/**
 * Send message to AI endpoint (Groq / Gemini) or fallback gracefully
 */
export async function sendChatMessage({
  message,
  history = [],
  persona,
  lang = 'en',
  apiKey = null,
  provider = 'fallback' // 'gemini' | 'groq' | 'fallback'
}) {
  // 1. Try Gemini if configured
  if (provider === 'gemini' && apiKey) {
    try {
      const systemInstruction = buildSystemPrompt(persona, lang);
      const contents = [
        ...history.map(h => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 120
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply.trim();
      }
    } catch (err) {
      console.warn('[AIService] Gemini request failed, using companion fallback:', err);
    }
  }

  // 2. Try Groq if configured
  if (provider === 'groq' && apiKey) {
    try {
      const systemInstruction = buildSystemPrompt(persona, lang);
      const messages = [
        { role: 'system', content: systemInstruction },
        ...history.map(h => ({
          role: h.sender === 'user' ? 'user' : 'assistant',
          content: h.text
        })),
        { role: 'user', content: message }
      ];

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages,
          max_tokens: 120,
          temperature: 0.8
        })
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply.trim();
      }
    } catch (err) {
      console.warn('[AIService] Groq request failed, using companion fallback:', err);
    }
  }

  // 3. Natural Fallback based on message index and language
  const list = FALLBACK_RESPONSES[lang] || FALLBACK_RESPONSES.en;
  const index = Math.min(history.filter(h => h.sender === 'bot').length, list.length - 1);
  return list[index] || list[0];
}
