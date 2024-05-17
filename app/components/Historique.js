import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { useNavigation } from '@react-navigation/native';
const HistoriqueScreen = () => {
    const [reservations, setReservations] = useState([]);
    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadReservations();
        });
        return unsubscribe;
    }, [navigation]);

    const loadReservations = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            // Appel à la nouvelle fonction getUserReservationspaid pour récupérer les réservations payées
            const response = await client.get('/reservations/myrespaid/'+userId); // Remplacez 'userId' par l'ID de l'utilisateur actuel

            if (response.status === 200) {
                const paidReservations = response.data;

                // Fetch emplacement details for each reservation
                const promises = paidReservations.map(async (reservation) => {
                    const emplacementResponse = await client.get('/emplacements/' + reservation.emplacementId);
                    if (emplacementResponse.status === 200) {
                        reservation.emplacementName = emplacementResponse.data.name;
                    }
                    return reservation;
                });

                // Wait for all promises to resolve
                const updatedReservations = await Promise.all(promises);
                setReservations(updatedReservations);
            } else {
                console.error('Erreur lors du chargement des réservations');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des réservations:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.reservationContainer}>
            <Text style={styles.reservationText}>Date: {item.date}</Text>
            <Text style={styles.reservationText}>Heure de début: {item.heure_deb}</Text>
            <Text style={styles.reservationText}>Heure de fin: {item.heure_fin}</Text>
            <Text style={styles.reservationText}>Emplacement: {item.emplacementName}</Text>
            <Text style={styles.reservationText}>Tarif: {item.tarif}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={reservations}
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
});

export default HistoriqueScreen;
