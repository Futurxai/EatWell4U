import { ReactNode } from 'react';

const PRIMARY = '#4CAF50';

interface AppButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'soft';
  fullWidth?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function AppButton({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  icon,
  disabled = false,
  style,
}: AppButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: '13px 20px',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    letterSpacing: 0.2,
    transition: 'all 0.15s ease',
    opacity: disabled ? 0.6 : 1,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: PRIMARY,
      color: 'white',
      boxShadow: '0 4px 18px rgba(76,175,80,0.35)',
    },
    outline: {
      background: 'white',
      color: PRIMARY,
      border: `2px solid ${PRIMARY}`,
    },
    ghost: {
      background: 'transparent',
      color: PRIMARY,
    },
    soft: {
      background: '#E8F5E9',
      color: PRIMARY,
      border: 'none',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
    >
      {icon && icon}
      {children}
    </button>
  );
}
