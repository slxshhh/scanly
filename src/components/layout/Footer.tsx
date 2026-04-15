import React from 'react';
import { QrCode } from 'lucide-react';
import { useTranslation } from "@/src/lib/i18n";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-gray-900">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white">
            <QrCode className="w-4 h-4" />
          </div>
          <span className="tracking-tighter">{t('brand')}</span>
        </div>
        
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          © {new Date().getFullYear()} {t('brand')} {t('studio')}. {t('allRightsReserved') || 'All rights reserved.'}
        </div>

        <div className="flex gap-6">
          <a href="#" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">Documentation</a>
          <a href="#" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">Issues</a>
          <a href="#" className="text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest">License</a>
        </div>
      </div>
    </footer>
  );
}
