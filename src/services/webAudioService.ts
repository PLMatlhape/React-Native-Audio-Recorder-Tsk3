// WebAudioService: fallback for audio recording/playback on web
// Uses MediaRecorder and Blob URLs

export class WebAudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioUrl: string = '';
  private isRecording: boolean = false;

  async startRecording(): Promise<string | null> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Web audio recording is not supported in this browser.');
      return null;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];
    this.isRecording = true;
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    };
    this.mediaRecorder.start();
    return null;
  }

  async stopRecording(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioUrl = URL.createObjectURL(audioBlob);
        this.isRecording = false;
        resolve(this.audioUrl);
      };
      this.mediaRecorder.stop();
    });
  }

  async startPlaying(url: string): Promise<void> {
    const audio = new Audio(url);
    audio.play();
  }

  async stopPlaying(): Promise<void> {
    // Not implemented for web fallback
  }

  isRecordingActive(): boolean {
    return this.isRecording;
  }
}
