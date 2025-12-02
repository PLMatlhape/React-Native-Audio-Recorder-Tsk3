
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { PermissionsService } from './services/permissionsService';


const App: React.FC = () => {
  useEffect(() => {
    // Initialize permissions on app start for mobile
    if (Platform.OS !== 'web') {
      PermissionsService.initializePermissions();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;