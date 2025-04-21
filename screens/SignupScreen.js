import React, { useState } from "react";
import { View, Alert, StyleSheet, Image } from "react-native";
import { TextInput, Button, ActivityIndicator, useTheme, Text } from "react-native-paper";
import axios from "axios";

export default function SignupScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(form.phone)) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://192.168.0.104:5000/api/auth/register", form);

      if (response.status === 200) {
        Alert.alert("Success", "Registration successful! Please verify your email.");
        setForm({ name: "", email: "", phone: "", address: "", password: "" });
        navigation.navigate("SignupVerify", { email: form.email });
      }
    } catch (err) {
      console.error(err.response);
      Alert.alert("Error", err.response?.data?.msg || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Logo */}
      <Image
        source={require('../assets/image.png')} // Make sure the image path is correct
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Signup Title */}
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        label="Name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Phone"
        value={form.phone}
        onChangeText={(text) => setForm({ ...form, phone: text })}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        label="Address"
        value={form.address}
        onChangeText={(text) => setForm({ ...form, address: text })}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        secureTextEntry
        style={styles.input}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Register
          </Button>
          <Button onPress={() => navigation.navigate("Login")}>Login</Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1e40af", // Navy blue
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
});
