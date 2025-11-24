import { Alert, Platform } from 'react-native';

export class PermissionsService {
  static async requestMicrophonePermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // Web browsers handle microphone permissions automatically via getUserMedia
        // Return true to allow the recording attempt, browser will prompt user
        return true;
      }
      
      // For mobile: Stub implementation - replace with expo-audio when implementing native
      // TODO: Add expo-audio and implement: 
      // const { status } = await Audio.requestPermissionsAsync();
      // return status === 'granted';
      console.warn('Mobile permissions not yet implemented');
      return false;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
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
        'Microphone permission is required to record audio.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return micPermission;
  }
}