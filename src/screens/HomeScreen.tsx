import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import VoiceNoteList from '../components/VoiceNoteList';
import { StorageService } from '../services/storageService';
import { VoiceNote } from '../types';
import { COLORS } from '../utils/constants';
import { createShadow } from '../utils/shadow';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setIsLoading] = useState(true);

  const loadNotes = async () => {
    try {
      const loadedNotes = await StorageService.getAllVoiceNotes();
      // Sort by date, newest first
      loadedNotes.sort((a, b) => b.date.getTime() - a.date.getTime());
      setNotes(loadedNotes);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const handleDelete = async (id: string) => {
    try {
      await StorageService.deleteVoiceNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleRename = async (id: string, newTitle: string) => {
    try {
      await StorageService.updateVoiceNote(id, { title: newTitle });
      setNotes(
        notes.map(note => (note.id === id ? { ...note, title: newTitle } : note))
      );
    } catch (error) {
      console.error('Error renaming note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Notes</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}
        >
          <MaterialIcons name="settings" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search recordings..."
      />

      <VoiceNoteList
        notes={notes}
        onDelete={handleDelete}
        onRename={handleRename}
        searchQuery={searchQuery}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Recording')}
      >
        <MaterialIcons name="add" size={32} color={COLORS.text} />
      </TouchableOpacity>
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
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  settingsButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow(COLORS.primary, { width: 0, height: 4 }, 0.3, 8, 8),
  },
});

export default HomeScreen;