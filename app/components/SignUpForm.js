import React, { useState } from "react";
import { View, StyleSheet, Text ,Alert} from "react-native";
import FormContainer from "./FormContainer";
import FormInput from "./FormInput";
import FormSubmitButton from "./FormSubmitButton";
import { isValidEmail,isValidObjField,updateError } from "../utils/methods";
import { Formik } from "formik";
import * as Yup from 'yup'
import client from "../api/client";


const validationSchema= Yup.object({
    fullname: Yup.string().trim().min(3,'Invalid name!').required('name is required!') ,
   email: Yup.string().email('Invalid email!').required('email is required!'),
   password: Yup.string().trim().min(8,'Password is too short!').required('password is required!'),
   confirmPassword: Yup.string().equals([Yup.ref('password'),null],'password does not match!')
})

const SignUpForm = () => {
    const userInfo={
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    const [error, setError] = useState('');

    const handleOnChangeText = (value, fieldName) => {
        setUserInfo({ ...userInfo, [fieldName]: value });
    };

    const isValidForm = () => {

        if (!isValidObjField(userInfo)) {
            return updateError('required all fields!', setError);
        }
        if (!userInfo.fullname.trim() || userInfo.fullname.length < 3) {
            updateError('Invalid name!');
            return false;
        }
        if (!isValidEmail(userInfo.email)) {
            updateError('Invalid email!');
            return false;
        }
        if (!userInfo.password.trim() || userInfo.password.length < 8) {
            updateError('Password is less than 8 characters!');
            return false;
        }
        if (userInfo.password !== userInfo.confirmPassword) {
            updateError('Passwords do not match!');
            return false;
        }
        return true;
    };

 
    const submitForm = () => {
        if (isValidForm()) {
            // Soumettre le formulaire
            console.log(userInfo);
        }
    };

   
    const signUp = async (values, formikActions) => {
       /* try {
            const res = await client.post('/create-user', { ...values });
            console.log(res.data);
            if (!res.data.success) {
                Alert.alert('Error', res.data.message);
            } else {
                Alert.alert('Success', 'User registered successfully!');
                formikActions.resetForm();
                formikActions.setSubmitting(false);
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred while registering. Please try again later.');
           
        }*/
        try{
            const res = await client.post('/create-user', { ...values });
            console.log(res.data);
            if(res.data.success){
                Alert.alert('Success', 'User registered successfully!');
                formikActions.resetForm();
                formikActions.setSubmitting(false);
            }else{
                Alert.alert('Error', 'An error occurred while registering. Please try again later.');
                formikActions.resetForm();
                formikActions.setSubmitting(false);
            }
        }catch{ (error) 
                console.log(error.message);
        }
       
    };


    return (
        <FormContainer>
           <Formik initialValues={userInfo} validationSchema={validationSchema} onSubmit={signUp}>
{({values,errors,touched,isSubmitting,handleChange, handleBlur,handleSubmit})=> {
   

    const {fullname,email,password,confirmPassword} =values
    return(
    <>
    
    <FormInput
                value={fullname}
                error={touched.fullname && errors.fullname}
                onChangeText={handleChange('fullname')}
                onBlur={handleBlur('fullname')}
                label='Full Name'
                placeholder='Enter Your Name'
            />
            <FormInput
             value={email}
             error={touched.email && errors.email}
                autoCapitalize='none'
                label='Email'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder='Enter Your Email'
            />
            <FormInput
            value={password}
            error={touched.password && errors.password}
                autoCapitalize='none'
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
                label='Password'
                placeholder='Enter Your Password'
            />
            <FormInput
            value={confirmPassword}
            error={touched.confirmPassword && errors.confirmPassword}
                autoCapitalize='none'
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry
                label='Confirm Password'
                placeholder='Confirm Your Password'
            />
            <FormSubmitButton submitting={isSubmitting} onPress={handleSubmit} title='Sign Up' />
    </>)
}}

           </Formik>
           
        </FormContainer>
    );
};

const styles = StyleSheet.create({});

export default SignUpForm;
