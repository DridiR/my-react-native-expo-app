import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReservationScreen from './ReservationScreen';
import MyReservationsScreen from './MyReservationsScreen';
import AppForm from './AppForm';
import LienForm from './LienForm';
import PaiementScreen from './Paiement'

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AppForm">
      <Stack.Screen name="AppForm" component={AppForm} />
      <Stack.Screen name="LienForm" component={LienForm} />
      <Stack.Screen name='ReservationScreen' component={ReservationScreen}></Stack.Screen>
      <Stack.Screen name='MyReservationsScreen' component={MyReservationsScreen}></Stack.Screen>
      <Stack.Screen name='PaiementScreen' component={PaiementScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppNavigator;
