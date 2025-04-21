import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  const cards = [
    {
      title: 'Profile',
      description: 'View your account details and balance.',
      screen: 'Profile',
    },
    {
      title: 'Transfer Money',
      description: 'Send money to another account.',
      screen: 'Transfer',
    },
    {
      title: 'Balance',
      description: 'Check your current account balance.',
      screen: 'Balance',
    },
    {
      title: 'All Transactions',
      description: 'View your transaction history.',
      screen: 'Transactions',
    },
    {
      title: 'Change Password',
      description: 'Update your account password.',
      screen: 'ChangePassword',
    }
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };

    loadUser();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Bank Title */}
      <Text style={styles.bankTitle}>Eastern Bank Ltd</Text>
  
      {/* Profile Section */}
      <Card style={styles.profileCard}>
        <Card.Title
          title={user?.name || 'Loading...'}
          subtitle={`Account No: ${user?.accountNumber || ''}`}
          left={(props) => <Avatar.Text {...props} label={user?.name?.charAt(0).toUpperCase() || 'U'} />}
        />
      </Card>
  
      {/* Dashboard Cards */}
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <Card
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(card.screen)}
          >
            <Card.Content>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.description}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40, // Adds space from the top
    backgroundColor: '#f2f2f2',
  }
  ,
  profileCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#555',
  },
  bankTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1e40af', // Navy Blue shade
  },
  
});
