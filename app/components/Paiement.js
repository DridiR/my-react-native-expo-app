import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, TextInput, StyleSheet } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useRoute } from '@react-navigation/native';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';
const PaiementScreen = () => {
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);
  const [reservationId, setReservationId] = useState('');
  const [tarif, setTarif] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const route = useRoute(); 
  const navigation = useNavigation();
  useEffect(() => {
    const { reservationId, tarif } = route.params;
    setReservationId(reservationId);
    setTarif(tarif);
  }, [route.params]);

  const fetchClientSecret = async () => {
    try {
      console.log("Fetching client secret...");
      const response = await client.post('/api/paiement', { montant: tarif, reservationId });
      console.log("Server response:", response.data);
      setClientSecret(response.data.clientSecret);
      return response.data.clientSecret;
    } catch (error) {
      console.error('Erreur lors de la récupération du client secret:', error);
      setError('Erreur lors de la récupération du client secret');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      let secret = clientSecret;
      if (!secret) {
        secret = await fetchClientSecret();
      }
      console.log("Client secret:", secret);
      const { paymentIntent, error } = await confirmPayment(secret, {
        type: 'payment',
        paymentMethodType: 'Card',
        billingDetails: {
          email: email,
        },
        paymentMethodOptions: {
          card: cardDetails,
        },
      });

      if (error) {
        console.error('Erreur lors du paiement:', error.message);
        setError('Erreur lors du paiement: ' + error.message);
      } else {
        await client.put(`/reservations/${reservationId}`, { paye: true });
        Alert.alert('Succès', 'Paiement réussi');
        // Réinitialiser les champs après le paiement réussi
        setUsername('');
        setEmail('');
        setCardDetails(null);
        navigation.navigate('historique');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error.message);
      setError('Erreur lors du paiement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Text style={styles.label}>Saisissez vos informations de carte bancaire :</Text>
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: 'Numéro de carte',
          postalCode: 'Code postal',
          placeholder: '1234 5678 9101 1121',
        }}
        style={styles.cardField}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
      />
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Nom d'utilisateur"
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        placeholder="Adresse e-mail"
      />
      <Button title="Payer" onPress={handlePayment} disabled={loading} />
      {loading && <ActivityIndicator style={styles.loadingIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default PaiementScreen;
