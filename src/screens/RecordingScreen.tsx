import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AnimatedSphere from '../components/AnimatedSphere';
import { AudioService } from '../services/audioService';
import { PermissionsService } from '../services/permissionsService';
import { StorageService } from '../services/storageService';
import { COLORS } from '../utils/constants';
import { formatTime } from '../utils/formatters';
import { createShadow } from '../utils/shadow';

type RootStackParamList = {
  Home: undefined;
  Recording: undefined;
};

type RecordingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Recording'>;
};

const RecordingScreen: React.FC<RecordingScreenProps> = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime] = useState(0);
  const [audioLevel] = useState(0);
  const [title, setTitle] = useState('');
  const audioService = useRef(new AudioService()).current;
  const recordingPath = useRef<string>('');

  useEffect(() => {
    checkPermissions();
    
    // audioService.onRecordProgress is not available in web stub

    return () => {
      if (isRecording) {
        audioService.stopRecording();
      }
      // audioService.removeRecordListener();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPermissions = async () => {
    const hasPermissions = await PermissionsService.checkPermissions();
    if (!hasPermissions) {
      Alert.alert(
        'Permissions Required',
        'Please grant microphone permission to record audio.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleStartRecording = async () => {
    try {
      const hasPermissions = await PermissionsService.checkPermissions();
      if (!hasPermissions) {
        Alert.alert('Error', 'Microphone permission is required');
        return;
      }

      const path = await audioService.startRecording('high');
      recordingPath.current = path ?? '';
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const handlePauseResume = async () => {
    try {
      if (isPaused) {
        await audioService.resumeRecording();
      } else {
        await audioService.pauseRecording();
      }
      setIsPaused(!isPaused);
    } catch (error) {
      console.error('Error pausing/resuming recording:', error);
      Alert.alert('Error', 'Failed to pause/resume recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      await audioService.stopRecording();
      setIsRecording(false);
      setIsPaused(false);

      // Show save dialog
      Alert.alert(
        'Save Recording',
        'Enter a title for your recording',
        [
          {
            text: 'Cancel',
            onPress: () => {
              navigation.goBack();
            },
            style: 'cancel',
          },
          {
            text: 'Save',
            onPress: async () => {
              await saveRecording();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const saveRecording = async () => {
    try {
      const fileSize = await StorageService.getFileSize(recordingPath.current);
      
      const voiceNote = {
        id: Date.now().toString(),
        title: title.trim() || `Recording ${new Date().toLocaleDateString()}`,
        uri: recordingPath.current,
        duration: recordTime,
        date: new Date(),
        size: fileSize,
      };

      await StorageService.saveVoiceNote(voiceNote);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving recording:', error);
      Alert.alert('Error', 'Failed to save recording');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (isRecording) {
              Alert.alert(
                'Discard Recording?',
                'Are you sure you want to discard this recording?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => {
                      audioService.stopRecording();
                      navigation.goBack();
                    },
                  },
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
        >
          <MaterialIcons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <AnimatedSphere isRecording={isRecording} audioLevel={audioLevel} />

        <Text style={styles.timer}>{formatTime(recordTime)}</Text>

        {isRecording && (
          <Text style={styles.status}>
            {isPaused ? 'Paused' : 'Recording...'}
          </Text>
        )}

        {!isRecording && (
          <TextInput
            style={styles.titleInput}
            placeholder="Enter recording title (optional)"
            placeholderTextColor={COLORS.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        )}
      </View>

      <View style={styles.controls}>
        {!isRecording ? (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handleStartRecording}
            activeOpacity={0.8}
          >
            <MaterialIcons name="fiber-manual-record" size={40} color={COLORS.text} />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePauseResume}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={isPaused ? 'play-arrow' : 'pause'}
                size={32}
                color={COLORS.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.recordButton, styles.stopButton]}
              onPress={handleStopRecording}
              activeOpacity={0.8}
            >
              <MaterialIcons name="stop" size={40} color={COLORS.text} />
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 32,
    fontVariant: ['tabular-nums'],
  },
  status: {
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 12,
  },
  titleInput: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    marginTop: 32,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
    gap: 24,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow('#000', { width: 0, height: 4 }, 0.3, 8, 8),
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});

export default RecordingScreen;