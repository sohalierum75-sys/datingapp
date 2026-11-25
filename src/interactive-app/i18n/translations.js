/**
 * Global i18n Translation Dictionary for Mobile Interactive Companion Web App
 * Supports 10+ major traffic regions with dynamic language detection & fallback to English
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español (MX/ES)', flag: '🇪🇸' },
  { code: 'pt', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export const TRANSLATIONS = {
  en: {
    online: 'Online Now',
    distanceAway: 'km away',
    activeScenario: 'Daily Scenario',
    downloadApp: 'Download App',
    tabChat: 'AI Companion',
    tabQuiz: 'Unlock Photos',
    typing: 'is typing a message...',
    typePlaceholder: 'Reply to',
    send: 'Send',
    freeMessagesLeft: 'free messages left',
    messagesLockedTitle: 'Daily Free Limit Reached! 🔒',
    messagesLockedDesc: 'You have used all 5 free messages. Unlock 5 more private messages now!',
    unlockMoreMessages: 'Unlock +5 Messages 🔓',
    privatePhotoLocked: 'Sent a private photo 🔒',
    tapToUnlockPhoto: 'Tap to Unlock Photo',
    unlockPrivatePhotoCTA: 'Unlock Private Photo 🔓',
    photoUnlocked: 'Photo Unlocked ✨',
    quizTitle: 'Compatibility Quiz 🔥',
    quizSubtitle: 'Answer 3 quick questions to reveal my private HD photo!',
    revealedSuccess: 'HD Photo Revealed! Tap below to save it.',
    savePhoto: 'Save / Download HD Photo 📥',
    revealHdBtn: 'Reveal HD Photo 🔓',
    questionProgress: 'Question',
    correctAnswer: 'Great taste! Blur reduced by 50% ✨',
    appDownloadTitle: 'Install Mobile App',
    appDownloadSubtitle: 'Get instant notifications and unlimited private chat!',
    installPwaBtn: 'Add to Home Screen (Instant PWA) 📲',
    downloadApkBtn: 'Direct Download APK (Android) ⬇️',
    iosInstallGuideTitle: 'How to install on iPhone / iPad:',
    iosStep1: '1. Tap the Share button at the bottom of Safari',
    iosStep2: '2. Scroll down and select "Add to Home Screen"',
    iosStep3: '3. Tap "Add" to launch in full screen anytime!',
    close: 'Close',
    selectLanguage: 'Choose Language',
    sponsoredAdNotice: 'Ad sponsor helps keep this app 100% free',
    quizzes: [
      {
        id: 1,
        title: 'Bedtime Secret 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          {
            q: 'What time do you usually go to bed?',
            options: ['Before 11 PM', 'Around midnight', '2 AM or later 🔥', 'Whenever I get tired']
          },
          {
            q: 'What is your idea of a perfect first date?',
            options: ['Romantic candle dinner', 'Late night rooftop drinks', 'Cozy Netflix & wine', 'Beach walk under the stars']
          },
          {
            q: 'If we were together tonight, what would we do?',
            options: ['Talk for hours', 'Cuddle and listen to music', 'Something exciting and naughty 😉', 'Go on a late night drive']
          }
        ]
      },
      {
        id: 2,
        title: 'Morning Vibes ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          {
            q: 'How do you like your morning coffee?',
            options: ['Sweet with milk', 'Black & strong', 'I prefer tea or iced drinks', 'A kiss in bed instead 💋']
          },
          {
            q: 'Are you more of an introvert or extrovert?',
            options: ['Deep introvert', 'Outgoing party lover', 'Ambivert depending on mood', 'Secretive until you know me']
          },
          {
            q: 'What catches your attention first in a girl?',
            options: ['Her eyes and smile', 'Her curves & body 🔥', 'Her confidence & wit', 'Her sweet voice']
          }
        ]
      },
      {
        id: 3,
        title: 'Exclusive VIP Album 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          {
            q: 'Do you prefer secret flirty messages or direct calls?',
            options: ['Spicy midnight texts 🔥', 'Late voice notes', 'Spontaneous FaceTime calls', 'Meeting up in real life ASAP']
          },
          {
            q: 'What is your favorite weekend getaway?',
            options: ['Luxury resort with pool', 'Secluded mountain cabin', 'Wild party beach', 'Staying in bed all weekend']
          },
          {
            q: 'Would you keep our private photos confidential?',
            options: ['100% just between us 🔒', 'Of course, total privacy', 'Only for my eyes!', 'Cross my heart ❤️']
          }
        ]
      }
    ]
  },
  es: {
    online: 'En línea',
    distanceAway: 'km de distancia',
    activeScenario: 'Escenario del Día',
    downloadApp: 'Descargar App',
    tabChat: 'Compañera AI',
    tabQuiz: 'Desbloquear Fotos',
    typing: 'está escribiendo un mensaje...',
    typePlaceholder: 'Responder a',
    send: 'Enviar',
    freeMessagesLeft: 'mensajes gratis restantes',
    messagesLockedTitle: '¡Límite Gratis Alcanzado! 🔒',
    messagesLockedDesc: 'Has usado tus 5 mensajes gratis. ¡Desbloquea 5 mensajes privados más ahora!',
    unlockMoreMessages: 'Desbloquear +5 Mensajes 🔓',
    privatePhotoLocked: 'Envió una foto privada 🔒',
    tapToUnlockPhoto: 'Toca para desbloquear foto',
    unlockPrivatePhotoCTA: 'Desbloquear Foto Privada 🔓',
    photoUnlocked: 'Foto Desbloqueada ✨',
    quizTitle: 'Test de Compatibilidad 🔥',
    quizSubtitle: '¡Responde 3 preguntas rápidas para revelar mi foto HD privada!',
    revealedSuccess: '¡Foto HD revelada! Toca abajo para guardarla.',
    savePhoto: 'Guardar / Descargar Foto HD 📥',
    revealHdBtn: 'Revelar Foto HD 🔓',
    questionProgress: 'Pregunta',
    correctAnswer: '¡Buen gusto! Desenfoque reducido un 50% ✨',
    appDownloadTitle: 'Instalar Aplicación Móvil',
    appDownloadSubtitle: '¡Recibe notificaciones instantáneas y chat privado ilimitado!',
    installPwaBtn: 'Añadir a Pantalla de Inicio (PWA) 📲',
    downloadApkBtn: 'Descargar APK Directo (Android) ⬇️',
    iosInstallGuideTitle: 'Cómo instalar en iPhone / iPad:',
    iosStep1: '1. Toca el botón Compartir en Safari',
    iosStep2: '2. Desplázate hacia abajo y selecciona "Añadir a pantalla de inicio"',
    iosStep3: '3. Toca "Añadir" para abrir en pantalla completa siempre',
    close: 'Cerrar',
    selectLanguage: 'Seleccionar Idioma',
    sponsoredAdNotice: 'La publicidad patrocinada mantiene esta app 100% gratis',
    quizzes: [
      {
        id: 1,
        title: 'Secreto Nocturno 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: '¿A qué hora sueles dormirte?', options: ['Antes de las 11 PM', 'Hacia la medianoche', '2 AM o más tarde 🔥', 'Cuando me da sueño'] },
          { q: '¿Tu cita perfecta?', options: ['Cena romántica', 'Copas en terraza de noche', 'Netflix y vino acogedor', 'Paseo nocturno en la playa'] },
          { q: '¿Qué haríamos esta noche juntos?', options: ['Hablar horas', 'Abrazarnos con música', 'Algo travieso y picante 😉', 'Paseo en coche nocturno'] }
        ]
      },
      {
        id: 2,
        title: 'Vibras Matutinas ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: '¿Cómo tomas el café?', options: ['Dulce con leche', 'Negro y fuerte', 'Prefiero té o batidos', 'Un beso en la cama 💋'] },
          { q: '¿Eres introvertido o extrovertido?', options: ['Muy introvertido', 'Fiestero extrovertido', 'Depende de mi humor', 'Reservado al inicio'] },
          { q: '¿Qué te llama más la atención de una chica?', options: ['Ojos y sonrisa', 'Curvas y cuerpo 🔥', 'Confianza y humor', 'Voz dulce'] }
        ]
      },
      {
        id: 3,
        title: 'Álbum VIP Exclusivo 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: '¿Prefieres mensajes picantes o llamadas?', options: ['Textos picantes de noche 🔥', 'Audios sugerentes', 'Videollamada espontánea', 'Vernos en persona ya'] },
          { q: '¿Escapada de fin de semana favorita?', options: ['Hotel de lujo con piscina', 'Cabaña en la montaña', 'Playa de fiesta', 'Quedarnos en la cama'] },
          { q: '¿Mantendrás nuestras fotos en privado?', options: ['100% entre nosotros 🔒', 'Por supuesto, total reserva', 'Solo para mis ojos', 'Te lo prometo ❤️'] }
        ]
      }
    ]
  },
  pt: {
    online: 'Online agora',
    distanceAway: 'km de distância',
    activeScenario: 'Cenário do Dia',
    downloadApp: 'Baixar App',
    tabChat: 'Companheira IA',
    tabQuiz: 'Desbloquear Fotos',
    typing: 'está digitando uma mensagem...',
    typePlaceholder: 'Responder a',
    send: 'Enviar',
    freeMessagesLeft: 'mensagens grátis restantes',
    messagesLockedTitle: 'Limite Grátis Atingido! 🔒',
    messagesLockedDesc: 'Você usou suas 5 mensagens grátis. Desbloqueie +5 mensagens privadas agora!',
    unlockMoreMessages: 'Desbloquear +5 Mensagens 🔓',
    privatePhotoLocked: 'Enviou uma foto privada 🔒',
    tapToUnlockPhoto: 'Toque para desbloquear foto',
    unlockPrivatePhotoCTA: 'Desbloquear Foto Privada 🔓',
    photoUnlocked: 'Foto Desbloqueada ✨',
    quizTitle: 'Quiz de Compatibilidade 🔥',
    quizSubtitle: 'Responda 3 perguntas rápidas para revelar minha foto HD privada!',
    revealedSuccess: 'Foto HD Revelada! Toque abaixo para salvar.',
    savePhoto: 'Salvar / Baixar Foto HD 📥',
    revealHdBtn: 'Revelar Foto HD 🔓',
    questionProgress: 'Pergunta',
    correctAnswer: 'Ótimo gosto! Desfoque reduzido em 50% ✨',
    appDownloadTitle: 'Instalar Aplicativo Móvel',
    appDownloadSubtitle: 'Receba notificações instantâneas e chat privado ilimitado!',
    installPwaBtn: 'Adicionar à Tela de Início (PWA) 📲',
    downloadApkBtn: 'Download Direto do APK (Android) ⬇️',
    iosInstallGuideTitle: 'Como instalar no iPhone / iPad:',
    iosStep1: '1. Toque no botão Compartilhar no Safari',
    iosStep2: '2. Role para baixo e selecione "Adicionar à Tela de Início"',
    iosStep3: '3. Toque em "Adicionar" para abrir em tela cheia',
    close: 'Fechar',
    selectLanguage: 'Escolher Idioma',
    sponsoredAdNotice: 'Anúncios patrocinados mantêm este app 100% gratuito',
    quizzes: [
      {
        id: 1,
        title: 'Segredo Noturno 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Que horas você costuma dormir?', options: ['Antes das 23h', 'Perto da meia-noite', '2h da manhã ou mais 🔥', 'Quando bater o sono'] },
          { q: 'Qual o seu encontro perfeito?', options: ['Jantar à luz de velas', 'Bebidas em um rooftop', 'Netflix & vinho no sofá', 'Passeio na praia à noite'] },
          { q: 'Se estivéssemos juntos hoje, o que faríamos?', options: ['Conversar por horas', 'Ficar abraçadinhos ouvindo música', 'Algo ousado e quente 😉', 'Dar uma volta de carro'] }
        ]
      },
      {
        id: 2,
        title: 'Manhã Romântica ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Como você gosta do café da manhã?', options: ['Doce com leite', 'Forte e preto', 'Prefiro suco ou chá', 'Um beijo na cama primeiro 💋'] },
          { q: 'Você é mais quieto ou festeiro?', options: ['Introvertido tranquilo', 'Baladeiro extrovertido', 'Depende do momento', 'Tímido até pegar intimidade'] },
          { q: 'O que mais chama sua atenção numa mulher?', options: ['Olhar e sorriso', 'Corpo e curvas 🔥', 'Atitude e inteligência', 'Voz doce'] }
        ]
      },
      {
        id: 3,
        title: 'Álbum VIP Exclusivo 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Prefere mensagens provocantes ou chamadas?', options: ['Textos picantes de madrugada 🔥', 'Áudios sussurrados', 'Chamada de vídeo surpresa', 'Nos vermos pessoalmente logo'] },
          { q: 'Qual a viagem dos sonhos?', options: ['Resort de luxo com piscina', 'Chalé na serra', 'Praia paradisíaca', 'Ficar na cama o fim de semana todo'] },
          { q: 'Vai guardar nossas fotos em segredo?', options: ['100% entre nós 🔒', 'Com certeza, privacidade total', 'Só para os meus olhos', 'Prometo de coração ❤️'] }
        ]
      }
    ]
  },
  fr: {
    online: 'En ligne',
    distanceAway: 'km de vous',
    activeScenario: 'Scénario du Jour',
    downloadApp: 'Télécharger l\'App',
    tabChat: 'Compagne IA',
    tabQuiz: 'Débloquer Photos',
    typing: 'est en train d\'écrire...',
    typePlaceholder: 'Répondre à',
    send: 'Envoyer',
    freeMessagesLeft: 'messages gratuits restants',
    messagesLockedTitle: 'Limite Gratuite Atteinte ! 🔒',
    messagesLockedDesc: 'Vous avez utilisé vos 5 messages gratuits. Débloquez 5 messages privés de plus maintenant !',
    unlockMoreMessages: 'Débloquer +5 Messages 🔓',
    privatePhotoLocked: 'A envoyé une photo privée 🔒',
    tapToUnlockPhoto: 'Appuyez pour débloquer la photo',
    unlockPrivatePhotoCTA: 'Débloquer la Photo Privée 🔓',
    photoUnlocked: 'Photo Débloquée ✨',
    quizTitle: 'Quiz de Compatibilité 🔥',
    quizSubtitle: 'Répondez à 3 questions rapides pour révéler ma photo HD secrète !',
    revealedSuccess: 'Photo HD Révélée ! Touchez ci-dessous pour l\'enregistrer.',
    savePhoto: 'Enregistrer la Photo HD 📥',
    revealHdBtn: 'Révéler la Photo HD 🔓',
    questionProgress: 'Question',
    correctAnswer: 'Super goût ! Flou réduit de 50% ✨',
    appDownloadTitle: 'Installer l\'Application Mobile',
    appDownloadSubtitle: 'Recevez des notifications en direct et un chat privé sans limite !',
    installPwaBtn: 'Ajouter à l\'écran d\'accueil (PWA) 📲',
    downloadApkBtn: 'Télécharger APK Direct (Android) ⬇️',
    iosInstallGuideTitle: 'Comment installer sur iPhone / iPad :',
    iosStep1: '1. Appuyez sur le bouton Partager dans Safari',
    iosStep2: '2. Faites défiler et choisissez "Sur l\'écran d\'accueil"',
    iosStep3: '3. Touchez "Ajouter" pour profiter du plein écran',
    close: 'Fermer',
    selectLanguage: 'Choisir la Langue',
    sponsoredAdNotice: 'Les annonces permettent à cette application de rester 100% gratuite',
    quizzes: [
      {
        id: 1,
        title: 'Secret du Soir 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'À quelle heure allez-vous au lit ?', options: ['Avant 23h', 'Vers minuit', '2h du matin ou plus 🔥', 'Quand le sommeil vient'] },
          { q: 'Votre premier rendez-vous parfait ?', options: ['Dîner aux chandelles', 'Verres sur un rooftop chic', 'Netflix & vin sous un plaid', 'Balade sur la plage étoilée'] },
          { q: 'Si nous étions ensemble ce soir ?', options: ['Parler pendant des heures', 'Câlins en musique', 'Quelque chose de coquin et intense 😉', 'Virée en voiture sous les néons'] }
        ]
      },
      {
        id: 2,
        title: 'Douceur du Matin ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Comment aimez-vous votre café ?', options: ['Doux avec du lait', 'Noir et serré', 'Plutôt thé ou jus frais', 'Un baiser au lit d\'abord 💋'] },
          { q: 'Plutôt discret ou fêtard ?', options: ['Très introverti', 'Fêtard assumé', 'Entre les deux selon l\'humeur', 'Réservé au début'] },
          { q: 'Ce qui vous attire en premier chez une femme ?', options: ['Son regard et sourire', 'Ses formes et son corps 🔥', 'Sa confiance et son humour', 'Sa voix douce'] }
        ]
      },
      {
        id: 3,
        title: 'Album VIP Privilège 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Plutôt messages torrides ou appels ?', options: ['Messages coquins à minuit 🔥', 'Notes vocales sensuelles', 'Appel vidéo improvisé', 'Se voir en vrai très vite'] },
          { q: 'Votre week-end idéal ?', options: ['Hôtel de luxe avec spa', 'Chalet secret en forêt', 'Fête à la plage', 'Rester au lit tout le week-end'] },
          { q: 'Garderez-vous nos photos secrètes ?', options: ['100% entre nous 🔒', 'Confidentialité totale', 'Rien que pour mes yeux', 'Je le jure ❤️'] }
        ]
      }
    ]
  },
  de: {
    online: 'Jetzt online',
    distanceAway: 'km entfernt',
    activeScenario: 'Tages-Szenario',
    downloadApp: 'App laden',
    tabChat: 'KI-Freundin',
    tabQuiz: 'Fotos freischalten',
    typing: 'schreibt eine Nachricht...',
    typePlaceholder: 'Antworte an',
    send: 'Senden',
    freeMessagesLeft: 'Gratis-Nachrichten übrig',
    messagesLockedTitle: 'Kostenloses Limit erreicht! 🔒',
    messagesLockedDesc: 'Du hast alle 5 Gratis-Nachrichten genutzt. Schalte jetzt 5 weitere private Nachrichten frei!',
    unlockMoreMessages: '+5 Nachrichten freischalten 🔓',
    privatePhotoLocked: 'Hat ein privates Foto gesendet 🔒',
    tapToUnlockPhoto: 'Tippen zum Freischalten',
    unlockPrivatePhotoCTA: 'Privates Foto freischalten 🔓',
    photoUnlocked: 'Foto freigeschaltet ✨',
    quizTitle: 'Kompatibilitäts-Quiz 🔥',
    quizSubtitle: 'Beantworte 3 kurze Fragen, um mein privates HD-Foto aufzudecken!',
    revealedSuccess: 'HD-Foto aufgedeckt! Tippe unten zum Speichern.',
    savePhoto: 'HD-Foto speichern 📥',
    revealHdBtn: 'HD-Foto aufdecken 🔓',
    questionProgress: 'Frage',
    correctAnswer: 'Toller Geschmack! Unschärfe um 50% reduziert ✨',
    appDownloadTitle: 'App auf deinem Smartphone installieren',
    appDownloadSubtitle: 'Erhalte sofort Benachrichtigungen und unbegrenzten privaten Chat!',
    installPwaBtn: 'Zum Startbildschirm hinzufügen (PWA) 📲',
    downloadApkBtn: 'APK direkt laden (Android) ⬇️',
    iosInstallGuideTitle: 'Installation auf iPhone / iPad:',
    iosStep1: '1. Tippe unten in Safari auf das Teilen-Symbol',
    iosStep2: '2. Scrolle nach unten zu "Zum Home-Bildschirm"',
    iosStep3: '3. Tippe auf "Hinzufügen" für Vollbild-Genuss',
    close: 'Schließen',
    selectLanguage: 'Sprache wählen',
    sponsoredAdNotice: 'Werbung hält diese App zu 100% kostenlos',
    quizzes: [
      {
        id: 1,
        title: 'Nächtliches Geheimnis 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Wann gehst du meistens schlafen?', options: ['Vor 23 Uhr', 'Gegen Mitternacht', '2 Uhr nachts oder später 🔥', 'Wenn ich müde bin'] },
          { q: 'Dein ideales erstes Date?', options: ['Romantisches Candle-Light-Dinner', 'Drinks auf einer Rooftop-Bar', 'Kuscheliger Netflix & Wein Abend', 'Strandspaziergang im Mondlicht'] },
          { q: 'Was würden wir heute Nacht tun?', options: ['Stundenlang reden', 'Kuscheln und Musik hören', 'Etwas Aufregendes und Heißes 😉', 'Eine nächtliche Spritztour machen'] }
        ]
      },
      {
        id: 2,
        title: 'Morgenstimmung ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Wie trinkst du deinen Kaffee am liebsten?', options: ['Süß mit Milch', 'Schwarz und stark', 'Lieber Tee oder Saft', 'Ein Kuss im Bett stattdessen 💋'] },
          { q: 'Bist du eher still oder feierfreudig?', options: ['Eher introvertiert', 'Party-Mensch', 'Kommt auf die Laune an', 'Zurückhaltend bis man mich kennt'] },
          { q: 'Was fällt dir bei einer Frau zuerst auf?', options: ['Augen und Lächeln', 'Kurven und Körper 🔥', 'Ausstrahlung und Witz', 'Ihre sanfte Stimme'] }
        ]
      },
      {
        id: 3,
        title: 'Exklusives VIP Album 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Lieber freche Nachrichten oder Anrufe?', options: ['Heiße Mitternachts-Nachrichten 🔥', 'Sinnliche Sprachmemos', 'Spontaner Videoanruf', 'Direktes Treffen im echten Leben'] },
          { q: 'Dein perfektes Wochenend-Getaway?', options: ['Luxusresort mit Pool', 'Einsame Berghütte', 'Wilde Party am Strand', 'Das ganze Wochenende im Bett'] },
          { q: 'Bleiben unsere Fotos unser Geheimnis?', options: ['100% nur zwischen uns 🔒', 'Absolute Diskretion', 'Nur für meine Augen!', 'Ich verspreche es ❤️'] }
        ]
      }
    ]
  },
  it: {
    online: 'Online adesso',
    distanceAway: 'km da te',
    activeScenario: 'Scenario del Giorno',
    downloadApp: 'Scarica App',
    tabChat: 'Compagna IA',
    tabQuiz: 'Sblocca Foto',
    typing: 'sta scrivendo un messaggio...',
    typePlaceholder: 'Rispondi a',
    send: 'Invia',
    freeMessagesLeft: 'messaggi gratuiti rimasti',
    messagesLockedTitle: 'Limite Gratuito Raggiunto! 🔒',
    messagesLockedDesc: 'Hai usato i tuoi 5 messaggi gratis. Sblocca altri 5 messaggi privati adesso!',
    unlockMoreMessages: 'Sblocca +5 Messaggi 🔓',
    privatePhotoLocked: 'Ha inviato una foto privata 🔒',
    tapToUnlockPhoto: 'Tocca per sbloccare la foto',
    unlockPrivatePhotoCTA: 'Sblocca Foto Privata 🔓',
    photoUnlocked: 'Foto Sbloccata ✨',
    quizTitle: 'Quiz di Compatibilità 🔥',
    quizSubtitle: 'Rispondi a 3 domande rapide per scoprire la mia foto HD segreta!',
    revealedSuccess: 'Foto HD Rivelata! Tocca sotto per salvarla.',
    savePhoto: 'Salva Foto HD 📥',
    revealHdBtn: 'Rivela Foto HD 🔓',
    questionProgress: 'Domanda',
    correctAnswer: 'Ottimo gusto! Sfocatura ridotta del 50% ✨',
    appDownloadTitle: 'Installa l\'Applicazione Mobile',
    appDownloadSubtitle: 'Ricevi notifiche istantanee e chat privata senza limiti!',
    installPwaBtn: 'Aggiungi a Schermata Home (PWA) 📲',
    downloadApkBtn: 'Download Diretto APK (Android) ⬇️',
    iosInstallGuideTitle: 'Come installare su iPhone / iPad:',
    iosStep1: '1. Tocca il pulsante Condividi in Safari',
    iosStep2: '2. Scorri verso il basso e seleziona "Aggiungi alla schermata Home"',
    iosStep3: '3. Tocca "Aggiungi" per aprirla a schermo intero',
    close: 'Chiudi',
    selectLanguage: 'Scegli Lingua',
    sponsoredAdNotice: 'Gli sponsor pubblicitari mantengono questa app gratis al 100%',
    quizzes: [
      {
        id: 1,
        title: 'Segreto di Notte 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'A che ora vai a dormire di solito?', options: ['Prima delle 23', 'Verso mezzanotte', 'Alle 2 o più tardi 🔥', 'Quando ho sonno'] },
          { q: 'Il tuo primo appuntamento ideale?', options: ['Cena a lume di candela', 'Drink su un rooftop panoramico', 'Divano, vino e film', 'Passeggiata al chiaro di luna'] },
          { q: 'Se fossimo insieme stasera?', options: ['Parlare per ore', 'Coccolarsi ascoltando musica', 'Qualcosa di malizioso e piccante 😉', 'Un giro notturno in auto'] }
        ]
      },
      {
        id: 2,
        title: 'Dolce Mattina ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Come prendi il caffè?', options: ['Dolce con latte', 'Espresso nero e forte', 'Preferisco tè o succhi', 'Un bacio a letto prima di tutto 💋'] },
          { q: 'Sei più timido o socievole?', options: ['Molto introverso', 'Animale da festa', 'Dipende dalla situazione', 'Riservato all\'inizio'] },
          { q: 'Cosa noti prima in una ragazza?', options: ['Occhi e sorriso', 'Curve e corpo 🔥', 'Carisma e ironia', 'La voce dolce'] }
        ]
      },
      {
        id: 3,
        title: 'Album VIP Esclusivo 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Preferisci messaggi piccanti o chiamate?', options: ['Messaggini provocanti di notte 🔥', 'Note vocali intime', 'Videochiamata a sorpresa', 'Incontrarci dal vivo subito'] },
          { q: 'Il tuo weekend perfetto?', options: ['Resort con piscina e spa', 'Baita nascosta nei boschi', 'Festa sfrenata in spiaggia', 'Rimanere a letto tutto il tempo'] },
          { q: 'Manterrai le nostre foto segrete?', options: ['100% solo tra noi 🔒', 'Discrezione totale garantita', 'Solo per i miei occhi', 'Te lo prometto con il cuore ❤️'] }
        ]
      }
    ]
  },
  ar: {
    online: 'متصلة الآن',
    distanceAway: 'كم منك',
    activeScenario: 'سيناريو اليوم',
    downloadApp: 'تحميل التطبيق',
    tabChat: 'الرفيقة الذكية',
    tabQuiz: 'فتح الصور السرية',
    typing: 'تكتب رسالة الآن...',
    typePlaceholder: 'اكتب رداً إلى',
    send: 'إرسال',
    freeMessagesLeft: 'رسائل مجانية متبقية',
    messagesLockedTitle: 'وصلت للحد المجاني! 🔒',
    messagesLockedDesc: 'لقد استهلكت 5 رسائل مجانية. افتح 5 رسائل خاصة إضافية الآن!',
    unlockMoreMessages: 'فتح +5 رسائل خاصة 🔓',
    privatePhotoLocked: 'أرسلت صورة خاصة 🔒',
    tapToUnlockPhoto: 'اضغط لفتح الصورة',
    unlockPrivatePhotoCTA: 'فتح الصورة الخاصة 🔓',
    photoUnlocked: 'تم فتح الصورة ✨',
    quizTitle: 'اختبار التوافق والرومانسية 🔥',
    quizSubtitle: 'أجب عن 3 أسئلة سريعة لكشف صورتي السرية بجودة HD!',
    revealedSuccess: 'تم كشف الصورة بجودة عالية! اضغط بالأسفل للحفظ.',
    savePhoto: 'حفظ الصورة بجودة HD 📥',
    revealHdBtn: 'كشف الصورة بجودة عالية 🔓',
    questionProgress: 'السؤال',
    correctAnswer: 'ذوقك رائع! تم تقليل التغبيش بنسبة 50% ✨',
    appDownloadTitle: 'تثبيت التطبيق على هاتفك',
    appDownloadSubtitle: 'احصل على إشعارات فورية ومحادثات خاصة بلا حدود!',
    installPwaBtn: 'إضافة للشاشة الرئيسية (تطبيق فوري) 📲',
    downloadApkBtn: 'تحميل ملف APK المباشر (أندرويد) ⬇️',
    iosInstallGuideTitle: 'طريقة التثبيت على الآيفون والآيباد:',
    iosStep1: '1. اضغط على زر المشاركة أسفل متصفح سفاري',
    iosStep2: '2. مرر لأسفل واختر "إضافة إلى الشاشة الرئيسية"',
    iosStep3: '3. اضغط "إضافة" لفتح التطبيق بشاشة كاملة في أي وقت',
    close: 'إغلاق',
    selectLanguage: 'اختر اللغة',
    sponsoredAdNotice: 'الإعلانات تدعم استمرار التطبيق مجاناً 100%',
    quizzes: [
      {
        id: 1,
        title: 'أسرار المساء الهادئ 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'في أي وقت تنام عادة؟', options: ['قبل 11 مساءً', 'حوالي منتصف الليل', '2 صباحاً أو بعد ذلك 🔥', 'حين أشعر بالنعاس'] },
          { q: 'ما هو موعدك الغرامي المثالي؟', options: ['عشاء رومانسي على ضوء الشموع', 'جلسة ساحرة في مطعم بإطلالة ليلية', 'سهرة مع فيلم ومشروب دافئ', 'نزهة ليلية على شاطئ البحر'] },
          { q: 'لو كنا معاً الليلة، ماذا سنفعل؟', options: ['نتحدث لساعات طويلة', 'نستمع للموسيقى الرومانسية', 'شيء مثير ومميز جداً 😉', 'جولة ليلية بالسيارة'] }
        ]
      },
      {
        id: 2,
        title: 'أجواء الصباح والقهوة ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'كيف تحب قهوتك الصباحية؟', options: ['حلوة مع الحليب', 'سادة وقوية', 'أفضل الشاي أو العصائر', 'قبلة دافئة في السرير أولاً 💋'] },
          { q: 'هل تفضل الهدوء أم السهر والحفلات؟', options: ['هادئ ومنطوٍ', 'اجتماعي ومحب للأضواء', 'حسب المزاج واليوم', 'غامض حتى تتعرف علي جيداً'] },
          { q: 'ما أول ما يلفت انتباهك في الفتاة؟', options: ['عيناها وابتسامتها', 'قوامها وجمالها 🔥', 'ثقتها بنفسها وذكاؤها', 'صوتها العذب'] }
        ]
      },
      {
        id: 3,
        title: 'ألبوم كبار الشخصيات VIP 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'هل تفضل الرسائل المغرية أم الاتصالات؟', options: ['رسائل ليلية مشوقة 🔥', 'تسجيلات صوتية دافئة', 'مكالمة فيديو مفاجئة', 'أن نلتقي وجهاً لوجه سريعاً'] },
          { q: 'عطلتك الأسبوعية المفضلة؟', options: ['منتجع فاخر مع مسبح خاص', 'كوخ جبلي منعزل', 'حفلة على الشاطئ', 'البقاء في السرير طوال العطلة'] },
          { q: 'هل ستحتفظ بصورنا الخاصة بسرية تامة؟', options: ['100% بيننا فقط 🔒', 'بالتأكيد، سرية مطلقة', 'لعيني فقط!', 'أعدك من كل قلبي ❤️'] }
        ]
      }
    ]
  },
  hi: {
    online: 'अभी ऑनलाइन',
    distanceAway: 'किमी दूर',
    activeScenario: 'आज का मिजाज',
    downloadApp: 'ऐप डाउनलोड करें',
    tabChat: 'एआई हमसफ़र',
    tabQuiz: 'तस्वीरें अनलॉक करें',
    typing: 'टाइप कर रही हैं...',
    typePlaceholder: 'जवाब दें',
    send: 'भेजें',
    freeMessagesLeft: 'मुफ़्त संदेश बचे हैं',
    messagesLockedTitle: 'मुफ़्त सीमा समाप्त! 🔒',
    messagesLockedDesc: 'आपने सभी 5 मुफ़्त संदेश इस्तेमाल कर लिए हैं। अभी 5 और प्राइवेट संदेश अनलॉक करें!',
    unlockMoreMessages: '+5 संदेश अनलॉक करें 🔓',
    privatePhotoLocked: 'एक प्राइवेट फोटो भेजी है 🔒',
    tapToUnlockPhoto: 'फोटो देखने के लिए टैप करें',
    unlockPrivatePhotoCTA: 'प्राइवेट फोटो अनलॉक करें 🔓',
    photoUnlocked: 'फोटो अनलॉक हो गई ✨',
    quizTitle: 'रोमांटिक कम्पैटिबिलिटी क्विज़ 🔥',
    quizSubtitle: 'मेरी प्राइवेट HD फोटो देखने के लिए बस 3 आसान सवालों के जवाब दें!',
    revealedSuccess: 'HD फोटो खुल गई! सेव करने के लिए नीचे टैप करें।',
    savePhoto: 'HD फोटो सेव करें 📥',
    revealHdBtn: 'HD फोटो देखें 🔓',
    questionProgress: 'सवाल',
    correctAnswer: 'शानदार पसंद! धुंधलापन 50% कम हो गया ✨',
    appDownloadTitle: 'मोबाइल ऐप इंस्टॉल करें',
    appDownloadSubtitle: 'तुरंत नोटिफिकेशन और अनलिमिटेड प्राइवेट चैट पाएं!',
    installPwaBtn: 'होम स्क्रीन पर जोड़ें (PWA) 📲',
    downloadApkBtn: 'डायरेक्ट APK डाउनलोड (Android) ⬇️',
    iosInstallGuideTitle: 'iPhone / iPad पर कैसे इंस्टॉल करें:',
    iosStep1: '1. Safari में नीचे शेयर बटन दबाएं',
    iosStep2: '2. नीचे स्क्रॉल करके "Add to Home Screen" चुनें',
    iosStep3: '3. फुल स्क्रीन अनुभव के लिए "Add" दबाएं',
    close: 'बंद करें',
    selectLanguage: 'भाषा चुनें',
    sponsoredAdNotice: 'प्रायोजित विज्ञापन इस ऐप को हमेशा मुफ़्त रखने में मदद करते हैं',
    quizzes: [
      {
        id: 1,
        title: 'रात के राज़ 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'आप आमतौर पर कितने बजे सोते हैं?', options: ['रात 11 बजे से पहले', 'आधी रात के करीब', 'देर रात 2 बजे या बाद में 🔥', 'जब नींद आ जाए'] },
          { q: 'आपकी ड्रीम डेट कैसी होगी?', options: ['कैंडल लाइट डिनर', 'छत पर रोमांटिक ड्रिंक्स', 'साथ में नेटफ्लिक्स और बातें', 'चांदनी रात में बीच पर सैर'] },
          { q: 'अगर आज रात हम साथ होते तो?', options: ['घंटों दिल की बातें करते', 'पास बैठकर संगीत सुनते', 'कुछ खास और शरारती 😉', 'देर रात लॉन्ग ड्राइव पर जाते'] }
        ]
      },
      {
        id: 2,
        title: 'सुबह की ताजगी ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'आप सुबह क्या पीना पसंद करते हैं?', options: ['मीठी चाय या कॉफी', 'कड़क ब्लैक कॉफी', 'ताज़ा जूस', 'बिस्तर पर एक प्यार भरा किस 💋'] },
          { q: 'आप शांत हैं या मस्तीखोर?', options: ['शांत और अंतर्मुखी', 'पार्टी और मस्ती प्रेमी', 'मूड पर निर्भर करता है', 'शुरुआत में थोड़ा शर्मीला'] },
          { q: 'एक लड़की में सबसे पहले क्या भाता है?', options: ['उसकी आंखें और मुस्कान', 'उसकी अदा और खूबसूरती 🔥', 'उसका आत्मविश्वास और बातें', 'उसकी प्यारी आवाज़'] }
        ]
      },
      {
        id: 3,
        title: 'एक्सक्लूसिव वीआईपी एल्बम 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'आपको क्या ज्यादा पसंद है?', options: ['रात के शरारती टेक्स्ट मैसेज 🔥', 'प्यारी वॉयस रिकॉर्डिंग', 'अचानक वीडियो कॉल', 'जल्द से जल्द सामने मिलना'] },
          { q: 'परफेक्ट वीकेंड कैसा होना चाहिए?', options: ['शानदार रिसॉर्ट में स्टे', 'पहाड़ों में शांत कॉटेज', 'बीच पर मस्ती', 'पूरा वीकेंड बिस्तर में आराम'] },
          { q: 'क्या हमारी प्राइवेट फोटो सुरक्षित रखेंगे?', options: ['100% सिर्फ हमारे बीच 🔒', 'पूरी प्राइवेसी की गारंटी', 'सिर्फ मेरी आंखों के लिए!', 'पक्का वादा ❤️'] }
        ]
      }
    ]
  },
  si: {
    online: 'දැන් ඔන්ලයින්',
    distanceAway: 'km දුරින්',
    activeScenario: 'දවසේ මූඩ් එක',
    downloadApp: 'ඇප් එක ගන්න',
    tabChat: 'AI පෙම්වතිය',
    tabQuiz: 'රහස් ඡායාරූප',
    typing: 'ටයිප් කරමින්...',
    typePlaceholder: 'පිළිතුරු ලියන්න',
    send: 'යවන්න',
    freeMessagesLeft: 'නොමිලේ පණිවිඩ ඉතිරිය',
    messagesLockedTitle: 'නොමිලේ සීමාව අවසන්! 🔒',
    messagesLockedDesc: 'ඔබ නොමිලේ පණිවිඩ 5ම භාවිත කර ඇත. තවත් පෞද්ගලික පණිවිඩ 5ක් දැන්ම විවෘත කරගන්න!',
    unlockMoreMessages: 'පණිවිඩ 5ක් අගුළු හරින්න 🔓',
    privatePhotoLocked: 'පෞද්ගලික ඡායාරූපයක් එව්වා 🔒',
    tapToUnlockPhoto: 'ඡායාරූපය බලන්න ටැප් කරන්න',
    unlockPrivatePhotoCTA: 'රහස් පින්තූරය අගුළු හරින්න 🔓',
    photoUnlocked: 'පින්තූරය අගුළු හැරුණා ✨',
    quizTitle: 'ගැළපීමේ ප්‍රශ්නාවලිය 🔥',
    quizSubtitle: 'මගේ පැහැදිලි HD පින්තූරය බලාගන්න කෙටි ප්‍රශ්න 3කට උත්තර දෙන්න!',
    revealedSuccess: 'HD ඡායාරූපය විවෘතයි! පහතින් සේව් කරගන්න.',
    savePhoto: 'HD ඡායාරූපය සේව් කරන්න 📥',
    revealHdBtn: 'HD ඡායාරූපය බලන්න 🔓',
    questionProgress: 'ප්‍රශ්නය',
    correctAnswer: 'නියමයි! බොඳවීම 50%කින් අඩු විය ✨',
    appDownloadTitle: 'මොබයිල් ඇප් එක ස්ථාපනය කරන්න',
    appDownloadSubtitle: 'ක්ෂණික දැනුම්දීම් සහ සීමාරහිත චැට් එක අත්විඳින්න!',
    installPwaBtn: 'මුල් තිරයට එක්කරන්න (PWA) 📲',
    downloadApkBtn: 'කෙලින්ම APK බාගත කරන්න (Android) ⬇️',
    iosInstallGuideTitle: 'iPhone / iPad හි ස්ථාපනය කරන අයුරු:',
    iosStep1: '1. Safari යට ඇති Share බොත්තම ඔබන්න',
    iosStep2: '2. පහළට ගොස් "Add to Home Screen" තෝරන්න',
    iosStep3: '3. පූර්ණ තිරයෙන් බැලීමට "Add" ඔබන්න',
    close: 'වසන්න',
    selectLanguage: 'භාෂාව තෝරන්න',
    sponsoredAdNotice: 'වෙළඳ දැන්වීම් මඟින් මෙම ඇප් එක නොමිලේ පවත්වාගෙන යයි',
    quizzes: [
      {
        id: 1,
        title: 'රාත්‍රී රහස් 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'ඔබ සාමාන්‍යයෙන් නිදාගන්නේ කීයටද?', options: ['රෑ 11ට පෙර', 'මැදියම් රැයට ආසන්නව', 'පාන්දර 2ට හෝ පසුව 🔥', 'නින්ද එන වෙලාවට'] },
          { q: 'ඔබේ සිහින හමුවීම මොන වගේද?', options: ['ඉටිපන්දම් එළියෙන් රාත්‍රී කෑමක්', 'උස් ගොඩනැගිල්ලක රාත්‍රී දසුන් බලමින්', 'සීතල කාමරයක චිත්‍රපටියක් බලමින්', 'මුහුදු වෙරළේ ඇවිදිමින්'] },
          { q: 'අද රෑ අපි එකට හිටියොත් මොකද කරන්නේ?', options: ['පැය ගණන් කතාබහ කරමු', 'තුරුළු වී සිංදු අහමු', 'වෙනස්ම ආදරණීය අත්දැකීමක් 😉', 'රෑ කාර් එකේ රවුමක් යමු'] }
        ]
      },
      {
        id: 2,
        title: 'උදෑසන මනෝභාවය ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'උදෑසන බොන්න කැමති මොනවද?', options: ['කිරි කෝපි හෝ තේ', 'කළු කෝපි', 'පලතුරු බීම', 'ඇඳේදී උණුසුම් හාදුවක් 💋'] },
          { q: 'ඔබ නිහඬ කෙනෙක්ද නැත්නම් පාටි දාන කෙනෙක්ද?', options: ['නිහඬ චරිතයක්', 'පාටි සහ විනෝදයට කැමති', 'වෙලාවෙ හැටියට', 'මුලින් ලැජ්ජයි පස්සෙ යාලුයි'] },
          { q: 'කෙල්ලෙක්ගෙන් මුලින්ම දකින්නේ මොනවද?', options: ['ඇස් සහ සිනහව', 'ලස්සන හැඩය 🔥', 'කතාව සහ පෞරුෂය', 'මිහිරි කටහඬ'] }
        ]
      },
      {
        id: 3,
        title: 'විශේෂ VIP ඇල්බමය 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'වඩාත් ප්‍රිය කරන්නේ මොන ක්‍රමයටද?', options: ['රෑට ආදරණීය කෙටි පණිවිඩ 🔥', 'මිහිරි හඬ පණිවිඩ', 'වීඩියෝ කෝල් එකක්', 'හැකි ඉක්මනින් මුණගැසීම'] },
          { q: 'නිවාඩුවක් ගත කරන්න කැමති කොහේද?', options: ['සුඛෝපභෝගී හෝටලයක', 'කඳුකරයේ කුඩා නිවසක', 'මුහුදු වෙරළේ', 'සති අන්තයම ඇඳට වෙලා'] },
          { q: 'අපේ පින්තූර රහසක් ලෙස තබාගන්නවාද?', options: ['100% අප දෙදෙනා අතර පමණි 🔒', 'සම්පූර්ණ පෞද්ගලිකත්වය', 'මගේ දෑසට පමණයි!', 'දිවුරලා පොරොන්දු වෙනවා ❤️'] }
        ]
      }
    ]
  },
  ru: {
    online: 'Онлайн',
    distanceAway: 'км от вас',
    activeScenario: 'Сценарий дня',
    downloadApp: 'Скачать App',
    tabChat: 'ИИ-Спутница',
    tabQuiz: 'Открыть фото',
    typing: 'печатает сообщение...',
    typePlaceholder: 'Ответить для',
    send: 'Отправить',
    freeMessagesLeft: 'бесплатных сообщений осталось',
    messagesLockedTitle: 'Бесплатный лимит исчерпан! 🔒',
    messagesLockedDesc: 'Вы использовали 5 бесплатных сообщений. Откройте еще 5 приватных сообщений прямо сейчас!',
    unlockMoreMessages: 'Открыть +5 сообщений 🔓',
    privatePhotoLocked: 'Отправила приватное фото 🔒',
    tapToUnlockPhoto: 'Нажмите, чтобы открыть фото',
    unlockPrivatePhotoCTA: 'Открыть приватное фото 🔓',
    photoUnlocked: 'Фото открыто ✨',
    quizTitle: 'Тест на Совместимость 🔥',
    quizSubtitle: 'Ответьте на 3 быстрых вопроса, чтобы открыть мое секретное HD-фото!',
    revealedSuccess: 'HD-фото открыто! Нажмите ниже, чтобы сохранить.',
    savePhoto: 'Сохранить HD-фото 📥',
    revealHdBtn: 'Показать HD-фото 🔓',
    questionProgress: 'Вопрос',
    correctAnswer: 'Отличный вкус! Размытие уменьшено на 50% ✨',
    appDownloadTitle: 'Установить приложение',
    appDownloadSubtitle: 'Получайте мгновенные уведомления и неограниченный приватный чат!',
    installPwaBtn: 'Добавить на главный экран (PWA) 📲',
    downloadApkBtn: 'Прямое скачивание APK (Android) ⬇️',
    iosInstallGuideTitle: 'Как установить на iPhone / iPad:',
    iosStep1: '1. Нажмите кнопку "Поделиться" в Safari',
    iosStep2: '2. Прокрутите вниз и выберите "На экран «Домой»"',
    iosStep3: '3. Нажмите "Добавить" для полноэкранного режима',
    close: 'Закрыть',
    selectLanguage: 'Выбрать язык',
    sponsoredAdNotice: 'Спонсорская реклама помогает поддерживать приложение на 100% бесплатным',
    quizzes: [
      {
        id: 1,
        title: 'Ночной секрет 🌙',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Во сколько ты обычно ложишься спать?', options: ['До 23:00', 'Около полуночи', 'В 2 ночи или позже 🔥', 'Когда устану'] },
          { q: 'Твое идеальное первое свидание?', options: ['Романтический ужин при свечах', 'Коктейли на крыше с красивым видом', 'Уютный вечер с вином и фильмом', 'Прогулка по ночному пляжу'] },
          { q: 'Если бы мы были вместе сегодня ночью?', options: ['Болтали бы часами', 'Обнимались под музыку', 'Что-то страстное и дерзкое 😉', 'Поехали бы кататься по ночному городу'] }
        ]
      },
      {
        id: 2,
        title: 'Утреннее настроение ☕',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Какой кофе ты любишь по утрам?', options: ['Сладкий с молоком', 'Крепкий черный', 'Лучше чай или сок', 'Поцелуй в постели вместо кофе 💋'] },
          { q: 'Ты интроверт или экстраверт?', options: ['Спокойный интроверт', 'Душа компании', 'Под настроение', 'Скрытный, пока не узнаю получше'] },
          { q: 'Что тебя больше всего привлекает в девушке?', options: ['Взгляд и улыбка', 'Фигура и формы 🔥', 'Харизма и ум', 'Нежный голос'] }
        ]
      },
      {
        id: 3,
        title: 'Эксклюзивный VIP альбом 💎',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        questions: [
          { q: 'Что ты предпочитаешь больше?', options: ['Пикантные полуночные смс 🔥', 'Нежные голосовые сообщения', 'Внезапный видеозвонок', 'Увидеться вживую как можно скорее'] },
          { q: 'Идеальные выходные для тебя?', options: ['Роскошный отель с бассейном', 'Уютный домик в горах', 'Шумная пляжная вечеринка', 'Провести все выходные в постели'] },
          { q: 'Сохранишь наши фото в секрете?', options: ['100% только между нами 🔒', 'Полная конфиденциальность', 'Только для моих глаз!', 'Обещаю от всего сердца ❤️'] }
        ]
      }
    ]
  }
};

/**
 * Detects visitor language with fallback to default or English
 */
