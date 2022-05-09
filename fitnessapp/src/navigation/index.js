import React,{useEffect, useState} from "react";
import {View, Text,ActivityIndicator} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen'
import ForgotPassWordScreen from '../screens/ForgotPassWordScreen';
import RestPassWordScreen from '../screens/RestPassWordScreen';
import HomeScreen from '../screens/HomeScreen'
import CalanderScreen from "../screens/CalanderScreen";
import ModifyScreen from "../screens/ModifyScreen";
import {Auth, Hub} from 'aws-amplify'
import UserProfileScreen from "../screens/UserProfileScreen";
import CalorieScreen from "../screens/CalorieScreen";
import ViewScreen from "../screens/ViewScreen/ViewScreen";
const Stack = createNativeStackNavigator();

const Stack2 = createNativeStackNavigator();
const Navigation = () => {

    const [user, setUser] = useState(undefined);
    const [log, setLog] = useState(false);
    const checkUser = async() => {
    
    try {
   
        const authUser = await Auth.currentAuthenticatedUser({bypassCache: true})
        setLog(true);
    setUser(authUser);
    } catch (e) {
        setUser(null)

    }

}

    useEffect(() => {
        checkUser();
    }, [])
    
    useEffect(() => {
        const listener = (data)=> {
            console.log(data);
            if (data.payload.event == 'signIn' || data.payload.event == 'signOut') {
                checkUser();
                setLog(false);
            }
        }

        Hub.listen('auth',listener)
        return() => Hub.remove('auth', listener)
    }, [])
    if (user == undefined && log==true) {
        return(
            <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        )
    }
    return (
        <>

        <NavigationContainer >
            <Stack.Navigator screenOptions={{headerShown: false}}>
                {user ? (
                    <>
                    <Stack.Screen name="Home" component ={HomeScreen} />
                    <Stack.Screen name="CalanderScreen" component ={CalanderScreen} />
                    <Stack.Screen name="ModifyScreen" component={ModifyScreen}/>
                    <Stack.Screen name="UserProfileScreen" component ={UserProfileScreen} />
                    <Stack.Screen name="CalorieScreen" component ={CalorieScreen} />
                    <Stack.Screen name="ViewScreen" component ={ViewScreen} />
                    </>
                ) : (
                    <>
                    <Stack.Screen name="SignIn" component ={SignInScreen} />
                    <Stack.Screen name="SignUp" component ={SignUpScreen} />
                    <Stack.Screen name="ConfirmEmail" component ={ConfirmEmailScreen} />
                    <Stack.Screen name="ForgotPassWord" component ={ForgotPassWordScreen} />
                    <Stack.Screen name="RestPassWord" component ={RestPassWordScreen} />
                    </>
                )}

      
            </Stack.Navigator>

        </NavigationContainer>
        </>
    )
}


export default Navigation;