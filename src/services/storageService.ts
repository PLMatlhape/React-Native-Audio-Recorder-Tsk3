import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { AppSettings, VoiceNote } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

export class StorageService {
  static async saveVoiceNote(voiceNote: VoiceNote): Promise<void> {
    try {
      const existingNotes = await this.getAllVoiceNotes();
      const updatedNotes = [...existingNotes, voiceNote];
      await AsyncStorage.setItem(
        STORAGE_KEYS.VOICE_NOTES,
        JSON.stringify(updatedNotes)
      );
    } catch (error) {
      console.error('Error saving voice note:', error);
      throw error;
    }
  }

  static async getAllVoiceNotes(): Promise<VoiceNote[]> {
    try {
      const notesJson = await AsyncStorage.getItem(STORAGE_KEYS.VOICE_NOTES);
      if (!notesJson) return [];
      
      const notes = JSON.parse(notesJson);
      // Convert date strings back to Date objects
      return notes.map((note: any) => ({
        ...note,
        date: new Date(note.date),
      }));
    } catch (error) {
      console.error('Error getting voice notes:', error);
      return [];
    }
  }

  static async deleteVoiceNote(id: string): Promise<void> {
    try {
      const notes = await this.getAllVoiceNotes();
      const noteToDelete = notes.find(note => note.id === id);
      
      if (noteToDelete && Platform.OS !== 'web') {
        // Delete the audio file (mobile only)
        // TODO: Implement with expo-file-system when adding native support
        console.warn('File deletion not yet implemented for mobile');
      }
      
      const updatedNotes = notes.filter(note => note.id !== id);
      await AsyncStorage.setItem(
        STORAGE_KEYS.VOICE_NOTES,
        JSON.stringify(updatedNotes)
      );
    } catch (error) {
      console.error('Error deleting voice note:', error);
      throw error;
    }
  }

  static async updateVoiceNote(id: string, updates: Partial<VoiceNote>): Promise<void> {
    try {
      const notes = await this.getAllVoiceNotes();
      const updatedNotes = notes.map(note =>
        note.id === id ? { ...note, ...updates } : note
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.VOICE_NOTES,
        JSON.stringify(updatedNotes)
      );
    } catch (error) {
      console.error('Error updating voice note:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<AppSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!settingsJson) {
        return {
          recordingQuality: 'high',
          playbackSpeed: 1.0,
          autoBackup: false,
        };
      }
      return JSON.parse(settingsJson);
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        recordingQuality: 'high',
        playbackSpeed: 1.0,
        autoBackup: false,
      };
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  static async getFileSize(uri: string): Promise<number> {
    try {
      if (Platform.OS === 'web') {
        // For web, approximate size from blob URL
        // TODO: Implement proper size calculation
        return 0;
      }
      // TODO: Implement with expo-file-system when adding native support
      return 0;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  }
}