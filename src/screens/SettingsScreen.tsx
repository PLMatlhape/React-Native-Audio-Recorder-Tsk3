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
        <Text style={styles.infoValue}>Audio Recorder Team</Text>
      </View>
    </View>

    <TouchableOpacity
      style={styles.feedbackButton}
      onPress={() => Alert.alert('Feedback', 'Coming soon!')}
    >
      <MaterialIcons name="feedback" size={24} color={COLORS.primary} />
      <Text style={styles.feedbackText}>Send Feedback</Text>
    </TouchableOpacity>
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
feedbackButton: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
padding: 16,
backgroundColor: COLORS.surface,
borderRadius: 12,
marginTop: 20,
gap: 12,
},
feedbackText: {
fontSize: 16,
fontWeight: '600',
color: COLORS.primary,
},
});
export default SettingsScreen;