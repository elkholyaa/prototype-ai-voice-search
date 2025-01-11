/**
 * Speech recognition service for handling voice input
 */
class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ar-SA';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
      }
    }
  }

  start(onResult: (text: string) => void, onError?: (error: Error) => void): void {
    if (!this.recognition) {
      onError?.(new Error('Speech recognition is not supported in this browser'));
      return;
    }

    this.recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    this.recognition.onerror = (event) => {
      onError?.(new Error(`Speech recognition error: ${event.error}`));
    };

    this.recognition.start();
  }

  stop(): void {
    this.recognition?.stop();
  }
}

export const speechService = new SpeechRecognitionService(); 