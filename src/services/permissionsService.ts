import { Audio } from 'expo-av';
import { Alert, Platform } from 'react-native';

export class PermissionsService {
  static async requestMicrophonePermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Web browsers handle microphone permissions automatically via getUserMedia
        // Return true to allow the recording attempt, browser will prompt user
        return true;
      }
      
      // For mobile: Use expo-av to request microphone permission
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  }

  // Check current permission status without prompting
  static async checkMicrophonePermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    try {
      if (Platform.OS === 'web') {
        return 'granted'; // Web handles this differently
      }
      
      const { status } = await Audio.getPermissionsAsync();
      if (status === 'granted') return 'granted';
      if (status === 'denied') return 'denied';
      return 'undetermined';
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return 'undetermined';
    }
  }

  // Storage permission is not required for Expo managed workflow
  static async requestStoragePermission(): Promise<boolean> {
    return true;
  }

  static async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      // Web browsers handle permissions automatically
      return true;
    }
    
    const micPermission = await this.requestMicrophonePermission();
    if (!micPermission) {
      Alert.alert(
        'Permission Required',
        'Microphone permission is required to record audio. Please enable it in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return micPermission;
  }

  // Initialize permissions on app startup - call this early
  static async initializePermissions(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Request microphone permission on app start
      await this.requestMicrophonePermission();
    } catch (error) {
      console.error('Error initializing permissions:', error);
    }
  }
}