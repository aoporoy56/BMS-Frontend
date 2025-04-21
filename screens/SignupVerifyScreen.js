import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import axios from "axios";

export default function SignupVerifyScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const { colors } = useTheme();

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.0.104:5000/api/auth/register/verify", {
        email,
        otp,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Account verified successfully");
        navigation.navigate("Login");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.msg || "OTP verification failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <TextInput
        label="OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleVerify} style={styles.button}>
        Verify OTP
      </Button>
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
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});
