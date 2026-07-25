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

  recognition.onresult = (event: any) => {
    let transcript = '';
    const results = event.results;
    if (results) {
      for (let i = 0; i < results.length; i++) {
        transcript += results[i][0].transcript;
      }
    }
    onResult(transcript);
  };

  recognition.onerror = (event: { error: string }) => {
    onError(event.error || 'Error en reconocimiento de voz');
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
