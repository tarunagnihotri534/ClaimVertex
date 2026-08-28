import React from 'react';
import { Logo } from './Logo';
import heroScannerImg from './HIGH.png';
import './index.css';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div style={styles.root}>
      {/* Ambient background orbs for soft realism */}
      <div className="landing-bg-orb landing-orb-1" />
      <div className="landing-bg-orb landing-orb-2" />
      <div className="landing-bg-orb landing-orb-3" />

      {/* ── TOP NAVBAR (Edge-to-Edge Touching Corners) ── */}
      <header style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoBadge}>
            <Logo size={20} color="#a0e571" />
          </div>
          <span style={styles.navBrand}>ClaimVertex</span>
        </div>
        <div style={styles.navRight}>
          <button 
            className="btn-enterprise-login" 
            onClick={onLogin} 
            id="navbar-login-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* ── MAIN HERO STAGE ── */}
      <main style={styles.hero}>
        {/* Left Column: Headlines & Call to Actions */}
        <div style={styles.heroLeft}>
          <div style={styles.badge}>
            <span style={styles.badgePulseDot} className="pulse-indicator" />
            <span>AI-POWERED P&amp;C INSURANCE INTELLIGENCE</span>
          </div>

          <h1 style={styles.heroHeading}>
            Transforming Claims from Manual Workflows to <span style={styles.headingGradient}>Intelligent Decisions</span>
          </h1>

          <p style={styles.heroSub}>
            Autonomous Straight-Through Processing (STP), 6-vector SIU fraud detection, and real-time financial settlement — all in under 0.9 seconds.
          </p>

          <div style={styles.ctaRow}>
            <button 
              className="btn-enterprise-secondary" 
              onClick={onLogin} 
              id="hero-learn-more-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#114b5f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Explore Features</span>
            </button>

            <button 
              className="btn-enterprise-primary" 
              onClick={onLogin} 
              id="hero-launch-btn"
            >
              <span>Launch Dashboard</span>
              <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Realistic Trust Badges / Latency micro-bar */}
          <div style={styles.trustBar}>
            <div style={styles.trustItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>&lt;0.9s STP Execution</span>
            </div>
            <span style={styles.trustDivider}>•</span>
            <div style={styles.trustItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>99.8% SIU Fraud Accuracy</span>
            </div>
            <span style={styles.trustDivider}>•</span>
            <div style={styles.trustItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>SOC-2 Type II Certified</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Static High-Res Hero Graphic with Ambient Aura */}
        <div style={styles.heroRight}>
          <div style={styles.imageContainer}>
            <div style={styles.imageGlowBackdrop} className="ambient-aura" />
            <img
              src={heroScannerImg}
              alt="Claim Document & Smartphone Scanner"
              style={styles.heroImage}
              className="hero-main-img"
            />
          </div>
        </div>
      </main>

      {/* ── 3 FORMAL REALISTIC ENTERPRISE PILLAR CARDS ── */}
      <div style={styles.cardsContainer}>
        {/* Pillar 1: STP Engine */}
        <div 
          className="enterprise-card" 
          style={{ '--card-accent': '#10b981' } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div 
              className="card-icon-wrap" 
              style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span 
              className="card-pill-tag" 
              style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
            >
              ⚡ STP Engine
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>
              Autonomous STP Engine
            </div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              Sub-second deterministic coverage validation and immediate electronic check disbursement for qualified clean claims.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <span className="card-sub-pill">⚡ Direct ACH Settlement</span>
            <span className="card-sub-pill">✓ Policy Check</span>
          </div>
        </div>

        {/* Pillar 2: SIU Fraud Matrix */}
        <div 
          className="enterprise-card" 
          style={{ '--card-accent': '#6366f1' } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div 
              className="card-icon-wrap" 
              style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', border: '1px solid #c7d2fe' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <span 
              className="card-pill-tag" 
              style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}
            >
              🛡️ 6-Vector SIU
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>
              Forensic SIU Fraud Matrix
            </div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              Multi-carrier duplicate contractor billing detection, NOAA Doppler weather validation, and EXIF metadata tampering audit.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <span className="card-sub-pill">🛰️ NOAA Doppler Radar</span>
            <span className="card-sub-pill">🔍 EXIF Tamper Audit</span>
          </div>
        </div>

        {/* Pillar 3: PE Dispatch */}
        <div 
          className="enterprise-card" 
          style={{ '--card-accent': '#f59e0b' } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div 
              className="card-icon-wrap" 
              style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fde68a' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span 
              className="card-pill-tag" 
              style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}
            >
              📞 Voice Telephony
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>
              Forensic PE Dispatch
            </div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              Automated AI voice telephony scheduling with policyholders and calendar reservation for licensed structural engineers.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <span className="card-sub-pill">🎙️ AI Voice Adjuster</span>
            <span className="card-sub-pill">📅 Licensed PE Slots</span>
          </div>
        </div>
      </div>

      {/* ── DARK BLACK FOOTER BAR (Edge-to-Edge Touching Corners, Centered Bright Text) ── */}
      <footer style={styles.footerBar}>
        <div style={styles.footerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Logo size={16} color="#a0e571" />
            <span style={styles.footerText}>
              © {new Date().getFullYear()} ClaimVertex · Enterprise AI Insurance Intelligence · All Rights Reserved.
            </span>
          </div>
          <div style={styles.footerStatus}>
            <span style={styles.statusDot} />
            <span>Systems Normal (STP Active)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────
// Enterprise Layout & Alignment Styles
// ─────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    margin: 0,
    padding: 0,
    backgroundColor: '#f8fafc',
    backgroundImage: `
      radial-gradient(circle at 1.5px 1.5px, rgba(17, 75, 95, 0.07) 1.2px, transparent 1.2px),
      radial-gradient(ellipse 60% 50% at 75% 30%, rgba(160, 229, 113, 0.12) 0%, transparent 70%),
      radial-gradient(ellipse 50% 50% at 20% 80%, rgba(56, 189, 248, 0.08) 0%, transparent 70%)
    `,
    backgroundSize: '28px 28px, 100% 100%, 100% 100%',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: '#0f172a',
    overflowX: 'hidden',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },

  // Navbar (Touching corners 100% full width)
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#114b5f',
    backgroundImage: 'linear-gradient(135deg, #0e3b4b 0%, #114b5f 60%, #165b73 100%)',
    height: 64,
    width: '100%',
    margin: 0,
    padding: '0 36px',
    borderRadius: 0,
    flexShrink: 0,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    zIndex: 20,
    boxSizing: 'border-box',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(160, 229, 113, 0.4)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
  },
  navBrand: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 20,
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.3px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
  },

  // Hero Section - Centered, balanced container
  hero: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '36px 36px 20px',
    gap: 48,
    maxWidth: 1240,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    zIndex: 1,
  },
  heroLeft: {
    flex: '1 1 540px',
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    zIndex: 2,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(17, 75, 95, 0.08)',
    color: '#0e4e63',
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: '0.8px',
    padding: '6px 14px',
    borderRadius: 20,
    border: '1px solid rgba(17, 75, 95, 0.18)',
    boxShadow: '0 2px 4px rgba(17, 75, 95, 0.04)',
  },
  badgePulseDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: '#059669',
    boxShadow: '0 0 8px #10b981',
    display: 'inline-block',
  },
  heroHeading: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontWeight: 800,
    fontSize: 40,
    lineHeight: 1.2,
    color: '#0f172a',
    letterSpacing: '-0.8px',
    margin: 0,
  },
  headingGradient: {
    background: 'linear-gradient(135deg, #114b5f 0%, #0d9488 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    fontSize: 15.5,
    lineHeight: 1.6,
    color: '#475569',
    margin: 0,
  },
  ctaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
    marginTop: 6,
  },

  // Trust / Micro-metric bar
  trustBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 6,
    paddingTop: 12,
    borderTop: '1px solid #e2e8f0',
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#64748b',
  },
  trustDivider: {
    color: '#cbd5e1',
    fontSize: 12,
  },

  // Hero Right Graphic Container
  heroRight: {
    flex: '1 1 440px',
    maxWidth: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 320,
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imageGlowBackdrop: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(160, 229, 113, 0.35) 0%, rgba(56, 189, 248, 0.2) 50%, transparent 70%)',
    filter: 'blur(30px)',
    zIndex: 0,
    pointerEvents: 'none',
  },
  heroImage: {
    maxWidth: '100%',
    width: 410,
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
    filter: 'drop-shadow(0 20px 30px rgba(17, 75, 95, 0.14)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.08))',
    userSelect: 'none',
    position: 'relative',
    zIndex: 1,
  },

  // 3 Feature Cards Container - Perfect horizontal alignment with hero
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20,
    maxWidth: 1240,
    margin: '12px auto 32px',
    padding: '0 36px',
    width: '100%',
    boxSizing: 'border-box',
    zIndex: 2,
  },

  // Footer Bar (Edge-to-Edge)
  footerBar: {
    backgroundColor: '#0a0f1d',
    borderTop: '1px solid #1e293b',
    width: '100%',
    margin: 0,
    padding: '0 36px',
    height: 50,
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    zIndex: 10,
  },
  footerInner: {
    maxWidth: 1240,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerText: {
    fontSize: 12.5,
    fontWeight: 500,
    color: '#94a3b8',
    letterSpacing: '0.1px',
  },
  footerStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11.5,
    fontWeight: 600,
    color: '#34d399',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 6px #10b981',
    display: 'inline-block',
  },
};
