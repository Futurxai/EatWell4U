import { useNavigate, useLocation } from 'react-router';
import { User, CalendarDays, BarChart3 } from 'lucide-react';
import { useColors, useAppContext } from '../context/AppContext';

const PRIMARY = '#4CAF50';

const TABS = [
  { path: '/profile',       label: 'Profile',  icon: User,         accent: PRIMARY    },
  { path: '/create-chart',  label: 'Plan',     icon: CalendarDays, accent: '#FF9800'  },
  { path: '/weekly-result', label: 'Results',  icon: BarChart3,    accent: '#E040FB'  },
];

export function BottomNav() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const C         = useColors();
  const { darkMode } = useAppContext();

  return (
    <div style={{
      display: 'flex',
      height: 60,
      background: darkMode ? '#1A1A1A' : '#FFFFFF',
      borderTop: `1px solid ${C.border}`,
      flexShrink: 0,
      boxShadow: darkMode
        ? '0 -4px 16px rgba(0,0,0,0.4)'
        : '0 -4px 16px rgba(0,0,0,0.07)',
      zIndex: 100,
      // Safe-area for phones with home indicator
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {TABS.map(({ path, label, icon: Icon, accent }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              position: 'relative',
              transition: 'opacity 0.15s',
            }}
          >
            {/* Active indicator dot */}
            {active && (
              <div style={{
                position: 'absolute',
                top: 6,
                width: 4,
                height: 4,
                borderRadius: 2,
                background: accent,
              }} />
            )}
            <div style={{
              width: 42,
              height: 28,
              borderRadius: 14,
              background: active ? `${accent}18` : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}>
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 1.8}
                color={active ? accent : C.muted}
              />
            </div>
            <span style={{
              fontSize: 10.5,
              fontWeight: active ? 700 : 500,
              color: active ? accent : C.muted,
              letterSpacing: 0.2,
              transition: 'color 0.2s',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
