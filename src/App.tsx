/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MainLayout } from "@/src/components/layout/MainLayout";
import { QRControls } from "@/src/components/qr/QRControls";
import { QRPreview } from "@/src/components/qr/QRPreview";
import { SavedQRs } from "@/src/components/qr/SavedQRs";
import { SupportChat } from "@/src/components/support/SupportChat";
import { useQRCode } from "@/src/hooks/useQRCode";
import { QRState } from "@/src/types/qr";
import { Download, Cloud, Loader2 } from "lucide-react";
import { useAuth } from "@/src/components/auth/AuthProvider";
import { qrService } from "@/src/lib/qrService";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/src/lib/firebase";

const initialOptions: QRState = {
  width: 300,
  height: 300,
  type: 'svg',
  data: "https://scanly.studio",
  image: "",
  margin: 10,
  qrOptions: {
    typeNumber: 0,
    mode: 'Byte',
    errorCorrectionLevel: 'Q'
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 0,
    crossOrigin: 'anonymous',
  },
  dotsOptions: {
    type: 'rounded',
    color: '#24292e',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#24292e',
  },
  cornersDotOptions: {
    type: 'dot',
    color: '#24292e',
  }
};

export default function App() {
  const [options, setOptions] = useState<QRState>(initialOptions);
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { setOptions: updateQR, containerRef: qrRef, download: dl, exportAsJSON: ex } = useQRCode(options);

  const handleOptionsChange = (newOptions: React.SetStateAction<QRState>) => {
    setOptions(newOptions);
    updateQR(newOptions);
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please login to save your QR codes to the cloud.");
      return;
    }

    const name = prompt("Enter a name for this QR code:", `QR ${new Date().toLocaleTimeString()}`);
    if (!name) return;

    setIsSaving(true);
    try {
      await qrService.saveQRCode(name, options);
      setRefreshKey(prev => prev + 1);
      trackEvent('save_qr_code', { name, data_length: options.data.length });
      alert("QR code saved successfully!");
    } catch (error) {
      alert("Failed to save QR code");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = (ext: 'png' | 'jpeg' | 'svg') => {
    dl(ext);
    trackEvent('download_qr_code', { format: ext });
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
        {/* Left Column: Controls */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-gray-900">Design Studio</h2>
                <p className="text-sm text-gray-500 font-medium">Craft your professional QR identity</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="rounded-full px-6 shadow-md hover:shadow-lg transition-all"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Cloud className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save to Cloud"}
                </Button>
              </div>
            </div>
            
            <div className="p-8">
              <QRControls 
                options={options} 
                setOptions={handleOptionsChange} 
                onExportJSON={ex}
              />
            </div>
          </div>

          {user && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
              <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                <h2 className="text-2xl font-black tracking-tight text-gray-900">Asset Vault</h2>
                <p className="text-sm text-gray-500 font-medium">Your synchronized professional designs</p>
              </div>
              <div className="p-8">
                <div key={refreshKey}>
                  <SavedQRs onLoad={handleOptionsChange} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 p-10 flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
                  <QRPreview containerRef={qrRef} />
                </div>
              </div>
              
              <div className="mt-12 w-full space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-px flex-1 bg-gray-100" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Export Options</span>
                  <div className="h-px flex-1 bg-gray-100" />
                </div>

                <button 
                  onClick={() => handleDownload('png')}
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  DOWNLOAD PNG
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleDownload('jpeg')}
                    className="py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold text-sm hover:border-primary/20 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    JPEG
                  </button>
                  <button 
                    onClick={() => handleDownload('svg')}
                    className="py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold text-sm hover:border-accent/20 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  >
                    SVG
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <p className="text-xs text-primary/80 font-bold leading-relaxed text-center">
                Studio Tip: High-contrast designs ensure 100% scan reliability across all professional print media.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SupportChat />
    </MainLayout>
  );
}


