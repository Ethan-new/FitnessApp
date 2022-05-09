import React, {useState} from "react";
import {View, Text, Image, StyleSheet, useWindowDimensions, ScrollView, Alert} from 'react-native'
import Logo from '../../../assets/images/logo.png'
import CustomInput from "../../componets/CustomInput";
import CustomButton from "../../componets/CustomButton";
import SocialSignInButtons from "../../componets/SocialSignInButtons";


import { useNavigation } from "@react-navigation/native";
import { Auth } from "aws-amplify";
const SignInScreen = () => {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [loading,setLoading] = useState(false);

    const {height} = useWindowDimensions();
    const navigation = useNavigation();
    
const onSignInPressed = async (data) => {
    if (loading) {
        return;
    }

    setLoading(true);
try {
    const response = await Auth.signIn(username, password)
    console.log(response)

} catch(e) {
    Alert.alert('Oops', e.message);
}
setLoading(false);

    //navigation.navigate('Home');
}
const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassWord');
}

const onCreateAccountPressed = () => {
    navigation.navigate('SignUp');
}
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
            <Image source={Logo} style={[styles.logo, {height: height *0.3}]} resizeMode="contain"/>
            <CustomInput placeholder="Username" value={username} setValue={setUsername}/>
            <CustomInput placeholder="Password" value={password} setValue={setPassword} secureTextEntry={true}/>
            <CustomButton text={loading ? "Loading... " : "Sign In"} onPress={onSignInPressed}/>
            <CustomButton text="Forgot password?" onPress={onForgotPasswordPressed} type='TERTIARY'/>

            <SocialSignInButtons/>
            <CustomButton text="Don't have an account? Create One." onPress={onCreateAccountPressed} type='TERTIARY'/>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
        padding:20,
    },
    logo: {
        width: '70%',
        maxWidth:300,
        maxHeight:300,
    }
})
export default SignInScreen;