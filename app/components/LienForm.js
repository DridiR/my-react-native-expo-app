import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import ReservationScreen from './ReservationScreen';
import MyReservationsScreen from './MyReservationsScreen';
import ChatbotScreen from './Chatbot';
import HistoriqueScreen from './Historique'
const Tab = createBottomTabNavigator();

const LienForm = () => {
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white', display: 'flex' },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={AccueilScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="chatbot"
        component={ChatbotScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="envelope" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="List"
        component={MyReservationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="list-ul" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Reservation"
        component={ReservationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="calendar" size={size} color={color} />
          ),
        }}
      />
       <Tab.Screen
        name="historique"
        component={HistoriqueScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="history" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AccueilScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/OIP (4).jpg')}
        style={styles.image}
      />
      <TouchableOpacity style={styles.button}>
        <Icon name="check-circle" size={30} color="green" />
        <Text style={styles.buttonText}>Réservez votre place de parking à distance</Text> 
      </TouchableOpacity>
     
      <TouchableOpacity style={styles.button}>
        <Icon name="car" size={30} color="blue" />
        <Text style={styles.buttonText}>Navigateur de places disponibles</Text> 
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Icon name="credit-card" size={30} color="red" />
        <Text style={styles.buttonText}>Paiement sans contact</Text> 
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Icon name="bell" size={30} color="orange" />
        <Text style={styles.buttonText}>Notifications instantanées</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
});

export default LienForm;
