import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LogOut, CalendarDays, Edit2, Scale, Target, User, Check, X, Camera, Moon, Sun, Menu } from 'lucide-react';
import { useAppContext, useColors, useIsMobile } from '../context/AppContext';
import { ChipSelector } from '../components/ChipSelector';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';

const PRIMARY = '#4CAF50';
const PRIMARY_LIGHT = '#E8F5E9';
const TEXT = '#1A1A1A';
const TEXT_MUTED = '#9E9E9E';
const BORDER = '#EBEBEB';

/** Resize + compress an image dataURL to ≤ maxPx on longest side, JPEG quality q */
function compressImage(dataUrl: string, maxPx = 300, quality = 0.72): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width: w, height: h } = img;
      if (w > maxPx || h > maxPx) {
        if (w >= h) { h = Math.round((h * maxPx) / w); w = maxPx; }
        else        { w = Math.round((w * maxPx) / h); h = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl); // fallback: keep original
    img.src = dataUrl;
  });
}

function StatCard({
  icon,
  label,
  value,
  unit,
  color = PRIMARY,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color?: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: 'white',
        borderRadius: 16,
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: TEXT,
          lineHeight: 1,
        }}
      >
        {value}
        <span style={{ fontSize: 11, fontWeight: 500, color: TEXT_MUTED, marginLeft: 2 }}>
          {unit}
        </span>
      </div>
      <div style={{ fontSize: 11, color: TEXT_MUTED }}>{label}</div>
    </div>
  );
}

