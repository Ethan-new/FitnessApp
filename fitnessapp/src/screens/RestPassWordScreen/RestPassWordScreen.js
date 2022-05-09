import React, {useState} from "react";
import {View, Text, StyleSheet, ScrollView,Alert} from 'react-native'

import CustomInput from "../../componets/CustomInput";
import CustomButton from "../../componets/CustomButton";
import SocialSignInButtons from "../../componets/SocialSignInButtons";
import { useNavigation } from "@react-navigation/native";
import {Auth} from 'aws-amplify'
const RestPassWordScreen = () => {

const [username, setUsername] = useState('');
const [code, setcode] = useState('');
const [newPassword, setNewPassword] = useState('');
const navigation = useNavigation();
const onSubmitPressed = async() => {

    try {
        const response = await Auth.forgotPasswordSubmit(username,code,newPassword);
        navigation.navigate('SignIn');

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

            <Text style={[styles.title]}>Reset your password</Text>
            <CustomInput placeholder="Username" value={username} setValue={setUsername}/>
            <CustomInput placeholder="Code" value={code} setValue={setcode}/>
            <CustomInput placeholder="Enter your new Password" value={newPassword} setValue={setNewPassword}/>

            <CustomButton text="Submit" onPress={onSubmitPressed}/>

            <CustomButton text="Back to Sign in" onPress={onSignInPressed} type='TERTIARY'/>

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
export default RestPassWordScreen;