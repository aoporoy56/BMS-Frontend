import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper'; // Import Paper components

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.heading}>Home Screen</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Profile')}
            style={styles.button}
          >
            Go to Profile
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Adds shadow to the card
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ea', // Use Paper's primary color
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    width: '100%',
  },
});
