
import { Platform } from 'react-native';
import { WebAudioService } from './webAudioService';

export class AudioService {
  private webAudioService: WebAudioService | null = null;
  private recordingPath: string = '';

  constructor() {
    if (Platform.OS === 'web') {
      this.webAudioService = new WebAudioService();
    }
  }

  async startRecording(quality: 'low' | 'medium' | 'high' = 'high'): Promise<string | null> {
    if (Platform.OS === 'web' && this.webAudioService) {
      await this.webAudioService.startRecording();
      return null;
    }
    // Mobile stub
    return null;
  }

  async stopRecording(): Promise<string | null> {
    if (Platform.OS === 'web' && this.webAudioService) {
      return await this.webAudioService.stopRecording();
    }
    // Mobile stub
    return null;
  }

  async pauseRecording(): Promise<void> {
    if (Platform.OS === 'web') return;
    // Mobile stub
  }

  async resumeRecording(): Promise<void> {
    if (Platform.OS === 'web') return;
    // Mobile stub
  }

  async startPlaying(uri: string, speed: number = 1.0): Promise<void> {
    if (Platform.OS === 'web' && this.webAudioService) {
      await this.webAudioService.startPlaying(uri);
      return;
    }
    // Mobile stub
  }

  async stopPlaying(): Promise<void> {
    if (Platform.OS === 'web' && this.webAudioService) {
      await this.webAudioService.stopPlaying();
      return;
    }
    // Mobile stub
  }

  async pausePlaying(): Promise<void> {
    if (Platform.OS === 'web') return;
    // Mobile stub
  }

  removeRecordListener(): void {
    if (Platform.OS === 'web') return;
    // Mobile stub
  }

  removePlaybackListener(): void {
    if (Platform.OS === 'web') return;
    // Mobile stub
  }

  private getIOSQuality(quality: 'low' | 'medium' | 'high'): any {
    // Mobile stub
    return null;
  }
}