import React, { useState } from 'react';
import { 
  Send, 
  Bot, 
  Volume2, 
  VolumeX,
  MessageCircle, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function SupportAssistantView() {
  const {
    askGraminSahayak,
    speakText,
    isSpeaking,
    stopSpeaking,
    showToast
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am Gramin Sahayak, your 24/7 AI business assistant. How can I help you today with cataloging, first-mile logistics, escrow payouts, or government schemes?',
      time: 'Just now'
    }
  ]);

  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Transit Damage');
  const [disputeOrderRef, setDisputeOrderRef] = useState('USC-ORD-9402');
  const [disputeNotes, setDisputeNotes] = useState('');

  const quickQuestions = [
    'How do I package fragile terracotta and glass crafts?',
    'When does the buyer payment get released to my bank?',
    'How does the Village Cluster Van pickup work?',
    'What government subsidies can my SHG claim under ODOP?'
  ];

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Simulate AI response
    setTimeout(() => {
      const reply = askGraminSahayak(query);
      const botMsg = {
        sender: 'bot',
        text: reply,
        time: getCurrentTime()
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    showToast(`Grievance #${Date.now().toString().slice(-6)} lodged. Assigned to UsConnect Fair Arbitration Desk.`, 'success');
    setDisputeOpen(false);
    setDisputeNotes('');
  };

  return (
    <div>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
          color: 'white',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 24px rgba(120, 53, 15, 0.25)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#fef3c7', marginBottom: '0.75rem', fontWeight: 600 }}>
          <Sparkles size={14} /> AI Gramin Sahayak Desk
        </div>
        <h2 style={{ fontSize: '1.85rem', color: 'white', marginBottom: '0.5rem' }}>
          Multilingual Support & Fair Grievance Arbitration
        </h2>
        <p style={{ color: '#fed7aa', fontSize: '0.95rem', maxWidth: '780px', lineHeight: 1.5 }}>
          Rural entrepreneurs need support in their local language without navigating complex bureaucratic ticket trees. Gramin Sahayak provides instant answers, audio narration, and protected fair dispute arbitration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Chatbot Interface */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '620px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffedd5', color: '#c85a17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>AI Gramin Sahayak</strong>
                <span style={{ fontSize: '0.75rem', color: '#15803d', display: 'block' }}>● Active (Hindi / English / Regional)</span>
              </div>
            </div>

            <button
              id="listen-sahayak-btn"
              className={`btn btn-secondary btn-sm ${isSpeaking ? 'speaking' : ''}`}
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  const latestBot = [...messages].reverse().find((m) => m.sender === 'bot');
                  if (latestBot) speakText(latestBot.text);
                }
              }}
              title={isSpeaking ? "Stop audio narration" : "Read latest response aloud"}
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{isSpeaking ? 'Stop Audio' : 'Listen Aloud'}</span>
            </button>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {m.sender === 'bot' && (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ffedd5', color: '#c85a17', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={16} />
                  </div>
                )}
                <div>
                  <div
                    style={{
                      background: m.sender === 'user' ? 'var(--primary)' : '#f1f5f9',
                      color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                      padding: '0.75rem 1rem',
                      borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '0.875rem',
                      lineHeight: 1.5
                    }}
                  >
                    {m.text}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', display: 'block', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick suggestions */}
          <div style={{ padding: '0.5rem 1.25rem', background: '#fafafa', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                className="btn btn-secondary btn-sm"
                style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                onClick={() => handleSendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}
          >
            <input
              id="sahayak-query-input"
              type="text"
              className="form-input"
              placeholder="Ask anything about packaging, escrow, or transport..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
            />
            <button id="send-sahayak-query-btn" type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem' }}>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Support Channels & Dispute Arbitration Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Direct WhatsApp / Call Connect */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageCircle size={18} color="#15803d" /> Direct Village Coordinator Connect
            </h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              For rural producers with low literacy or limited connectivity, connect directly via 1-click WhatsApp voice note or toll-free hotline.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <a
                href="#whatsapp-bridge"
                className="btn btn-forest"
                style={{ background: '#15803d', textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Connecting to WhatsApp Gramin Mitra Desk (+91 8000-CONNECT)...', 'info');
                }}
              >
                <MessageCircle size={16} /> WhatsApp Voice
              </a>

              <a
                href="#tollfree"
                className="btn btn-secondary"
                style={{ textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Toll-free Hotline: 1800-USCONNECT (9 AM to 7 PM)', 'info');
                }}
              >
                <PhoneCall size={16} /> Toll-Free Call
              </a>
            </div>
          </div>

          {/* Rural Fair Return & Arbitration */}
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #b45309' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} /> Rural Fair Return Arbitration
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5, marginBottom: '1rem' }}>
              Unlike commercial sites where returned items are discarded at the artisan's expense, UsConnect provides a <strong>Transit Loss Protection Fund</strong>. If a customer receives a broken craft, the customer is refunded via escrow, and the artisan is compensated for the craft labor.
            </p>

            <button
              id="open-dispute-btn"
              className="btn btn-outline btn-sm"
              style={{ color: '#b45309', borderColor: '#fed7aa' }}
              onClick={() => setDisputeOpen(true)}
            >
              File Return / Grievance Claim →
            </button>
          </div>

          {/* Government Scheme Alignment Card */}
          <div className="card" style={{ padding: '1.5rem', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: '#1e293b' }}>
              🏛️ Active Government Scheme Integrations:
            </h4>
            <ul style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
              <li><strong>ODOP (One District One Product):</strong> Priority logistics tagging and national buyer expos.</li>
              <li><strong>PMEGP Subsidy:</strong> Up to 35% margin money subsidy on handicraft equipment.</li>
              <li><strong>TRIFED & Khadi India:</strong> Zero-commission cross-listing on national rural portals.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Grievance Modal */}
      {disputeOpen && (
        <div className="modal-overlay" onClick={() => setDisputeOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem' }}>File Fair Arbitration Claim</h3>
              <button className="modal-close-btn" onClick={() => setDisputeOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleDisputeSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Related Order Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={disputeOrderRef}
                  onChange={(e) => setDisputeOrderRef(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Issue Category</label>
                <select
                  className="form-select"
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                >
                  <option value="Transit Damage">Transit Damage / Breakage</option>
                  <option value="Pickup Delay">First-Mile Pickup Van Delay</option>
                  <option value="Escrow Inquiry">Escrow Release Inquiry</option>
                  <option value="Quality Inspection">Customer Quality Feedback</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Evidence Details</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Describe what occurred. Upload or describe packaging integrity..."
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setDisputeOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit to Arbitration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
