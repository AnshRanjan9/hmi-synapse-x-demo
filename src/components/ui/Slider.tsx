import { soundManager } from '@/lib/audio';

export function Slider({ value, min, max, onChange, label, unit }: { value: number, min: number, max: number, onChange: (v: number) => void, label?: string, unit?: string }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    soundManager.play('hover'); // subtle tick for slider
    onChange(Math.round(Number(e.target.value)));
  };

  return (
    <div className="flex flex-col justify-center min-h-[44px] gap-2">
      {label && (
        <div className="flex justify-between text-sm font-medium text-text-secondary">
          <span>{label}</span>
          <span className="font-mono text-accent-primary">{Math.round(value)} {unit}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={Math.round(value)}
        onChange={handleChange}
        onMouseEnter={() => soundManager.play('hover')}
        className="w-full h-3 bg-border rounded-lg appearance-none cursor-pointer accent-accent-primary shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-secondary"
      />
    </div>
  );
}
