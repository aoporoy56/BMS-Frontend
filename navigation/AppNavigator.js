import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, DefaultTheme } from 'react-native-paper'; // Import DefaultTheme
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SignupVerifyScreen from '../screens/SignupVerifyScreen';
import LoginVerifyScreen from '../screens/LoginVerifyScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';

// Create the Stack Navigator
const Stack = createNativeStackNavigator();



export default function AppNavigator() {
  return (
    // PaperProvider wraps the app for styling with React Native Paper components
    <PaperProvider>
      {/* SafeAreaProvider ensures the app UI respects safe areas on various devices */}
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            {/* Splash Screen: Displayed first before navigating to other screens */}
            <Stack.Screen 
              name="Splash" 
              component={SplashScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name="LoginVerify" component={LoginVerifyScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{headerShown: false }} />
            <Stack.Screen name="SignupVerify" component={SignupVerifyScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
