import { GripVertical } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

interface RevealComparisonProps {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}

export function RevealComparison({ before, after, beforeLabel = 'Antes', afterLabel = 'Depois' }: RevealComparisonProps) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const onMove = (event: MouseEvent) => dragging && move(event.clientX);
    const onTouchMove = (event: TouchEvent) => dragging && event.touches[0] && move(event.touches[0].clientX);
    const end = () => setDragging(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchend', end);
    };
  }, [dragging, move]);

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Comparar antes e depois"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={position}
      tabIndex={0}
      className="relative aspect-[16/10] cursor-ew-resize select-none overflow-hidden rounded-[20px] border border-line/70 bg-paper touch-none"
      onMouseDown={(event) => { event.preventDefault(); setDragging(true); move(event.clientX); }}
      onTouchStart={(event) => { setDragging(true); const touch = event.touches[0]; if (touch) move(touch.clientX); }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') setPosition((value) => Math.max(0, value - 5));
        if (event.key === 'ArrowRight') setPosition((value) => Math.min(100, value + 5));
      }}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>{before}</div>

      <div className="absolute left-4 top-4 z-20 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper backdrop-blur-sm">{beforeLabel}</div>
      <div className="absolute right-4 top-4 z-20 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper backdrop-blur-sm">{afterLabel}</div>

      <div className={`absolute bottom-0 top-0 z-10 w-[3px] -translate-x-1/2 bg-paper shadow-[0_0_18px_rgba(11,11,10,0.2)] ${dragging ? 'bg-white' : ''}`} style={{ left: `${position}%` }}>
        <div className={`absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-paper shadow-xl transition-transform ${dragging ? 'scale-110' : ''}`}>
          <GripVertical size={18} className="text-ink" />
        </div>
      </div>
    </div>
  );
}
