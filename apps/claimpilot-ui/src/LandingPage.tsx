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

      {/* ── TOP NAVBAR (Edge-to-Edge Touching Corners) ── */}
      <header style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoBadge}>
            <Logo size={20} color="#a0e571" />
          </div>
          <span style={styles.navBrand}>ClaimVertex</span>
        </div>
        <div style={styles.navRight}>
          <button style={styles.loginBtn} onClick={onLogin} id="navbar-login-btn">
            Login
          </button>
        </div>
      </header>

      {/* ── MAIN HERO STAGE ── */}
      <main style={styles.hero}>

        {/* Left Column: Headlines & Call to Actions */}
        <div style={styles.heroLeft}>
          <div style={styles.badge}>
            AI-POWERED P&amp;C INSURANCE
          </div>

          <h1 style={styles.heroHeading}>
            Transforming Claims from Manual Workflows to Intelligent Decisions
          </h1>

          <p style={styles.heroSub}>
            Autonomous Straight-Through Processing (STP), 6-vector SIU fraud detection, and real-time financial settlement — all in under 0.9 seconds.
          </p>

          <div style={styles.ctaRow}>
            <button
              style={styles.learnMoreBtn}
              onClick={onLogin}
              id="hero-learn-more-btn"
            >
              Learn More
            </button>
            <button style={styles.launchBtn} onClick={onLogin} id="hero-launch-btn">
              Launch Dashboard →
            </button>
          </div>
        </div>

        {/* Right Column: Clean Static High-Res Hero Graphic */}
        <div style={styles.heroRight}>
          <div style={styles.imageContainer}>
            <img
              src={heroScannerImg}
              alt="Claim Document & Smartphone Scanner"
              style={styles.heroImage}
            />
          </div>
        </div>

      </main>

      {/* ── 3 FORMAL ENTERPRISE PILLAR CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, maxWidth: 1280, margin: '16px auto 36px', padding: '0 48px', width: '100%', boxSizing: 'border-box' }}>
        {/* Pillar 1 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '20px 22px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Autonomous STP Engine</div>
          <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.55 }}>Sub-second deterministic coverage validation and immediate electronic check disbursement for qualified clean claims.</div>
        </div>
        {/* Pillar 2 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '20px 22px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Forensic SIU Fraud Matrix</div>
          <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.55 }}>Multi-carrier duplicate contractor billing detection, NOAA Doppler weather validation, and EXIF metadata tampering audit.</div>
        </div>
        {/* Pillar 3 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '20px 22px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Forensic PE Dispatch</div>
          <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.55 }}>Automated AI voice telephony scheduling with policyholders and calendar reservation for licensed structural engineers.</div>
        </div>
      </div>

      {/* ── DARK BLACK FOOTER BAR (Edge-to-Edge Touching Corners, Centered Bright Text) ── */}
      <footer style={styles.footerBar}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Logo size={16} color="#ffffff" />
          <span style={styles.footerText}>
            © {new Date().getFullYear()} ClaimVertex · AI-Powered P&amp;C Claims Intelligence · All Rights Reserved.
          </span>
        </div>
      </footer>

    </div>
  );
};

// ─────────────────────────────────────────────
// Styles matching Figma 1:1 Reference + Ambient Beauty
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
    backgroundColor: '#fffef5',
    backgroundImage: `
      radial-gradient(circle at 1.5px 1.5px, rgba(17, 75, 95, 0.08) 1.2px, transparent 1.2px),
      radial-gradient(ellipse 60% 50% at 75% 30%, rgba(160, 229, 113, 0.16) 0%, transparent 70%),
      radial-gradient(ellipse 50% 50% at 20% 80%, rgba(56, 189, 248, 0.1) 0%, transparent 70%)
    `,
    backgroundSize: '28px 28px, 100% 100%, 100% 100%',
    fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
    color: '#0d1f2d',
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
    height: 64,
    width: '100%',
    margin: 0,
    padding: '0 40px',
    borderRadius: 0,
    flexShrink: 0,
    boxShadow: '0 3px 12px rgba(0,0,0,0.18)',
    zIndex: 20,
    boxSizing: 'border-box',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0a2e3b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(160,229,113,0.35)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  navBrand: {
    fontFamily: "'Fredoka One', 'Segoe UI', cursive, sans-serif",
    fontSize: 21,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '0.4px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
  },
  loginBtn: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontWeight: 700,
    fontSize: 13.5,
    color: '#114b5f',
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 24px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    transition: 'transform 0.15s ease, background-color 0.15s ease',
  },

  // Hero Section
  hero: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px 64px',
    gap: 56,
    maxWidth: 1320,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  heroLeft: {
    flex: '1 1 520px',
    maxWidth: 590,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    zIndex: 2,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(17,75,95,0.08)',
    color: '#114b5f',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '5px 14px',
    borderRadius: 20,
    border: '1px solid rgba(17,75,95,0.2)',
    boxShadow: '0 2px 6px rgba(17,75,95,0.06)',
  },
  badgePulseDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#114b5f',
    display: 'inline-block',
  },
  heroHeading: {
    fontFamily: "'Segoe UI', -apple-system, sans-serif",
    fontWeight: 800,
    fontSize: 42,
    lineHeight: 1.22,
    color: '#0d1f2d',
    letterSpacing: '-0.8px',
    margin: 0,
  },
  headingGradient: {
    background: 'linear-gradient(135deg, #114b5f 0%, #0d9488 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    fontSize: 16,
    lineHeight: 1.65,
    color: '#4a5568',
    margin: 0,
  },
  ctaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  learnMoreBtn: {
    fontFamily: "'Segoe UI', sans-serif",
    fontWeight: 700,
    fontSize: 14.5,
    color: '#0d1f2d',
    backgroundColor: '#a0e571',
    border: 'none',
    borderRadius: 24,
    padding: '12px 30px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(160,229,113,0.5), 0 2px 4px rgba(0,0,0,0.06)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },
  launchBtn: {
    fontFamily: "'Segoe UI', sans-serif",
    fontWeight: 700,
    fontSize: 14.5,
    color: '#ffffff',
    backgroundColor: '#114b5f',
    border: 'none',
    borderRadius: 24,
    padding: '12px 30px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(17,75,95,0.35), 0 2px 4px rgba(0,0,0,0.08)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  },

  // Hero Right Illustration & Ambient Atmosphere
  heroRight: {
    flex: '1 1 440px',
    maxWidth: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 300,
  },
  imageContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  heroImage: {
    maxWidth: '100%',
    width: 400,
    height: 'auto',
    display: 'block',
    objectFit: 'contain',
    filter: 'drop-shadow(0 15px 30px rgba(17, 75, 95, 0.12)) drop-shadow(0 4px 10px rgba(0,0,0,0.06))',
    userSelect: 'none',
  },

  // Dark Black Footer Bar (Touching corners 100% full width)
  footerBar: {
    backgroundColor: '#000000',
    borderTop: '1px solid #111111',
    width: '100%',
    margin: 0,
    padding: '0 40px',
    height: 52,
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    zIndex: 10,
  },
  footerText: {
    fontSize: 13,
    fontWeight: 500,
    color: '#ffffff',
    letterSpacing: '0.2px',
    textAlign: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 6px #22c55e',
    display: 'inline-block',
  },
};
