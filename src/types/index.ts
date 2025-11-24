export interface VoiceNote {
  id: string;
  title: string;
  uri: string;
  duration: number;
  date: Date;
  size: number;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordTime: number;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

export interface AppSettings {
  recordingQuality: 'low' | 'medium' | 'high';
  playbackSpeed: number;
  autoBackup: boolean;
}

export interface AudioMetrics {
  currentMetering: number;
  averagePower: number;
}