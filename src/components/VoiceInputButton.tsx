import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../lib/speech';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleListening = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Tu navegador o dispositivo no soporta dictado por voz.');
      return;
    }

    if (isListening && recognizer) {
      recognizer.stop();
      setIsListening(false);
      return;
    }

    setErrorMsg(null);
    const rec = createSpeechRecognizer(
      (text) => {
        onTranscript(text);
      },
      (err) => {
        setErrorMsg('Error de voz: ' + err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (rec) {
      rec.start();
      setRecognizer(rec);
      setIsListening(true);
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? 'Detener dictado por voz' : 'Iniciar dictado por voz'}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
          isListening
            ? 'bg-rose-600 text-white animate-pulse border border-rose-400'
            : 'bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-slate-700'
        }`}
      >
        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        <span>{isListening ? 'Escuchando...' : 'Dictar por voz'}</span>
      </button>
      {errorMsg && <span className="text-[10px] text-rose-400">{errorMsg}</span>}
    </div>
  );
};
