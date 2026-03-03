import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Save, RefreshCw, Coffee, Utensils, Moon, Apple,
  Check, Clock, ShoppingCart, ChevronDown, Share2, X,
  Flame, CheckCircle2, Droplets, Plus, Minus, Waves,
} from 'lucide-react';
import { useAppContext, useColors } from '../context/AppContext';
import {
  vegMealPlan, nonVegMealPlan, dayColors, DayMeal,
  vegGroceryList, nonVegGroceryList, motivationalQuotes,
} from '../data/mealPlans';
import { ScreenHeader } from '../components/ScreenHeader';

const PRIMARY       = '#4CAF50';
const PRIMARY_LIGHT = '#E8F5E9';

// ─── Canvas helper ────────────────────────────────────────────────────────────
function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath(); ctx.fill();
}

// ─── Calorie badge ────────────────────────────────────────────────────────────
function KcalBadge({ kcal, accent }: { kcal: number; accent: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      background: `${accent}14`, borderRadius: 6,
      padding: '1px 7px', fontSize: 9, fontWeight: 700, color: accent,
      flexShrink: 0,
    }}>
      <Flame size={8} strokeWidth={2.5} />
      {kcal} kcal
    </span>
  );
}

// ─── Macro pill row ───────────────────────────────────────────────────────────
function MacroRow({ protein, carbs, fat, darkMode }: { protein: number; carbs: number; fat: number; darkMode: boolean }) {
  const pillBase: React.CSSProperties = {
    flex: 1, padding: '8px 6px', borderRadius: 10,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
  };
  const labelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 600 };
  const valStyle: React.CSSProperties = { fontSize: 13, fontWeight: 800 };
  const divider = darkMode ? '#333' : '#F0F0F0';

  return (
    <div style={{
      display: 'flex',
      background: darkMode ? '#252525' : '#FAFAFA',
      borderRadius: 12,
      border: `1px solid ${darkMode ? '#2C2C2C' : '#EBEBEB'}`,
      marginTop: 14, overflow: 'hidden',
    }}>
      <div style={{ ...pillBase, borderRight: `1px solid ${divider}` }}>
        <span style={{ ...labelStyle, color: '#EF5350' }}>🥩 Protein</span>
        <span style={{ ...valStyle, color: darkMode ? '#EFEFEF' : '#1A1A1A' }}>{protein}g</span>
      </div>
      <div style={{ ...pillBase, borderRight: `1px solid ${divider}` }}>
        <span style={{ ...labelStyle, color: '#FF9800' }}>🌾 Carbs</span>
        <span style={{ ...valStyle, color: darkMode ? '#EFEFEF' : '#1A1A1A' }}>{carbs}g</span>
      </div>
      <div style={{ ...pillBase }}>
        <span style={{ ...labelStyle, color: '#FFCA28' }}>🫙 Fat</span>
        <span style={{ ...valStyle, color: darkMode ? '#EFEFEF' : '#1A1A1A' }}>{fat}g</span>
      </div>
    </div>
  );
}

