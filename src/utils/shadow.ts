import { Platform, ViewStyle } from 'react-native';

/**
 * Creates cross-platform shadow styles
 * On web: uses boxShadow
 * On mobile: uses iOS shadow props + Android elevation
 */
export const createShadow = (
  color: string,
  offset: { width: number; height: number },
  opacity: number,
  radius: number,
  elevation: number = 8
): ViewStyle => {
  if (Platform.OS === 'web') {
    // Convert React Native shadow to CSS boxShadow
    const shadowColor = `rgba(${hexToRgb(color)}, ${opacity})`;
    return {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${shadowColor}`,
    } as ViewStyle;
  }

  // Native shadow styles
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation, // Android
  };
};

/**
 * Helper to convert hex color to RGB values
 */
const hexToRgb = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
};
