import { Target } from "lucide-react";

export function CategoryDetailEmpty() {
  return (
    <div className="rounded-xl border border-dashed border-stone-200 dark:border-neutral-800 bg-stone-50/40 dark:bg-neutral-900/40 px-6 py-10 flex flex-col items-center justify-center text-center">
      <Target className="w-6 h-6 text-stone-300 dark:text-neutral-600 mb-3" strokeWidth={1.5} />
      <p className="text-sm font-semibold text-stone-600 dark:text-neutral-300 mb-1">
        Pilih kategori untuk Deep Dive
      </p>
      <p className="text-xs text-stone-400 dark:text-neutral-500 max-w-xs">
        Klik salah satu bar pada chart atau tab kategori di atas untuk membuka analisis detail, tren performa, dan rekomendasi posting.
      </p>
    </div>
  );
}
