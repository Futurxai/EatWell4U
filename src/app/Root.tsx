import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  LogIn, User, CalendarDays, BarChart3, Leaf,
  ChevronRight, Moon, Sun, Menu,
} from 'lucide-react';
import { useEffect } from 'react';
import { useAppContext, useColors, useIsMobile } from './context/AppContext';
import { BottomNav } from './components/BottomNav';

const PRIMARY      = '#4CAF50';
const PRIMARY_DARK = '#388E3C';
const GOLD         = '#FFC107';
const SIDEBAR_W    = 352;

/* Generic icon component type — avoids "as typeof User" casts */
type IconComp = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}>;

/* ─── Nav items ─────────────────────────────────────────────── */
const NAV_ITEMS: {
  path: string;
  label: string;
  desc: string;
  icon: IconComp;
  accent: string;
  tag: string;
}[] = [
  { path: '/',              label: 'Login',            desc: 'Sign in or create your acco...', icon: LogIn,        accent: '#4CAF50', tag: 'Entry'    },
  { path: '/profile',       label: 'My Profile',       desc: 'Name, weight, dietary g...',     icon: User,         accent: '#29B6F6', tag: 'Personal' },
  { path: '/create-chart',  label: 'Create Food Chart',desc: 'Configure your weekly m...',     icon: CalendarDays, accent: '#FF9800', tag: 'Builder'  },
  { path: '/weekly-result', label: 'Weekly Result',    desc: 'Meals, calories, macros & ...', icon: BarChart3,    accent: '#E040FB', tag: 'Result'   },
];

/* ─── Per-screen "Now Viewing" details ──────────────────────── */
interface ScreenDetail {
  label: string;
  desc: string;
  accent: string;
  Icon: IconComp;
  features: { emoji: string; text: string }[];
}

const SCREEN_INFO: Record<string, ScreenDetail> = {
  '/': {
    label: 'Login', desc: 'Sign in or create your account',
    accent: '#4CAF50', Icon: LogIn,
    features: [
      { emoji: '📧', text: 'Email & password login' },
      { emoji: '✨', text: 'Register with name & email' },
      { emoji: '🔑', text: 'Demo credentials included' },
      { emoji: '💾', text: 'Session saved locally' },
    ],
  },
  '/profile': {
    label: 'My Profile', desc: 'Name, weight, dietary goal & photo',
    accent: '#29B6F6', Icon: User,
    features: [
      { emoji: '🖼️', text: 'Profile photo (compressed)' },
      { emoji: '⚖️', text: 'Weight & goal weight' },
      { emoji: '🥦', text: 'Dietary preference' },
      { emoji: '✏️', text: 'Edit via pencil icon' },
    ],
  },
  '/create-chart': {
    label: 'Create Food Chart', desc: 'Configure your weekly meal plan',
    accent: '#FF9800', Icon: CalendarDays,
    features: [
      { emoji: '📏', text: 'Body details & height' },
      { emoji: '🏃', text: 'Activity level selector' },
      { emoji: '🍽️', text: 'Cuisine & difficulty' },
      { emoji: '💰', text: 'Budget-friendly option' },
    ],
  },
  '/weekly-result': {
    label: 'Weekly Result', desc: 'Meals, calories, macros & more',
    accent: '#E040FB', Icon: BarChart3,
    features: [
      { emoji: '📅', text: '7-day meal plan' },
      { emoji: '🔥', text: 'Calorie & macro tracking' },
      { emoji: '💧', text: 'Water intake tracker' },
      { emoji: '📤', text: 'Save & share chart' },
    ],
  },
};

const APP_FEATURES = [
  { emoji: '🔥', text: 'Calorie tracking', bg: '#FFF3E0' },
  { emoji: '💧', text: 'Water intake',     bg: '#E1F5FE' },
  { emoji: '🥬', text: 'Veg & Non-veg',   bg: '#E8F5E9' },
  { emoji: '✨', text: 'Smart meal plan',  bg: '#EDE7F6' },
];

