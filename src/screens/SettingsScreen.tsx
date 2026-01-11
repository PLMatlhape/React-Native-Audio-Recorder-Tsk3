import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { StorageService } from '../services/storageService';
import { AppSettings } from '../types';
import { COLORS } from '../utils/constants';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<AppSettings>({
    recordingQuality: 'high',
    playbackSpeed: 1.0,
    autoBackup: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await StorageService.getSettings();
    setSettings(loadedSettings);
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await StorageService.saveSettings(newSettings);
      setSettings(newSettings);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const qualityOptions: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recording Quality</Text>
          <Text style={styles.sectionDescription}>
            Higher quality results in larger file sizes
          </Text>
          <View style={styles.optionsContainer}>
            {qualityOptions.map(quality => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.optionButton,
                  settings.recordingQuality === quality &&
                    styles.optionButtonActive,
                ]}
                onPress={() =>
                  saveSettings({ ...settings, recordingQuality: quality })
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.recordingQuality === quality &&
                      styles.optionTextActive,
                  ]}
                >
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Playback Speed</Text>
          <Text style={styles.sectionDescription}>
            Adjust default playback speed for recordings
          </Text>
          <View style={styles.optionsContainer}>
            {speedOptions.map(speed => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.optionButton,
                  settings.playbackSpeed === speed && styles.optionButtonActive,
                ]}
                onPress={() =>
                  saveSettings({ ...settings, playbackSpeed: speed })
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    settings.playbackSpeed === speed && styles.optionTextActive,
                  ]}
                >
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Auto Backup</Text>
              <Text style={styles.sectionDescription}>
                Automatically backup recordings to cloud storage (Feature coming soon)
              </Text>
            </View>
            <Switch
              value={settings.autoBackup}
              onValueChange={value =>
                saveSettings({ ...settings, autoBackup: value })
              }
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Developer</Text>
            <Text style={styles.infoValue}>PLMatlhape</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback & Support</Text>
          <Text style={styles.sectionDescription}>
            We would love to hear from you! Share your feedback or get help.
          </Text>
          
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => {
              Alert.alert(
                'Send Feedback',
                'How would you like to reach us?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Rate App', 
                    onPress: () => Alert.alert('Thank you!', 'Rating feature coming soon.') 
                  },
                  { 
                    text: 'Email Us', 
                    onPress: () => Alert.alert('Email', 'Contact: support@audiorecorder.app') 
                  },
                ]
              );
            }}
          >
            <MaterialIcons name="feedback" size={24} color={COLORS.primary} />
            <Text style={styles.supportButtonText}>Send Feedback</Text>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => {
              Alert.alert(
                'Help & FAQ',
                '• Tap the + button to start recording\n• Tap on a recording to play it\n• Tap the edit icon to rename\n• Tap the delete icon to remove\n• Use the search bar to find recordings\n\nFor more help, contact support.',
                [{ text: 'Got it' }]
              );
            }}
          >
            <MaterialIcons name="help" size={24} color={COLORS.primary} />
            <Text style={styles.supportButtonText}>Help & FAQ</Text>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for CodeTribe Assessment</Text>
        </View>
      </ScrollView>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary + '30',
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  optionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 12,
  },
  supportButtonText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default SettingsScreen;