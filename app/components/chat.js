import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";


const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipientId, setRecipientId] = useState('');

    useEffect(() => {
        fetchMessages();
        fetchRecipientId();
    }, []);
    const fetchRecipientId = async () => {
        try {
            const response = await client.get(`/employes/assistant`);
            const assistants = response.data;
            if (assistants.length > 0) {
                // Utilisez tous les assistants comme destinataires
                const recipientIds = assistants.map(assistant => assistant._id);
                setRecipientId(recipientIds);
            } else {
                console.warn('Aucun assistant client trouvé');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des assistants:', error);
        }
    };
const fetchMessages = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId; 
        const response = await client.get(`/messages/${userId}`); // Appel de votre fonction API pour récupérer les messages de l'utilisateur connecté
        setMessages(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
    }
};

    const sendMessage = async (message, recipientIds) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const senderId = decodedToken.userId; 
            await client.post('/messages', { content: message, sender: senderId, recipients: recipientIds }); // Envoi du nouveau message à l'API
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            throw error;
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            await sendMessage(newMessage, recipientId);
            setNewMessage(''); // Réinitialiser le champ de saisie après l'envoi du message
            await fetchMessages(); // Rafraîchir la liste des messages après l'envoi
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <View key={index} style={styles.message}>
                        <Text>{message.content}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Votre message..."
                    value={newMessage}
                    onChangeText={text => setNewMessage(text)}
                />
                 <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
                    <Text style={styles.buttonText}>Envoyer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end', // Aligne le contenu à droite
        alignItems: 'flex-end', // Aligne le contenu en bas
        backgroundColor: '#f0f0f0',
        margin: 4, // Ajout d'un margin de 4 pixels
        paddingRight: 7,
       
    },
    messagesContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',

    },
    message: {
        backgroundColor: 'lightblue', 
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        color: 'white'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
        
    },
    button: {
        backgroundColor: 'skyblue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default ChatScreen;
