import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
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
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);

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

  const handleRename = () => {
    setEditTitle(note.title);
    setIsEditing(true);
  };

  const handleSaveRename = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && trimmedTitle !== note.title) {
      onRename(note.id, trimmedTitle);
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setEditTitle(note.title);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => !isEditing && setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
        disabled={isEditing}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="mic" size={24} color={COLORS.primary} />
        </View>
        
        <View style={styles.infoContainer}>
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editTitle}
                onChangeText={setEditTitle}
                autoFocus
                selectTextOnFocus
                onSubmitEditing={handleSaveRename}
                onBlur={handleCancelRename}
              />
              <TouchableOpacity onPress={handleSaveRename} style={styles.editButton}>
                <MaterialIcons name="check" size={20} color={COLORS.success} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancelRename} style={styles.editButton}>
                <MaterialIcons name="close" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.title} numberOfLines={1}>
                {note.title}
              </Text>
              <View style={styles.metaContainer}>
                <Text style={styles.metaText}>{formatDate(note.date)}</Text>
                <Text style={styles.metaText}> • </Text>
                <Text style={styles.metaText}>{formatTime(note.duration)}</Text>
                {note.size > 0 && (
                  <>
                    <Text style={styles.metaText}> • </Text>
                    <Text style={styles.metaText}>{formatFileSize(note.size)}</Text>
                  </>
                )}
              </View>
            </>
          )}
        </View>

        {!isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleRename} style={styles.actionButton}>
              <MaterialIcons name="edit" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <MaterialIcons name="delete" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {isExpanded && !isEditing && (
        <View style={styles.expandedContent}>
          <AudioPlayer uri={note.uri} initialDuration={note.duration} />
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
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  editButton: {
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
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