// ─── MealRow ──────────────────────────────────────────────────────────────────
interface MealRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  cookTime: string;
  calories: number;
  accentColor: string;
  isLast?: boolean;
  darkMode: boolean;
}
function MealRow({ icon, label, value, cookTime, calories, accentColor, isLast = false, darkMode }: MealRowProps) {
  const C = darkMode
    ? { text: '#EFEFEF', muted: '#777', border: '#2C2C2C' }
    : { text: '#1A1A1A', muted: '#9E9E9E', border: '#EBEBEB' };
  return (
    <div style={{
      display: 'flex', gap: 11,
      paddingBottom: isLast ? 2 : 12,
      marginBottom: isLast ? 0 : 12,
      borderBottom: isLast ? 'none' : `1px dashed ${C.border}`,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 9,
        background: `${accentColor}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, color: accentColor,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Label row: BREAKFAST · ⏱ 15 min · 🔥 280 kcal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6 }}>
            {label}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            background: `${accentColor}15`, borderRadius: 6,
            padding: '1px 6px', fontSize: 9, fontWeight: 600, color: accentColor,
          }}>
            <Clock size={8} strokeWidth={2.5} />
            {cookTime}
          </span>
          <KcalBadge kcal={calories} accent={accentColor} />
        </div>
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}

// ─── DayCard ──────────────────────────────────────────────────────────────────
interface DayCardProps {
  meal: DayMeal;
  index: number;
  darkMode: boolean;
  completed: boolean;
  onToggleComplete: () => void;
}
function DayCard({ meal, index, darkMode, completed, onToggleComplete }: DayCardProps) {
  const [expanded, setExpanded] = useState(index === 0);
  const colors  = dayColors[meal.day] || { bg: '#F5F5F5', text: '#424242', accent: '#9E9E9E' };
  const cardBg  = darkMode ? '#1E1E1E' : 'white';
  const border  = completed
    ? `1px solid ${colors.accent}55`
    : `1px solid ${darkMode ? '#2C2C2C' : '#EBEBEB'}`;
  const dayTotal = meal.calories.breakfast + meal.calories.lunch + meal.calories.dinner + meal.calories.snacks;

  return (
    <div style={{
      background: cardBg, borderRadius: 20, marginBottom: 12,
      border, overflow: 'hidden',
      boxShadow: completed ? `0 2px 12px ${colors.accent}22` : '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.3s, border 0.3s',
    }}>
      {/* Completion progress stripe */}
      {completed && (
        <div style={{ height: 3, background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}88)` }} />
      )}

      {/* Header row */}
      <div style={{
        background: completed
          ? (darkMode ? `${colors.accent}28` : `${colors.accent}18`)
          : (darkMode ? `${colors.accent}22` : colors.bg),
        padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
        transition: 'background 0.3s',
      }}>
        {/* Day badge */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: colors.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'white', letterSpacing: 0.3 }}>{meal.dayShort}</span>
        </div>

        {/* Day name + calorie total */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: darkMode ? colors.accent : colors.text }}>
            {meal.day}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <Flame size={10} color="#FF7043" strokeWidth={2.5} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#FF7043' }}>
              {dayTotal.toLocaleString()} kcal
            </span>
            <span style={{ fontSize: 10, color: darkMode ? '#666' : '#BDBDBD' }}>/ day</span>
          </div>
        </button>

        {/* Complete toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
          style={{
            background: completed ? colors.accent : (darkMode ? '#2A2A2A' : '#F0F0F0'),
            border: `1.5px solid ${completed ? colors.accent : (darkMode ? '#333' : '#E0E0E0')}`,
            borderRadius: 10, width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          title={completed ? 'Mark as incomplete' : 'Mark as done'}
        >
          <CheckCircle2
            size={16}
            color={completed ? 'white' : (darkMode ? '#555' : '#BDBDBD')}
            strokeWidth={2}
          />
        </button>

        {/* Expand/collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: expanded ? colors.accent : (darkMode ? '#333' : 'white'),
            borderRadius: 8, padding: '3px 10px',
            fontSize: 11, fontWeight: 600,
            color: expanded ? 'white' : (darkMode ? '#aaa' : '#9E9E9E'),
            border: `1px solid ${expanded ? colors.accent : (darkMode ? '#333' : '#EBEBEB')}`,
            cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
        >
          {expanded ? 'Hide' : 'View'}
        </button>
      </div>

      {/* Expanded meals */}
      {expanded && (
        <div style={{ padding: '16px 16px 14px', background: cardBg }}>
          <MealRow
            icon={<Coffee size={14} />} label="Breakfast"
            value={meal.breakfast} cookTime={meal.cookTimes.breakfast}
            calories={meal.calories.breakfast} accentColor="#FF9800" darkMode={darkMode}
          />
          <MealRow
            icon={<Utensils size={14} />} label="Lunch"
            value={meal.lunch} cookTime={meal.cookTimes.lunch}
            calories={meal.calories.lunch} accentColor={PRIMARY} darkMode={darkMode}
          />
          <MealRow
            icon={<Moon size={14} />} label="Dinner"
            value={meal.dinner} cookTime={meal.cookTimes.dinner}
            calories={meal.calories.dinner} accentColor="#5C6BC0" darkMode={darkMode}
          />
          <MealRow
            icon={<Apple size={14} />} label="Snacks"
            value={meal.snacks} cookTime={meal.cookTimes.snacks}
            calories={meal.calories.snacks} accentColor="#EC407A"
            isLast darkMode={darkMode}
          />
          {/* Macro summary */}
          <MacroRow protein={meal.macros.protein} carbs={meal.macros.carbs} fat={meal.macros.fat} darkMode={darkMode} />
        </div>
      )}
    </div>
  );
}

