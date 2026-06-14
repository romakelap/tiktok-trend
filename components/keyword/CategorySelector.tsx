import React from 'react';
import { TOKENS } from '@/lib/design-tokens';
interface CategorySelectorProps {
  selected: string;
  onSelect: (category: string) => void;
}

const categories = ['Edukasi', 'Komedi', 'Kuliner', 'Lifestyle', 'Teknologi'];

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <div style={{ background: TOKENS.card, border: `1px solid ${TOKENS.cardBorder}`, borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: TOKENS.textMuted, textTransform: 'uppercase', marginBottom: 12 }}>Kategori</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {categories.map((cat) => {
          const isSelected = selected === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: isSelected ? '1.5px solid #111111' : `1.5px solid ${TOKENS.cardBorder}`,
                background: isSelected ? TOKENS.charcoal : TOKENS.card,
                color: isSelected ? '#ffffff' : TOKENS.textSubtle,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
