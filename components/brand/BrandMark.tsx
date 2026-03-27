interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 40, className }: BrandMarkProps) {
  return (
    <div className={className} style={{ height: size, width: size }}>
      <div
        aria-label="Vyarah brand mark"
        className="relative flex h-full w-full items-center justify-center overflow-hidden border border-[rgba(17,17,17,0.2)] bg-[#111111]"
      >
        <span
          className="absolute inset-x-0 top-0 block bg-[var(--gray-depth-4)]"
          style={{ height: Math.max(2, Math.round(size * 0.08)) }}
        />
        <span
          className="font-display font-bold leading-none tracking-[-0.08em] text-[#f2f2f2]"
          style={{ fontSize: Math.max(16, Math.round(size * 0.52)) }}
        >
          V
        </span>
        <span
          className="absolute right-[16%] top-[18%] block bg-[var(--gray-depth-1)]"
          style={{
            height: Math.max(2, Math.round(size * 0.06)),
            width: Math.max(8, Math.round(size * 0.2)),
            transform: 'rotate(45deg)',
          }}
        />
      </div>
    </div>
  );
}
