import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
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

  const [isLoading, setIsLoading] = useState(false); // To show/hide the loading indicator
  const { colors } = useTheme(); // To access theme colors

  const handleSubmit = async () => {
    // Form validation
    if (!form.name || !form.email || !form.phone || !form.address || !form.password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    // Regex for email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    // Regex for phone validation (simple check)
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(form.phone)) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const response = await axios.post("http://192.168.0.104:5000/api/auth/register", form);

      if (response.status === 200) {
        Alert.alert("Success", "Registration successful! Please verify your email.");
        console.log(response.data);
        setForm({ name: "", email: "", phone: "", address: "", password: "" }); // Clear form
        navigation.navigate("SignupVerify", { email: form.email }); // Navigate to verification page
      }
    } catch (err) {
      console.error(err.response);
      Alert.alert("Error", err.response?.data?.msg || "Registration failed");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
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
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Register
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
  },
});
