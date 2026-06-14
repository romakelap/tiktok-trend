import { Gamepad2, BookOpen, Smile, Shirt, Utensils, Music, Sun, Monitor, Hash, Layers, LucideIcon } from "lucide-react";
import { GridBg } from "@/components/layout/GridBg";
import { TOKENS } from "@/lib/design-tokens";
import { CatData, CAT_COLORS } from "@/lib/hashtag/mock-data";

export const CAT_ICONS: Record<string, LucideIcon> = {
  All: Layers,
  Gaming: Gamepad2,
  Edukasi: BookOpen,
  Komedi: Smile,
  Fashion: Shirt,
  Kuliner: Utensils,
  Musik: Music,
  Lifestyle: Sun,
  Teknologi: Monitor,
};

interface CategorySelectorProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  allData?: CatData[];
}

export function CategorySelector({ activeCategory, onSelectCategory, allData = [] }: CategorySelectorProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden p-5"
      style={{
        background: TOKENS.card,
        border: `1px solid ${TOKENS.cardBorder}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.05),inset 0 1px 0 rgba(255,255,255,1)'
      }}
    >
      <GridBg theme="light" />
      <div className="relative z-10">
        <p className="font-black text-sm mb-3" style={{ color: TOKENS.text }}>Pilih Kategori</p>
        <div className="flex flex-wrap gap-2">
          {allData.map(d => {
            const col = d.category === 'All' ? '#18181b' : (CAT_COLORS[d.category] ?? '#111');
            const IconComponent = CAT_ICONS[d.category] ?? Hash;
            const isActive = d.category === activeCategory;
            const gPos = d.weekGrowth >= 0;
            return (
              <button
                key={d.category}
                onClick={() => onSelectCategory(d.category)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
                style={{
                  background: isActive ? col : '#F5F4F2',
                  color: isActive ? '#fff' : TOKENS.textSubtle,
                  border: `1px solid ${isActive ? col : 'rgba(0,0,0,0.1)'}`,
                  boxShadow: isActive ? `0 2px 10px rgba(0,0,0,0.18)` : 'none',
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                <IconComponent className="w-4 h-4" />
                <span className="font-black text-xs">{d.category}</span>
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.22)' : (gPos ? TOKENS.positiveBg : TOKENS.negativeBg),
                    color: isActive ? '#fff' : (gPos ? TOKENS.positive : TOKENS.negative)
                  }}
                >
                  {gPos ? '+' : ''}{d.weekGrowth}%
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
