import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QRState, DotType, CornerSquareType, CornerDotType } from "@/src/types/qr";
import { Download, FileJson, Settings2, Palette, Square, Circle, Image as ImageIcon, Layout, QrCode, Upload, Loader2, X } from "lucide-react";
import { storageService } from "@/src/lib/storageService";
import { useAuth } from "@/src/components/auth/AuthProvider";
import { useTranslation } from "@/src/lib/i18n";

interface QRControlsProps {
  options: QRState;
  setOptions: React.Dispatch<React.SetStateAction<QRState>>;
  onExportJSON: () => void;
}

export function QRControls({ options, setOptions, onExportJSON }: QRControlsProps) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useTranslation();

  const updateOption = (path: string, value: any) => {
// ... existing code ...
    setOptions((prev) => {
      const newOptions = { ...prev };
      const keys = path.split('.');
      let current: any = newOptions;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newOptions;
    });
  };

  const renderColorOptions = (path: string, label: string, currentOptions: any) => {
    const isGradient = !!currentOptions.gradient;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>{label} Color</Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Gradient</span>
            <input 
              type="checkbox" 
              checked={isGradient}
              onChange={(e) => {
                if (e.target.checked) {
                  updateOption(`${path}.gradient`, {
                    type: 'linear',
                    rotation: 0,
                    colorStops: [
                      { offset: 0, color: currentOptions.color || '#000000' },
                      { offset: 1, color: '#ffffff' }
                    ]
                  });
                } else {
                  updateOption(`${path}.gradient`, undefined);
                }
              }}
              className="w-4 h-4 accent-pink-500"
            />
          </div>
        </div>

        {!isGradient ? (
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={currentOptions.color || '#000000'} 
              onChange={(e) => updateOption(`${path}.color`, e.target.value)}
              className="w-12 h-10 p-1 rounded-lg cursor-pointer"
            />
            <Input 
              value={currentOptions.color || '#000000'} 
              onChange={(e) => updateOption(`${path}.color`, e.target.value)}
              className="flex-1 rounded-xl"
            />
          </div>
        ) : (
          <div className="space-y-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="space-y-2">
              <Label className="text-xs">Gradient Type</Label>
              <Select 
                value={currentOptions.gradient.type} 
                onValueChange={(v) => updateOption(`${path}.gradient.type`, v)}
              >
                <SelectTrigger className="h-8 rounded-lg text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs">Rotation ({currentOptions.gradient.rotation}°)</Label>
              <Slider 
                value={[currentOptions.gradient.rotation]} 
                min={0} max={360} step={1}
                onValueChange={(v) => updateOption(`${path}.gradient.rotation`, v[0])}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Color 1</Label>
                <Input 
                  type="color" 
                  value={currentOptions.gradient.colorStops[0].color} 
                  onChange={(e) => {
                    const newStops = [...currentOptions.gradient.colorStops];
                    newStops[0].color = e.target.value;
                    updateOption(`${path}.gradient.colorStops`, newStops);
                  }}
                  className="w-full h-8 p-1 rounded-lg cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Color 2</Label>
                <Input 
                  type="color" 
                  value={currentOptions.gradient.colorStops[1].color} 
                  onChange={(e) => {
                    const newStops = [...currentOptions.gradient.colorStops];
                    newStops[1].color = e.target.value;
                    updateOption(`${path}.gradient.colorStops`, newStops);
                  }}
                  className="w-full h-8 p-1 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {/* 1. Main */}
      <AccordionItem value="main" className="border-none rounded-2xl px-0">
        <AccordionTrigger className="hover:no-underline py-4 px-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
              <Settings2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">{t('contentSize')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-6 pb-2 px-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('qrData')}</Label>
            <Input 
              value={options.data} 
              onChange={(e) => updateOption('data', e.target.value)}
              placeholder="https://example.com"
              className="rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all h-12"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('width')} ({options.width}px)</Label>
              <Slider 
                value={[options.width || 300]} 
                min={100} max={1000} step={10}
                onValueChange={(v) => updateOption('width', v[0])}
                className="py-4"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('height')} ({options.height}px)</Label>
              <Slider 
                value={[options.height || 300]} 
                min={100} max={1000} step={10}
                onValueChange={(v) => updateOption('height', v[0])}
                className="py-4"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('margin')} ({options.margin}px)</Label>
            <Slider 
              value={[options.margin || 0]} 
              min={0} max={100} step={1}
              onValueChange={(v) => updateOption('margin', v[0])}
              className="py-4"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 2. Dots */}
      <AccordionItem value="dots" className="border-none rounded-2xl px-0">
        <AccordionTrigger className="hover:no-underline py-4 px-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
              <Palette className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">{t('patternStyle')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-6 pb-2 px-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('dotPattern')}</Label>
            <Select 
              value={options.dotsOptions.type} 
              onValueChange={(v) => updateOption('dotsOptions.type', v)}
            >
              <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50/30 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'].map(t => (
                  <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderColorOptions('dotsOptions', 'Pattern', options.dotsOptions)}
        </AccordionContent>
      </AccordionItem>

      {/* 3. Corners Square */}
      <AccordionItem value="corners-square" className="border-none rounded-2xl px-0">
        <AccordionTrigger className="hover:no-underline py-4 px-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
              <Square className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">{t('cornerFrames')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-6 pb-2 px-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('frameShape')}</Label>
            <Select 
              value={options.cornersSquareOptions.type} 
              onValueChange={(v) => updateOption('cornersSquareOptions.type', v)}
            >
              <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50/30 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['dot', 'square', 'extra-rounded'].map(t => (
                  <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderColorOptions('cornersSquareOptions', 'Frame', options.cornersSquareOptions)}
        </AccordionContent>
      </AccordionItem>

      {/* 4. Corners Dot */}
      <AccordionItem value="corners-dot" className="border-none rounded-2xl px-0">
        <AccordionTrigger className="hover:no-underline py-4 px-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
              <Circle className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">{t('cornerEyes')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-6 pb-2 px-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('eyeShape')}</Label>
            <Select 
              value={options.cornersDotOptions.type} 
              onValueChange={(v) => updateOption('cornersDotOptions.type', v)}
            >
              <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50/30 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['dot', 'square'].map(t => (
                  <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {renderColorOptions('cornersDotOptions', 'Eye', options.cornersDotOptions)}
        </AccordionContent>
      </AccordionItem>

      {/* 5. Background */}
      <AccordionItem value="background" className="border-none rounded-2xl px-0">
        <AccordionTrigger className="hover:no-underline py-4 px-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
              <Layout className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">{t('canvas')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-6 pb-2 px-6 space-y-6">
          {renderColorOptions('backgroundOptions', t('canvas'), options.backgroundOptions)}
        </AccordionContent>
      </AccordionItem>


      {/* 6. Image */}
      <AccordionItem value="image" className="border-none rounded-2xl px-0">
        <AccordionTrigger className="hover:no-underline py-4 px-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">{t('logoBranding')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-6 pb-2 px-6 space-y-8">
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('brandAssets')}</Label>
            
            {!user ? (
              <div className="p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                <p className="text-xs text-gray-500 font-medium">{t('loginToUpload')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {options.image ? (
                  <div className="relative group">
                    <img 
                      src={options.image} 
                      alt="Logo Preview" 
                      className="w-full h-40 object-contain bg-gray-50 rounded-2xl border border-gray-100 p-4"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => updateOption('image', '')}
                      className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-full shadow-xl hover:bg-red-50 transition-all border border-red-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 hover:border-primary/30 transition-all group"
                  >
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    ) : (
                      <>
                        <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 group-hover:text-primary tracking-tight">{t('uploadLogo')}</span>
                      </>
                    )}
                  </div>
                )}
                
                <input 
                  id="logo-upload"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    setIsUploading(true);
                    try {
                      const url = await storageService.uploadQRImage(file);
                      updateOption('image', url);
                    } catch (error) {
                      alert(t('saveError'));
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                />
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('directUrl')}</Label>
              <Input 
                value={options.image} 
                onChange={(e) => updateOption('image', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="rounded-xl h-10 text-xs bg-gray-50/50 border-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <Label className="text-sm font-bold text-gray-700">{t('clearance')}</Label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{t('hideDots')}</span>
              <input 
                type="checkbox" 
                checked={options.imageOptions.hideBackgroundDots}
                onChange={(e) => updateOption('imageOptions.hideBackgroundDots', e.target.checked)}
                className="w-5 h-5 accent-primary rounded-md"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('logoScale')}</Label>
              <span className="text-xs font-bold text-primary">{Math.round(options.imageOptions.imageSize * 100)}%</span>
            </div>
            <Slider 
              value={[options.imageOptions.imageSize]} 
              min={0.1} max={1} step={0.05}
              onValueChange={(v) => updateOption('imageOptions.imageSize', v[0])}
              className="py-2"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('logoPadding')}</Label>
              <span className="text-xs font-bold text-primary">{options.imageOptions.margin}px</span>
            </div>
            <Slider 
              value={[options.imageOptions.margin]} 
              min={0} max={50} step={1}
              onValueChange={(v) => updateOption('imageOptions.margin', v[0])}
              className="py-2"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 7. QR Options */}
      <AccordionItem value="qr-options" className="border-none rounded-2xl px-0">
        <AccordionTrigger className="hover:no-underline py-4 px-6 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white shadow-sm text-primary">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">{t('advancedEngine')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-6 pb-2 px-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('renderEngine')}</Label>
            <Select 
              value={options.type} 
              onValueChange={(v) => updateOption('type', v)}
            >
              <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50/30 h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="svg">SVG (Vector)</SelectItem>
                <SelectItem value="canvas">Canvas (Raster)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('typeNumber')} ({options.qrOptions.typeNumber === 0 ? 'Auto' : options.qrOptions.typeNumber})</Label>
            <Slider 
              value={[options.qrOptions.typeNumber]} 
              min={0} max={40} step={1}
              onValueChange={(v) => updateOption('qrOptions.typeNumber', v[0])}
              className="py-4"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('encoding')}</Label>
              <Select 
                value={options.qrOptions.mode} 
                onValueChange={(v) => updateOption('qrOptions.mode', v)}
              >
                <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50/30 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Numeric', 'Alphanumeric', 'Byte', 'Kanji'].map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-gray-400">{t('correction')}</Label>
              <Select 
                value={options.qrOptions.errorCorrectionLevel} 
                onValueChange={(v) => updateOption('qrOptions.errorCorrectionLevel', v)}
              >
                <SelectTrigger className="rounded-xl border-gray-100 bg-gray-50/30 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['L', 'M', 'Q', 'H'].map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 8. Export as JSON */}
      <div className="pt-8">
        <Button 
          variant="outline" 
          className="w-full h-16 rounded-3xl border-2 border-dashed border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all group shadow-sm"
          onClick={onExportJSON}
        >
          <div className="p-2 bg-white rounded-xl shadow-sm mr-3 group-hover:scale-110 transition-transform">
            <FileJson className="w-5 h-5 text-gray-400 group-hover:text-primary" />
          </div>
          <span className="font-black text-sm text-gray-500 group-hover:text-primary tracking-tight">{t('exportConfig')}</span>
        </Button>
      </div>
    </Accordion>
  );
}
