export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export function createSpeechRecognizer(
  onResult: (text: string) => void,
  onError: (err: string) => void,
  onEnd: () => void
) {
  if (!isSpeechRecognitionSupported()) {
    onError('El reconocimiento de voz no está soportado en este navegador.');
    return null;
  }

  const SpeechRecognitionClass =
    (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
    (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

  const recognition = new SpeechRecognitionClass();
  recognition.lang = 'es-AR';
  recognition.continuous = true;
  recognition.interimResults = true;

  // FIX duplicación de dictado: event.results acumula TODO lo dicho desde el
  // inicio de la sesión. Recorrerlo completo en cada evento y encima concatenar
  // en el componente producía texto repetido ("La La Bom La bomba La bomba...").
  // Solución: emitir únicamente los resultados FINALES nuevos, una sola vez,
  // llevando un puntero de hasta dónde ya se emitió.
  let emittedUpTo = 0;
  recognition.onresult = (event: any) => {
    let newFinalText = '';
    const results = event.results;
    if (results) {
      for (let i = emittedUpTo; i < results.length; i++) {
        if (results[i].isFinal) {
          newFinalText += results[i][0].transcript;
          emittedUpTo = i + 1;
        }
      }
    }
    const clean = newFinalText.trim();
    if (clean) {
      onResult(clean);
    }
  };

  recognition.onerror = (event: { error: string }) => {
    onError(event.error || 'Error en reconocimiento de voz');
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
