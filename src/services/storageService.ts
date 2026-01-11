import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
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
      
      // Delete the audio file if it exists
      if (noteToDelete && noteToDelete.uri && Platform.OS !== 'web') {
        try {
          const fileInfo = await FileSystem.getInfoAsync(noteToDelete.uri);
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(noteToDelete.uri);
          }
        } catch (fileError) {
          console.warn('Could not delete audio file:', fileError);
        }
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
        // For web, try to fetch blob and get size
        if (uri && uri.startsWith('blob:')) {
          try {
            const response = await fetch(uri);
            const blob = await response.blob();
            return blob.size;
          } catch {
            return 0;
          }
        }
        return 0;
      }
      
      // For mobile, use expo-file-system
      if (!uri) return 0;
      
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && 'size' in fileInfo) {
        return fileInfo.size || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  }
}