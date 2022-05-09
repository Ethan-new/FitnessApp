import React, {useState} from "react";
import {View, Text, StyleSheet, ScrollView,Alert} from 'react-native'

import CustomInput from "../../componets/CustomInput";
import CustomButton from "../../componets/CustomButton";


import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";

const ConfirmEmailScreen = () => {


const [code, setCode] = useState('');
const [username, setUsername] = useState('');
const navigation = useNavigation();
    
const onConfirmPressed = async () => {
    try {
        const response = await Auth.confirmSignUp(username,code);
        navigation.navigate('SignIn');

    }
    catch{
        Alert.alert("Oops", e.message);        
    }

}
const onResendcodePressed =async  () => {
    try {
        const response = await Auth.resendSignUp(username);
        Alert.alert("Success", "Code has been sent to your email"); 

    }
    catch{
        Alert.alert("Oops", e.message);        
    }
}

const onSignInPressed = () => {
    navigation.navigate('SignIn');
}
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>

            <Text style={[styles.title]}>Confirm Your Email</Text>
            <CustomInput placeholder="Enter your username here" value={username} setValue={setUsername}/>
            <CustomInput placeholder="Enter your confirmation code" value={code} setValue={setCode}/>


            <CustomButton text="Confirm" onPress={onConfirmPressed}/>

            <CustomButton text="Resend code" onPress={onResendcodePressed} type='SECONDARY'/>
            <CustomButton text="Back to Sign in." onPress={onSignInPressed} type='TERTIARY'/>

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
export default ConfirmEmailScreen;