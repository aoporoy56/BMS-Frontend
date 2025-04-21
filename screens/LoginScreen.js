import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image, Text } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleLogin = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.post("http://192.168.0.104:5000/api/auth/login", {
        email,
        password
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

        Alert.alert("Success", "Login successful");
        navigation.replace("Home");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.msg || "Login failed");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Logo */}
      <Image
        source={require('../assets/image.png')} // Make sure the path is correct
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Login Title */}
      <Text style={styles.title}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#1e40af" style={styles.loading} />
      ) : (
        <>
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>
          <Button onPress={() => navigation.navigate("Signup")}>Sign Up</Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e40af',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  loading: {
    marginVertical: 20, // Adds space between the loader and buttons
  },
});

export default LoginScreen;
