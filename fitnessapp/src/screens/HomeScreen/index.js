import React,{useState,useEffect} from "react";
import {View, Text, StyleSheet,Pressable,Image} from 'react-native'
import {Auth} from "aws-amplify"
import {User} from '../../models';
import { DataStore } from '@aws-amplify/datastore';


import CustomButton from "../../componets/CustomButton";
import { useNavigation , useIsFocused} from "@react-navigation/native";
import CustomTile from "../../componets/CustomTile";
import ModifyScreen from "../ModifyScreen";


function getWeekBegin() {
    var now = new Date();
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    return next;
 }




const HomeScreen = () => {
    const navigation = useNavigation();
    const [loaded, setLoaded] = useState(false)
    const [currUser, setUser]= useState(undefined)
    const [currDay, setDay]= useState(undefined)
    const [currCal, setCal]= useState(undefined)


    const IsFocused = useIsFocused()

    useEffect(() => {
        loadData()
    } , [IsFocused])

    async function loadData() {
    try {
        const user = await DataStore.query(User,  u => u.username("eq", Auth.Credentials.Auth.user.username))
        setUser(user[0])

        let weekStart = getWeekBegin();
        const d = new Date();
        user[0].TrainingDayList.forEach((x) => {
            let res = x.weekStartDate.localeCompare(weekStart.toDateString())
            if (res == 0) {

                x.exercisesDays.forEach((y,idx2) => {

                    if (d.getDay() == idx2) {

                        setDay(y)
                    }
                })
            }
        })

    } catch (err) {console.log(err)}


    
    setLoaded(true)

    }


    const signOut = ()=> {
        Auth.signOut()
    }

    const onCalanderPagePressed = ()=> {
        navigation.navigate('CalanderScreen');
    }
    const GoToModScreen =  ()=> {

        navigation.navigate('ModifyScreen');
  
    }
    const onCalPagePressed = ()=> {
        navigation.navigate('CalorieScreen');
    }
    const onHomePagePressed = ()=> {
        navigation.navigate('UserProfileScreen')
    }
    const DoNothing = ()=> {
        alert("This feature is still a work in progress!")
    }

    if (loaded == true) {
        console.log(currUser)
        console.log(currUser.CalCount.allDays[5].currCals)

        return(
            <>
        <View style={styles.container}>
                    <View>
                        <Text style={styles.timings}>Welcome Back {currUser.username}</Text>
                        <Text style={styles.description}>Your Workout today is planned at</Text>
                        <Text style={styles.description}>{currDay.startTime} (24H)</Text>
                    </View>
                    <Pressable style={styles.button} onPress={onCalanderPagePressed}>
                        <Text style={styles.buttonText}>Go to Calander</Text>
                     </Pressable>
        </View>

        <View style={styles.container2}>
                    <View>
                        <Text style={styles.timings}>Calorie Goals</Text>
                        <Text style={styles.description}>You have { currUser.CalCount.allDays[7].goalCals - currUser.CalCount.allDays[7].currCals}</Text>
                        <Text style={styles.description}>calories left today!</Text>
                    </View>
                    <Pressable style={styles.button2} onPress={onCalPagePressed} >
                        <Text style={styles.buttonText}>Go to Calorie Tracker</Text>
                     </Pressable>
        </View>

        <View style={styles.container3}>
                    <View>
                        <Text style={styles.timings}>Profile</Text>
                        <Text style={styles.description}>Change your preferences and</Text>
                        <Text style={styles.description}>settings</Text>
                    </View>
                    <Pressable style={styles.button3} onPress={onHomePagePressed}>
                        <Text style={styles.buttonText}>Edit your profile</Text>
                     </Pressable>
        </View>

        <Pressable style={styles.buttonSignout} onPress={signOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
            </>
        )
    }
    return (
        <View>
            <Text>Loading...</Text>
        </View>
    )


}
const styles = StyleSheet.create({
    container3: {
        marginTop: 10,
        backgroundColor: '#c48333',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignSelf: 'center',
        width: '90%',
        maxWidth: '100%',
        
      },
    container2: {
        marginTop: 10,
        backgroundColor: '#1f9c4d',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignSelf: 'center',
        width: '90%',
        maxWidth: '100%',
      },
    container: {
      marginTop: 10,
      backgroundColor: '#0891b2',
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderRadius: 5,
      alignSelf: 'center',
      width: '90%',
      maxWidth: '100%',
      
    },
    timings: {
      color: '#fff',
      fontSize: '25px',
      alignSelf: 'center'
    },
    description: {
      color: 'white',
      marginBottom: 5,
      fontSize: 20,
      alignSelf: 'center'
    },
    button: {
      backgroundColor: '#22d3ee',
      alignSelf: 'center',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 2,
    },
    button2: {
        backgroundColor: '#5dd488',
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 2,
      },
      button3: {
        backgroundColor: '#eb9328',
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 2,
      },
      buttonSignout: {
        backgroundColor: '#c21527',
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 2,
        marginTop: 10
      },
    buttonText: {
      fontWeight: 'bold',
      color: 'white',
      textTransform: 'uppercase',
      fontSize: 14
    }
  });


export default HomeScreen;