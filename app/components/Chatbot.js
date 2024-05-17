import React, { useState,  useEffect  } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
const ChatbotScreen = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await client.get(`/questions/user/${userId}`);
        const questions = response.data.map(question => {
            const answerToShow = question.adminAnswer || question.answer;
            return { ...question, answerToShow };
          });
          setUserQuestions(questions);
      
      } catch (error) {
        console.error('Erreur:', error.message);
      }
    };

    fetchData();
  }, []);

  const sendMessage = async () => {
    if (input.trim() === '') return;
    const token = await AsyncStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const user = decodedToken.userId;
    console.log("cest ça le user :",user)
    setMessages([...messages, { text: input, fromUser: true }]);
    setInput('');
  
    try {
        const response = await client.post('/questions/user/'+user, {
          question: input,
          userId: user,
        });
      
        const data = response.data;
        if (data.adminAnswer ) {
            setMessages(prevMessages => [...prevMessages, { text: data.adminAnswer, fromUser: false }]);
          } else if (data.answer) {
            setMessages(prevMessages => [...prevMessages, { text: data.answer, fromUser: false }]);
          } else {
            setMessages(prevMessages => [...prevMessages, { text: "Nous vous répondrons dès que possible", fromUser: false }]);
          }
      } catch (error) {
        if (error.response) {
          console.error('Erreur de réponse:', error.response.data);
        } else if (error.request) {
          console.error('Pas de réponse reçue:', error.request);
        } else {
          console.error('Erreur:', error.message);
        }
      }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
      {userQuestions.map((question, index) => (
  <View key={index} style={{ marginBottom: 10 }}>
    {question.answerToShow && (
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', margin: 10 }}>
        <Text style={{ padding: 10, backgroundColor: '#4caf50', borderRadius: 8, marginHorizontal: 5, color: 'white', maxWidth: '80%' }}>{question.question}</Text>
      </View>
    )}
    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
      <Text style={{ padding: 10, backgroundColor: '#2196f3', borderRadius: 8, marginHorizontal: 5, color: 'white', maxWidth: '80%' }}>{question.answerToShow}</Text>
    </View>
  </View>
))}
        {messages.map((message, index) => (
          <View key={index} style={{ alignItems: message.fromUser ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <Text style={{ padding: 10, backgroundColor: message.fromUser ? '#4caf50' : '#2196f3', borderRadius: 8, marginHorizontal: 5, color: 'white', maxWidth: '80%' }}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginRight: 10, paddingHorizontal: 10 }}
          value={input}
          onChangeText={setInput}
          placeholder="Posez votre question..."
        />
        <Button title="Envoyer" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatbotScreen;
