import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  LogIn, User, CalendarDays, BarChart3,
  Leaf, ChevronLeft, ChevronRight,
  Moon, Sun,
} from 'lucide-react';
import { useEffect } from 'react';
import { useAppContext, useColors } from './context/AppContext';
import { BottomNav } from './components/BottomNav';

const PRIMARY      = '#4CAF50';
const PRIMARY_DARK = '#388E3C';
const SIDEBAR_W    = 260;

const NAV_ITEMS = [
  { path: '/',              label: 'Login',         icon: LogIn,        accent: '#4CAF50', tag: 'Entry'    },
  { path: '/profile',       label: 'My Profile',    icon: User,         accent: '#29B6F6', tag: 'Personal' },
  { path: '/create-chart',  label: 'Create Chart',  icon: CalendarDays, accent: '#FF9800', tag: 'Builder'  },
  { path: '/weekly-result', label: 'Weekly Result', icon: BarChart3,    accent: '#E040FB', tag: 'Result'   },
];

/* ═══════════════════════════════════════════════════════════════════
   SIDEBAR  — top-level component (NOT nested inside Root!)
   Receives all needed values via props so it never needs its own
   context call and React never sees a "new type" on re-render.
═══════════════════════════════════════════════════════════════════ */
interface SidebarProps {
  drawerOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

function AppSidebar({
  drawerOpen, onClose, darkMode, onToggleDark, currentPath, onNavigate,
}: SidebarProps) {
  const border  = darkMode ? '#242424' : '#E8EEEA';
  const panel   = darkMode ? '#141414' : '#FFFFFF';
  const text    = darkMode ? '#EFEFEF' : '#1A1A1A';
  const muted   = darkMode ? '#666'    : '#9E9E9E';
  const sub     = darkMode ? '#252525' : '#F2F2F2';
  const overlay = darkMode ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.35)';

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: overlay, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        width: SIDEBAR_W,
        transform: drawerOpen ? 'translateX(0)' : `translateX(-${SIDEBAR_W}px)`,
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        background: panel, borderRight: `1px solid ${border}`,
        display: 'flex', flexDirection: 'column',
        boxShadow: drawerOpen
          ? (darkMode ? '8px 0 32px rgba(0,0,0,.7)' : '8px 0 32px rgba(76,175,80,.14)')
          : 'none',
      }}>
        {/* Brand */}
        <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(76,175,80,.4)' }}>
              <Leaf size={19} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: PRIMARY, letterSpacing: -0.5, lineHeight: 1 }}>EatWell</div>
              <div style={{ fontSize: 9, color: muted, fontWeight: 600, letterSpacing: 0.5, marginTop: 2 }}>prod by FuturX</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 9, background: sub, border: `1px solid ${border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted }}>
            <ChevronLeft size={15} strokeWidth={2.5} />
          </button>
        </div>

        <div style={{ padding: '14px 16px 6px', fontSize: 9.5, fontWeight: 800, color: muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
          Navigation
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '6px 10px' }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon, accent, tag }) => {
            const active = currentPath === path;
            return (
              <button
                key={path}
                onClick={() => onNavigate(path)}
                style={{
                  width: '100%', marginBottom: 4, padding: '10px', borderRadius: 12,
                  background: active ? `${accent}18` : 'transparent',
                  border: `1.5px solid ${active ? accent + '44' : 'transparent'}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  textAlign: 'left', transition: 'all 0.18s',
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                  background: active ? accent : sub,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: active ? 'white' : muted,
                  boxShadow: active ? `0 3px 10px ${accent}44` : 'none',
                  transition: 'all 0.18s',
                }}>
                  <Icon size={18} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: active ? 700 : 600, color: active ? accent : text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.4, padding: '1px 5px', borderRadius: 4, background: active ? `${accent}22` : sub, color: active ? accent : muted }}>
                    {tag}
                  </span>
                </div>
                {active && <ChevronRight size={12} color={accent} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>

        {/* Dark mode toggle */}
        <div style={{ padding: '10px', borderTop: `1px solid ${border}`, flexShrink: 0 }}>
          <button
            onClick={onToggleDark}
            style={{ width: '100%', padding: '10px', borderRadius: 12, border: `1px solid ${border}`, background: darkMode ? '#1E1E1E' : '#F5F5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {darkMode ? <Moon size={15} color="#AB47BC" strokeWidth={2} /> : <Sun size={15} color="#FF9800" strokeWidth={2} />}
              <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div style={{ width: 34, height: 20, borderRadius: 10, background: darkMode ? '#AB47BC' : '#E0E0E0', position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: darkMode ? 16 : 3, width: 14, height: 14, borderRadius: 7, background: 'white', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
            </div>
          </button>
        </div>

        <div style={{ padding: '8px 16px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: muted }}>EatWell v1.0 · FuturX © 2026</div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT  — layout shell
═══════════════════════════════════════════════════════════════════ */
export function Root() {
  const { darkMode, setDarkMode, drawerOpen, setDrawerOpen } = useAppContext();
  const C        = useColors();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginScreen = location.pathname === '/';

  // Close sidebar whenever the user navigates
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  /* colour tokens */
  const topPanel  = darkMode ? '#141414' : '#FFFFFF';
  const topBorder = darkMode ? '#242424' : '#E8EEEA';
  const topText   = darkMode ? '#EFEFEF' : '#1A1A1A';
  const topMuted  = darkMode ? '#666'    : '#9E9E9E';
  const mainBg    = darkMode ? '#0D0D0D' : '#ECF3EC';

  const currentRoute = NAV_ITEMS.find(n => n.path === location.pathname);

  return (
    <div
      className="app-shell flex flex-col overflow-hidden"
      style={{ fontFamily: 'system-ui,-apple-system,BlinkMacSystemFont,sans-serif' }}
    >
      {/* ── Desktop top bar (hidden on mobile via CSS) ─────────── */}
      <header
        className="hidden md:flex items-center shrink-0 px-6 gap-4"
        style={{
          height: 56, zIndex: 30,
          background: topPanel,
          borderBottom: `1px solid ${topBorder}`,
          boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,.4)' : '0 2px 10px rgba(0,0,0,.07)',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(76,175,80,.35)' }}>
            <Leaf size={16} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: PRIMARY, letterSpacing: -0.4, lineHeight: 1 }}>EatWell</div>
            <div style={{ fontSize: 8.5, color: topMuted, letterSpacing: 0.5 }}>prod by FuturX</div>
          </div>
        </div>

        {/* Breadcrumb */}
        {currentRoute && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 1, height: 20, background: topBorder }} />
            <ChevronRight size={13} color={topMuted} />
            <span style={{ fontSize: 13, fontWeight: 600, color: topText }}>{currentRoute.label}</span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {!isLoginScreen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${PRIMARY}15`, border: `1px solid ${PRIMARY}30` }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: PRIMARY }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: PRIMARY }}>Active</span>
          </div>
        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ width: 36, height: 36, borderRadius: 10, background: darkMode ? '#252525' : '#F2F2F2', border: `1px solid ${topBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: darkMode ? '#FFD54F' : '#666' }}
        >
          {darkMode ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
        </button>
      </header>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Sidebar overlay — desktop only, not on login */}
        {!isLoginScreen && (
          <AppSidebar
            drawerOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode(!darkMode)}
            currentPath={location.pathname}
            onNavigate={(path) => { navigate(path); setDrawerOpen(false); }}
          />
        )}

        {/* ── Content column ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── Screen area ─────────────────────────────────────
              Mobile  : full width, fills height
              Desktop : centred column  (login = card, others = column)
          ──────────────────────────────────────────────────── */}
          <div
            className={[
              'flex-1 overflow-hidden flex flex-col relative',
              isLoginScreen
                ? 'md:flex-row md:items-center md:justify-center'
                : 'md:flex-row md:items-stretch md:justify-center',
            ].join(' ')}
            style={{ background: C.bg }}
          >
            {/* Desktop bg overlay */}
            <div
              className={[
                'hidden md:block absolute inset-0 pointer-events-none',
                isLoginScreen
                  ? (darkMode ? 'desktop-login-bg-dark' : 'desktop-login-bg')
                  : '',
              ].join(' ')}
              style={!isLoginScreen ? { background: mainBg } : undefined}
            />

            {/* Screen wrapper */}
            <div
              className={[
                'relative z-10 w-full flex-1 flex flex-col overflow-hidden',
                isLoginScreen
                  ? 'md:flex-none md:w-[440px] md:max-h-[760px] md:rounded-[32px] md:shadow-2xl md:my-4'
                  : 'md:max-w-[520px] md:shadow-xl',
              ].join(' ')}
              style={{ background: C.bg, transition: 'background 0.3s' }}
            >
              <Outlet />
            </div>
          </div>

          {/* ── Bottom nav (mobile only) ─────────────────────── */}
          {!isLoginScreen && (
            <div className="md:hidden shrink-0">
              <BottomNav />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
