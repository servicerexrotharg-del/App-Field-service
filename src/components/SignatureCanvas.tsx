import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Upload, Check } from 'lucide-react';

interface SignatureCanvasProps {
  label: string;
  initialValue?: string;
  onSave: (base64Url: string) => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ label, initialValue, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(initialValue));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 300;
    canvas.height = rect.height || 120;

    ctx.strokeStyle = '#06b6d4'; // Cyan 500
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialValue) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = initialValue;
    }
  }, [initialValue]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
    onSave('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              setHasSignature(true);
              onSave(canvas.toDataURL('image/png'));
            }
          }
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex flex-col space-y-2">
      <div className="flex justify-between items-start min-h-[36px]">
        <span className="text-[11px] font-semibold uppercase text-cyan-400 tracking-wide">{label}</span>
        <div className="flex items-center gap-1">
          <label
            title="Pegar imagen de firma desde rollo fotográfico"
            className="p-1 bg-slate-800 text-slate-300 hover:text-cyan-400 rounded cursor-pointer transition-colors text-xs flex items-center gap-1 border border-slate-700"
          >
            <Upload className="w-3 h-3" />
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          {hasSignature && (
            <button
              type="button"
              onClick={clearCanvas}
              title="Borrar firma"
              className="p-1 bg-slate-800 text-rose-400 hover:text-rose-300 rounded border border-slate-700"
            >
              <Eraser className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="relative border border-dashed border-slate-700 rounded-md bg-slate-950/80 overflow-hidden h-28 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none"
        />
        {!hasSignature && (
          <span className="absolute text-[10px] text-slate-500 pointer-events-none italic">
            Dibuje la firma a mano alzada o cargue imagen
          </span>
        )}
      </div>

      {hasSignature && (
        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
          <Check className="w-3 h-3" />
          <span>Firma capturada correctamente</span>
        </div>
      )}
    </div>
  );
};
