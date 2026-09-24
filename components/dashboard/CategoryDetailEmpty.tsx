import { Target } from "lucide-react";

export function CategoryDetailEmpty() {
  return (
    <div className="rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40 px-6 py-12 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3 border border-neutral-200 dark:border-neutral-700">
        <Target className="w-5 h-5 text-neutral-400 dark:text-neutral-500" strokeWidth={1.8} />
      </div>
      <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">
        Belum ada kategori yang dipilih
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
        Pilih salah satu bar pada chart atau baris tabel di atas untuk membuka visualisasi detail, tren performa, dan rekomendasi posting.
      </p>
    </div>
  );
}
