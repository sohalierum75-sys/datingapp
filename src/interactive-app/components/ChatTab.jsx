import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/aiService.js';
import { openExternalUrl } from '../utils/iabEscape.js';

export default function ChatTab({
  persona,
  t,
  currentLang,
  adsterraDirectLink,
  aiApiKey,
  aiProvider = 'fallback'
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: t.scenarioFirstMessage || `Hey there! I saw you were looking at my profile... what's on your mind? 😉`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);
  const [isPhotoUnlocked, setIsPhotoUnlocked] = useState(false);
  const [bonusMessages, setBonusMessages] = useState(0);

  const messagesEndRef = useRef(null);

  const MAX_FREE_MESSAGES = 5 + bonusMessages;
  const isLocked = userMsgCount >= MAX_FREE_MESSAGES;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLocked || isTyping) return;

    const userText = inputText.trim();
    const newMsgCount = userMsgCount + 1;
    setUserMsgCount(newMsgCount);
    setInputText('');

    const newMessages = [
      ...messages,
      {
        id: Date.now(),
        sender: 'user',
        text: userText,
        time: 'Just now'
      }
    ];
    setMessages(newMessages);

    // Show typing state
    setIsTyping(true);

    // Slight delay for realistic response feel
    setTimeout(async () => {
      // Message 2 Hook: Send a Private Photo offer!
      if (newMsgCount === 2) {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: t.photoMessageOffer || "I just took this a minute ago... do you want to see? 🙈",
            hasPhoto: true,
            photoUrl: persona.privatePhoto || persona.avatar,
            time: 'Just now'
          }
        ]);
        if (navigator.vibrate) {
          navigator.vibrate([150, 100, 150]);
        }
        return;
      }

      // Normal AI / Companion response
      const botReply = await sendChatMessage({
        message: userText,
        history: newMessages,
        persona,
        lang: currentLang,
        apiKey: aiApiKey,
        provider: aiProvider
      });

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'bot',
          text: botReply,
          time: 'Just now'
        }
      ]);

      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }, 1200);
  };

  const handleUnlockPhoto = (e) => {
    e.stopPropagation();
    openExternalUrl(adsterraDirectLink);
    setIsPhotoUnlocked(true);
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const handleUnlockMoreMessages = (e) => {
    e.stopPropagation();
    openExternalUrl(adsterraDirectLink);
    setBonusMessages((prev) => prev + 5);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 120px)',
      background: '#0d0d12',
      position: 'relative'
    }}>
      {/* Daily Scenario Banner */}
      <div style={{
        background: 'rgba(255, 51, 102, 0.08)',
        borderBottom: '1px solid rgba(255, 51, 102, 0.2)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '18px' }}>✨</span>
        <div style={{ fontSize: '12px', color: '#ff809f', lineHeight: 1.4 }}>
          <strong>{t.dailyScenario}:</strong> {persona.dailyScenario || "Chilling at home, looking for a sweet chat ❤️"}
        </div>
      </div>

      {/* Free Messages Counter Pill */}
      <div style={{
        padding: '6px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        fontSize: '11px',
        color: '#9ca3af'
      }}>
        <span>{t.freeMessagesLeft}:</span>
        <span style={{
          color: isLocked ? '#ff4d4d' : '#10b981',
          fontWeight: 700
        }}>
          {Math.max(0, MAX_FREE_MESSAGES - userMsgCount)} / {MAX_FREE_MESSAGES}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '8px'
              }}
            >
              {!isUser && (
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              )}

              <div style={{
                maxWidth: '78%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isUser ? 'linear-gradient(135deg, #ff3366, #ff557f)' : '#1e1e28',
                  color: '#fff',
                  fontSize: '14px',
                  lineHeight: '1.45',
                  boxShadow: isUser ? '0 4px 12px rgba(255, 51, 102, 0.25)' : 'none',
                  border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {m.text}

                  {/* Private Photo Card Offer */}
                  {m.hasPhoto && (
                    <div style={{
                      marginTop: '10px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}>
                      <div style={{
                        position: 'relative',
                        width: '210px',
                        height: '240px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={m.photoUrl}
                          alt="Private"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: isPhotoUnlocked ? 'none' : 'blur(18px)',
                            transform: isPhotoUnlocked ? 'none' : 'scale(1.15)',
                            transition: 'filter 0.5s ease, transform 0.5s ease'
                          }}
                        />

                        {!isPhotoUnlocked && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '30px', marginBottom: '8px' }}>🔒</div>
                            <button
                              onClick={handleUnlockPhoto}
                              style={{
                                background: 'linear-gradient(135deg, #ff3366, #ff6b8b)',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 14px',
                                borderRadius: '18px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(255, 51, 102, 0.4)'
                              }}
                            >
                              {t.unlockPhotoBtn}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '10px', color: '#6b7280', marginTop: '3px', padding: '0 4px' }}>
                  {m.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={persona.avatar}
              alt=""
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{
              background: '#1e1e28',
              padding: '10px 14px',
              borderRadius: '18px 18px 18px 4px',
              display: 'flex',
              gap: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <span style={{ animation: 'pulse 1s infinite', color: '#9ca3af' }}>•</span>
              <span style={{ animation: 'pulse 1s infinite 0.2s', color: '#9ca3af' }}>•</span>
              <span style={{ animation: 'pulse 1s infinite 0.4s', color: '#9ca3af' }}>•</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area or Gated Limit Lock */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(20, 20, 26, 0.98)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {isLocked ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.15), rgba(255, 107, 139, 0.15))',
            border: '1px solid rgba(255, 51, 102, 0.4)',
            borderRadius: '16px',
            padding: '14px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
              🔒 {t.chatLockedTitle}
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
              {t.chatLockedDesc}
            </div>
            <button
              onClick={handleUnlockMoreMessages}
              style={{
                background: 'linear-gradient(135deg, #ff3366, #ff6b8b)',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 51, 102, 0.4)',
                marginTop: '4px'
              }}
            >
              ⚡ {t.unlockMoreMessages}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSend}
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.typePlaceholder}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '12px 18px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: inputText.trim() && !isTyping ? '#ff3366' : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() && !isTyping ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }}
            >
              ➤
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
