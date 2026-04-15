import { useEffect, useRef, useState } from "react";
import QRCodeStyling, { Options } from "qr-code-styling";

export function useQRCode(initialOptions: Options) {
  const [options, setOptions] = useState<Options>(initialOptions);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling(options);
    if (containerRef.current) {
      qrCode.current.append(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update(options);
    }
  }, [options]);

  const download = (extension: 'png' | 'jpeg' | 'svg') => {
    if (qrCode.current) {
      qrCode.current.download({ extension });
    }
  };

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(options, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "qr-config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return {
    options,
    setOptions,
    containerRef,
    download,
    exportAsJSON
  };
}
