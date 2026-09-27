"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check, Plus, Trash2, Settings2, Sparkles, User, Users, Layers, Search, CheckCircle2 } from "lucide-react";

export type AccountSuggestion = {
  username: string;
  name: string;
  category?: string;
  followers?: string;
};

const DEFAULT_ACCOUNT_SUGGESTIONS: AccountSuggestion[] = [
  { username: "imploracosmetics", name: "Implora Cosmetics Official", category: "Beauty & Personal Care", followers: "2.4M" },
  { username: "glad2glow.id", name: "Glad2Glow Indonesia", category: "Skincare & Beauty", followers: "3.1M" },
  { username: "somethincofficial", name: "Somethinc Indonesia", category: "Cosmetics & Skincare", followers: "4.5M" },
  { username: "skintific.id", name: "Skintific Indonesia", category: "Personal Care", followers: "5.2M" },
  { username: "azarinecosmetic", name: "Azarine Cosmetic Official", category: "Sunscreen & Beauty", followers: "1.9M text" },
  { username: "wardahbeauty", name: "Wardah Beauty Official", category: "Halal Cosmetics", followers: "6.8M" },
  { username: "maybelline_id", name: "Maybelline Indonesia", category: "Makeup & Beauty", followers: "3.9M" },
  { username: "tanamanhias.id", name: "Tanaman Hias Indonesia", category: "Lifestyle & Hobby", followers: "1.8M" },
  { username: "kebun.bali", name: "Kebun Bali Official", category: "Garden & Nature", followers: "920K" },
  { username: "plantkween", name: "PlantKween Official", category: "Inspiration & Living", followers: "2.1M" },
  { username: "gardenup.official", name: "GardenUp Official", category: "Home & Garden", followers: "1.4M" },
];

type AnalyticsSetupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentMainAccount: string;
  currentCompetitors?: string[];
  currentCluster?: string;
  availableAccounts?: AccountSuggestion[];
  onSave: (config: { mainAccount: string; competitors: string[]; cluster: string }) => void;
};

