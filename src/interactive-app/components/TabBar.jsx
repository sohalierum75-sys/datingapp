import React from 'react';

export default function TabBar({ activeTab, setActiveTab, t, quizBadge = 3 }) {
  return (
    <nav style={{
      display: 'flex',
      background: 'rgba(20, 20, 26, 0.98)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '4px 8px',
      position: 'relative'
    }}>
      {/* Tab A: AI Companion Chat */}
      <button
        onClick={() => setActiveTab('chat')}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 10px',
          background: 'transparent',
          border: 'none',
          borderBottom: activeTab === 'chat' ? '3px solid #ff3366' : '3px solid transparent',
          color: activeTab === 'chat' ? '#fff' : '#9ca3af',
          fontWeight: activeTab === 'chat' ? 700 : 500,
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <span style={{ fontSize: '15px' }}>💬</span>
        <span>{t.tabChat}</span>
      </button>

      {/* Tab B: Compatibility Quiz / Unlock Photo */}
      <button
        onClick={() => setActiveTab('quiz')}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 10px',
          background: 'transparent',
          border: 'none',
          borderBottom: activeTab === 'quiz' ? '3px solid #ff3366' : '3px solid transparent',
          color: activeTab === 'quiz' ? '#fff' : '#9ca3af',
          fontWeight: activeTab === 'quiz' ? 700 : 500,
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative'
        }}
      >
        <span style={{ fontSize: '15px' }}>🔒</span>
        <span>{t.tabQuiz}</span>
        {quizBadge > 0 && (
          <span style={{
            background: '#ff3366',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: 800,
            padding: '1px 6px',
            marginLeft: '4px'
          }}>
            {quizBadge}
          </span>
        )}
      </button>
    </nav>
  );
}