export function ProfileScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, setProfile, darkMode, setDarkMode, setDrawerOpen } = useAppContext();
  const C = useColors();
  const isMobile = useIsMobile();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-open edit sheet when navigated from Create Account
  useEffect(() => {
    if ((location.state as { openEdit?: boolean })?.openEdit) {
      // slight delay so the screen mounts fully before sliding up the sheet
      const t = setTimeout(() => {
        setEditData({ ...profile });
        setIsEditing(true);
      }, 350);
      return () => clearTimeout(t);
    }
  }, []);

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const editInitials = editData.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const openEdit = () => {
    // Always re-sync editData from the latest saved profile
    setEditData({ ...profile });
    setIsEditing(true);
  };

  const closeEdit = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile({ ...editData });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsEditing(false);
    }, 900);
  };

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // allow re-picking same file

    setCompressing(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const raw = ev.target?.result as string;
      // Compress: max 300×300 px, JPEG 0.72 → typically < 25 KB as base64
      const compressed = await compressImage(raw, 300, 0.72);
      setEditData((prev) => ({ ...prev, profileImage: compressed }));
      setCompressing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setEditData((prev) => ({ ...prev, profileImage: undefined }));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, position: 'relative', overflow: 'hidden', transition: 'background 0.3s' }}>
      {/* Header */}
      <div
        style={{
          background: C.card,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
          transition: 'background 0.3s',
        }}
      >
        {/* Left side: hamburger (desktop) or spacer (mobile) */}
        {isMobile ? (
          <div style={{ width: 38 }} />
        ) : (
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              width: 38, height: 38, borderRadius: 11,
              background: `linear-gradient(135deg, #4CAF50, #388E3C)`,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(76,175,80,0.35)',
            }}
            title="Open navigation"
          >
            <Menu size={18} color="white" strokeWidth={2.5} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Dark mode quick toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: darkMode ? '#2A2A2A' : '#F5F5F5',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 8, borderRadius: 10,
              color: darkMode ? '#FFD54F' : '#666',
              transition: 'all 0.2s',
            }}
          >
            {darkMode ? <Sun size={17} strokeWidth={2.2} /> : <Moon size={17} strokeWidth={2.2} />}
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#FFF0F0', border: 'none', cursor: 'pointer',
              color: '#E53935', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 8, borderRadius: 10,
            }}
          >
            <LogOut size={17} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '20px 16px 48px' }}>
        {/* Profile Avatar Card */}
        <div
          style={{
            background: `linear-gradient(145deg, ${PRIMARY} 0%, #388E3C 100%)`,
            borderRadius: 24,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 16,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -20, width: 80, height: 80, borderRadius: 40, background: 'rgba(255,255,255,0.08)' }} />

          {/* "EatWell" watermark — sits behind the name + email block */}
          <div style={{
            position: 'absolute',
            bottom: 52,      /* aligns with the name text row */
            left: 0, right: 0,
            textAlign: 'center',
            fontSize: 58,
            fontWeight: 900,
            letterSpacing: -2,
            color: 'rgba(255,255,255,0.11)',
            userSelect: 'none',
            pointerEvents: 'none',
            lineHeight: 1,
            textShadow: '0 4px 24px rgba(0,0,0,0.18)',
          }}>
            EatWell
          </div>

          {/* Avatar Circle */}
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              fontWeight: 800,
              color: PRIMARY,
              marginBottom: 12,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '3px solid rgba(255,255,255,0.9)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 38 }}
              />
            ) : (
              initials
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            {/* Edit icon — left of name */}
            <button
              onClick={openEdit}
              style={{
                width: 30, height: 30, borderRadius: 9,
                background: 'rgba(255,255,255,0.18)',
                border: '1.5px solid rgba(255,255,255,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white', flexShrink: 0,
                backdropFilter: 'blur(4px)',
              }}
              title="Edit Profile"
            >
              <Edit2 size={13} strokeWidth={2.5} />
            </button>

            <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>
              {profile.name}
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
            {profile.email}
          </div>

          {/* Goal badge */}
          <div
            style={{
              marginTop: 12,
              background: 'rgba(255,255,255,0.2)',
              padding: '5px 14px',
              borderRadius: 20,
              fontSize: 12,
              color: 'white',
              fontWeight: 600,
            }}
          >
            {profile.goal === 'weight-loss' ? '⚖️ Weight Loss Goal' : '💪 Muscle Gain Goal'}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <StatCard icon={<User size={16} />} label="Age" value={profile.age} unit="yrs" color="#5C6BC0" />
          <StatCard icon={<Scale size={16} />} label="Weight" value={profile.weight} unit="kg" color={PRIMARY} />
          <StatCard icon={<Target size={16} />} label="Goal" value={profile.goalWeight} unit="kg" color="#FF7043" />
        </div>

        {/* Dietary Preference */}
        <div style={{ background: C.card, borderRadius: 20, padding: '18px 16px', marginBottom: 14, border: `1px solid ${C.border}`, transition: 'background 0.3s' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
            Dietary Preference
          </div>
          <ChipSelector
            options={[{ value: 'veg', label: '🥦 Vegetarian' }, { value: 'non-veg', label: '🍗 Non-Veg' }]}
            selected={profile.dietary}
            onSelect={(val) => setProfile({ ...profile, dietary: val as 'veg' | 'non-veg' })}
          />
        </div>

        {/* Goal Type */}
        <div style={{ background: C.card, borderRadius: 20, padding: '18px 16px', marginBottom: 14, border: `1px solid ${C.border}`, transition: 'background 0.3s' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
            Fitness Goal
          </div>
          <ChipSelector
            options={[{ value: 'weight-loss', label: '⚖️ Weight Loss' }, { value: 'muscle-gain', label: '💪 Muscle Gain' }]}
            selected={profile.goal}
            onSelect={(val) => setProfile({ ...profile, goal: val as 'weight-loss' | 'muscle-gain' })}
          />
        </div>

        {/* Dark Mode Settings Card */}
        <div style={{ background: C.card, borderRadius: 20, padding: '18px 16px', marginBottom: 14, border: `1px solid ${C.border}`, transition: 'background 0.3s' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>
            Appearance
          </div>
          <div
            onClick={() => setDarkMode(!darkMode)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', padding: '12px 14px',
              background: darkMode ? '#2A2A2A' : '#F8F9FA',
              borderRadius: 14, border: `1.5px solid ${C.border}`,
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: darkMode ? '#333' : PRIMARY_LIGHT,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {darkMode
                  ? <Moon size={18} color="#FFD54F" strokeWidth={2} />
                  : <Sun size={18} color={PRIMARY} strokeWidth={2} />}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Dark Mode</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                  {darkMode ? 'Dark theme is on' : 'Light theme is on'}
                </div>
              </div>
            </div>
            {/* Toggle pill */}
            <div style={{
              width: 48, height: 26, borderRadius: 13,
              background: darkMode ? '#333' : C.border,
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 3,
                left: darkMode ? 24 : 3,
                width: 20, height: 20, borderRadius: 10,
                background: darkMode ? '#FFD54F' : '#aaa',
                boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                transition: 'left 0.2s ease, background 0.2s',
              }} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <AppButton
          fullWidth
          onClick={() => navigate('/create-chart')}
          icon={<CalendarDays size={17} />}
          style={{ marginBottom: 12, padding: '15px' }}
        >
          Create Weekly Food Chart
        </AppButton>

        <div style={{ height: 20 }} />
      </div>

      {/* ── Edit Profile Bottom Sheet ── */}

      {/* Backdrop */}
      <div
        onClick={closeEdit}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.35)',
          zIndex: 10,
          opacity: isEditing ? 1 : 0,
          pointerEvents: isEditing ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sheet panel */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          borderRadius: '24px 24px 0 0',
          zIndex: 20,
          transform: isEditing ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '88%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.14)',
        }}
      >
        {/* Sheet Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E0E0E0' }} />
        </div>

        {/* Sheet Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 20px 16px',
            borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
          }}
        >
          <button
            onClick={closeEdit}
            style={{
              background: '#F5F5F5',
              border: 'none',
              cursor: 'pointer',
              color: TEXT_MUTED,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 10,
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Edit Profile</div>

          <button
            onClick={handleSave}
            disabled={compressing}
            style={{
              background: saved ? '#E8F5E9' : PRIMARY,
              border: 'none',
              cursor: compressing ? 'not-allowed' : 'pointer',
              color: saved ? PRIMARY : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              padding: '7px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s ease',
              opacity: compressing ? 0.7 : 1,
            }}
          >
            <Check size={14} strokeWidth={2.5} />
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>

        {/* Sheet Form */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            padding: '20px 20px 32px',
          }}
        >
          {/* Avatar picker */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, gap: 10 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImagePick}
            />

            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => !compressing && fileInputRef.current?.click()}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  background: editData.profileImage
                    ? 'transparent'
                    : `linear-gradient(145deg, ${PRIMARY}, #388E3C)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 800,
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
                  overflow: 'hidden',
                  border: `3px solid ${PRIMARY}`,
                  opacity: compressing ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {editData.profileImage ? (
                  <img
                    src={editData.profileImage}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  editInitials || <User size={28} />
                )}
              </div>

              {/* Camera badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: compressing ? TEXT_MUTED : PRIMARY,
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <Camera size={13} color="white" strokeWidth={2.2} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => !compressing && fileInputRef.current?.click()}
                style={{
                  background: PRIMARY_LIGHT,
                  border: 'none',
                  cursor: compressing ? 'not-allowed' : 'pointer',
                  color: PRIMARY,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: 20,
                  opacity: compressing ? 0.7 : 1,
                }}
              >
                {compressing ? 'Processing…' : editData.profileImage ? 'Change Photo' : 'Upload Photo'}
              </button>
              {editData.profileImage && !compressing && (
                <button
                  onClick={handleRemoveImage}
                  style={{
                    background: '#FFF0F0',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#E53935',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: 20,
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Section: Personal Info */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: TEXT_MUTED,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 14,
            }}
          >
            Personal Info
          </div>

          <AppInput
            label="Full Name"
            value={editData.name}
            onChange={(val) => setEditData({ ...editData, name: val })}
            placeholder="Your full name"
          />

          <AppInput
            label="Email Address"
            type="email"
            value={editData.email}
            onChange={(val) => setEditData({ ...editData, email: val })}
            placeholder="your@email.com"
          />

          {/* Section: Body Stats */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: TEXT_MUTED,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 14,
              marginTop: 6,
            }}
          >
            Body Stats
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <AppInput
                label="Age (yrs)"
                type="number"
                value={editData.age}
                onChange={(val) => setEditData({ ...editData, age: val })}
                placeholder="e.g. 28"
              />
            </div>
            <div style={{ flex: 1 }}>
              <AppInput
                label="Weight (kg)"
                type="number"
                value={editData.weight}
                onChange={(val) => setEditData({ ...editData, weight: val })}
                placeholder="e.g. 65"
              />
            </div>
          </div>

          <AppInput
            label="Goal Weight (kg)"
            type="number"
            value={editData.goalWeight}
            onChange={(val) => setEditData({ ...editData, goalWeight: val })}
            placeholder="e.g. 58"
          />

          {/* Section: Preferences */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: TEXT_MUTED,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 14,
              marginTop: 6,
            }}
          >
            Preferences
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8 }}>
              Dietary Preference
            </div>
            <ChipSelector
              options={[
                { value: 'veg', label: '🥦 Vegetarian' },
                { value: 'non-veg', label: '🍗 Non-Veg' },
              ]}
              selected={editData.dietary}
              onSelect={(val) => setEditData({ ...editData, dietary: val as 'veg' | 'non-veg' })}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 8 }}>
              Fitness Goal
            </div>
            <ChipSelector
              options={[
                { value: 'weight-loss', label: '⚖️ Weight Loss' },
                { value: 'muscle-gain', label: '💪 Muscle Gain' },
              ]}
              selected={editData.goal}
              onSelect={(val) => setEditData({ ...editData, goal: val as 'weight-loss' | 'muscle-gain' })}
            />
          </div>
        </div>

        {/* Sheet Footer CTA */}
        <div
          style={{
            padding: '12px 20px 24px',
            borderTop: `1px solid ${BORDER}`,
            flexShrink: 0,
          }}
        >
          <AppButton
            fullWidth
            onClick={handleSave}
            disabled={compressing}
            icon={saved ? <Check size={16} /> : undefined}
            style={{ padding: '15px', background: saved ? '#388E3C' : PRIMARY }}
          >
            {compressing ? 'Processing photo…' : saved ? 'Changes Saved!' : 'Save Changes'}
          </AppButton>
        </div>
      </div>
    </div>
  );
}