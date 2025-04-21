import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // After a short delay, check for stored token/user
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const user = await AsyncStorage.getItem('user');

        if (token && user) {
          // Navigate to Home if token/user found
          navigation.replace('Home');
        } else {
          // Otherwise go to Login
          navigation.replace('Login');
        }
      } catch (error) {
        console.error("Storage check failed", error);
        Alert.alert("Error", "Something went wrong");
        navigation.replace('Login');
      }
    };

    const timer = setTimeout(checkAuth, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/image.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
