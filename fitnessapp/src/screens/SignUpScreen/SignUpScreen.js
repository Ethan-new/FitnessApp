import React, {useState} from "react";
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native'

import CustomInput from "../../componets/CustomInput";
import CustomButton from "../../componets/CustomButton";
import SocialSignInButtons from "../../componets/SocialSignInButtons";
import { DataStore } from '@aws-amplify/datastore';
import { User,CalCount, Cals } from '../../models';


import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";

const SignUpScreen = () => {
const [name, setName] = useState('');
const [username, setUsername] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [passwordRepeat, setPasswordRepeat] = useState('');
const navigation = useNavigation();



const onRegisterPressed = async () => {
    const cal = new Cals ({
        "currTargetCals": "2000",
        "allDays":[]
        
        
    })

    try {

        
        const response = await Auth.signUp({
            username,
            password,
            attributes:{email, name,preferred_username: username}
        });
        await DataStore.save(
            new User({
                "height": 0,
                "weight": 0,
                "gender": "",
                "TrainingDayList": [],
                "numberOfPreferedExercises": 0,
                "username": username.toLowerCase(),
                "CalCount": cal
            })
        );
        navigation.navigate('ConfirmEmail', {username});
    } catch(e) {
        Alert.alert('Oops', e.message);
    }

}

const onSignInPressed = () => {
    navigation.navigate('SignIn');
}
const onTermsOfUsePressed = () => {
    console.warn("Terms");
}

const onPrivacyPolicyPressed = () => {
    console.warn("Pricacy Policy");
}

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>

            <Text style={[styles.title]}>Create An account</Text>
            <CustomInput placeholder="Full name" value={name} setValue={setName}/>
            <CustomInput placeholder="Username" value={username} setValue={setUsername}/>
            <CustomInput placeholder="Email" value={email} setValue={setEmail}/>
            <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry={true}/>
            <CustomInput placeholder="Password" value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry={true}/>

            <CustomButton text="Register" onPress={onRegisterPressed}/>
            <Text style={styles.text}>By registering, you confirm that you accept our <Text style={styles.link} onPress={onTermsOfUsePressed}>Terms of Use</Text> and <Text style={styles.link} onPress={onPrivacyPolicyPressed}>Privacy Policy</Text></Text>

        <SocialSignInButtons/>
            <CustomButton text="Have an account? Sign In." onPress={onSignInPressed} type='TERTIARY'/>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
        padding:20,
    },
    title: {
        fontSize:24,
        fontWeight:'bold',
        color:'#051C60',
        margin:10,
    },
    text:{
        color:'gray',
        marginVertical:10,
    },
    link:{
        color:'#FDB075',

    }
})
export default SignUpScreen;