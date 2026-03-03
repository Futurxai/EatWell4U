import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Eye, EyeOff, Leaf, Mail, Lock, User,
  Check, AlertCircle, CheckCircle2, Info, X,
} from 'lucide-react';
import { AppButton } from '../components/AppButton';
import { useAppContext } from '../context/AppContext';

const PRIMARY       = '#4CAF50';
const PRIMARY_DARK  = '#388E3C';
const PRIMARY_LIGHT = '#E8F5E9';
const TEXT          = '#1A1A1A';
const TEXT_MUTED    = '#9E9E9E';
const BORDER        = '#EBEBEB';
const INPUT_BG      = '#F8F9FA';

type ToastType = 'error' | 'success' | 'info';
interface ToastMsg { message: string; type: ToastType; id: number; }

const DEMO_EMAIL    = 'user@eatwell.com';
const DEMO_PASSWORD = 'eatwell123';
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function Toast({ toast, onDismiss }: { toast: ToastMsg; onDismiss: () => void }) {
  const cfg = {
    error:   { bg: '#FF3B30', icon: <AlertCircle size={16} strokeWidth={2.5} />,  label: 'Error'   },
    success: { bg: '#4CAF50', icon: <CheckCircle2 size={16} strokeWidth={2.5} />, label: 'Success' },
    info:    { bg: '#2196F3', icon: <Info size={16} strokeWidth={2.5} />,          label: 'Info'    },
  }[toast.type];
  return (
    <div style={{
      position: 'absolute', top: 14, left: 14, right: 14, zIndex: 999,
      background: cfg.bg, borderRadius: 16, padding: '12px 13px',
      display: 'flex', alignItems: 'flex-start', gap: 10,
      boxShadow: `0 8px 28px ${cfg.bg}55`,
      animation: 'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
        {cfg.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>{cfg.label}</div>
        <div style={{ fontSize: 12.5, color: 'white', lineHeight: 1.4, fontWeight: 500 }}>{toast.message}</div>
      </div>
      <button onClick={onDismiss} style={{ background: 'rgba(255,255,255,0.22)', border: 'none', cursor: 'pointer', width: 24, height: 24, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
        <X size={12} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function Field({ label, icon, error, children }: { label: string; icon: React.ReactNode; error?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: error ? '#FF3B30' : '#555', display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: error ? '#FF3B30' : TEXT_MUTED, display: 'flex' }}>{icon}</div>
        {children}
      </div>
    </div>
  );
}

export function LoginScreen() {
  const navigate = useNavigate();
  const { setProfile } = useAppContext();

  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [lEmail,    setLEmail]    = useState('');
  const [lPass,     setLPass]     = useState('');
  const [lShowP,    setLShowP]    = useState(false);
  const [lEmailErr, setLEmailErr] = useState(false);
  const [lPassErr,  setLPassErr]  = useState(false);

  const [rName,     setRName]     = useState('');
  const [rEmail,    setREmail]    = useState('');
  const [rPass,     setRPass]     = useState('');
  const [rShowP,    setRShowP]    = useState(false);
  const [rNameErr,  setRNameErr]  = useState(false);
  const [rEmailErr, setREmailErr] = useState(false);
  const [rPassErr,  setRPassErr]  = useState(false);
  const [regDone,   setRegDone]   = useState(false);

  const [toast, setToast] = useState<ToastMsg | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: ToastType = 'error') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type, id: Date.now() });
    timerRef.current = setTimeout(() => setToast(null), 4200);
  };
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const switchTab = (t: 'login' | 'register') => {
    setTab(t); setToast(null);
    setLEmailErr(false); setLPassErr(false);
    setRNameErr(false);  setREmailErr(false); setRPassErr(false);
  };

  const handleLogin = () => {
    setLEmailErr(false); setLPassErr(false);
    if (!lEmail.trim())        { setLEmailErr(true); showToast('Email address is required.'); return; }
    if (!isValidEmail(lEmail)) { setLEmailErr(true); showToast('Invalid email — e.g. you@example.com'); return; }
    if (!lPass)                { setLPassErr(true);  showToast('Password is required.'); return; }
    if (lPass.length < 6)      { setLPassErr(true);  showToast('Password must be at least 6 characters.'); return; }

    const email = lEmail.trim().toLowerCase();

    // Check demo credentials
    const demoMatch = email === DEMO_EMAIL && lPass === DEMO_PASSWORD;

    // Check registered credentials saved in localStorage
    let registeredMatch = false;
    try {
      const stored = localStorage.getItem('eatwell_credentials');
      if (stored) {
        const creds: { email: string; password: string }[] = JSON.parse(stored);
        registeredMatch = creds.some(c => c.email === email && c.password === lPass);
      }
    } catch { /* ignore */ }

    if (!demoMatch && !registeredMatch) {
      setLEmailErr(true); setLPassErr(true);
      showToast('Incorrect email or password. Check your credentials.');
      return;
    }

    // Load saved profile for this registered user if available
    try {
      const stored = localStorage.getItem('eatwell_credentials');
      if (stored && !demoMatch) {
        const creds: { email: string; password: string; name: string }[] = JSON.parse(stored);
        const user = creds.find(c => c.email === email);
        if (user) {
          setProfile({ name: user.name, email: user.email, age: '25', weight: '65', goalWeight: '60', dietary: 'veg', goal: 'weight-loss', profileImage: undefined });
        }
      }
    } catch { /* ignore */ }

    showToast('Welcome back! Logging you in…', 'success');
    setTimeout(() => navigate('/profile'), 900);
  };

  const handleRegister = () => {
    setRNameErr(false); setREmailErr(false); setRPassErr(false);
    if (!rName.trim())         { setRNameErr(true);  showToast('Full name is required.'); return; }
    if (!rEmail.trim())        { setREmailErr(true); showToast('Email address is required.'); return; }
    if (!isValidEmail(rEmail)) { setREmailErr(true); showToast('Invalid email — e.g. you@example.com'); return; }
    if (rPass.length < 6)      { setRPassErr(true);  showToast('Password must be at least 6 characters.'); return; }

    const email = rEmail.trim().toLowerCase();

    // Check if email already registered
    try {
      const stored = localStorage.getItem('eatwell_credentials');
      const creds: { email: string; password: string; name: string }[] = stored ? JSON.parse(stored) : [];
      if (creds.some(c => c.email === email) || email === DEMO_EMAIL) {
        setREmailErr(true);
        showToast('This email is already registered. Please login.');
        return;
      }
      // Save new credentials
      creds.push({ email, password: rPass, name: rName.trim() });
      localStorage.setItem('eatwell_credentials', JSON.stringify(creds));
    } catch { /* ignore */ }

    setRegDone(true);
    setProfile({ name: rName.trim(), email, age: '25', weight: '65', goalWeight: '60', dietary: 'veg', goal: 'weight-loss', profileImage: undefined });
    showToast('Account created! Taking you in…', 'success');
    setTimeout(() => navigate('/profile', { state: { openEdit: true } }), 950);
  };

  const inputStyle = (err: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 44px 13px 40px', borderRadius: 12,
    border: `1.5px solid ${err ? '#FF3B30' : BORDER}`,
    background: err ? '#FFF5F5' : INPUT_BG,
    fontSize: 14, color: TEXT, boxSizing: 'border-box', outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  });

  const strength      = (p: string) => p.length === 0 ? 0 : p.length < 6 ? 1 : p.length < 8 ? 2 : p.length < 11 ? 3 : 4;
  const strengthColor = (p: string) => ['transparent', '#FF3B30', '#FF9500', '#FFC107', PRIMARY][strength(p)];
  const strengthLabel = (p: string) => ['', 'Too short', 'Weak', 'Fair', 'Strong'][strength(p)];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'white', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes toastIn   { from { opacity:0; transform:translateY(-16px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {toast && <Toast key={toast.id} toast={toast} onDismiss={() => setToast(null)} />}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(160deg, ${PRIMARY_LIGHT} 0%, rgba(232,245,233,0.2) 65%, white 100%)`,
        padding: '34px 28px 26px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(76,175,80,0.38)', marginBottom: 12 }}>
          <Leaf size={36} color="white" strokeWidth={1.8} />
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: PRIMARY, letterSpacing: -0.8, lineHeight: 1, marginBottom: 4 }}>EatWell</div>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: '#A5C8A7', letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 6 }}>prod by FuturX</div>
        <div style={{ fontSize: 13, color: '#6A9B6E', lineHeight: 1.4 }}>Your Weekly Food Plan in Minutes</div>
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '6px 18px 28px', overflowY: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ background: 'white', borderRadius: 24, border: `1px solid ${BORDER}`, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#F7F7F7', borderBottom: `1px solid ${BORDER}` }}>
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => switchTab(t)} style={{
                flex: 1, padding: '15px 0', border: 'none', cursor: 'pointer',
                background: tab === t ? 'white' : 'transparent',
                borderBottom: tab === t ? `3px solid ${PRIMARY}` : '3px solid transparent',
                color: tab === t ? PRIMARY : TEXT_MUTED,
                fontWeight: tab === t ? 700 : 500, fontSize: 14, transition: 'all 0.2s',
              }}>
                {t === 'login' ? '🔑  Login' : '✨  Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div key={tab} style={{ padding: '22px 18px 22px', animation: 'fadeSlide 0.25s ease' }}>

            {/* LOGIN */}
            {tab === 'login' && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 3 }}>Welcome back! 👋</div>
                  <div style={{ fontSize: 12.5, color: TEXT_MUTED }}>Log in to your EatWell account</div>
                </div>

                <Field label="Email Address" icon={<Mail size={15} />} error={lEmailErr}>
                  <input type="email" value={lEmail} placeholder="you@example.com"
                    onChange={e => { setLEmail(e.target.value); setLEmailErr(false); }}
                    style={inputStyle(lEmailErr)} />
                </Field>

                <Field label="Password" icon={<Lock size={15} />} error={lPassErr}>
                  <input type={lShowP ? 'text' : 'password'} value={lPass} placeholder="Enter your password"
                    onChange={e => { setLPass(e.target.value); setLPassErr(false); }}
                    style={inputStyle(lPassErr)} />
                  <button onClick={() => setLShowP(!lShowP)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, display: 'flex', padding: 0 }}>
                    {lShowP ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </Field>

                <div style={{ marginBottom: 14, padding: '9px 12px', background: '#F0FFF0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 7, border: '1px solid #C8E6C9' }}>
                  <Info size={13} color={PRIMARY} />
                  <span style={{ fontSize: 11.5, color: '#388E3C' }}>Demo: <strong>user@eatwell.com</strong> · <strong>eatwell123</strong></span>
                </div>

                <div style={{ textAlign: 'right', marginBottom: 18 }}>
                  <button style={{ background: 'none', border: 'none', color: PRIMARY, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: 0 }}>Forgot Password?</button>
                </div>

                <AppButton fullWidth onClick={handleLogin} style={{ padding: '15px' }}>Login</AppButton>
              </>
            )}

            {/* REGISTER */}
            {tab === 'register' && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 3 }}>Create Account ✨</div>
                  <div style={{ fontSize: 12.5, color: TEXT_MUTED }}>Join EatWell and start planning your meals</div>
                </div>

                <Field label="Full Name" icon={<User size={15} />} error={rNameErr}>
                  <input type="text" value={rName} placeholder="e.g. Priya Sharma"
                    onChange={e => { setRName(e.target.value); setRNameErr(false); }}
                    style={inputStyle(rNameErr)} />
                </Field>

                <Field label="Email Address" icon={<Mail size={15} />} error={rEmailErr}>
                  <input type="email" value={rEmail} placeholder="you@example.com"
                    onChange={e => { setREmail(e.target.value); setREmailErr(false); }}
                    style={inputStyle(rEmailErr)} />
                </Field>

                <Field label="Password" icon={<Lock size={15} />} error={rPassErr}>
                  <input type={rShowP ? 'text' : 'password'} value={rPass} placeholder="Min. 6 characters"
                    onChange={e => { setRPass(e.target.value); setRPassErr(false); }}
                    style={inputStyle(rPassErr)} />
                  <button onClick={() => setRShowP(!rShowP)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: TEXT_MUTED, display: 'flex', padding: 0 }}>
                    {rShowP ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </Field>

                {rPass.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: strength(rPass) >= i ? strengthColor(rPass) : BORDER, transition: 'background 0.3s' }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: strengthColor(rPass), fontWeight: 600 }}>{strengthLabel(rPass)}</div>
                  </div>
                )}

                <AppButton fullWidth onClick={handleRegister}
                  icon={regDone ? <Check size={15} /> : undefined}
                  style={{ padding: '15px', background: regDone ? PRIMARY_DARK : PRIMARY, transition: 'background 0.2s' }}>
                  {regDone ? 'Account Created! 🎉' : 'Create My Account'}
                </AppButton>
              </>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 11.5, color: TEXT_MUTED }}>
          By continuing, you agree to our{' '}
          <span style={{ color: PRIMARY, fontWeight: 600 }}>Terms & Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}
