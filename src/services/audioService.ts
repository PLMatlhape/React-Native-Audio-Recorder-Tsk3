import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { Platform } from 'react-native';
import { WebAudioService } from './webAudioService';

export type RecordingProgressCallback = (data: { currentPosition: number; currentMetering?: number }) => void;
export type PlaybackProgressCallback = (data: { currentPosition: number; duration: number; isPlaying: boolean }) => void;

export class AudioService {
  private webAudioService: WebAudioService | null = null;
  private recording: Audio.Recording | null = null;
  private sound: Audio.Sound | null = null;
  private recordingProgressCallback: RecordingProgressCallback | null = null;
  private playbackProgressCallback: PlaybackProgressCallback | null = null;
  private recordingTimer: ReturnType<typeof setInterval> | null = null;
  private recordingStartTime: number = 0;
  private pausedDuration: number = 0;
  private isPaused: boolean = false;

  constructor() {
    if (Platform.OS === 'web') {
      this.webAudioService = new WebAudioService();
    }
  }

  // Set callback for recording progress updates
  onRecordProgress(callback: RecordingProgressCallback): void {
    this.recordingProgressCallback = callback;
  }

  // Set callback for playback progress updates
  onPlaybackProgress(callback: PlaybackProgressCallback): void {
    this.playbackProgressCallback = callback;
  }

  async startRecording(quality: 'low' | 'medium' | 'high' = 'high'): Promise<string | null> {
    if (Platform.OS === 'web' && this.webAudioService) {
      await this.webAudioService.startRecording();
      this.startWebRecordingTimer();
      return null;
    }

    try {
      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Get recording options based on quality
      const recordingOptions = this.getRecordingOptions(quality);

      // Create and prepare recording
      const { recording } = await Audio.Recording.createAsync(
        recordingOptions,
        (status) => this.onRecordingStatusUpdate(status)
      );

      this.recording = recording;
      this.recordingStartTime = Date.now();
      this.pausedDuration = 0;
      this.isPaused = false;

      return recording.getURI();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  private startWebRecordingTimer(): void {
    this.recordingStartTime = Date.now();
    this.pausedDuration = 0;
    this.recordingTimer = setInterval(() => {
      if (this.recordingProgressCallback && !this.isPaused) {
        const elapsed = (Date.now() - this.recordingStartTime - this.pausedDuration) / 1000;
        this.recordingProgressCallback({ currentPosition: elapsed });
      }
    }, 100);
  }

  private onRecordingStatusUpdate(status: Audio.RecordingStatus): void {
    if (status.isRecording && this.recordingProgressCallback) {
      this.recordingProgressCallback({
        currentPosition: status.durationMillis / 1000,
        currentMetering: status.metering,
      });
    }
  }

  async stopRecording(): Promise<string | null> {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (Platform.OS === 'web' && this.webAudioService) {
      return await this.webAudioService.stopRecording();
    }

    if (!this.recording) {
      return null;
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      this.recording = null;
      return uri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  }

  async pauseRecording(): Promise<void> {
    if (Platform.OS === 'web') {
      this.isPaused = true;
      return;
    }

    if (this.recording) {
      try {
        await this.recording.pauseAsync();
        this.isPaused = true;
      } catch (error) {
        console.error('Error pausing recording:', error);
        throw error;
      }
    }
  }

  async resumeRecording(): Promise<void> {
    if (Platform.OS === 'web') {
      this.isPaused = false;
      return;
    }

    if (this.recording) {
      try {
        await this.recording.startAsync();
        this.isPaused = false;
      } catch (error) {
        console.error('Error resuming recording:', error);
        throw error;
      }
    }
  }

  async startPlaying(uri: string, speed: number = 1.0): Promise<void> {
    if (Platform.OS === 'web' && this.webAudioService) {
      await this.webAudioService.startPlaying(uri);
      return;
    }

    try {
      // Stop any existing playback
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      // Create and play sound
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, rate: speed, progressUpdateIntervalMillis: 100 },
        (status) => this.onPlaybackStatusUpdate(status)
      );

      this.sound = sound;
    } catch (error) {
      console.error('Error starting playback:', error);
      throw error;
    }
  }

  private onPlaybackStatusUpdate(status: AVPlaybackStatus): void {
    if (!status.isLoaded) return;
    
    const loadedStatus = status as AVPlaybackStatusSuccess;
    
    if (this.playbackProgressCallback) {
      this.playbackProgressCallback({
        currentPosition: loadedStatus.positionMillis / 1000,
        duration: loadedStatus.durationMillis ? loadedStatus.durationMillis / 1000 : 0,
        isPlaying: loadedStatus.isPlaying,
      });
    }

    // Auto-stop when playback finishes
    if (loadedStatus.didJustFinish) {
      this.playbackProgressCallback?.({
        currentPosition: 0,
        duration: loadedStatus.durationMillis ? loadedStatus.durationMillis / 1000 : 0,
        isPlaying: false,
      });
    }
  }

  async stopPlaying(): Promise<void> {
    if (Platform.OS === 'web' && this.webAudioService) {
      await this.webAudioService.stopPlaying();
      return;
    }

    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.setPositionAsync(0);
      } catch (error) {
        console.error('Error stopping playback:', error);
      }
    }
  }

  async pausePlaying(): Promise<void> {
    if (Platform.OS === 'web') return;

    if (this.sound) {
      try {
        await this.sound.pauseAsync();
      } catch (error) {
        console.error('Error pausing playback:', error);
        throw error;
      }
    }
  }

  async resumePlaying(): Promise<void> {
    if (Platform.OS === 'web') return;

    if (this.sound) {
      try {
        await this.sound.playAsync();
      } catch (error) {
        console.error('Error resuming playback:', error);
        throw error;
      }
    }
  }

  async seekTo(positionSec: number): Promise<void> {
    if (Platform.OS === 'web') return;

    if (this.sound) {
      try {
        await this.sound.setPositionAsync(positionSec * 1000);
      } catch (error) {
        console.error('Error seeking:', error);
        throw error;
      }
    }
  }

  async setPlaybackSpeed(speed: number): Promise<void> {
    if (Platform.OS === 'web') return;

    if (this.sound) {
      try {
        await this.sound.setRateAsync(speed, true);
      } catch (error) {
        console.error('Error setting playback speed:', error);
        throw error;
      }
    }
  }

  removeRecordListener(): void {
    this.recordingProgressCallback = null;
  }

  removePlaybackListener(): void {
    this.playbackProgressCallback = null;
  }

  async cleanup(): Promise<void> {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
    }
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch {
        // Ignore cleanup errors
      }
    }
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  private getRecordingOptions(quality: 'low' | 'medium' | 'high'): Audio.RecordingOptions {
    switch (quality) {
      case 'low':
        return Audio.RecordingOptionsPresets.LOW_QUALITY;
      case 'medium':
        return {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          android: {
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
            sampleRate: 22050,
            bitRate: 64000,
          },
          ios: {
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
            sampleRate: 22050,
            bitRate: 64000,
          },
        };
      case 'high':
      default:
        return Audio.RecordingOptionsPresets.HIGH_QUALITY;
    }
  }
}