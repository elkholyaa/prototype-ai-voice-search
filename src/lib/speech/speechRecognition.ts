/**
 * Service for handling browser speech recognition with Arabic support
 * @class SpeechRecognitionService
 */
export class SpeechRecognitionService {
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

  /**
   * Starts listening for voice input
   * @param onResult - Callback for successful voice recognition
   * @param onError - Callback for handling errors
   */
  startListening(onResult: (text: string) => void, onError: (error: any) => void) {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported'));
      return;
    }

    this.recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    this.recognition.onerror = onError;
    this.recognition.start();
  }

  /**
   * Stops listening for voice input
   */
  stopListening() {
    this.recognition?.stop();
  }
} 