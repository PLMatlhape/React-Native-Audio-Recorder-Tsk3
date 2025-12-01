import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { VoiceNote } from '../types';
import { COLORS } from '../utils/constants';
import { formatDate, formatFileSize, formatTime } from '../utils/formatters';
import AudioPlayer from './AudioPlayer';

interface VoiceNoteItemProps {
  note: VoiceNote;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

const VoiceNoteItem: React.FC<VoiceNoteItemProps> = ({
  note,
  onDelete,
  onRename,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(note.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="mic" size={24} color={COLORS.primary} />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {note.title}
          </Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{formatDate(note.date)}</Text>
            <Text style={styles.metaText}> • </Text>
            <Text style={styles.metaText}>{formatTime(note.duration)}</Text>
            <Text style={styles.metaText}> • </Text>
            <Text style={styles.metaText}>{formatFileSize(note.size)}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <MaterialIcons name="delete" size={24} color={COLORS.error} />
        </TouchableOpacity>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <AudioPlayer uri={note.uri} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default VoiceNoteItem;