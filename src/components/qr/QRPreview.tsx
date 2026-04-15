import React from "react";

interface QRPreviewProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function QRPreview({ containerRef }: QRPreviewProps) {
  return (
    <div className="aspect-square bg-white rounded-3xl border border-gray-100 shadow-xl flex items-center justify-center p-8 overflow-hidden">
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:h-auto [&>svg]:max-w-full [&>svg]:h-auto"
      />
    </div>
  );
}
