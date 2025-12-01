
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { PermissionsService } from './services/permissionsService';


const App: React.FC = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Request permissions on app start
      PermissionsService.checkPermissions();
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;