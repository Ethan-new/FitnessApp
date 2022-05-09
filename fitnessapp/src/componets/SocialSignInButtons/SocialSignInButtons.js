import React from "react";
import {View, Text} from 'react-native'
import CustomButton from "../CustomButton";

const SocialSignInButtons = () => {

    const onSignInFacebookPressed = () => {
        console.warn("Sign In Facebook");
    }
    const onSignInGooglePressed = () => {
        console.warn("Sign In Google");
    }
    const onSignInApplePressed = () => {
        console.warn("Sign In Apple");
    }
    
    return (
       <>
            <CustomButton text="Sign In with Facebook" onPress={onSignInFacebookPressed} bgColor="#E7EAF4" fgColor="#4765A9"/>
            <CustomButton text="Sign In with Google" onPress={onSignInGooglePressed} bgColor="#DAE9EA" fgColor="#DD4D44"/>
            <CustomButton text="Sign In with Apple" onPress={onSignInApplePressed} bgColor="#e3e3e3" fgColor="#363636"/>    
        </>
    )
}


export default SocialSignInButtons;
