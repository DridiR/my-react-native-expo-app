import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { useNavigation } from '@react-navigation/native';

const MyReservationsScreen = () => {
    const [userReservations, setUserReservations] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadUserReservations();
        });
        return unsubscribe;
    }, [navigation]);

    const loadUserReservations = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId; 
            const response = await client.get('/reservations/My/'+userId);

            if (response.status === 200) {
                const reservations = response.data;

                // Fetching emplacement details for each reservation
                const promises = reservations.map(async (reservation) => {
                    const emplacementResponse = await client.get('/emplacements/' + reservation.emplacementId);
                    if (emplacementResponse.status === 200) {
                        reservation.emplacementName = emplacementResponse.data.name; // Add emplacementName to reservation object
                    }
                    return reservation;
                });

                // Wait for all promises to resolve
                const updatedReservations = await Promise.all(promises);
                
                setUserReservations(updatedReservations);
            } else {
                Alert.alert('Erreur', 'Impossible de charger les réservations de l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des réservations de l\'utilisateur:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors du chargement des réservations de l\'utilisateur');
        }
    };

    const handleCancellation = async (reservationId) => {
        try {
            const response = await client.delete('/reservations/' + reservationId);
            if (response.status === 200) {
                const updatedReservations = userReservations.filter((reservation) => reservation._id !== reservationId);
                setUserReservations(updatedReservations);
                Alert.alert('Succès', 'Réservation annulée avec succès.');
            } else {
                console.error('Erreur lors de l\'annulation de la réservation');
                Alert.alert('Erreur', 'Échec de l\'annulation de la réservation.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'annulation de la réservation:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de l\'annulation de la réservation.');
        }
    };

    const handlePaymentNavigation = (reservationId, tarif) => {
        navigation.navigate('PaiementScreen', { reservationId, tarif });
    };

    const renderItem = ({ item }) => (
        <View style={styles.reservationContainer}>
            <Text style={styles.reservationText}>Date: {item.date}</Text>
            <Text style={styles.reservationText}>Heure de début: {item.heure_deb}</Text>
            <Text style={styles.reservationText}>Heure de fin: {item.heure_fin}</Text>
            <Text style={styles.reservationText}>Emplacement: {item.emplacementName}</Text>
            <Text style={styles.reservationText}>Tarif: {item.tarif}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancellation(item._id)}>
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.paymentButton} onPress={() => handlePaymentNavigation(item._id,item.tarif)}>
                    <Text style={styles.paymentButtonText}>Payer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={userReservations}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 20,
    },
    reservationContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    reservationText: {
        fontSize: 16,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    paymentButton: {
        backgroundColor: '#28a745',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    paymentButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyReservationsScreen;
