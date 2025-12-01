import React from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import { VoiceNote } from '../types';
import VoiceNoteItem from './VoiceNoteItem';
import { COLORS } from '../utils/constants';

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
        <Text style={styles.emptyText}>
          {searchQuery
            ? 'No recordings found'
            : 'No recordings yet.\nTap the + button to start recording!'}
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
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default VoiceNoteList;