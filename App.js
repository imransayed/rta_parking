import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TailwindProvider } from 'tailwindcss-react-native';
import HomeScreen from './src/components/HomeScreen';
import ParkingHistoryScreen from './src/components/ParkingHistoryScreen';
import SettingsScreen from './src/components/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <TailwindProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#65adf1',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'UAE Parking Ticket' }}
          />
          <Stack.Screen 
            name="ParkingHistory" 
            component={ParkingHistoryScreen} 
            options={{ title: 'Parking History' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
}