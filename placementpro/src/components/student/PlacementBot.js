import React, { useState, useRef, useEffect } from 'react';
import { Card, PageHeader, Btn } from '../shared/UI';
import { BOT_KB } from '../../data/mockData';

const QUICK_QUESTIONS = [
  "What's the CGPA cutoff?",
  "When is my interview?",
  "Am I eligible for any drive?",
  "How do I apply?",
  "What documents do I need?",
  "What to wear for interview?",
  "How to prepare for aptitude?",
  "Contact placement office",
];

const findReply = (input) => {
  const lower = input.toLowerCase();
  for (const [key, reply] of Object.entries(BOT_KB)) {
    if (lower.includes(key)) return reply;
  }
  // Fuzzy keyword matching
  if (lower.includes('wear') || lower.includes('dress') || lower.includes('attire')) return BOT_KB.dress;
  if (lower.includes('doc') || lower.includes('certificate') || lower.includes('bring')) return BOT_KB.documents;
  if (lower.includes('prepare') || lower.includes('test') || lower.includes('exam')) return BOT_KB.aptitude;
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('office')) return BOT_KB.contact;
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hello! 👋 I'm PlacementBot, your 24/7 campus career assistant. Ask me anything about placement drives, eligibility, interviews, documents, or career tips!";
  return "I'm not sure about that. Please contact the Placement Office directly: tpo@college.edu or call 0824-2200000 ext 301 during office hours (Mon–Fri, 10AM–5PM).";
};

export default function PlacementBot() {
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'bot',
      text: "Hi! 👋 I'm PlacementBot, your 24/7 virtual career assistant.\n\nI can help you with:\n• CGPA cutoffs & eligibility\n• Interview schedules & venues\n• Documents to bring\n• How to apply\n• Career tips & preparation\n\nWhat would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = {
      id: Date.now(), from: 'user', text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);

    // Simulate bot typing
    setTyping(true);
    setTimeout(() => {
      const reply = findReply(msg);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'bot', text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="animate-fadeup" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      <PageHeader title="PlacementBot 🤖" subtitle="24/7 Virtual Career Assistant — Ask me anything!" />

      {/* Quick questions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {QUICK_QUESTIONS.map(q => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            style={{
              padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent-light)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--muted)'; }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
              {msg.from === 'bot' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>🤖</div>
              )}
              <div style={{ maxWidth: '70%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.from === 'user' ? 'var(--accent)' : 'var(--card2)',
                  border: msg.from === 'bot' ? '1px solid var(--border)' : 'none',
                  fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 4, textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
              <div style={{ padding: '12px 16px', borderRadius: '14px 14px 14px 4px', background: 'var(--card2)', border: '1px solid var(--border)', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--muted)', animation: `pulse-dot 1.2s ease infinite`, animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about cutoffs, interviews, documents..."
            style={{ flex: 1 }}
          />
          <Btn onClick={() => sendMessage()} disabled={!input.trim()}>Send ↑</Btn>
        </div>
      </Card>
    </div>
  );
}
