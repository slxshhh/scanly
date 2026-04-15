import React, { useEffect, useState } from 'react';
import { qrService, SavedQRCode } from '@/src/lib/qrService';
import { useAuth } from '@/src/components/auth/AuthProvider';
import { QRState } from '@/src/types/qr';
import { Trash2, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from "@/src/lib/i18n";

interface SavedQRsProps {
  onLoad: (options: React.SetStateAction<QRState>) => void;
}

export function SavedQRs({ onLoad }: SavedQRsProps) {
  const { user } = useAuth();
  const [savedQRs, setSavedQRs] = useState<SavedQRCode[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const fetchQRs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const qrs = await qrService.getSavedQRCodes();
      setSavedQRs(qrs);
    } catch (error) {
      console.error("Failed to fetch QRs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRs();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;
    try {
      await qrService.deleteQRCode(id);
      setSavedQRs(prev => prev.filter(qr => qr.id !== id));
    } catch (error) {
      alert(t('saveError'));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : savedQRs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
          <p className="text-sm text-gray-400 font-medium">{t('noSaved')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedQRs.map((qr) => (
            <div 
              key={qr.id} 
              className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 bg-primary/5 rounded-lg text-primary">
                    <ExternalLink className="w-3 h-3" />
                  </div>
                  <h3 className="font-black text-xs text-gray-900 truncate uppercase tracking-tight">{qr.name}</h3>
                </div>
                <button 
                  onClick={() => handleDelete(qr.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => onLoad(qr.options)}
                  className="flex-1 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl hover:bg-black transition-all uppercase tracking-widest"
                >
                  {t('loadDesign')}
                </button>
              </div>
              
              <p className="mt-3 text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                {qr.updatedAt?.toDate().toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
