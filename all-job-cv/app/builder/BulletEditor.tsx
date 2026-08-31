"use client";

function bulletsFromText(text: string): string[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length ? lines : [""];
}

export default function BulletEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const bullets = bulletsFromText(value);

  function updateBullet(index: number, text: string) {
    const next = [...bullets];
    next[index] = text;
    onChange(next.join("\n"));
  }

  function addBullet() {
    onChange([...bullets, ""].join("\n"));
  }

  function removeBullet(index: number) {
    const next = bullets.filter((_, i) => i !== index);
    onChange(next.join("\n"));
  }

  return (
    <div className="space-y-2">
      {bullets.map((bullet, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2.5 text-[#B8B2A3]" aria-hidden>
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
              <circle cx="3" cy="3" r="1.2" fill="currentColor" />
              <circle cx="9" cy="3" r="1.2" fill="currentColor" />
              <circle cx="3" cy="8" r="1.2" fill="currentColor" />
              <circle cx="9" cy="8" r="1.2" fill="currentColor" />
              <circle cx="3" cy="13" r="1.2" fill="currentColor" />
              <circle cx="9" cy="13" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <textarea
            className="input min-h-[46px] flex-1"
            value={bullet}
            onChange={(e) => updateBullet(i, e.target.value)}
            placeholder="What did you do?"
          />
          {bullets.length > 1 && (
            <button
              type="button"
              onClick={() => removeBullet(i)}
              className="mt-2 text-[#8B8578] hover:text-[#993C1D]"
              aria-label="Remove bullet"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addBullet}
        className="text-sm font-medium text-[#3F6C51] hover:underline"
      >
        + Add bullet
      </button>
    </div>
  );
}
