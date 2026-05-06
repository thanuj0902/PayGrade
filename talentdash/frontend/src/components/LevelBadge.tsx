// frontend/src/components/LevelBadge.tsx

const LEVEL_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  l3:  { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
  l4:  { bg: 'rgba(99,102,241,0.1)', color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  l5:  { bg: 'rgba(124,106,247,0.12)', color: '#a78bfa', border: 'rgba(124,106,247,0.3)' },
  l6:  { bg: 'rgba(168,85,247,0.1)', color: '#c084fc', border: 'rgba(168,85,247,0.25)' },
  l7:  { bg: 'rgba(217,70,239,0.1)', color: '#e879f9', border: 'rgba(217,70,239,0.25)' },
  l8:  { bg: 'rgba(236,72,153,0.1)', color: '#f472b6', border: 'rgba(236,72,153,0.25)' },
  sde1: { bg: 'rgba(20,184,166,0.1)', color: '#2dd4bf', border: 'rgba(20,184,166,0.25)' },
  sde2: { bg: 'rgba(52,211,153,0.1)', color: '#34d399', border: 'rgba(52,211,153,0.25)' },
  sde3: { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: 'rgba(16,185,129,0.3)' },
  'junior engineer': { bg: 'rgba(251,191,36,0.08)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  'engineer': { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  'senior engineer': { bg: 'rgba(249,115,22,0.1)', color: '#fb923c', border: 'rgba(249,115,22,0.25)' },
  'staff engineer': { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
  'principal engineer': { bg: 'rgba(244,63,94,0.1)', color: '#fb7185', border: 'rgba(244,63,94,0.25)' },
};

export default function LevelBadge({ level }: { level: string }) {
  const style = LEVEL_STYLES[level.toLowerCase()] ?? {
    bg: 'rgba(136,136,170,0.1)', color: '#8888aa', border: 'rgba(136,136,170,0.2)'
  };

  return (
    <span style={{
      fontFamily: 'DM Mono, monospace',
      fontSize: '0.65rem',
      fontWeight: 500,
      letterSpacing: '0.08em',
      padding: '3px 8px',
      borderRadius: 4,
      border: `1px solid ${style.border}`,
      background: style.bg,
      color: style.color,
      display: 'inline-flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
    }}>
      {level.toUpperCase()}
    </span>
  );
}