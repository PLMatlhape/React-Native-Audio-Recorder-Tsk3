import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AudioService } from '../services/audioService';
import { COLORS } from '../utils/constants';
import { formatTime } from '../utils/formatters';

interface AudioPlayerProps {
  uri: string;
  initialDuration?: number;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri, initialDuration = 0 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const audioService = useRef(new AudioService()).current;

  useEffect(() => {
    // Set up playback progress callback
    audioService.onPlaybackProgress((data) => {
      setCurrentTime(data.currentPosition);
      if (data.duration > 0) {
        setDuration(data.duration);
      }
      setIsPlaying(data.isPlaying);
    });

    return () => {
      audioService.stopPlaying();
      audioService.removePlaybackListener();
    };
  }, [audioService]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await audioService.pausePlaying();
        setIsPlaying(false);
      } else {
        if (currentTime > 0 && currentTime < duration) {
          await audioService.resumePlaying();
        } else {
          await audioService.startPlaying(uri);
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing/pausing audio:', error);
    }
  };

  const handleStop = async () => {
    try {
      await audioService.stopPlaying();
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <MaterialIcons 
            name={isPlaying ? 'pause' : 'play-arrow'} 
            size={32} 
            color={COLORS.text} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleStop} style={styles.stopButton}>
          <MaterialIcons name="stop" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
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
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontVariant: ['tabular-nums'],
  },
});

export default AudioPlayer;