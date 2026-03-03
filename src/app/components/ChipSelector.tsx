const PRIMARY = '#4CAF50';
const PRIMARY_LIGHT = '#E8F5E9';
const BORDER = '#E8E8E8';
const TEXT_MUTED = '#9E9E9E';

interface ChipOption {
  value: string;
  label: string;
}

interface ChipSelectorProps {
  options: ChipOption[];
  selected: string;
  onSelect: (val: string) => void;
}

export function ChipSelector({ options, selected, onSelect }: ChipSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              padding: '8px 20px',
              borderRadius: 22,
              border: `1.5px solid ${isSelected ? PRIMARY : BORDER}`,
              background: isSelected ? PRIMARY_LIGHT : 'white',
              color: isSelected ? PRIMARY : TEXT_MUTED,
              fontSize: 13,
              fontWeight: isSelected ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