/* ════════════════════════════════════════════════════════════════
   APP SIDEBAR
   Props come from Root so AppSidebar never needs to call
   useNavigate / useLocation itself — safe under HMR isolation.
════════════════════════════════════════════════════════════════ */
interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

function AppSidebar({ currentPath, onNavigate }: SidebarProps) {
  const { drawerOpen, setDrawerOpen, darkMode, setDarkMode } = useAppContext();

  const bg      = darkMode ? '#111111' : '#FFFFFF';
  const border  = darkMode ? '#242424' : '#EBEBEB';
  const text    = darkMode ? '#EFEFEF' : '#1A1A1A';
  const muted   = darkMode ? '#666666' : '#9E9E9E';
  const sub     = darkMode ? '#252525' : '#F5F5F5';
  const cardBg  = darkMode ? '#1A1A1A' : '#F8F8F8';
  const greenBg = darkMode ? '#0F1F0F' : '#EBF5EB';
  const greenBd = darkMode ? '#1A3A1A' : '#C8E6C9';

  const screenInfo: ScreenDetail =
    SCREEN_INFO[currentPath] ?? SCREEN_INFO['/profile'];

  const goTo = (path: string) => {
    onNavigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        width: SIDEBAR_W,
        transform: drawerOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_W}px)`,
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        background: bg,
        borderRight: `1px solid ${border}`,
        display: 'flex', flexDirection: 'column',
        boxShadow: drawerOpen ? '8px 0 40px rgba(0,0,0,0.18)' : 'none',
        overflowY: 'auto',
        scrollbarWidth: 'none',
      }}>

        {/* ── BRAND HEADER ──────────────────────────── */}
        <div style={{ padding: '24px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 16, flexShrink: 0,
              background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(76,175,80,0.40)',
            }}>
              <Leaf size={26} color="white" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: PRIMARY, letterSpacing: -0.6, lineHeight: 1.05 }}>
                EatWell
              </div>
              <div style={{ width: 38, height: 3, borderRadius: 2, background: GOLD, margin: '5px 0 4px' }} />
              <div style={{ fontSize: 11.5, color: muted, fontWeight: 500 }}>prod by FuturX</div>
            </div>
          </div>
          <p style={{ margin: '14px 0 0', fontSize: 13, color: muted, lineHeight: 1.55 }}>
            Weekly Food Chart Maker — plan smarter, eat better.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: border, margin: '16px 0 12px' }} />

        {/* ── SCREENS ───────────────────────────────── */}
        <div style={{ padding: '0 22px' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 800, color: muted,
            letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 10,
          }}>
            Screens
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {NAV_ITEMS.map(({ path, label, desc, icon: Icon, accent, tag }) => {
              const active = currentPath === path;
              return (
                <button
                  key={path}
                  onClick={() => goTo(path)}
                  style={{
                    width: '100%', padding: '11px 12px', borderRadius: 14,
                    background: active ? `${accent}14` : 'transparent',
                    border: `1.5px solid ${active ? accent + '40' : 'transparent'}`,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 12,
                    textAlign: 'left',
                    transition: 'background 0.18s, border-color 0.18s',
                  }}
                >
                  {/* Icon square */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                    background: active ? accent : sub,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: active ? `0 4px 14px ${accent}44` : 'none',
                    transition: 'background 0.18s',
                  }}>
                    <Icon size={20} strokeWidth={2} color={active ? 'white' : muted} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: active ? accent : text, lineHeight: 1.2 }}>
                      {label}
                    </div>
                    {active && (
                      <div style={{ width: 28, height: 2.5, borderRadius: 1.5, background: GOLD, margin: '4px 0 3px' }} />
                    )}
                    <div style={{
                      fontSize: 11.5, color: muted,
                      marginTop: active ? 0 : 3,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {desc}
                    </div>
                  </div>

                  {/* Tag */}
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.3,
                    padding: '3px 8px', borderRadius: 7, flexShrink: 0,
                    background: active ? `${accent}20` : (darkMode ? '#2A2A2A' : '#EEEEEE'),
                    color: active ? accent : muted,
                  }}>
                    {tag}
                  </span>

                  <ChevronRight size={14} strokeWidth={2.5} color={active ? accent : muted} style={{ flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── NOW VIEWING card ──────────────────────── */}
        <div style={{
          margin: '16px 14px 0',
          background: cardBg, borderRadius: 18,
          border: `1px solid ${border}`, overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{ padding: '12px 16px 8px', fontSize: 10.5, fontWeight: 800, color: muted, letterSpacing: 1.3, textTransform: 'uppercase' }}>
            Now Viewing
          </div>

          {/* Current screen highlight */}
          <div style={{
            margin: '0 12px 10px', padding: '10px 12px',
            background: `${screenInfo.accent}14`, borderRadius: 13,
            border: `1px solid ${screenInfo.accent}35`,
            display: 'flex', alignItems: 'center', gap: 11,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: screenInfo.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 3px 10px ${screenInfo.accent}44`,
            }}>
              <screenInfo.Icon size={19} color="white" strokeWidth={2} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: screenInfo.accent, lineHeight: 1.2 }}>
                {screenInfo.label}
              </div>
              <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{screenInfo.desc}</div>
            </div>
          </div>

          {/* Feature bullets */}
          <div style={{ padding: '2px 16px 14px' }}>
            {screenInfo.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{f.emoji}</span>
                <span style={{ fontSize: 12.5, color: muted }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── APP FEATURES card ─────────────────────── */}
        <div style={{
          margin: '12px 14px 0',
          background: greenBg, borderRadius: 18,
          border: `1px solid ${greenBd}`, overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{ padding: '12px 16px 8px', fontSize: 10.5, fontWeight: 800, color: darkMode ? '#66BB6A' : '#388E3C', letterSpacing: 1.3, textTransform: 'uppercase' }}>
            App Features
          </div>
          {APP_FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 13,
              padding: '9px 16px',
              borderTop: `1px solid ${darkMode ? greenBd + '88' : greenBd}`,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: darkMode ? 'rgba(255,255,255,0.08)' : f.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15,
              }}>
                {f.emoji}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: text }}>
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* ── Dark / Light mode toggle ──────────────── */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{
            margin: '12px 14px 0', padding: '14px 16px',
            background: darkMode ? '#1E1E1E' : '#F5F5F5',
            borderRadius: 16, border: `1px solid ${border}`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            {darkMode
              ? <Moon size={18} color="#AB47BC" strokeWidth={2} />
              : <Sun  size={18} color="#FF9800" strokeWidth={2} />}
            <span style={{ fontSize: 15, fontWeight: 600, color: text }}>
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <div style={{
            width: 44, height: 26, borderRadius: 13, flexShrink: 0,
            background: darkMode ? '#AB47BC' : '#CCCCCC',
            position: 'relative', transition: 'background 0.25s',
          }}>
            <div style={{
              position: 'absolute', top: 3,
              left: darkMode ? 20 : 3,
              width: 20, height: 20, borderRadius: 10, background: 'white',
              boxShadow: '0 1px 5px rgba(0,0,0,0.25)',
              transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 16px 22px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: muted }}>EatWell v1.0 · FuturX © 2026</div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ROOT LAYOUT
═══════════════════════════════════════════════════════════════ */
export function Root() {
  const { darkMode, setDarkMode, drawerOpen, setDrawerOpen } = useAppContext();
  const C        = useColors();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const currentPath   = location.pathname;
  const isLoginScreen = currentPath === '/';

  useEffect(() => { setDrawerOpen(false); }, [currentPath]);

  const FF = 'system-ui,-apple-system,BlinkMacSystemFont,sans-serif';

  /* ── MOBILE ──────────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div style={{
        height: '100dvh',
        display: 'flex', flexDirection: 'column',
        background: C.bg, fontFamily: FF, overflow: 'hidden',
      }}>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
        {!isLoginScreen && <BottomNav />}
      </div>
    );
  }

  /* ── DESKTOP ─────────────────────────────────────────────────── */
  const mainBg    = darkMode ? '#0D0D0D' : '#ECF3EC';
  const topPanel  = darkMode ? '#141414' : '#FFFFFF';
  const topBorder = darkMode ? '#242424' : '#E8EEEA';
  const topMuted  = darkMode ? '#666'    : '#9E9E9E';
  const topText   = darkMode ? '#EFEFEF' : '#1A1A1A';

  const currentNav = NAV_ITEMS.find(n => n.path === currentPath);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: mainBg, fontFamily: FF }}>

      {/* ── Top app bar ─────────────────────────────── */}
      <header style={{
        height: 56, flexShrink: 0,
        background: topPanel, borderBottom: `1px solid ${topBorder}`,
        boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,.5)' : '0 2px 10px rgba(0,0,0,.07)',
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px',
        position: 'sticky', top: 0, zIndex: 30,
      }}>

        {/* Hamburger */}
        {!isLoginScreen && (
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            title="Open navigation menu"
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: drawerOpen ? `${PRIMARY}18` : (darkMode ? '#252525' : '#F2F2F2'),
              border: `1px solid ${drawerOpen ? PRIMARY + '50' : topBorder}`,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: drawerOpen ? PRIMARY : topMuted, transition: 'all 0.2s',
            }}
          >
            <Menu size={18} strokeWidth={2} />
          </button>
        )}

        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0, cursor: isLoginScreen ? 'default' : 'pointer' }}
          onClick={() => !isLoginScreen && navigate('/profile')}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(76,175,80,.35)',
          }}>
            <Leaf size={15} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: PRIMARY, letterSpacing: -0.4, lineHeight: 1 }}>EatWell</div>
            <div style={{ fontSize: 8, color: topMuted, letterSpacing: 0.5 }}>prod by FuturX</div>
          </div>
        </div>

        {/* Breadcrumb */}
        {currentNav && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 1, height: 18, background: topBorder }} />
            <ChevronRight size={12} color={topMuted} />
            <span style={{ fontSize: 13, fontWeight: 600, color: topText }}>{currentNav.label}</span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Active badge */}
        {!isLoginScreen && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 20,
            background: `${PRIMARY}15`, border: `1px solid ${PRIMARY}30`,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: PRIMARY }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: PRIMARY }}>Active</span>
          </div>
        )}

        {/* Dark mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: darkMode ? '#252525' : '#F2F2F2',
            border: `1px solid ${topBorder}`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {darkMode
            ? <Sun  size={16} strokeWidth={2} color="#FFD54F" />
            : <Moon size={16} strokeWidth={2} color="#666" />}
        </button>
      </header>

      {/* Sidebar — only outside login; navigate passed as prop (no router hooks inside AppSidebar) */}
      {!isLoginScreen && (
        <AppSidebar
          currentPath={currentPath}
          onNavigate={navigate}
        />
      )}

      {/* Centred content column */}
      <div style={{
        flex: 1, display: 'flex',
        justifyContent: 'center',
        alignItems: isLoginScreen ? 'center' : 'flex-start',
        padding: isLoginScreen ? '24px' : '0',
        minHeight: isLoginScreen ? 'calc(100vh - 56px)' : undefined,
      }}>
        <div style={{
          width: isLoginScreen ? '440px' : '520px',
          maxWidth: '100%',
          height: isLoginScreen ? undefined : 'calc(100vh - 56px)',
          maxHeight: isLoginScreen ? '760px' : undefined,
          borderRadius: isLoginScreen ? 32 : 0,
          overflow: 'hidden',
          boxShadow: darkMode ? '0 8px 48px rgba(0,0,0,0.6)' : '0 8px 48px rgba(0,0,0,0.12)',
          background: C.bg,
          display: 'flex', flexDirection: 'column',
          transition: 'background 0.3s',
          position: isLoginScreen ? undefined : 'sticky',
          top: isLoginScreen ? undefined : 56,
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}