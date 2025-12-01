import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { AudioService } from '../services/audioService';
import { PermissionsService } from '../services/permissionsService';
import { StorageService } from '../services/storageService';
import { VoiceNote } from '../types';
import { COLORS } from '../utils/constants';
import { formatTime } from '../utils/formatters';
import { createShadow } from '../utils/shadow';
import AnimatedSphere from './AnimatedSphere';

interface AudioRecorderProps {
  onRecordingComplete: (note: VoiceNote) => void;
  quality?: 'low' | 'medium' | 'high';
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  quality = 'high',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioService = useRef(new AudioService()).current;
  const recordingUri = useRef<string>('');

  useEffect(() => {
    // audioService.onRecordProgress is not available in web stub
    return () => {
      // audioService.removeRecordListener();
    };
  }, [audioService]);

  const startRecording = async () => {
    try {
      const hasPermission = await PermissionsService.checkPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Required', 'Microphone permission is required to record audio.');
        return;
      }

      const uri = await audioService.startRecording(quality);
  recordingUri.current = uri ?? '';
      setIsRecording(true);
      setIsPaused(false);
      setRecordTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const pauseRecording = async () => {
    try {
      await audioService.pauseRecording();
      setIsPaused(true);
    } catch (error) {
      console.error('Error pausing recording:', error);
    }
  };

  const resumeRecording = async () => {
    try {
      await audioService.resumeRecording();
      setIsPaused(false);
    } catch (error) {
      console.error('Error resuming recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await audioService.stopRecording();
      const size = await StorageService.getFileSize(recordingUri.current);
      
      const note: VoiceNote = {
        id: Date.now().toString(),
        title: `Recording ${new Date().toLocaleString()}`,
        uri: recordingUri.current,
        duration: recordTime,
        date: new Date(),
        size,
      };

      await StorageService.saveVoiceNote(note);
      onRecordingComplete(note);
      
      setIsRecording(false);
      setIsPaused(false);
      setRecordTime(0);
      setAudioLevel(0);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to save recording. Please try again.');
    }
  };

  const cancelRecording = async () => {
    Alert.alert(
      'Cancel Recording',
      'Are you sure you want to discard this recording?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            await audioService.stopRecording();
            setIsRecording(false);
            setIsPaused(false);
            setRecordTime(0);
            setAudioLevel(0);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AnimatedSphere isRecording={isRecording} audioLevel={audioLevel} />

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(recordTime)}</Text>
        {isRecording && (
          <View style={[styles.recordingIndicator, isPaused && styles.pausedIndicator]} />
        )}
      </View>

      <View style={styles.controls}>
        {!isRecording ? (
          <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
            <Text style={{fontSize: 32, color: COLORS.text}}>🎤</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.controlButton} onPress={cancelRecording}>
              <Text style={{fontSize: 24, color: COLORS.error}}>✖</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pauseButton}
              onPress={isPaused ? resumeRecording : pauseRecording}
            >
              <Text style={{fontSize: 24, color: COLORS.text}}>{isPaused ? '▶' : '⏸'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={stopRecording}>
              <Text style={{fontSize: 24, color: COLORS.success}}>✔</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '300',
    color: COLORS.text,
    marginRight: 12,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.error,
  },
  pausedIndicator: {
    backgroundColor: COLORS.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 40,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow(COLORS.primary, { width: 0, height: 4 }, 0.3, 8, 8),
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AudioRecorder;