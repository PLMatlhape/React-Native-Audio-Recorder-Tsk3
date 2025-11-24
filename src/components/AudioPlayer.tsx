import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { AudioService } from '../services/audioService';
import { COLORS } from '../utils/constants';
import { formatTime } from '../utils/formatters';

interface AudioPlayerProps {
  uri: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState(0);
  const [duration] = useState(0);
  const audioService = useRef(new AudioService()).current;

  useEffect(() => {
    // audioService.onPlaybackProgress is not available in web stub
    return () => {
      audioService.stopPlaying();
      // audioService.removePlaybackListener();
    };
  }, [audioService]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await audioService.pausePlaying();
      } else {
        await audioService.startPlaying(uri);
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing/pausing audio:', error);
    }
  };

  const handleStop = async () => {
    try {
      await audioService.stopPlaying();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  // Slider and seekToPlayer not available in web stub
        return (
        <View style={styles.container}>
        <View style={styles.controls}>
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
  <Text style={{fontSize: 32, color: COLORS.text}}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
            <TouchableOpacity onPress={handleStop} style={styles.stopButton}>
              <Text style={{fontSize: 24, color: COLORS.text}}>⏹</Text>
            </TouchableOpacity>
          </View>
        
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            {/* Slider removed for web compatibility */}
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
        );
        };
        const styles = StyleSheet.create({
        container: {
        paddingVertical: 12,
        },
        controls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        },
        playButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        },
        stopButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        },
        progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        },
        slider: {
        flex: 1,
        marginHorizontal: 12,
        },
        timeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        minWidth: 45,
        },
        });
        export default AudioPlayer;