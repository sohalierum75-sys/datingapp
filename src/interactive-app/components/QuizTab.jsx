import React, { useState } from 'react';
import { openExternalUrl } from '../utils/iabEscape.js';

export default function QuizTab({
  persona,
  t,
  adsterraDirectLink,
  quizQuestions = []
}) {
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [answeredList, setAnsweredList] = useState([]);
  const [isRefreshingAd, setIsRefreshingAd] = useState(false);

  // Photos to unlock (fallback to persona private gallery or avatar)
  const photos = persona.privateGallery?.length
    ? persona.privateGallery
    : [
        persona.privatePhoto || persona.avatar,
        persona.avatar,
        persona.privatePhoto || persona.avatar
      ];

  // Progressive blur calculation:
  // Question 0 answered -> 20px
  // Question 1 answered -> 12px
  // Question 2 answered -> 5px
  // 3rd answered -> reveal CTA ready (or 0px once clicked)
  const getBlurAmount = () => {
    if (isRevealed) return '0px';
    if (currentQuestionIdx === 0) return '22px';
    if (currentQuestionIdx === 1) return '13px';
    if (currentQuestionIdx === 2) return '6px';
    return '0px';
  };

  const activeQuestion = quizQuestions[currentQuestionIdx] || {
    question: "Are you ready to meet someone special?",
    options: ["Yes, absolutely! ❤️", "Maybe, let's see 😉", "Looking for fun 🔥"]
  };

  const handleSelectOption = (idx) => {
    // Record answer
    setAnsweredList((prev) => [...prev, idx]);

    // Simulate ad banner pulse/refresh
    setIsRefreshingAd(true);
    setTimeout(() => setIsRefreshingAd(false), 500);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(80);
    }

    if (currentQuestionIdx < 2) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // 3 questions completed for this photo!
      setCurrentQuestionIdx(3);
    }
  };

  const handleRevealHdPhoto = (e) => {
    e.stopPropagation();
    openExternalUrl(adsterraDirectLink);
    setIsRevealed(true);
    if (navigator.vibrate) {
      navigator.vibrate([150, 100, 200]);
    }
  };

  const handleNextPhoto = () => {
    if (currentPhotoIdx < photos.length - 1) {
      setCurrentPhotoIdx((prev) => prev + 1);
      setCurrentQuestionIdx(0);
      setIsRevealed(false);
    }
  };

  return (
    <div style={{
      padding: '16px',
      height: 'calc(100vh - 120px)',
      overflowY: 'auto',
      boxSizing: 'border-box',
      background: '#0d0d12',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header Info */}
      <div style={{ textAlign: 'center', marginBottom: '14px', width: '100%' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800, color: '#fff' }}>
          🔥 {t.quizTitle}
        </h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
          {t.quizSubtitle}
        </p>
      </div>

      {/* Photo Tabs Navigation (Photo 1, Photo 2, Photo 3) */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '14px',
        width: '100%',
        maxWidth: '360px',
        justifyContent: 'center'
      }}>
        {photos.map((_, pIdx) => {
          const isActive = currentPhotoIdx === pIdx;
          return (
            <button
              key={pIdx}
              onClick={() => {
                setCurrentPhotoIdx(pIdx);
                setCurrentQuestionIdx(0);
                setIsRevealed(false);
              }}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '10px',
                background: isActive ? 'rgba(255, 51, 102, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isActive ? '1px solid #ff3366' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isActive ? '#ff3366' : '#9ca3af',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📸 Photo {pIdx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Blurred Photo Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '360px',
        height: '340px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        marginBottom: '16px',
        background: '#191924'
      }}>
        <img
          src={photos[currentPhotoIdx]}
          alt="Locked Photo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: `blur(${getBlurAmount()})`,
            transform: isRevealed ? 'scale(1)' : 'scale(1.1)',
            transition: 'filter 0.6s ease, transform 0.6s ease'
          }}
        />

        {/* Progress Badge Indicator */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          borderRadius: '12px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span>{isRevealed ? '🔓 100%' : `🔒 ${Math.round((currentQuestionIdx / 3) * 100)}%`}</span>
          <span>{t.unlocked}</span>
        </div>

        {/* 3rd Question Completed -> Reveal CTA Overlay */}
        {currentQuestionIdx >= 3 && !isRevealed && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
              {t.allQuestionsAnswered}
            </div>
            <button
              onClick={handleRevealHdPhoto}
              style={{
                background: 'linear-gradient(135deg, #ff3366, #ff6b8b)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(255, 51, 102, 0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🔓</span>
              <span>{t.revealHdBtn}</span>
            </button>
          </div>
        )}

        {/* Fully Revealed State: Save / Download Options */}
        {isRevealed && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px'
          }}>
            <a
              href={photos[currentPhotoIdx]}
              download={`photo-${currentPhotoIdx + 1}.jpg`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'rgba(0, 0, 0, 0.75)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              ⬇ {t.saveHdPhoto}
            </a>
          </div>
        )}
      </div>

      {/* Simulated Ad Banner Refresh / Trigger */}
      <div style={{
        width: '100%',
        maxWidth: '360px',
        padding: '6px 10px',
        background: isRefreshingAd ? 'rgba(255, 51, 102, 0.15)' : 'rgba(255, 255, 255, 0.03)',
        border: '1px dashed rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        marginBottom: '14px',
        textAlign: 'center',
        fontSize: '10px',
        color: '#6b7280',
        transition: 'all 0.3s'
      }}>
        {isRefreshingAd ? '⚡ Updating compatibility matches...' : 'Sponsored Compatibility Verification Active'}
      </div>

      {/* Active Question Box (if not yet answered 3 questions) */}
      {currentQuestionIdx < 3 ? (
        <div style={{
          width: '100%',
          maxWidth: '360px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '16px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#ff3366',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            {t.question} {currentQuestionIdx + 1} / 3
          </div>

          <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
            {activeQuestion.question}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeQuestion.options.map((option, optIdx) => (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '13px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : isRevealed && currentPhotoIdx < photos.length - 1 ? (
        <button
          onClick={handleNextPhoto}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}
        >
          ➡️ Unlock Next Photo ({currentPhotoIdx + 2} / {photos.length})
        </button>
      ) : null}
    </div>
  );
}
