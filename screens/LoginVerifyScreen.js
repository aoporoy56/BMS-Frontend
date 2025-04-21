import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { verifyLoginOTP } from "../api/auth";

export default function LoginVerifyScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    try {
      const res = await verifyLoginOTP({ email, otp });
      Alert.alert("Success", res.data.msg);
      navigation.navigate("Home");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.msg || "OTP verification failed");
    }
  };

  return (
    <View>
      <TextInput placeholder="Enter OTP" onChangeText={setOtp} keyboardType="numeric" />
      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
}
