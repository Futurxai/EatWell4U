import { useState, useEffect, useRef } from 'react';
import { Lock, X, Eye, EyeOff, ChevronDown } from 'lucide-react';

// ── Google brand colors ──────────────────────────────────────────────────────
const GB = {
  blue:   '#4285F4',
  red:    '#EA4335',
  yellow: '#FBBC05',
  green:  '#34A853',
  dark:   '#202124',
  gray:   '#5f6368',
  border: '#dadce0',
  error:  '#d93025',
  btnBg:  '#1a73e8',
  link:   '#1a73e8',
};

// ── Known mock accounts ───────────────────────────────────────────────────────
const KNOWN: Record<string, {
  name: string; firstName: string; avatarColor: string;
  age: string; weight: string; goalWeight: string;
  dietary: 'veg' | 'non-veg'; goal: 'weight-loss' | 'muscle-gain';
}> = {
  'priya.sharma@gmail.com': {
    name: 'Priya Sharma', firstName: 'Priya', avatarColor: '#EA4335',
    age: '28', weight: '65', goalWeight: '58', dietary: 'veg', goal: 'weight-loss',
  },
  'arjun.mehta@gmail.com': {
    name: 'Arjun Mehta', firstName: 'Arjun', avatarColor: '#4285F4',
    age: '32', weight: '78', goalWeight: '72', dietary: 'non-veg', goal: 'muscle-gain',
  },
  'sneha.patel@gmail.com': {
    name: 'Sneha Patel', firstName: 'Sneha', avatarColor: '#34A853',
    age: '25', weight: '55', goalWeight: '52', dietary: 'veg', goal: 'weight-loss',
  },
};

function deriveProfile(email: string) {
  const known = KNOWN[email.toLowerCase()];
  if (known) return { email, ...known };
  const prefix = email.split('@')[0];
  const parts = prefix.split(/[._\-+]/).filter(Boolean);
  const name = parts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const firstName = parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1) || 'User';
  const avatarColors = [GB.blue, GB.red, GB.green, '#9C27B0', '#FF9800'];
  const avatarColor = avatarColors[email.charCodeAt(0) % avatarColors.length];
  return { email, name, firstName, avatarColor, age: '26', weight: '65', goalWeight: '60', dietary: 'veg' as const, goal: 'weight-loss' as const };
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Google's full wordmark in exact brand colors */
function GoogleWordmark({ size = 28 }: { size?: number }) {
  const letters = [
    { char: 'G', color: GB.blue },
    { char: 'o', color: GB.red },
    { char: 'o', color: GB.yellow },
    { char: 'g', color: GB.blue },
    { char: 'l', color: GB.green },
    { char: 'e', color: GB.red },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      {letters.map((l, i) => (
        <span key={i} style={{
          color: l.color,
          fontSize: size,
          fontFamily: 'Roboto, "Google Sans", arial, sans-serif',
          fontWeight: 400,
          letterSpacing: -0.5,
        }}>
          {l.char}
        </span>
      ))}
    </div>
  );
}