export function detectLanguage(defaultLang = null) {
  if (defaultLang && TRANSLATIONS[defaultLang.toLowerCase()]) {
    return defaultLang.toLowerCase();
  }

  if (typeof window !== 'undefined' && window.navigator) {
    const navLangs = window.navigator.languages || [window.navigator.language || 'en'];
    for (const raw of navLangs) {
      if (!raw) continue;
      const code = raw.toLowerCase().split('-')[0];
      if (TRANSLATIONS[code]) {
        return code;
      }
    }
  }

  return 'en';
}

/**
 * Convenience export of quiz questions mapped per language
 */
export const QUIZ_QUESTIONS = Object.fromEntries(
  Object.keys(TRANSLATIONS).map(code => [
    code,
    (TRANSLATIONS[code].quizzes?.[0]?.questions || []).map(item => ({
      question: item.q,
      options: item.options
    }))
  ])
);

/**
 * Retrieves translation bundle for a given language code with unified aliases
 */
export function getTranslation(langCode) {
  const code = (langCode || 'en').toLowerCase().split('-')[0];
  const raw = TRANSLATIONS[code] || TRANSLATIONS.en;
  
  return {
    ...raw,
    // Normalizing aliases across component requirements
    nearby: raw.nearby || '2.4 km away',
    chooseLanguage: raw.chooseLanguage || 'Select Language',
    downloadModalDesc: raw.appDownloadSubtitle || 'Install our web app or download APK for instant notifications and private chat.',
    installPwa: raw.installPwaBtn || 'Add to Home Screen (PWA) 📲',
    downloadApk: raw.downloadApkBtn || 'Download Direct APK (Android) ⬇️',
    iosInstructionsTitle: raw.iosInstallGuideTitle || 'How to install on iOS:',
    iosStep1: raw.iosStep1 || 'Tap the Share icon at the bottom of Safari',
    iosStep2: raw.iosStep2 || "Scroll down and tap 'Add to Home Screen'",
    iosStep3: raw.iosStep3 || "Tap 'Add' in the top right corner",
    dailyScenario: raw.activeScenario || 'Daily Scenario',
    unlockPhotoBtn: raw.unlockPrivatePhotoCTA || 'Unlock Private Photo 🔓',
    chatLockedTitle: raw.messagesLockedTitle || 'Daily Free Limit Reached! 🔒',
    chatLockedDesc: raw.messagesLockedDesc || 'You have used all 5 free messages. Unlock 5 more private messages now!',
    scenarioFirstMessage: raw.scenarioFirstMessage || (code === 'es' ? '¡Hola! Vi que estabas mirando mi perfil... ¿en qué estás pensando? 😉' : `Hey there! I saw you were looking at my profile... what's on your mind? 😉`),
    photoMessageOffer: raw.photoMessageOffer || (code === 'es' ? 'Acabo de tomarme esto hace un minuto... ¿quieres verla? 🙈' : 'I just took this a minute ago... do you want to see? 🙈'),
    unlocked: raw.unlocked || 'Unlocked',
    allQuestionsAnswered: raw.allQuestionsAnswered || '100% Compatibility Verified! Photo Ready!',
    revealHdBtn: raw.revealHdBtn || 'Reveal HD Photo 🔓',
    saveHdPhoto: raw.savePhoto || 'Save / Download HD Photo 📥',
    question: raw.questionProgress || 'Question'
  };
}
