import { ArrowLeft } from 'lucide-react';
import { useColors } from '../context/AppContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, onBack, rightElement }: ScreenHeaderProps) {
  const C = useColors();

  return (
    <div
      style={{
        background: C.card,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0,
        transition: 'background 0.3s',
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: C.inputBg,
            border: `1px solid ${C.border}`,
            cursor: 'pointer',
            color: C.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 7,
            borderRadius: 10,
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          <ArrowLeft size={18} strokeWidth={2.2} />
        </button>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
      {rightElement}
    </div>
  );
}