/** Google-style loading dots */
function GoogleDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '20px 0' }}>
      {[GB.blue, GB.red, GB.yellow, GB.green].map((color, i) => (
        <div key={i} style={{
          width: 12, height: 12, borderRadius: 6, background: color,
          animation: `gdot 1.4s ease-in-out ${i * 0.16}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes gdot {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  );
}

/** User email pill (shown on password step) */
function EmailChip({ email, avatarColor, onBack }: { email: string; avatarColor: string; onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 14px 7px 8px',
        borderRadius: 24, border: `1px solid ${GB.border}`,
        background: 'white', cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 14, background: avatarColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 600, color: 'white', flexShrink: 0,
      }}>
        {email.charAt(0).toUpperCase()}
      </div>
      <span style={{ fontSize: 14, color: GB.dark, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {email}
      </span>
      <ChevronDown size={15} color={GB.gray} strokeWidth={2} />
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface GoogleOAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (profile: ReturnType<typeof deriveProfile>) => void;
}

export function GoogleOAuthModal({ visible, onClose, onSuccess }: GoogleOAuthModalProps) {
  type Step = 'email' | 'password' | 'loading' | 'done';

  const [step, setStep]       = useState<Step>('email');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [showPass, setShowP]  = useState(false);
  const [emailErr, setEmailE] = useState('');
  const [passErr, setPassE]   = useState('');
  const [profile, setProf]    = useState<ReturnType<typeof deriveProfile> | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef  = useRef<HTMLInputElement>(null);

  // Focus input when step changes
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      if (step === 'email') emailRef.current?.focus();
      if (step === 'password') passRef.current?.focus();
    }, 350);
    return () => clearTimeout(t);
  }, [step, visible]);

  // Reset on close
  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setStep('email'); setEmail(''); setPass('');
        setShowP(false); setEmailE(''); setPassE('');
        setProf(null);
      }, 400);
    }
  }, [visible]);

  const handleNextEmail = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setEmailE("Enter an email or phone number."); return; }
    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      setEmailE("Enter a valid email address."); return;
    }
    setEmailE('');
    const p = deriveProfile(trimmed);
    setProf(p);
    setStep('password');
  };

  const handleNextPassword = () => {
    if (!password) { setPassE("Enter a password."); return; }
    if (password.length < 6) { setPassE("Wrong password. Try again."); return; }
    setPassE('');
    setStep('loading');
    setTimeout(() => {
      setStep('done');
      setTimeout(() => {
        onSuccess(profile!);
      }, 600);
    }, 2000);
  };

  const handleKeyEmail  = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleNextEmail(); };
  const handleKeyPass   = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleNextPassword(); };

  const fi: React.CSSProperties = {
    width: '100%', padding: '13px 14px', fontSize: 16,
    borderRadius: 4, border: `1px solid ${GB.border}`,
    color: GB.dark, background: 'white', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'Roboto, arial, sans-serif',
    transition: 'border-color 0.15s',
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={step !== 'loading' && step !== 'done' ? onClose : undefined}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 50,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'all' : 'none',
          transition: 'opacity 0.28s ease',
        }}
      />

      {/* OAuth Window */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 60,
        display: 'flex', flexDirection: 'column',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.36s cubic-bezier(0.32, 0.72, 0, 1)',
        pointerEvents: visible ? 'all' : 'none',
      }}>

        {/* ── Fake browser chrome ── */}
        <div style={{
          background: '#f1f3f4', flexShrink: 0,
          borderBottom: '1px solid #e0e0e0',
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: 'white', borderRadius: 20, padding: '7px 14px',
            border: '1px solid #dadce0',
          }}>
            <Lock size={12} color="#188038" strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#3c4043', fontFamily: 'Roboto, sans-serif', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              accounts.google.com
            </span>
          </div>
          <button
            onClick={step !== 'loading' && step !== 'done' ? onClose : undefined}
            style={{
              background: '#e8eaed', border: 'none', cursor: 'pointer',
              width: 30, height: 30, borderRadius: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              color: '#5f6368',
            }}
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Page body ── */}
        <div style={{
          flex: 1, background: 'white', overflowY: 'auto', scrollbarWidth: 'none',
          display: 'flex', flexDirection: 'column',
        }}>

          {/* ── Email Step ── */}
          {(step === 'email') && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                <GoogleWordmark size={30} />
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 400, color: GB.dark, margin: '0 0 8px', fontFamily: 'Roboto, sans-serif', textAlign: 'center' }}>
                Sign in
              </h1>
              <p style={{ fontSize: 16, color: GB.gray, margin: '0 0 28px', fontFamily: 'Roboto, sans-serif', textAlign: 'center' }}>
                to continue to <strong style={{ color: GB.dark, fontWeight: 500 }}>EatWell</strong>
              </p>

              {/* Email input */}
              <div style={{ marginBottom: 6, position: 'relative' }}>
                <label style={{
                  position: 'absolute', top: emailErr ? -18 : 13, left: 14,
                  fontSize: 12, color: emailErr ? GB.error : GB.gray,
                  fontFamily: 'Roboto, sans-serif', pointerEvents: 'none',
                  background: 'white', padding: '0 4px',
                  transition: 'all 0.15s',
                }}>
                  Email or phone
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailE(''); }}
                  onKeyDown={handleKeyEmail}
                  placeholder=" "
                  style={{
                    ...fi,
                    borderColor: emailErr ? GB.error : email ? GB.blue : GB.border,
                    paddingTop: email ? 20 : 13,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = emailErr ? GB.error : GB.blue; e.currentTarget.style.borderWidth = '2px'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = emailErr ? GB.error : email ? GB.border : GB.border; e.currentTarget.style.borderWidth = '1px'; }}
                />
              </div>

              {emailErr && (
                <div style={{ fontSize: 12, color: GB.error, fontFamily: 'Roboto, sans-serif', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 16 }}>⚠</span> {emailErr}
                </div>
              )}

              <button style={{ background: 'none', border: 'none', color: GB.link, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: '4px 0 0', fontFamily: 'Roboto, sans-serif', width: 'fit-content' }}>
                Forgot email?
              </button>

              <div style={{ flex: 1 }} />

              {/* Guest mode notice */}
              <p style={{ fontSize: 12, color: GB.gray, fontFamily: 'Roboto, sans-serif', lineHeight: 1.5, marginBottom: 24 }}>
                Not your computer?{' '}
                <button style={{ background: 'none', border: 'none', color: GB.link, fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'Roboto, sans-serif' }}>
                  Use Guest mode
                </button>{' '}
                to sign in privately.{' '}
                <button style={{ background: 'none', border: 'none', color: GB.link, fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'Roboto, sans-serif' }}>
                  Learn more
                </button>
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={{ background: 'none', border: 'none', color: GB.link, fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '10px 8px', fontFamily: 'Roboto, sans-serif', borderRadius: 4 }}>
                  Create account
                </button>
                <button
                  onClick={handleNextEmail}
                  style={{
                    background: GB.btnBg, color: 'white', border: 'none',
                    borderRadius: 4, padding: '10px 24px',
                    fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'Roboto, sans-serif',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    letterSpacing: 0.25,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── Password Step ── */}
          {step === 'password' && profile && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
                <GoogleWordmark size={30} />
              </div>

              {/* Profile avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 28,
                  background: profile.avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 400, color: 'white',
                  marginBottom: 12, fontFamily: 'Roboto, sans-serif',
                }}>
                  {profile.firstName.charAt(0).toUpperCase()}
                </div>

                <h1 style={{ fontSize: 24, fontWeight: 400, color: GB.dark, margin: '0 0 6px', fontFamily: 'Roboto, sans-serif' }}>
                  Hi, {profile.firstName}
                </h1>

                <EmailChip
                  email={profile.email}
                  avatarColor={profile.avatarColor}
                  onBack={() => { setStep('email'); setPass(''); setPassE(''); }}
                />
              </div>

              {/* Password input */}
              <p style={{ fontSize: 16, color: GB.gray, margin: '0 0 20px', fontFamily: 'Roboto, sans-serif' }}>
                Enter your password
              </p>

              <div style={{ marginBottom: 6, position: 'relative' }}>
                <label style={{
                  position: 'absolute', top: passErr ? -18 : 13, left: 14,
                  fontSize: 12, color: passErr ? GB.error : GB.gray,
                  fontFamily: 'Roboto, sans-serif', pointerEvents: 'none',
                  background: 'white', padding: '0 4px',
                  transition: 'all 0.15s',
                }}>
                  Enter your password
                </label>
                <input
                  ref={passRef}
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPass(e.target.value); setPassE(''); }}
                  onKeyDown={handleKeyPass}
                  placeholder=" "
                  style={{
                    ...fi,
                    borderColor: passErr ? GB.error : password ? GB.blue : GB.border,
                    paddingTop: password ? 20 : 13,
                    paddingRight: 48,
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = passErr ? GB.error : GB.blue; e.currentTarget.style.borderWidth = '2px'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = passErr ? GB.error : password ? GB.border : GB.border; e.currentTarget.style.borderWidth = '1px'; }}
                />
                <button
                  onClick={() => setShowP(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: GB.gray, display: 'flex', alignItems: 'center', padding: 0 }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {passErr && (
                <div style={{ fontSize: 12, color: GB.error, fontFamily: 'Roboto, sans-serif', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 16 }}>⚠</span> {passErr}
                </div>
              )}

              {/* Show password checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 4 }}>
                <input
                  type="checkbox"
                  checked={showPass}
                  onChange={(e) => setShowP(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: GB.blue, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 14, color: GB.gray, fontFamily: 'Roboto, sans-serif' }}>Show password</span>
              </label>

              <button style={{ background: 'none', border: 'none', color: GB.link, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left', padding: '12px 0 0', fontFamily: 'Roboto, sans-serif', width: 'fit-content' }}>
                Forgot password?
              </button>

              <div style={{ flex: 1 }} />

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <button
                  onClick={() => { setStep('email'); setPass(''); setPassE(''); }}
                  style={{ background: 'none', border: 'none', color: GB.link, fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '10px 8px', fontFamily: 'Roboto, sans-serif', borderRadius: 4 }}
                >
                  Back
                </button>
                <button
                  onClick={handleNextPassword}
                  style={{
                    background: GB.btnBg, color: 'white', border: 'none',
                    borderRadius: 4, padding: '10px 24px',
                    fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    fontFamily: 'Roboto, sans-serif',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    letterSpacing: 0.25,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ── Loading Step ── */}
          {step === 'loading' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
              <div style={{ marginBottom: 32 }}>
                <GoogleWordmark size={30} />
              </div>

              {profile && (
                <div style={{
                  width: 64, height: 64, borderRadius: 32,
                  background: profile.avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 400, color: 'white',
                  marginBottom: 20, fontFamily: 'Roboto, sans-serif',
                }}>
                  {profile.firstName.charAt(0).toUpperCase()}
                </div>
              )}

              <p style={{ fontSize: 16, color: GB.gray, fontFamily: 'Roboto, sans-serif', marginBottom: 8 }}>
                Signing in…
              </p>
              <p style={{ fontSize: 13, color: '#aaa', fontFamily: 'Roboto, sans-serif', marginBottom: 0 }}>
                {profile?.email}
              </p>

              <GoogleDots />

              <p style={{ fontSize: 12, color: '#bbb', fontFamily: 'Roboto, sans-serif', textAlign: 'center', maxWidth: 260, lineHeight: 1.5 }}>
                You're being redirected to EatWell securely
              </p>
            </div>
          )}

          {/* ── Done Step ── */}
          {step === 'done' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
              <div style={{ marginBottom: 28 }}>
                <GoogleWordmark size={30} />
              </div>
              <div style={{
                width: 64, height: 64, borderRadius: 32,
                background: GB.green,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, marginBottom: 16,
                boxShadow: '0 4px 16px rgba(52,168,83,0.4)',
              }}>
                ✓
              </div>
              <p style={{ fontSize: 16, fontWeight: 500, color: GB.dark, fontFamily: 'Roboto, sans-serif' }}>
                Signed in successfully!
              </p>
              <p style={{ fontSize: 13, color: GB.gray, fontFamily: 'Roboto, sans-serif' }}>
                Redirecting to EatWell…
              </p>
            </div>
          )}

          {/* ── Footer on email step ── */}
          {step === 'email' && (
            <div style={{ padding: '12px 24px 24px', borderTop: '1px solid #e8eaed', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {['English (UK)', 'हिन्दी', 'தமிழ்', 'বাংলা'].map((lang, i) => (
                  <button key={i} style={{ background: 'none', border: 'none', color: GB.gray, fontSize: 11, cursor: 'pointer', fontFamily: 'Roboto, sans-serif', padding: '2px 4px' }}>
                    {lang}
                  </button>
                ))}
                <button style={{ background: 'none', border: 'none', color: GB.gray, fontSize: 11, cursor: 'pointer', fontFamily: 'Roboto, sans-serif', padding: '2px 4px' }}>
                  ▾
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom bar (like real Google sign-in footer) ── */}
        {(step === 'email' || step === 'password') && (
          <div style={{
            background: '#f1f3f4', flexShrink: 0,
            borderTop: '1px solid #e0e0e0',
            padding: '10px 16px',
            display: 'flex', justifyContent: 'center', gap: 16,
          }}>
            {['Help', 'Privacy', 'Terms'].map((item) => (
              <button key={item} style={{ background: 'none', border: 'none', color: GB.gray, fontSize: 12, cursor: 'pointer', fontFamily: 'Roboto, sans-serif', padding: '2px 4px' }}>
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
