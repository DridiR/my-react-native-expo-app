import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput ,Alert} from "react-native";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import { isValidEmail, isValidObjField, updateError } from "../utils/methods";
import client from "../api/client";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token enregistré avec succès');
    } catch (error) {
      console.log('Erreur lors de l\'enregistrement du token :', error.message);
    }
  };
 

const LoginForm = () => {
    const navigation=useNavigation();
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const { email, password } = userInfo;

    const handleOnChangeText = (value, fieldName) => {
        setUserInfo({ ...userInfo, [fieldName]: value });
    };

    const isValidForm = () => {
        if (!email.trim() || !password.trim()) {
            return updateError('Required all fields!', setError);
        }
        if (!isValidEmail(email)) {
            return updateError('Invalid email!', setError);
        }
        if (password.length < 8) {
            return updateError('Password is too short!', setError);
        }
        return true;
    };

    const submitForm = async () => {
        if (isValidForm()) {
            try {
                const res = await client.post('/sign-in', { ...userInfo });
                console.log(res.data)
                if (res.data.success) {
                    const token = res.data.token;
                    console.log('Token reçu:', token); // Ajout d'un console.log pour vérifier si le token est récupéré correctement
                    await storeToken(token); // Appel de la fonction pour stocker le jeton JWT
                      
                    navigation.navigate('LienForm');
                  
                } else {
                    Alert.alert('Error', 'Email/password does not match');
                    setUserInfo({ email: '', password: '' });
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    return (
        <FormContainer>
            {error ? <Text style={{ color: 'red', fontSize: 18, textAlign: 'center' }}>{error}</Text> : null}
            <FormInput
                value={email}
                onChangeText={(value) => handleOnChangeText(value, 'email')}
                label='Email'
                placeholder='Enter Your Email'
                autoCapitalize='none'
            />
            <FormInput
                value={password}
                onChangeText={(value) => handleOnChangeText(value, 'password')}
                label='Password'
                placeholder='Enter Your Password'
                autoCapitalize='none'
                secureTextEntry
            />
            <FormSubmitButton onPress={submitForm} title='Login' />
        </FormContainer>
    );
};

export default LoginForm;
