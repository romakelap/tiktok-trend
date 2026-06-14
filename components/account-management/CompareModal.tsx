import React, { useState, useEffect } from 'react';
import { X, Search, Check, AlertCircle, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TOKENS } from '@/lib/design-tokens';
import { Account, getTrackedAccounts } from '@/lib/account-management/api';
import { AccountAvatar } from './AccountAvatar';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompare: (main: Account, competitors: Account[]) => void;
}

export const CompareModal = ({ isOpen, onClose, onCompare }: CompareModalProps) => {
  const [mainSearch, setMainSearch] = useState('');
  const [compSearch, setCompSearch] = useState('');
  const [mainResults, setMainResults] = useState<Account[]>([]);
  const [compResults, setCompResults] = useState<Account[]>([]);
  
  const [selectedMain, setSelectedMain] = useState<Account | null>(null);
  const [selectedComps, setSelectedComps] = useState<Account[]>([]);

  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);

  // Debounced search for main account
  useEffect(() => {
    if (!mainSearch.trim()) {
      setMainResults([]);
      return;
    }
    setLoadingMain(true);
    const timer = setTimeout(() => {
      getTrackedAccounts(0, 10, mainSearch, 'all')
        .then(res => setMainResults(res.content))
        .catch(err => console.error(err))
        .finally(() => setLoadingMain(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [mainSearch]);

  // Debounced search for competitor accounts
  useEffect(() => {
    if (!compSearch.trim()) {
      setCompResults([]);
      return;
    }
    setLoadingComp(true);
    const timer = setTimeout(() => {
      getTrackedAccounts(0, 10, compSearch, 'all')
        .then(res => setCompResults(res.content))
        .catch(err => console.error(err))
        .finally(() => setLoadingComp(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [compSearch]);

  if (!isOpen) return null;

  const handleSelectMain = (acc: Account) => {
    setSelectedMain(acc);
    setMainSearch('');
    setMainResults([]);
  };

  const handleAddComp = (acc: Account) => {
    if (selectedMain && selectedMain.id === acc.id) return; // Can't compare main to itself
    if (selectedComps.some(c => c.id === acc.id)) return;
    setSelectedComps(prev => [...prev, acc]);
    setCompSearch('');
    setCompResults([]);
  };

  const handleRemoveComp = (id: number) => {
    setSelectedComps(prev => prev.filter(c => c.id !== id));
  };

  const handleSubmit = () => {
    if (selectedMain && selectedComps.length > 0) {
      onCompare(selectedMain, selectedComps);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-2xl border border-gray-100 max-w-4xl w-full p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-900"
              style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              <Target className="w-5 h-5 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight" style={{ color: TOKENS.text }}>
                Bandingkan Performa Akun
              </h2>
              <p className="text-xs mt-0.5" style={{ color: TOKENS.textMuted }}>
                Pilih akun utama Anda dan tambahkan beberapa kompetitor untuk melihat perbandingan metrik secara berdampingan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body — 2-column grid on md+ so wider modal stays balanced */}
        <div className="flex-1 overflow-y-auto py-5 grid grid-cols-1 md:grid-cols-2 gap-6 pr-1">
          {/* Section 1: Main Account Selection */}
          <div
            className="space-y-3 p-4 rounded-xl border border-gray-100 bg-gray-50/40 flex flex-col"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-900 text-white text-[10px] font-black"
              >
                1
              </span>
              <label className="text-xs font-black uppercase tracking-wider" style={{ color: TOKENS.textSubtle }}>
                Akun Utama Anda
              </label>
            </div>
            
            {selectedMain ? (
              <div 
                className="flex items-center justify-between p-3 rounded-xl border border-emerald-100 bg-emerald-50/20"
              >
                <div className="flex items-center gap-3">
                  <AccountAvatar account={selectedMain} size={36} />
                  <div>
                    <p className="font-black text-sm" style={{ color: TOKENS.text }}>@{selectedMain.username}</p>
                    <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>{selectedMain.displayName}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setSelectedMain(null)}
                  className="text-xs font-black text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                >
                  Ganti
                </Button>
              </div>
            ) : (
               <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  value={mainSearch}
                  onChange={e => setMainSearch(e.target.value)}
                  placeholder="Cari akun utama..."
                  className="pl-9 h-10 rounded-xl text-sm"
                  style={{ background: TOKENS.input, border: `1px solid ${TOKENS.inputBorder}` }}
                />
                
                {/* Search Results Dropdown */}
                {mainResults.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-gray-50">
                    {mainResults.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => handleSelectMain(acc)}
                        className="w-full text-left p-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <AccountAvatar account={acc} size={30} />
                        <div>
                          <p className="font-bold text-xs" style={{ color: TOKENS.text }}>@{acc.username}</p>
                          <p className="text-[10px]" style={{ color: TOKENS.textMuted }}>{acc.displayName}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {!loadingMain && mainSearch.trim() !== '' && mainResults.length === 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl p-3 text-center text-xs text-gray-400">
                    Tidak ada akun ditemukan
                  </div>
                )}
                {loadingMain && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">Loading...</div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Competitor/Inspiration Selection */}
          <div
            className="space-y-3 p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 flex flex-col"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center bg-emerald-600 text-white text-[10px] font-black"
              >
                2
              </span>
              <label className="text-xs font-black uppercase tracking-wider" style={{ color: TOKENS.textSubtle }}>
                Akun Pembanding{' '}
                <span className="font-bold normal-case opacity-60">(Kompetitor / Inspirasi)</span>
              </label>
              {selectedComps.length > 0 && (
                <span
                  className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black"
                >
                  <Users className="w-2.5 h-2.5" strokeWidth={2.5} />
                  {selectedComps.length}
                </span>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                value={compSearch}
                onChange={e => setCompSearch(e.target.value)}
                placeholder="Cari akun pembanding..."
                className="pl-9 h-10 rounded-xl text-sm"
                style={{ background: TOKENS.input, border: `1px solid ${TOKENS.inputBorder}` }}
                disabled={!selectedMain}
              />
              
              {/* Search Results Dropdown */}
              {(() => {
                const filteredCompsList = compResults.filter(
                  acc => acc.id !== selectedMain?.id && !selectedComps.some(c => c.id === acc.id)
                );
                
                if (filteredCompsList.length > 0) {
                  return (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-gray-50">
                      {filteredCompsList.map(acc => (
                        <button
                          key={acc.id}
                          onClick={() => handleAddComp(acc)}
                          className="w-full text-left p-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <AccountAvatar account={acc} size={30} />
                          <div>
                            <p className="font-bold text-xs" style={{ color: TOKENS.text }}>@{acc.username}</p>
                            <p className="text-[10px]" style={{ color: TOKENS.textMuted }}>{acc.displayName}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  );
                } else if (!loadingComp && compSearch.trim() !== '') {
                  return (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl p-3 text-center text-xs text-gray-400">
                      Tidak ada akun ditemukan atau sudah terpilih
                    </div>
                  );
                }
                return null;
              })()}
              {loadingComp && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">Loading...</div>
              )}
            </div>

            {/* Selected Competitors List */}
            {selectedComps.length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-1.5 pt-1 max-h-48 pr-1">
                {selectedComps.map(c => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-emerald-100 bg-white"
                  >
                    <AccountAvatar account={c} size={28} />
                    <div className="min-w-0 flex-1">
                      <p
                        className="font-black text-xs truncate"
                        style={{ color: TOKENS.text }}
                      >
                        @{c.username}
                      </p>
                      <p className="text-[10px] truncate" style={{ color: TOKENS.textMuted }}>
                        {c.displayName}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveComp(c.id)}
                      className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors flex-shrink-0"
                      title="Hapus dari daftar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="flex-1 flex items-center justify-center text-center text-[11px] font-bold py-6 rounded-lg border border-dashed"
                style={{
                  borderColor: 'rgba(0,0,0,0.08)',
                  color: TOKENS.textMuted,
                  minHeight: 80,
                }}
              >
                Belum ada akun pembanding dipilih
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
            {!selectedMain ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Pilih akun utama terlebih dahulu.</span>
              </>
            ) : selectedComps.length === 0 ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Pilih minimal 1 akun pembanding.</span>
              </>
            ) : (
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <Check className="w-4 h-4" />
                <span>Siap untuk dibandingkan!</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onClose}
              className="h-9 rounded-xl px-4 font-bold text-xs"
            >
              Batal
            </Button>
            <Button 
              size="sm" 
              onClick={handleSubmit}
              disabled={!selectedMain || selectedComps.length === 0}
              className="h-9 rounded-xl px-4 font-black text-xs text-white"
              style={{ 
                background: selectedMain && selectedComps.length > 0 ? '#111' : '#ccc', 
                boxShadow: selectedMain && selectedComps.length > 0 ? '0 4px 12px rgba(0,0,0,0.1)' : 'none' 
              }}
            >
              Generate Perbandingan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
