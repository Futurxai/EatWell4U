import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, Sparkles, IndianRupee, Check } from 'lucide-react';
import { useAppContext, useColors } from '../context/AppContext';
import { ScreenHeader } from '../components/ScreenHeader';
import { AppButton } from '../components/AppButton';

const PRIMARY       = '#4CAF50';
const PRIMARY_LIGHT = '#E8F5E9';

function FormField({ label, children, C }: { label: string; children: React.ReactNode; C: ReturnType<typeof useColors> }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.subText, display: 'block', marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Custom Dropdown — stays inside overflow:hidden phone container ── */
function CustomSelect({
  value, onChange, options, inputStyle, muted,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  inputStyle: React.CSSProperties;
  muted: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* Close when clicking outside */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // Use timeout so the same click that opened it doesn't instantly close it
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handler);
    };
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();            // prevent blur race
          setOpen(prev => !prev);
        }}
        style={{
          ...inputStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          textAlign: 'left',
          border: `1.5px solid ${open ? PRIMARY : (inputStyle.border as string)?.replace(/^.+solid /, '') || '#E0E0E0'}`,
          boxShadow: open ? `0 0 0 3px ${PRIMARY}22` : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          padding: '13px 16px',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label ?? 'Select…'}
        </span>
        <ChevronDown
          size={16}
          color={muted}
          style={{ flexShrink: 0, marginLeft: 8, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      {/* Options list */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'white', borderRadius: 14,
          border: `1.5px solid ${PRIMARY}44`,
          boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
          zIndex: 999, overflow: 'hidden',
        }}>
          {options.map((opt, i) => {
            const isActive = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '13px 16px',
                  background: isActive ? PRIMARY_LIGHT : 'white',
                  border: 'none',
                  borderTop: i > 0 ? '1px solid #F0F0F0' : 'none',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  fontSize: 13, color: isActive ? PRIMARY : '#1A1A1A', fontWeight: isActive ? 700 : 400,
                  transition: 'background 0.15s',
                }}
              >
                <span>{opt.label}</span>
                {isActive && <Check size={14} color={PRIMARY} strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const difficultyOptions = [
  { value: 'easy',     emoji: '🟢', label: 'Easy',     desc: 'Simple meals, less prep' },
  { value: 'moderate', emoji: '🟡', label: 'Moderate', desc: 'Balanced complexity' },
  { value: 'strict',   emoji: '🔴', label: 'Strict',   desc: 'Clean, disciplined eating' },
] as const;

export function CreateChartScreen() {
  const navigate = useNavigate();
  const { profile, chartForm, setChartForm } = useAppContext();
  const C = useColors();

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: `1.5px solid ${C.border}`,
    background: C.inputBg,
    fontSize: 14,
    color: C.text,
    boxSizing: 'border-box',
    outline: 'none',
  };

  const [form, setForm] = useState({
    age:           chartForm.age           || profile.age,
    height:        chartForm.height        || '163',
    weight:        chartForm.weight        || profile.weight,
    goalWeight:    chartForm.goalWeight    || profile.goalWeight,
    activityLevel: chartForm.activityLevel || 'moderate',
    dietary:       (chartForm.dietary      || profile.dietary) as 'veg' | 'non-veg',
    cuisine:       chartForm.cuisine       || 'Indian',
    difficulty:    (chartForm.difficulty   || 'moderate') as 'easy' | 'moderate' | 'strict',
    budgetFriendly: chartForm.budgetFriendly ?? false,
  });

  const handleGenerate = () => {
    setChartForm(form as any);
    navigate('/weekly-result');
  };

  const activityOptions = [
    { value: 'low',      label: '🚶 Low – Little or no exercise' },
    { value: 'moderate', label: '🏃 Moderate – Light exercise 3–4x/week' },
    { value: 'high',     label: '🏋️ High – Intense exercise 6–7x/week' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, transition: 'background 0.3s' }}>
      <ScreenHeader title="Create Your Weekly Plan" onBack={() => navigate('/profile')} />

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '18px 16px' }}>

        {/* Tip Banner */}
        <div style={{
          background: PRIMARY_LIGHT, borderRadius: 16, padding: '14px 16px',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
          border: `1px solid rgba(76,175,80,0.2)`,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>🌿</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2E7D32', marginBottom: 2 }}>Personalized Just for You</div>
            <div style={{ fontSize: 12, color: '#558B2F', lineHeight: 1.4 }}>Fill in your details to generate a perfect weekly meal plan</div>
          </div>
        </div>

        {/* Body Details Card */}
        <div style={{ background: C.card, borderRadius: 20, padding: '20px 16px', marginBottom: 14, border: `1px solid ${C.border}`, transition: 'background 0.3s' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>
            Body Details
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <FormField label="Age (yrs)" C={C}>
                <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Height (cm)" C={C}>
                <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <FormField label="Weight (kg)" C={C}>
                <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Goal Wt. (kg)" C={C}>
                <input type="number" value={form.goalWeight} onChange={(e) => setForm({ ...form, goalWeight: e.target.value })} style={inputStyle} />
              </FormField>
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div style={{ background: C.card, borderRadius: 20, padding: '20px 16px', marginBottom: 14, border: `1px solid ${C.border}`, transition: 'background 0.3s' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>
            Preferences
          </div>

          {/* Activity Level — custom dropdown (native select clips in phone mockup) */}
          <FormField label="Activity Level" C={C}>
            <CustomSelect
              value={form.activityLevel}
              onChange={(v) => setForm({ ...form, activityLevel: v })}
              options={activityOptions}
              inputStyle={inputStyle}
              muted={C.muted}
            />
          </FormField>

          {/* Diet Toggle */}
          <FormField label="Dietary Preference" C={C}>
            <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${C.border}` }}>
              {([{ val: 'veg', label: '🥦 Vegetarian' }, { val: 'non-veg', label: '🍗 Non-Veg' }] as { val: 'veg' | 'non-veg'; label: string }[]).map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setForm({ ...form, dietary: opt.val })}
                  style={{
                    flex: 1, padding: '12px 8px', border: 'none', cursor: 'pointer',
                    background: form.dietary === opt.val ? PRIMARY : C.card,
                    color: form.dietary === opt.val ? 'white' : C.muted,
                    fontSize: 13, fontWeight: form.dietary === opt.val ? 700 : 400,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FormField>

          {/* Cuisine */}
          <FormField label="Preferred Cuisine" C={C}>
            <input
              type="text"
              value={form.cuisine}
              onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
              placeholder="e.g. Indian, South Indian"
              style={{ ...inputStyle, marginBottom: 0 }}
            />
          </FormField>
        </div>

        {/* Difficulty + Budget Card */}
        <div style={{ background: C.card, borderRadius: 20, padding: '20px 16px', marginBottom: 24, border: `1px solid ${C.border}`, transition: 'background 0.3s' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>
            Plan Settings
          </div>

          {/* Difficulty Selector */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.subText, marginBottom: 10 }}>
              Difficulty Level
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {difficultyOptions.map((opt) => {
                const active = form.difficulty === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, difficulty: opt.value })}
                    style={{
                      flex: 1, padding: '10px 6px', borderRadius: 12,
                      border: active ? `2px solid ${PRIMARY}` : `1.5px solid ${C.border}`,
                      background: active ? PRIMARY_LIGHT : C.card,
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{opt.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: active ? PRIMARY : C.text }}>{opt.label}</span>
                    <span style={{ fontSize: 10, color: C.muted, textAlign: 'center', lineHeight: 1.3 }}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget-Friendly Toggle */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: form.budgetFriendly ? '#E8F5E9' : C.inputBg,
              border: `1.5px solid ${form.budgetFriendly ? 'rgba(76,175,80,0.4)' : C.border}`,
              borderRadius: 14, padding: '13px 16px', cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setForm({ ...form, budgetFriendly: !form.budgetFriendly })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: form.budgetFriendly ? PRIMARY : C.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}>
                <IndianRupee size={16} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: form.budgetFriendly ? PRIMARY : C.text }}>
                  Budget-Friendly Plan
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                  Optimise for affordable grocery shopping
                </div>
              </div>
            </div>
            {/* Toggle pill */}
            <div style={{
              width: 44, height: 24, borderRadius: 12,
              background: form.budgetFriendly ? PRIMARY : C.border,
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 3, left: form.budgetFriendly ? 22 : 3,
                width: 18, height: 18, borderRadius: 9, background: 'white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <AppButton
          fullWidth
          onClick={handleGenerate}
          icon={<Sparkles size={17} />}
          style={{ padding: '15px', marginBottom: 24 }}
        >
          Generate Weekly Chart
        </AppButton>
      </div>
    </div>
  );
}
