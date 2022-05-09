import React,{useState,useEffect} from "react";
import {View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView} from 'react-native'
import {Auth} from "aws-amplify"
import {User} from '../../models';
import { DataStore } from '@aws-amplify/datastore';

import _ from "lodash"

import { useNavigation } from "@react-navigation/native";
import CustomInput from "../../componets/CustomInput";
import CustomButton from "../../componets/CustomButton";
import RnIncrementDecrementBtn  from 'react-native-increment-decrement-button';
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { Cals } from "../../models";



const UserProfileScreen = () => {
    const navigation = useNavigation();
    const [loaded, setLoaded] = useState(false)
    const [currUser, setUser]= useState(undefined)

    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('');
    const [numberofexe, setNumberOfExe] = useState('');
    const [calories, setCalories] = useState('');
    //create user object and load data
 

    useEffect(() => {
        loadData()
      }, []);

    async function loadData() {
    try {
        const user = await DataStore.query(User,  u => u.username("eq", Auth.Credentials.Auth.user.username))
        setUser(user[0])
    } catch (err) {console.log(err)}
    setLoaded(true)
    }

    


    //Makes copies of user input and update account
    const saveChanges = async ()=> {
        let tempheight = 0;
        tempheight = height.valueOf()
        let tempweight = 0;
        tempweight = weight.valueOf()
        let tempexe = 0;
        tempexe = numberofexe.valueOf()
        let tempcal = 0;
        tempcal = calories.valueOf()

        let tempgender = "";
        tempgender = gender


        if (tempheight == 0) {
            tempheight = currUser.height
        }

        if (tempweight == 0) {
            tempweight = currUser.weight
        }

        if (tempexe == 0) {
            tempexe = currUser.numberOfPreferedExercises
        }
        

        if (tempcal == 0) {
            tempcal = currUser.CalCount.currTargetCals
        } 
        const calcount1 = new Cals({
            "currTargetCals": tempcal,
            "allDays": currUser.CalCount.allDays,
        })
        console.log(calcount1)
        if(tempgender.length > 0) {
            tempgender = gender
            console.log(tempgender)
        } else {
            tempgender = currUser.gender
        }
        console.log(currUser.TrainingDayList)
        await DataStore.save(
            User.copyOf(currUser, updated => {
            updated.height = Number(tempheight)
            updated.weight = Number(tempweight)
            updated.gender = tempgender;
            updated.numberOfPreferedExercises =  Number(tempexe);
            updated.CalCount = calcount1;
            updated.TrainingDayList = [currUser.TrainingDayList[0],currUser.TrainingDayList[0]];
            updated.username = currUser.username
            })
        );
        Alert.alert("Success", "New Profile Information Saved!")
        alert("Success, New Profile Information Saved!");
        navigation.navigate('Home');

    };
    const GoToModScreen =  ()=> {

        navigation.navigate('ModifyScreen');
  
    }
    const signOut = ()=> {
        Auth.signOut()

    }
    const GoToHomePage =  ()=> {
        setLoaded(false)
        navigation.navigate('Home');
    }
    console.log(currUser)
    if (loaded == true) {
        return(
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.root}>
    
                <Text style={[styles.title]}>{Auth.Credentials.Auth.user.username}'s Profile</Text>
    
                <Text style={[styles.text]}>Height (cm)</Text>
                <CustomInput placeholder={currUser.height} value={height} setValue={setHeight}/>
    
                <Text style={[styles.text]}>Weight (lb)</Text>
                <CustomInput placeholder={currUser.weight} value={weight} setValue={setWeight}/>
    
                <Text style={[styles.text]}>Gender</Text>
                <CustomInput placeholder={currUser.gender} value={gender} setValue={setGender}/>
    
                <Text style={[styles.text]}>Number of exercises per day</Text>
                <CustomInput placeholder={currUser.numberOfPreferedExercises} value={numberofexe} setValue={setNumberOfExe}/>
                
                <Text style={[styles.text]}>Number of calories per day</Text>
                <CustomInput placeholder={currUser.CalCount.currTargetCals} value={calories} setValue={setCalories}/>

                <CustomButton onPress={GoToHomePage} text="Go To Homepage" />
                <CustomButton onPress={saveChanges} text="Save changes to profile" />

                <CustomButton onPress={signOut} text="Sign Out" bgColor="#E3242B"/>
    
            </View>
            </ScrollView>
        )
    }
    return (
        <View>
            <Text>Loading...</Text>
        </View>
    )

};


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
        fontSize:14,
        color:'gray',
        marginVertical:10,
        fontWeight:'bold',
    },
})

export default UserProfileScreen;