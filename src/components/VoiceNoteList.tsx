import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { VoiceNote } from '../types';
import { COLORS } from '../utils/constants';
import VoiceNoteItem from './VoiceNoteItem';

interface VoiceNoteListProps {
  notes: VoiceNote[];
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
  searchQuery?: string;
}

const VoiceNoteList: React.FC<VoiceNoteListProps> = ({
  notes,
  onDelete,
  onRename,
  searchQuery = '',
}) => {
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredNotes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <MaterialIcons 
            name={searchQuery ? 'search-off' : 'mic-none'} 
            size={64} 
            color={COLORS.primary} 
          />
        </View>
        <Text style={styles.emptyTitle}>
          {searchQuery ? 'No Results Found' : 'No Recordings Yet'}
        </Text>
        <Text style={styles.emptyText}>
          {searchQuery
            ? `No recordings match "${searchQuery}"`
            : 'Tap the + button below to\nstart your first recording!'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredNotes}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <VoiceNoteItem note={item} onDelete={onDelete} onRename={onRename} />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100, // Extra space for FAB
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default VoiceNoteList;