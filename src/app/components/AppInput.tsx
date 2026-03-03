import { ReactNode } from 'react';

const BORDER = '#E8E8E8';
const TEXT = '#1A1A1A';
const INPUT_BG = '#F8F9FA';

interface AppInputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rightElement?: ReactNode;
  style?: React.CSSProperties;
}

export function AppInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  rightElement,
  style,
}: AppInputProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#555',
            display: 'block',
            marginBottom: 7,
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: rightElement ? '13px 46px 13px 16px' : '13px 16px',
            borderRadius: 12,
            border: `1.5px solid ${BORDER}`,
            background: INPUT_BG,
            fontSize: 15,
            color: TEXT,
            boxSizing: 'border-box',
            outline: 'none',
            ...style,
          }}
        />
        {rightElement && (
          <div
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
