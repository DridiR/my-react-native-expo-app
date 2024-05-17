import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

const NotificationListener = () => {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        
        if (status !== 'granted') {
          console.log('Permission not granted for notifications');
          return;
        }
      }
      
      console.log('Requesting Expo push token...');
      const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId: 'e4e2b84b-36d2-4569-b037-d2be4e039338' });
      console.log('Expo Push Token Response:', tokenResponse);
  
      if (tokenResponse.status === 'granted') {
        const notificationToken = tokenResponse.data;
        console.log('Expo Push Token:', notificationToken);
  
        // Save notification token to AsyncStorage for later use
        await AsyncStorage.setItem('expoPushToken', notificationToken);
        const userId = '664636050c17a50567b5418a';
  
        // Send notification token and user ID to backend
        console.log('Sending token to backend...');
        const response = await client.post('/users/notificationToken', { userId, token: notificationToken });
        console.log('Backend Response:', response.data);
      } else {
        console.log('Permission not granted for notifications');
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };
  

  return null;
};

export default NotificationListener;
