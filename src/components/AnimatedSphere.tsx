import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AnimatedSphereProps {
  isRecording: boolean;
  audioLevel?: number;
}

const AnimatedSphere: React.FC<AnimatedSphereProps> = ({ isRecording, audioLevel = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const distortAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      // Distortion animation based on audio level
      Animated.timing(distortAnim, {
        toValue: audioLevel,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(1);
      rotateAnim.setValue(0);
      distortAnim.setValue(0);
    }
  }, [isRecording, audioLevel, scaleAnim, rotateAnim, distortAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const generateCorruptedSpherePath = () => {
    const centerX = 75;
    const centerY = 75;
    const baseRadius = 50;
    const segments = 16;
    
    let path = '';
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const distortion = Math.random() * 10 * (audioLevel / 100);
      const radius = baseRadius + distortion;
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      if (i === 0) {
        path += `M ${x} ${y} `;
      } else {
        const prevAngle = ((i - 1) / segments) * Math.PI * 2;
        const prevRadius = baseRadius + Math.random() * 10 * (audioLevel / 100);
        const prevX = centerX + prevRadius * Math.cos(prevAngle);
        const prevY = centerY + prevRadius * Math.sin(prevAngle);
        
        const cpX1 = prevX + (x - prevX) * 0.3;
        const cpY1 = prevY + (y - prevY) * 0.3;
        const cpX2 = prevX + (x - prevX) * 0.7;
        const cpY2 = prevY + (y - prevY) * 0.7;
        
        path += `C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x} ${y} `;
      }
    }
    
    return path + 'Z';
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.sphereContainer,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <Svg width="150" height="150" viewBox="0 0 150 150">
          <Path
            d={generateCorruptedSpherePath()}
            fill="#6200EE"
            fillOpacity={0.8}
            stroke="#03DAC6"
            strokeWidth={2}
          />
          <Path
            d={generateCorruptedSpherePath()}
            fill="none"
            stroke="#03DAC6"
            strokeWidth={1}
            strokeOpacity={0.5}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  sphereContainer: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedSphere;