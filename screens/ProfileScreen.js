import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { TextInput, Button, Avatar, ActivityIndicator } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUser, deleteUser } from "../api/auth"; // Your backend API methods
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [editableUser, setEditableUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImageUrl: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('userToken');
        setUserToken(storedToken);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setEditableUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      }
      setLoading(false);
    };
    getUserData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);

    if (!editableUser.name || !editableUser.phone || !editableUser.address) {
      Alert.alert("Error", "All fields are required.");
      setLoading(false);
      return;
    }

    //Name minmum 3 characters and only letters and spaces
    if (!/^[a-zA-Z\s]{3,}$/.test(editableUser.name)) {
      Alert.alert("Error", "Name must be at least 3 characters long and contain only letters and spaces.");
      setLoading(false);
      return;
    }

    if(!/^[0-9]{11}$/.test(editableUser.phone)) {
      Alert.alert("Error", "Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    //Addres  s minimum 5 characters
    if (!/^[a-zA-Z0-9\s,.'-]{5,}$/.test(editableUser.address)) {
      Alert.alert("Error", "Address must be at least 5 characters long and contain only letters, numbers, spaces, and common punctuation.");
      setLoading(false);
      return;
    }




    try {
      const res = await axios.put("http://192.168.0.104:5000/api/auth/update", editableUser, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });
      if (res.status === 200) {
        await AsyncStorage.setItem('user', JSON.stringify(editableUser));
        setUser(editableUser);
        Alert.alert("Success", "Profile updated successfully.");
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.msg || "Profile update failed");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://192.168.0.104:5000/api/auth/delete", {
        email : editableUser.email
      });
      if (res.status === 200) {
        await AsyncStorage.removeItem('user');
        Alert.alert("Success", "User deleted successfully.");
        navigation.replace("Login");
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.msg || "Deletion failed");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userToken');
      Alert.alert("Logged out", "You have been logged out.");
      navigation.replace("Login");
    } catch (err) {
      Alert.alert("Error", "Logout failed");
      console.error("Logout Error: ", err);
    }
  };

  const handleFileChange = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 600,
      maxHeight: 600,
      quality: 0.8,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error("ImagePicker Error: ", response.errorMessage);
        return;
      }

      const file = response.assets[0];
      const updatedData = { ...editableUser, profileImageUrl: file.uri };

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.fileName,
      });
      formData.append('upload_preset', 'dfreqrdsy');
      formData.append('cloud_name', 'dfreqrdsy');

      try {
        const uploadResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/dfreqrdsy/image/upload',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        updatedData.profileImageUrl = uploadResponse.data.secure_url;
        setEditableUser(updatedData);
        Alert.alert("Success", "Profile image uploaded successfully");
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        Alert.alert("Error", "Image upload failed");
      }
    });
  };

  if (loading) return <ActivityIndicator animating={true} size="large" />;

  if (!user) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Avatar.Image
        size={100}
        source={{ uri: editableUser.profileImageUrl || "https://placeimg.com/140/140/people" }}
        style={styles.avatar}
      />
      {/* <Button onPress={handleFileChange} mode="contained" style={styles.uploadButton}>
        Upload Profile Image
      </Button> */}

      <Text style={styles.heading}>{editableUser.name}</Text>

      <TextInput
        label="Name"
        value={editableUser.name}
        onChangeText={(text) => setEditableUser({ ...editableUser, name: text })}
        style={styles.input}
      />
      <TextInput label="Email" value={editableUser.email} disabled style={styles.input} />
      <TextInput
        label="Phone"
        value={editableUser.phone}
        onChangeText={(text) => setEditableUser({ ...editableUser, phone: text })}
        style={styles.input}
      />
      <TextInput
        label="Address"
        value={editableUser.address}
        onChangeText={(text) => setEditableUser({ ...editableUser, address: text })}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleUpdate} style={styles.button}>
        Update Profile
      </Button>

      <Button mode="outlined" onPress={handleDelete} style={styles.button}>
        Delete Account
      </Button>

      <Button mode="text" onPress={handleLogout} style={styles.logoutButton} textColor="red">
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    marginBottom: 20,
  },
  uploadButton: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    marginTop: 15,
    width: '100%',
  },
  logoutButton: {
    marginTop: 10,
    width: '100%',
  },
});
