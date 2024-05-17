import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { format } from 'date-fns';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { jwtDecode } from "jwt-decode";
import 'core-js/stable/atob';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native'; // Import ActivityIndicator


const ReservationScreen = () => {
    const [date, setDate] = useState('');
    const [heureDeb, setHeureDeb] = useState('');
    const [heureFin, setHeureFin] = useState('');
    const [matricule, setMatricule] = useState('');
    const [emplacementName, setEmplacementName] = useState('');
    const [emplacementList, setEmplacementList] = useState([]);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
    const [tarif, setTarif] = useState(0); // Ajout du state pour le tarif
    const navigation = useNavigation();
    const [selectedDateAndTime, setSelectedDateAndTime] = useState({
        date: '',
        heureDeb: '',
        heureFin: '',
      });

      useEffect(() => {
        loadEmplacements();
    }, [selectedDateAndTime]);

    const loadEmplacements = async () => {
      
        if (!date || !heureDeb || !heureFin) {

            // No filtering if any field is empty
            setEmplacementList([]);
            return;
          }
       
          console.log(date,heureDeb,heureFin)
        try {
           
          const response = await client.get(`/emplacements/disponibles?date=${date}&heureDeb=${heureDeb}&heureFin=${heureFin}`);
      
          if (response.status === 200) {
            setEmplacementList(response.data);
             // Calcul du tarif lorsque la liste des emplacements est chargée
             calculateTarif(response.data);
          } else {
            Alert.alert('Erreur', 'Impossible de charger la liste des emplacements disponibles');
          }
        } catch (error) {
          console.error('Erreur:', error);
          Alert.alert('Erreur', 'Une erreur est survenue lors du chargement des emplacements disponibles');
        }
      };

      const calculateTarif = (emplacements) => {
        if (!date || !heureDeb || !heureFin) {
            return; // Quitter la fonction si une des valeurs est manquante
        }
    
        const selectedEmplacement = emplacements.find(emplacement => emplacement.name === emplacementName);
        if (selectedEmplacement) {
            const debutDate = new Date(date + 'T' + heureDeb);
            const finDate = new Date(date + 'T' + heureFin);
    
            if (isNaN(debutDate) || isNaN(finDate)) {
                return; // Quitter la fonction si les dates ou heures sont mal formatées
            }
    
            const heuresReservees = (finDate - debutDate) / (60 * 60 * 1000); // Convertir la différence en heures
            // Check if both heuresReservees and emplacement.tarif are valid numbers before calculating tarif
        if (typeof heuresReservees === 'number' && typeof selectedEmplacement.tarif === 'number') {
            const tarifReservation = heuresReservees * selectedEmplacement.tarif;
            setTarif(tarifReservation);
        } else {
            console.error('Erreur de calcul du tarif: valeurs non numériques');
        }

        }
    };



    

    const handleReservation = async () => {
        try {
            const selectedEmplacement = emplacementList.find(emplacement => emplacement.name === emplacementName);
            if (!selectedEmplacement) {
                Alert.alert('Erreur', 'Emplacement introuvable');
                return;
            }
    
            const emplacementId = selectedEmplacement._id;
            const token = await AsyncStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
              
            const response = await client.post('/reservations', {
                date,
                heure_deb: heureDeb,
                heure_fin: heureFin,
                matricule,
                tarif: tarif,
                paye: false,
                user: userId,
                emplacementId,
            });
            if (response.status === 201) {
                const reservationId = response.data.id;
                Alert.alert('Réservation créée avec succès', reservationId);
                const userReservationsResponse = await client.get('/reservations/My/' + userId);
                if (userReservationsResponse.status === 200) {
                    navigation.navigate('List');
                } else {
                    console.log('Impossible de récupérer les réservations de l\'utilisateur');
                    Alert.alert('Erreur', 'Impossible de récupérer les réservations de l\'utilisateur');
                }
                setDate('');
                setHeureDeb('');
                setHeureFin('');
                setMatricule('');
                setEmplacementName('');
            } else {
                console.log('Impossible de créer la réservation');
                Alert.alert('Erreur', 'Impossible de créer la réservation');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                const errorMessage = error.response.data.error;
                Alert.alert('Erreur', errorMessage);
                console.log("l erreur ici ");
            } else {
                console.error('Erreur:', error);
                Alert.alert('Erreur', 'Une erreur est survenue lors de la création de la réservation');
            }
        }
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleDateConfirm = (selectedDate) => {
    hideDatePicker();
    // Convertir la date sélectionnée en un objet Date
    const formattedDate = format(new Date(selectedDate), 'yyyy-MM-dd');
    setDate(formattedDate)
   };

   const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
};

const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
};

const handleStartTimeConfirm = (selectedTime) => {
    hideStartTimePicker();
    const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHeureDeb(formattedTime);
};

const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
};

const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
};

const handleEndTimeConfirm = (selectedTime) => {
    hideEndTimePicker();
    const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHeureFin(formattedTime);
};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nouvelle Réservation</Text>
            <View style={styles.form}>
             <Text style={styles.label}>Date:</Text>
             <Button 
              title={date ? ` ${date}` : 'Sélectionner une date'} 
                onPress={showDatePicker} 
                />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                  onConfirm={(selectedDate) => {
                 handleDateConfirm(selectedDate);
                 setSelectedDateAndTime(prevState => ({ ...prevState, date: selectedDate }));
                 }}
                    onCancel={hideDatePicker}
                />


            <Text style={styles.label}>Heure de début:</Text>
            <Button title={heureDeb ? ` ${heureDeb}` : 'Sélectionner heure de début'}  onPress={showStartTimePicker} />
                <DateTimePickerModal
                    isVisible={isStartTimePickerVisible}
                    mode="time"
                    onConfirm={(selectedTime) => {
                        handleStartTimeConfirm(selectedTime);
                        setSelectedDateAndTime(prevState => ({ ...prevState, heureDeb: selectedTime }));
                    }}
                    onCancel={hideStartTimePicker}
                />
           
            <Text style={styles.label}>Heure de fin:</Text>
            <Button title={heureFin ? ` ${heureFin}` : 'Sélectionner heure de fin'} onPress={showEndTimePicker} />
                <DateTimePickerModal
                    isVisible={isEndTimePickerVisible}
                    mode="time"
                    onConfirm={(selectedTime) => {
                        handleEndTimeConfirm(selectedTime);
                        setSelectedDateAndTime(prevState => ({ ...prevState, heureFin: selectedTime }));
                    }}
                    onCancel={hideEndTimePicker}
                />

          
            <Text style={styles.label}>Matricule:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setMatricule(text)}
                    value={matricule}
                />
            <Text style={styles.label}>Emplacement:</Text>
            {emplacementList.length === 0 && <ActivityIndicator size="large" />} 
            <Picker
                selectedValue={emplacementName}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setEmplacementName(itemValue)}
            >
                 <Picker.Item label="Sélectionner un emplacement" value="" />
        {emplacementList.map((emplacement, index) => (
          <Picker.Item key={index} label={emplacement.name} value={emplacement.name} />
        ))}
      </Picker>
            <Button title="Réserver" onPress={handleReservation} />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: 'black',
        textAlign: 'center',
    },
    form: {
        width: '80%',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#555',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        fontSize: 16,
        color: '#333',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
});



export default ReservationScreen;