// ─── Weekly Calorie + Macro summary card ──────────────────────────────────────
function CalorieSummaryCard({
  mealPlan, darkMode,
}: { mealPlan: DayMeal[]; darkMode: boolean }) {
  const avgKcal = Math.round(
    mealPlan.reduce((s, d) => s + d.calories.breakfast + d.calories.lunch + d.calories.dinner + d.calories.snacks, 0)
    / mealPlan.length,
  );
  const avgProtein = Math.round(mealPlan.reduce((s, d) => s + d.macros.protein, 0) / mealPlan.length);
  const avgCarbs   = Math.round(mealPlan.reduce((s, d) => s + d.macros.carbs,   0) / mealPlan.length);
  const avgFat     = Math.round(mealPlan.reduce((s, d) => s + d.macros.fat,     0) / mealPlan.length);

  const C = darkMode
    ? { card: '#1E1E1E', border: '#2C2C2C', text: '#EFEFEF', muted: '#777', sub: '#444' }
    : { card: 'white',   border: '#EBEBEB', text: '#1A1A1A', muted: '#9E9E9E', sub: '#F5F5F5' };

  // Macro bar widths (protein + carbs + fat as % of total grams)
  const total = avgProtein + avgCarbs + avgFat || 1;
  const pPct  = Math.round((avgProtein / total) * 100);
  const cPct  = Math.round((avgCarbs   / total) * 100);
  const fPct  = 100 - pPct - cPct;

  return (
    <div style={{
      background: C.card, borderRadius: 20, border: `1px solid ${C.border}`,
      padding: '16px 16px 14px', marginBottom: 14,
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      transition: 'background 0.3s',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #FF7043, #FF5722)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Flame size={17} color="white" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.7 }}>
              Daily Calories
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#FF7043', lineHeight: 1 }}>
                ~{avgKcal.toLocaleString()}
              </span>
              <span style={{ fontSize: 12, color: C.muted }}>kcal / day</span>
            </div>
          </div>
        </div>
        <div style={{
          background: darkMode ? '#2A2A2A' : '#FFF3E0',
          border: `1px solid ${darkMode ? '#3A3A3A' : '#FFE0B2'}`,
          borderRadius: 10, padding: '5px 10px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 10, color: '#FF9800', fontWeight: 700, marginBottom: 1 }}>7-day avg</div>
          <div style={{ fontSize: 11, color: C.muted }}>auto-calculated</div>
        </div>
      </div>

      {/* Macro text row */}
      <div style={{
        display: 'flex', gap: 0,
        background: C.sub, borderRadius: 10, overflow: 'hidden',
        border: `1px solid ${C.border}`,
      }}>
        {[
          { label: 'Protein', value: avgProtein, color: '#EF5350', emoji: '🥩' },
          { label: 'Carbs',   value: avgCarbs,   color: '#FF9800', emoji: '🌾' },
          { label: 'Fat',     value: avgFat,     color: '#FFCA28', emoji: '🫙' },
        ].map((m, i, arr) => (
          <div key={m.label} style={{
            flex: 1, padding: '9px 6px', textAlign: 'center',
            borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{ fontSize: 13 }}>{m.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>{m.value}g</div>
            <div style={{ fontSize: 10, color: m.color, fontWeight: 700, marginTop: 1 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Stacked macro bar */}
      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
          <div style={{ width: `${pPct}%`,  background: '#EF5350', borderRadius: '3px 0 0 3px', transition: 'width 0.5s' }} />
          <div style={{ width: `${cPct}%`,  background: '#FF9800', transition: 'width 0.5s' }} />
          <div style={{ flex: 1,            background: '#FFCA28', borderRadius: '0 3px 3px 0' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 9, color: '#EF5350', fontWeight: 600 }}>Protein {pPct}%</span>
          <span style={{ fontSize: 9, color: '#FF9800', fontWeight: 600 }}>Carbs {cPct}%</span>
          <span style={{ fontSize: 9, color: '#FFCA28', fontWeight: 600 }}>Fat {fPct}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Week progress bar ────────────────────────────────────────────────────────
function WeekProgressBar({
  completed, total, darkMode,
}: { completed: number; total: number; darkMode: boolean }) {
  const pct = (completed / total) * 100;
  const C = darkMode
    ? { bg: '#1E1E1E', border: '#2C2C2C', text: '#EFEFEF', muted: '#666' }
    : { bg: 'white',   border: '#EBEBEB', text: '#1A1A1A', muted: '#9E9E9E' };

  const msg =
    completed === 0 ? 'Start ticking off your days! 💪' :
    completed < 4   ? `Great start — keep going! 🔥` :
    completed < 7   ? `Almost there — ${total - completed} days left! ⚡` :
                      'Week complete — well done! 🎉';

  return (
    <div style={{
      background: C.bg, borderRadius: 18, border: `1px solid ${C.border}`,
      padding: '13px 16px', marginBottom: 14,
      transition: 'background 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Week Progress</span>
        <span style={{
          fontSize: 13, fontWeight: 800,
          color: completed === total ? '#43A047' : PRIMARY,
        }}>
          {completed} / {total} days
        </span>
      </div>

      {/* Bar track */}
      <div style={{
        height: 8, borderRadius: 4,
        background: darkMode ? '#2C2C2C' : '#EBEBEB',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 4,
          background: pct === 100
            ? 'linear-gradient(90deg, #43A047, #1B5E20)'
            : `linear-gradient(90deg, ${PRIMARY}, #66BB6A)`,
          transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: pct > 0 ? '0 0 6px rgba(76,175,80,0.5)' : 'none',
        }} />
      </div>

      {/* Day dots */}
      <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'space-between' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < completed
              ? PRIMARY
              : (darkMode ? '#2C2C2C' : '#EBEBEB'),
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div style={{ fontSize: 11, color: C.muted, marginTop: 6, textAlign: 'center' }}>
        {msg}
      </div>
    </div>
  );
}

// ─── Water Tracker Card ───────────────────────────────────────────────────────
interface WaterTrackerProps {
  weight: number;
  activityLevel: string;
  darkMode: boolean;
}
function WaterTrackerCard({ weight, activityLevel, darkMode }: WaterTrackerProps) {
  // ── Calculate daily goal ──────────────────────────────────────────────────
  const baseML   = (weight || 60) * 33;
  const actBonus = activityLevel === 'high' ? 1000 : activityLevel === 'moderate' ? 500 : 0;
  const goalML   = Math.min(Math.max(Math.round(baseML + actBonus), 2000), 4000);
  const goalL    = (goalML / 1000).toFixed(1);
  const glassML  = 250;
  const goalGlasses = Math.ceil(goalML / glassML);

  const todayKey = `eatwell_water_${new Date().toDateString()}`;
  const [glasses, setGlasses] = useState<number>(() => {
    const saved = localStorage.getItem(todayKey);
    return saved ? parseInt(saved, 10) : 0;
  });

  const updateGlasses = (val: number) => {
    const clamped = Math.max(0, Math.min(val, goalGlasses + 4));
    setGlasses(clamped);
    localStorage.setItem(todayKey, String(clamped));
  };

  const consumedML  = glasses * glassML;
  const consumedL   = (consumedML / 1000).toFixed(1);
  const pct         = Math.min((glasses / goalGlasses) * 100, 100);
  const isDone      = glasses >= goalGlasses;

  const C = darkMode
    ? { card: '#1E1E1E', border: '#2C2C2C', text: '#EFEFEF', muted: '#777', sub: '#1a2a3a' }
    : { card: 'white',   border: '#EBEBEB', text: '#1A1A1A', muted: '#9E9E9E', sub: '#E3F2FD' };

  const WATER_BLUE  = '#29B6F6';
  const WATER_DARK  = '#0288D1';

  // Status message
  const remaining = goalGlasses - glasses;
  const statusMsg =
    glasses === 0  ? `Drink your first glass! 💧` :
    remaining > 0  ? `${remaining} glass${remaining > 1 ? 'es' : ''} more to reach your goal 🚰` :
                     'Daily goal reached! Great job! 🎉';

  // Breakdown tips
  const tips = [
    { time: '7 AM',  label: 'Wake up',       glasses: 1 },
    { time: '10 AM', label: 'Mid-morning',    glasses: 2 },
    { time: '1 PM',  label: 'Lunch',          glasses: 2 },
    { time: '4 PM',  label: 'Afternoon',      glasses: 2 },
    { time: '7 PM',  label: 'Dinner',         glasses: 2 },
    { time: '9 PM',  label: 'Before bed',     glasses: goalGlasses - 9 > 0 ? goalGlasses - 9 : 1 },
  ];

  return (
    <div style={{
      background: C.card, borderRadius: 20, border: `1px solid ${C.border}`,
      marginBottom: 14, overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      transition: 'background 0.3s',
    }}>
      {/* Header */}
      <div style={{
        background: isDone
          ? 'linear-gradient(135deg, #0288D1 0%, #01579B 100%)'
          : 'linear-gradient(135deg, #29B6F6 0%, #0288D1 100%)',
        padding: '14px 16px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Watermark */}
        <div style={{
          position: 'absolute', bottom: -10, right: -6,
          fontSize: 52, fontWeight: 900, letterSpacing: -2,
          color: 'rgba(255,255,255,0.09)', userSelect: 'none',
          pointerEvents: 'none', lineHeight: 1,
        }}>EatWell</div>

        {/* Bubble decorations */}
        <div style={{ position: 'absolute', top: -10, right: -10, width: 55, height: 55, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', top: 20, right: 30, width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Droplets size={18} color="white" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7 }}>
                Daily Water Intake
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  {consumedL}L
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>/ {goalL}L goal</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{glasses}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)' }}>of {goalGlasses} glasses</div>
          </div>
        </div>

        {/* Wave fill bar */}
        <div style={{
          marginTop: 12, height: 8, borderRadius: 4,
          background: 'rgba(255,255,255,0.2)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 4,
            width: `${pct}%`,
            background: 'rgba(255,255,255,0.8)',
            transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: pct > 0 ? '0 0 8px rgba(255,255,255,0.5)' : 'none',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{consumedML} ml consumed</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{Math.round(pct)}%</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>

        {/* Glass dots tracker */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Glasses Tracker (each = 250 ml)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Array.from({ length: Math.max(goalGlasses, glasses) }).map((_, i) => {
              const filled = i < glasses;
              const isGoal = i === goalGlasses - 1;
              return (
                <button
                  key={i}
                  onClick={() => updateGlasses(filled ? i : i + 1)}
                  title={`Glass ${i + 1}`}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: `1.5px solid ${filled ? WATER_BLUE : (darkMode ? '#333' : '#E0E0E0')}`,
                    background: filled
                      ? (i >= goalGlasses ? `${WATER_BLUE}60` : WATER_BLUE)
                      : (darkMode ? '#252525' : '#F5F9FF'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isGoal && !filled ? `0 0 0 2px ${WATER_BLUE}44` : 'none',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                >
                  <Droplets
                    size={14}
                    color={filled ? 'white' : (darkMode ? '#444' : '#BDBDBD')}
                    strokeWidth={filled ? 2.5 : 1.5}
                  />
                  {isGoal && (
                    <div style={{
                      position: 'absolute', top: -4, right: -4,
                      width: 8, height: 8, borderRadius: '50%',
                      background: WATER_DARK, border: '1.5px solid white',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status message */}
        <div style={{
          padding: '9px 12px', borderRadius: 10,
          background: isDone ? 'rgba(41,182,246,0.12)' : (darkMode ? '#1a2535' : '#E3F2FD'),
          border: `1px solid ${isDone ? 'rgba(41,182,246,0.35)' : 'rgba(41,182,246,0.2)'}`,
          marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Waves size={14} color={WATER_BLUE} strokeWidth={2} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: isDone ? WATER_DARK : '#0277BD', fontWeight: isDone ? 700 : 500 }}>
            {statusMsg}
          </span>
        </div>

        {/* + / − controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => updateGlasses(glasses - 1)}
            disabled={glasses === 0}
            style={{
              flex: 1, height: 42, borderRadius: 12,
              background: darkMode ? '#252525' : '#F5F5F5',
              border: `1.5px solid ${darkMode ? '#333' : '#E0E0E0'}`,
              color: glasses === 0 ? (darkMode ? '#444' : '#BDBDBD') : C.text,
              fontSize: 20, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: glasses === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Minus size={16} strokeWidth={2.5} />
          </button>

          <div style={{ textAlign: 'center', minWidth: 70 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: WATER_BLUE, lineHeight: 1 }}>{glasses}</div>
            <div style={{ fontSize: 10, color: C.muted }}>glasses</div>
          </div>

          <button
            onClick={() => updateGlasses(glasses + 1)}
            style={{
              flex: 1, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #29B6F6, #0288D1)',
              border: 'none',
              color: 'white', fontSize: 20, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(41,182,246,0.4)',
              transition: 'all 0.15s',
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Recommended schedule */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Recommended Schedule
          </div>
          <div style={{ display: 'flex', gap: 0, borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}` }}>
            {tips.map((t, i) => (
              <div key={t.time} style={{
                flex: 1, padding: '7px 2px', textAlign: 'center',
                background: darkMode ? '#252525' : '#FAFAFA',
                borderRight: i < tips.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ fontSize: 8, color: WATER_BLUE, fontWeight: 700 }}>{t.time}</div>
                <div style={{ fontSize: 13, margin: '2px 0' }}>💧</div>
                <div style={{ fontSize: 8, color: C.muted, lineHeight: 1.2 }}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation note */}
        <div style={{ marginTop: 10, fontSize: 10, color: C.muted, textAlign: 'center', lineHeight: 1.5 }}>
          Goal = {weight || 60}kg × 33ml{actBonus > 0 ? ` + ${actBonus}ml (${activityLevel} activity)` : ''} = <span style={{ color: WATER_BLUE, fontWeight: 700 }}>{goalML}ml / day</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export function WeeklyResultScreen() {
  const navigate  = useNavigate();
  const { chartForm, profile, darkMode } = useAppContext();
  const C = useColors();

  const [saved,       setSaved]       = useState(false);
  const [groceryOpen, setGroceryOpen] = useState(false);
  const [sharing,     setSharing]     = useState(false);
  const [completed,   setCompleted]   = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

  const mealPlan    = chartForm.dietary === 'non-veg' ? nonVegMealPlan : vegMealPlan;
  const groceryList = chartForm.dietary === 'non-veg' ? nonVegGroceryList : vegGroceryList;
  const useBudget   = chartForm.budgetFriendly;
  const totalCost   = groceryList.reduce((s, i) => s + (useBudget ? i.budgetCost : i.cost), 0);
  const quoteIdx    = new Date().getDay() % motivationalQuotes.length;
  const quote       = motivationalQuotes[quoteIdx];

  const difficultyMeta: Record<string, { emoji: string; label: string }> = {
    easy:     { emoji: '🟢', label: 'Easy'     },
    moderate: { emoji: '🟡', label: 'Moderate' },
    strict:   { emoji: '🔴', label: 'Strict'   },
  };
  const diff = difficultyMeta[chartForm.difficulty || 'moderate'];

  const activityLabel: Record<string, string> = {
    low: 'Low Activity', moderate: 'Moderate Activity', high: 'High Activity',
  };

  const toggleComplete = (day: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  };

  // ── Share as Image ─────────────────────────────────────────────────────────
  const handleShare = async () => {
    setSharing(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        const W = 720, CARD_H = 158, PADDING = 40, HEADER_H = 200, FOOTER_H = 90;
        const H = HEADER_H + mealPlan.length * CARD_H + FOOTER_H;
        const canvas = document.createElement('canvas');
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d')!;

        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#2E7D32'); bg.addColorStop(1, '#1B5E20');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath(); ctx.arc(W - 60, 60, 80, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(60, H - 60, 60, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        fillRoundRect(ctx, PADDING, 24, W - PADDING * 2, 150, 20);
        ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 36px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('🥗 EatWell Weekly Plan', PADDING + 20, 72);
        ctx.font = '22px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.78)';
        ctx.fillText(`${profile.name}  ·  ${chartForm.dietary === 'non-veg' ? 'Non-Veg' : 'Vegetarian'}  ·  ${chartForm.cuisine}`, PADDING + 20, 108);
        ctx.font = '18px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        const avgKcal = Math.round(mealPlan.reduce((s, d) => s + d.calories.breakfast + d.calories.lunch + d.calories.dinner + d.calories.snacks, 0) / mealPlan.length);
        ctx.fillText(`${diff.emoji} ${diff.label}  ·  ~${avgKcal} kcal/day${useBudget ? '  ·  ₹ Budget' : ''}`, PADDING + 20, 142);

        mealPlan.forEach((day, i) => {
          const y = HEADER_H + i * CARD_H;
          const accent = (dayColors[day.day] || { accent: '#4CAF50' }).accent;
          const dayKcal = day.calories.breakfast + day.calories.lunch + day.calories.dinner + day.calories.snacks;
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
          fillRoundRect(ctx, PADDING, y + 4, W - PADDING * 2, CARD_H - 10, 16);
          ctx.fillStyle = accent;
          fillRoundRect(ctx, PADDING + 14, y + 18, 50, 28, 8);
          ctx.fillStyle = 'white'; ctx.font = 'bold 14px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(day.dayShort, PADDING + 39, y + 38);
          ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 20px system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(day.day, PADDING + 76, y + 30);
          ctx.font = '14px system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,152,0,0.9)';
          ctx.fillText(`${dayKcal} kcal`, PADDING + 76, y + 50);
          ctx.font = '16px system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.72)';
          const bp = day.breakfast.length > 50 ? day.breakfast.slice(0, 50) + '…' : day.breakfast;
          const lp = day.lunch.length     > 50 ? day.lunch.slice(0, 50)     + '…' : day.lunch;
          const dp = day.dinner.length    > 50 ? day.dinner.slice(0, 50)    + '…' : day.dinner;
          ctx.fillText(`☀ ${bp}`, PADDING + 14, y + 74);
          ctx.fillText(`🕐 ${lp}`, PADDING + 14, y + 98);
          ctx.fillText(`🌙 ${dp}`, PADDING + 14, y + 122);
        });

        const fy = HEADER_H + mealPlan.length * CARD_H + 16;
        ctx.fillStyle = 'rgba(255,255,255,0.14)';
        fillRoundRect(ctx, PADDING, fy, W - PADDING * 2, 56, 14);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '16px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`"${quote.quote}"  — ${quote.author}`, W / 2, fy + 24);
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillText('EatWell · prod by FuturX', W / 2, fy + 48);

        const link = document.createElement('a');
        link.download = 'eatwell-weekly-plan.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        resolve();
      }, 50);
    });
    setSharing(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, transition: 'background 0.3s' }}>
      <ScreenHeader
        title="Your Weekly Food Chart"
        subtitle={`${chartForm.dietary === 'non-veg' ? '🍗 Non-Veg' : '🥦 Vegetarian'} · ${chartForm.cuisine}`}
        onBack={() => navigate('/create-chart')}
      />

      <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '16px 14px' }}>

        {/* ── Motivational Quote ── */}
        <div style={{
          background: darkMode
            ? 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)'
            : 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
          borderRadius: 18, padding: '16px 18px', marginBottom: 14,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -12, right: -12, width: 60, height: 60, borderRadius: 30, background: 'rgba(255,255,255,0.1)' }} />
          {/* EatWell watermark */}
          <div style={{
            position: 'absolute', bottom: -8, right: -6,
            fontSize: 52, fontWeight: 900, letterSpacing: -2,
            color: 'rgba(255,255,255,0.09)', userSelect: 'none',
            pointerEvents: 'none', lineHeight: 1,
            textShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }}>EatWell</div>
          <div style={{ fontSize: 20, marginBottom: 6 }}>✨</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 6 }}>
            "{quote.quote}"
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>— {quote.author}</div>
        </div>

        {/* ── Summary Banner ── */}
        <div style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, #388E3C 100%)`,
          borderRadius: 20, padding: '16px 18px', marginBottom: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -15, right: 60, width: 70, height: 70, borderRadius: 35, background: 'rgba(255,255,255,0.1)' }} />
          {/* EatWell watermark */}
          <div style={{
            position: 'absolute', bottom: -10, left: -4,
            fontSize: 52, fontWeight: 900, letterSpacing: -2,
            color: 'rgba(255,255,255,0.09)', userSelect: 'none',
            pointerEvents: 'none', lineHeight: 1,
            textShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }}>EatWell</div>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>7-Day Plan · {profile.name}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 6 }}>
              {chartForm.weight}kg → {chartForm.goalWeight}kg
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 9px', borderRadius: 10, fontSize: 11, color: 'white', fontWeight: 600 }}>
                {activityLabel[chartForm.activityLevel] || 'Moderate Activity'}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 9px', borderRadius: 10, fontSize: 11, color: 'white', fontWeight: 600 }}>
                {diff.emoji} {diff.label}
              </span>
              {useBudget && (
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '3px 9px', borderRadius: 10, fontSize: 11, color: 'white', fontWeight: 600 }}>
                  ₹ Budget
                </span>
              )}
            </div>
          </div>
          <div style={{ fontSize: 40, marginLeft: 8 }}>🗓️</div>
        </div>

        {/* ① Daily Calorie + Macro Summary card */}
        <CalorieSummaryCard mealPlan={mealPlan} darkMode={darkMode} />

        {/* ④ Week progress bar */}
        <WeekProgressBar completed={completed.size} total={mealPlan.length} darkMode={darkMode} />

        {/* 💧 Water Intake Tracker */}
        <WaterTrackerCard
          weight={parseFloat(chartForm.weight) || 60}
          activityLevel={chartForm.activityLevel || 'moderate'}
          darkMode={darkMode}
        />

        {/* ── Tip Row ── */}
        <div style={{
          background: darkMode ? 'rgba(76,175,80,0.12)' : PRIMARY_LIGHT,
          borderRadius: 14, padding: '10px 14px', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 8,
          border: `1px solid rgba(76,175,80,0.2)`,
        }}>
          <span style={{ fontSize: 15 }}>💡</span>
          <div style={{ fontSize: 12, color: '#388E3C', lineHeight: 1.4 }}>
            <span style={{ fontWeight: 700 }}>Tip:</span> Tap ✓ on any day to mark it as completed
          </div>
        </div>

        {/* ② ③ Day Cards with calories + macros */}
        {mealPlan.map((meal, idx) => (
          <DayCard
            key={meal.day}
            meal={meal}
            index={idx}
            darkMode={darkMode}
            completed={completed.has(meal.day)}
            onToggleComplete={() => toggleComplete(meal.day)}
          />
        ))}

        {/* ── Grocery List ── */}
        <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: 14, overflow: 'hidden', transition: 'background 0.3s' }}>
          <button
            onClick={() => setGroceryOpen(!groceryOpen)}
            style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', padding: '15px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: PRIMARY_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={16} color={PRIMARY} strokeWidth={2.2} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Weekly Grocery List</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                  Est. cost: <span style={{ color: PRIMARY, fontWeight: 700 }}>₹{totalCost.toLocaleString()}</span>
                  {useBudget && <span style={{ color: '#FF9800', fontWeight: 600 }}> (Budget Mode)</span>}
                </div>
              </div>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: groceryOpen ? PRIMARY_LIGHT : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <ChevronDown size={15} color={groceryOpen ? PRIMARY : C.muted} strokeWidth={2.5}
                style={{ transform: groceryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </button>

          {groceryOpen && (
            <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 16px 16px' }}>
              {groceryList.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < groceryList.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{item.qty}</div>
                  </div>
                  <div style={{ background: useBudget ? 'rgba(255,152,0,0.12)' : PRIMARY_LIGHT, padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700, color: useBudget ? '#FF9800' : PRIMARY }}>
                    ₹{useBudget ? item.budgetCost : item.cost}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '12px 14px', background: useBudget ? 'rgba(255,152,0,0.08)' : PRIMARY_LIGHT, borderRadius: 14, border: `1px solid ${useBudget ? 'rgba(255,152,0,0.25)' : 'rgba(76,175,80,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: useBudget ? '#E65100' : '#2E7D32' }}>
                  Estimated Weekly Total
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: useBudget ? '#FF9800' : PRIMARY }}>
                  ₹{totalCost.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* ── Bottom Action Bar ── */}
      <div style={{ background: C.card, padding: '12px 14px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 7, flexShrink: 0, transition: 'background 0.3s' }}>
        <button onClick={() => navigate('/create-chart')} style={{ flex: 1, padding: '11px 4px', borderRadius: 12, background: darkMode ? '#2A2A2A' : '#F5F5F5', color: C.muted, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <RefreshCw size={13} /> Redo
        </button>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} style={{ flex: 1.6, padding: '11px 4px', borderRadius: 12, background: saved ? '#388E3C' : PRIMARY, color: 'white', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: '0 3px 12px rgba(76,175,80,0.35)', transition: 'background 0.2s ease' }}>
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : 'Save Plan'}
        </button>
        <button onClick={() => { setGroceryOpen(true); setTimeout(() => contentRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 100); }} style={{ flex: 1, padding: '11px 4px', borderRadius: 12, background: darkMode ? '#1B3A1F' : PRIMARY_LIGHT, color: PRIMARY, fontSize: 11, fontWeight: 600, border: `1.5px solid rgba(76,175,80,0.3)`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <ShoppingCart size={13} /> Grocery
        </button>
        <button onClick={handleShare} disabled={sharing} style={{ flex: 1, padding: '11px 4px', borderRadius: 12, background: darkMode ? '#1A2744' : '#E3F2FD', color: '#1565C0', fontSize: 11, fontWeight: 600, border: `1.5px solid rgba(21,101,192,0.25)`, cursor: sharing ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: sharing ? 0.7 : 1, transition: 'opacity 0.2s' }}>
          {sharing ? <X size={13} /> : <Share2 size={13} />}
          {sharing ? '…' : 'Share'}
        </button>
      </div>
    </div>
  );
}