import React from 'react';
import { 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Store, 
  Truck, 
  HelpCircle, 
  RotateCcw,
  Globe,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const {
    language,
    setLanguage,
    t,
    activeRole,
    setActiveRole,
    cart,
    setCartOpen,
    isSpeaking,
    speakText,
    stopSpeaking,
    setTourOpen,
    resetDemo
  } = useApp();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAudioTour = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const summaryText = {
        en: "Welcome to UsConnect, the unified digital platform for rural entrepreneurs. Seamlessly bridging Sales, Escrow Payments, Village Cluster Logistics, and Multilingual Support.",
        hi: "अस-कनेक्ट में आपका स्वागत है। ग्रामीण उद्यमियों के लिए बिक्री, सुरक्षित एस्क्रो भुगतान, ग्रामीण क्लस्टर लॉजिस्टिक्स और बहुभाषी सहायता का एकीकृत डिजिटल मंच।",
        bn: "আস-কানেক্টে আপনাকে স্বাগতম। গ্রামীণ উদ্যোক্তাদের জন্য বিক্রয়, এসক্রো পেমেন্ট, ক্লাস্টার লজিস্টিকস এবং সহায়তার ডিজিটাল প্ল্যাটফর্ম।",
        te: "అస్-కనెక్ట్ కు స్వాగతం. గ్రామీణ పారిశ్రామికవేత్తల కోసం అమ్మకాలు, ఎస్క్రో చెల్లింపులు, లాజిస్టిక్స్ మరియు సహాయక సేవలు.",
        mr: "अस-कनेक्ट मध्ये आपले स्वागत आहे. ग्रामीण उद्योजकांसाठी विक्री, एस्क्रो देयके, क्लस्टर वाहतूक आणि बहुभाषिक सहाय्य.",
        ta: "அஸ்கனெக்ட் தளத்திற்கு நல்வரவு. கிராமப்புற தொழில்முனைவோருக்கான விற்பனை, எஸ்க்ரோ பணம், போக்குவரத்து மற்றும் உதவி தளம்."
      }[language] || "Welcome to UsConnect.";

      speakText(summaryText);
    }
  };

  return (
    <>
      <header className="top-nav">
        <div className="nav-inner">
          {/* Brand Logo & Title */}
          <div className="brand-wrapper" onClick={() => setActiveRole('producer')}>
            <div className="brand-logo-icon">🌾</div>
            <div className="brand-text">
              <h1>UsConnect</h1>
              <span>ग्रामीण सेतु • Rural Enterprise OS</span>
            </div>
          </div>

          {/* Unified Persona Switcher */}
          <div className="role-switcher">
            <button
              id="role-producer-btn"
              className={`role-btn producer ${activeRole === 'producer' ? 'active' : ''}`}
              onClick={() => setActiveRole('producer')}
              title="Rural Artisan & Producer Studio"
            >
              <Store size={16} />
              <span>{t('roleProducer')}</span>
            </button>

            <button
              id="role-buyer-btn"
              className={`role-btn buyer ${activeRole === 'buyer' ? 'active' : ''}`}
              onClick={() => setActiveRole('buyer')}
              title="Urban Buyer & Wholesale Marketplace"
            >
              <ShoppingBag size={16} />
              <span>{t('roleBuyer')}</span>
            </button>

            <button
              id="role-logistics-btn"
              className={`role-btn logistics ${activeRole === 'logistics' ? 'active' : ''}`}
              onClick={() => setActiveRole('logistics')}
              title="Village Cluster Hub & Delivery Fleet"
            >
              <Truck size={16} />
              <span>{t('roleLogistics')}</span>
            </button>

            <button
              id="role-support-btn"
              className={`role-btn support ${activeRole === 'support' ? 'active' : ''}`}
              onClick={() => setActiveRole('support')}
              title="24/7 AI Gramin Sahayak Support"
            >
              <HelpCircle size={16} />
              <span>AI Sahayak</span>
            </button>
          </div>

          {/* Utility Controls */}
          <div className="nav-actions">
            {/* Guided Tour Launcher */}
            <button
              id="open-tour-btn"
              className="tour-trigger-btn"
              onClick={() => setTourOpen(true)}
              title="Interactive End-to-End Walkthrough"
            >
              <Sparkles size={15} />
              <span>Simulate Flow</span>
            </button>

            {/* Audio Voice Narration */}
            <button
              id="speech-toggle-btn"
              className={`speech-toggle-btn ${isSpeaking ? 'speaking' : ''}`}
              onClick={handleAudioTour}
              title={isSpeaking ? t('stopAudio') : t('listenAloud')}
            >
              {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{isSpeaking ? t('stopAudio') : t('listenAloud')}</span>
            </button>

            {/* Multilingual Selector */}
            <div className="lang-select-wrapper">
              <Globe size={15} style={{ position: 'absolute', left: '10px', color: '#64748b', pointerEvents: 'none' }} />
              <select
                id="language-select"
                className="lang-select"
                style={{ paddingLeft: '28px' }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Shopping Cart button */}
            <button
              id="cart-trigger-btn"
              className="cart-icon-btn"
              onClick={() => setCartOpen(true)}
              title="View Cart"
            >
              <ShoppingBag size={18} />
              {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </button>

            {/* Reset Demo State button */}
            <button
              id="reset-demo-btn"
              className="btn btn-secondary btn-sm"
              onClick={resetDemo}
              title="Reset Demo Data"
              style={{ padding: '0.45rem' }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Role Context Pill Bar */}
      <div className="persona-banner">
        <div className="persona-banner-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className={`banner-badge ${activeRole}`}>
              <Layers size={13} />
              Active Workspace: {t(`role${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`)}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
              {activeRole === 'producer' && 'Logged in as Mithila Mahila Kala Samiti (Sunita Devi, Madhubani Hub)'}
              {activeRole === 'buyer' && 'Exploring direct-from-artisan catalog with 100% Escrow Protection'}
              {activeRole === 'logistics' && 'Gramin Dak-Mitra & Village Aggregation Cluster Hub Monitor'}
              {activeRole === 'support' && 'AI Rural Dispute & Multi-lingual Assistance Desk'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#0f4c3a', fontWeight: 600 }}>
            <span>✓ Verified GI-Tag & SHG Clusters</span>
            <span>✓ 94% Direct Producer Realization</span>
            <span>✓ First-Mile Cluster Pickup</span>
          </div>
        </div>
      </div>
    </>
  );
}
