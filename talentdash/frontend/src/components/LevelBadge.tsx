const LEVEL_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  l3:  { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  l4:  { bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' },
  l5:  { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  l6:  { bg: '#FDF4FF', color: '#7E22CE', border: '#E9D5FF' },
  l7:  { bg: '#FFF1F2', color: '#BE123C', border: '#FECDD3' },
  l8:  { bg: '#FFF7ED', color: '#C2410C', border: '#FED7AA' },
  sde1: { bg: '#F0FDF4', color: '#166534', border: '#BBF7D0' },
  sde2: { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  sde3: { bg: '#F0FDFA', color: '#0F766E', border: '#99F6E4' },
  'junior engineer': { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
  'engineer': { bg: '#FFF7ED', color: '#9A3412', border: '#FED7AA' },
  'senior engineer': { bg: '#FFF1F2', color: '#9F1239', border: '#FECDD3' },
  'staff engineer': { bg: '#FDF2F8', color: '#86198F', border: '#F5D0FE' },
  'principal engineer': { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE' },
};

export default function LevelBadge({ level }: { level: string }) {
  const s = LEVEL_STYLES[level.toLowerCase()] ?? { bg: '#F8FAFC', color: '#475569', border: '#CBD5E1' };
  return (
    <span style={{
      fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', fontWeight: 500,
      letterSpacing: '0.05em', padding: '2px 8px', borderRadius: 4,
      border: `1px solid ${s.border}`, background: s.bg, color: s.color,
      display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
    }}>
      {level.toUpperCase()}
    </span>
  );
}