export function AnalyticsSetupModal({
  isOpen,
  onClose,
  currentMainAccount,
  currentCompetitors = ["glad2glow.id", "somethincofficial", "tanamanhias.id", "kebun.bali"],
  currentCluster = "Beauty & Personal Care #01",
  availableAccounts = [],
  onSave,
}: AnalyticsSetupModalProps) {
  const [mainAccountHandle, setMainAccountHandle] = useState(
    currentMainAccount ? currentMainAccount.replace("@", "") : "imploracosmetics"
  );
  const [showMainSuggestions, setShowMainSuggestions] = useState(false);

  const [competitors, setCompetitors] = useState<string[]>(currentCompetitors);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [showCompSuggestions, setShowCompSuggestions] = useState(false);

  const [selectedCluster, setSelectedCluster] = useState(currentCluster);
  const [isSaved, setIsSaved] = useState(false);

  const mainInputContainerRef = useRef<HTMLDivElement>(null);
  const compInputContainerRef = useRef<HTMLDivElement>(null);

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setMainAccountHandle(currentMainAccount ? currentMainAccount.replace("@", "") : "imploracosmetics");
      if (currentCompetitors && currentCompetitors.length > 0) {
        setCompetitors(currentCompetitors);
      }
      if (currentCluster) {
        setSelectedCluster(currentCluster);
      }
    }
  }, [isOpen, currentMainAccount, currentCompetitors, currentCluster]);

  // Combine default and passed available accounts
  const allSuggestions = [
    ...availableAccounts,
    ...DEFAULT_ACCOUNT_SUGGESTIONS.filter(
      (d) => !availableAccounts.some((a) => a.username.toLowerCase() === d.username.toLowerCase())
    ),
  ];

  // Outside click listener to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mainInputContainerRef.current &&
        !mainInputContainerRef.current.contains(event.target as Node)
      ) {
        setShowMainSuggestions(false);
      }
      if (
        compInputContainerRef.current &&
        !compInputContainerRef.current.contains(event.target as Node)
      ) {
        setShowCompSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Suggestions for Main Account
  const mainFilteredSuggestions = allSuggestions.filter((acc) => {
    const q = mainAccountHandle.toLowerCase().trim();
    if (!q) return true;
    return (
      acc.username.toLowerCase().includes(q) ||
      acc.name.toLowerCase().includes(q)
    );
  });

  // Suggestions for Competitor Input
  const compFilteredSuggestions = allSuggestions.filter((acc) => {
    const q = newCompetitor.toLowerCase().trim();
    if (competitors.includes(acc.username)) return false;
    if (!q) return true;
    return (
      acc.username.toLowerCase().includes(q) ||
      acc.name.toLowerCase().includes(q)
    );
  });

  const handleAddCompetitor = (handleToAdd?: string) => {
    const target = handleToAdd || newCompetitor;
    if (!target.trim()) return;
    const clean = target.trim().replace("@", "");
    if (!competitors.includes(clean)) {
      setCompetitors((prev) => [...prev, clean]);
    }
    setNewCompetitor("");
    setShowCompSuggestions(false);
  };

  const handleRemoveCompetitor = (handle: string) => {
    setCompetitors((prev) => prev.filter((c) => c !== handle));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      onSave({
        mainAccount: mainAccountHandle.trim() || "imploracosmetics",
        competitors,
        cluster: selectedCluster,
      });
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-sm transition-all duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-neutral-800 flex items-center justify-between bg-stone-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900 dark:text-white tracking-tight">
                Konfigurasi Analytics &amp; Akun TikTok
              </h2>
              <p className="text-xs text-stone-400 dark:text-neutral-500">
                Atur akun utama, monitoring kompetitor, &amp; preferensi klaster AI.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Section 1: Akun Utama (with Autocomplete Dropdown) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-500" />
              Akun Utama TikTok Anda
            </label>
            <div className="relative" ref={mainInputContainerRef}>
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm z-10">
                @
              </span>
              <input
                type="text"
                value={mainAccountHandle}
                onChange={(e) => {
                  setMainAccountHandle(e.target.value);
                  setShowMainSuggestions(true);
                }}
                onFocus={() => setShowMainSuggestions(true)}
                placeholder="ketik_nama_akun..."
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-950 text-stone-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              />

              {/* Autocomplete Dropdown Popover */}
              {showMainSuggestions && mainFilteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto py-1 animate-in fade-in-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 dark:text-neutral-500 uppercase border-b border-stone-100 dark:border-neutral-800 flex items-center gap-1">
                    <Search className="w-3 h-3 text-sky-500" />
                    Rekomendasi Akun Ditemukan
                  </div>
                  {mainFilteredSuggestions.map((acc) => (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => {
                        setMainAccountHandle(acc.username);
                        setShowMainSuggestions(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-sky-50/80 dark:hover:bg-neutral-800/80 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center uppercase flex-shrink-0">
                          {acc.username.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                            @{acc.username}
                          </p>
                          <p className="text-[10px] text-stone-400 dark:text-neutral-500">
                            {acc.name}
                          </p>
                        </div>
                      </div>
                      {acc.followers && (
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                          {acc.followers}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[11px] text-stone-400 dark:text-neutral-500">
              Ketik username TikTok Anda untuk melihat saran otomatis dari sistem.
            </p>
          </div>

          {/* Section 2: Daftar Kompetitor Terlacak (with Autocomplete Dropdown) */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-neutral-800">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                Daftar Kompetitor Terlacak ({competitors.length})
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                Maksimal 10 akun
              </span>
            </label>

            {/* Input & Add Button with Autocomplete */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1" ref={compInputContainerRef}>
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm z-10">
                  @
                </span>
                <input
                  type="text"
                  value={newCompetitor}
                  onChange={(e) => {
                    setNewCompetitor(e.target.value);
                    setShowCompSuggestions(true);
                  }}
                  onFocus={() => setShowCompSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCompetitor();
                    }
                  }}
                  placeholder="ketik_nama_kompetitor..."
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-950 text-stone-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />

                {/* Competitor Autocomplete Dropdown Popover */}
                {showCompSuggestions && compFilteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto py-1 animate-in fade-in-50">
                    <div className="px-3 py-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase border-b border-stone-100 dark:border-neutral-800 flex items-center gap-1">
                      <Search className="w-3 h-3 text-amber-500" />
                      Pilih Dari Rekomendasi Kompetitor
                    </div>
                    {compFilteredSuggestions.map((acc) => (
                      <button
                        key={acc.username}
                        type="button"
                        onClick={() => handleAddCompetitor(acc.username)}
                        className="w-full px-3.5 py-2 text-left hover:bg-amber-50/80 dark:hover:bg-neutral-800/80 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center uppercase flex-shrink-0">
                            {acc.username.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                              @{acc.username}
                            </p>
                            <p className="text-[10px] text-stone-400 dark:text-neutral-500">
                              {acc.name}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                          + Tambah
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleAddCompetitor()}
                className="h-10 px-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs flex items-center gap-1 hover:opacity-90 transition-all cursor-pointer flex-shrink-0 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </div>

            {/* List Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {competitors.map((handle) => (
                <div
                  key={handle}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 text-xs font-bold text-stone-800 dark:text-neutral-200 flex items-center gap-2 group"
                >
                  <span>@{handle}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompetitor(handle)}
                    className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Klaster Industri */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-neutral-800">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              Klaster Industri &amp; Niche
            </label>
            <select
              value={selectedCluster}
              onChange={(e) => setSelectedCluster(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-950 text-stone-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
            >
              <option value="Beauty & Personal Care">Beauty &amp; Personal Care #01</option>
              <option value="Fashion & Apparel">Fashion &amp; Apparel #02</option>
              <option value="Food & Beverage">Food &amp; Beverage #03</option>
              <option value="Gadget & Technology">Gadget &amp; Technology #04</option>
              <option value="Home & Living">Home &amp; Living #05</option>
            </select>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-stone-200 dark:border-neutral-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-neutral-300 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#00a3ad] dark:bg-[#00f2fe] text-white dark:text-stone-950 hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 animate-bounce" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simpan Konfigurasi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
