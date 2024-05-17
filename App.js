import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/components/AppNavigator';
import { StripeProvider } from '@stripe/stripe-react-native';
import NotificationListener from './app/components/NotificationListener';


export default function App() {
 
  return (
    <StripeProvider publishableKey="pk_test_51PFgU11I87K0yV3RyScwM0yARA81cEZh28M5fauGBOL5YDYWTlUWIplBl6g7PHdjbozDiRUdeceaihKroSl8ezsN00mI09ftpa">
      <NavigationContainer>
        <AppNavigator />
     <NotificationListener />
      </NavigationContainer>
    </StripeProvider>
  );
}
