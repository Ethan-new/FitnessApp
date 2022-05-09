import React,{useState,useEffect} from "react";
import {View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet} from 'react-native'
import {Auth} from "aws-amplify"
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { DataStore } from '@aws-amplify/datastore';
import { Day, Exercises, User, Week, ExercisesStorage } from '../../models';
import _ from "lodash"
import moment, { months } from "moment";
import { useNavigation } from "@react-navigation/native";

import CustomButton from "../../componets/CustomButton";
import RnIncrementDecrementBtn  from 'react-native-increment-decrement-button';
import RadioGroup from 'react-native-radio-buttons-group';

const radioButtonsData = [{
    id: '1', // acts as primary key, should be unique and non-empty string
    label: 'Sunday',
    value: 'option1'
}, {
    id: '2',
    label: 'Monday',
    value: 'option2'
}, {
    id: '3',
    label: 'Tuesday',
    value: 'option2'}
    , {
    id: '4',
    label: 'Wednesday',
    value: 'option2'}
    , {
    id: '5',
    label: 'Thursday',
    value: 'option2'}
    , {
    id: '6',
    label: 'Friday',
    value: 'option2'}
    , {
    id: '7',
    label: 'Saturday',
    value: 'option2'}

]

let currUser
let time = 12
const ModifyScreen = () => {
    const navigation = useNavigation();
    const [radioButtons, setRadioButtons] = useState(radioButtonsData)


    
    function onPressRadioButton(radioButtonsArray) {
        setRadioButtons(radioButtonsArray);
    }

    const loadData = async ()=> {  

        console.log(Auth.Credentials.Auth.user.username);
        const username = Auth.Credentials.Auth.user.username;
        currUser = await DataStore.query(User,  u => u.username("eq", username)); 


     };

    loadData();


    const signOut = ()=> {
        Auth.signOut()

    }
    const GoCalScreen = ()=> {
        navigation.navigate('CalanderScreen');

    }
    const ChangeSchedule = async ()=> {
        var temp = 10

        radioButtons.forEach((x,idx) => {
            if(x.selected == true) {
                temp = idx;
            }

        })
        if (temp == 10) {
            Alert("Please choose a Day");
            return;
        }
        let weekStart = getWeekBegin();

        currUser[0].TrainingDayList.forEach((x,idx1) => {
            let res = x.weekStartDate.localeCompare(weekStart.toDateString())
            if (res == 0) {

                x.exercisesDays.forEach((y,idx2) => {
                    if (temp == idx2) {
                        const deepCopyWithLodashCloneDeep = _.cloneDeep(currUser[0].TrainingDayList[idx1].exercisesDays)
                        deepCopyWithLodashCloneDeep

                        //y.startTime = time

                        deepCopyWithLodashCloneDeep[idx2].startTime =time;

                        DataStore.save(
                            User.copyOf(currUser[0], updated => {
                            updated.TrainingDayList[idx1].exercisesDays = deepCopyWithLodashCloneDeep;
                
                            })
                        );

                    }

                })
            }

        })
        alert("Day Time Changed")
    }

    function getWeekBegin() {
        var now = new Date();
        var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        console.log(next)
        return next;
     }

     const ReGenerateDay= async ()=> {
        try {
        var temp = 10
        const exercisesDB = await DataStore.query(ExercisesStorage);
        radioButtons.forEach((x,idx) => {
            if(x.selected == true) {
                temp = idx;
            }

        })
        if (temp == 10) {
            Alert("Please choose a Day");
            alert("Please choose a Day");
            return;
        }
        let weekStart = getWeekBegin();

        currUser[0].TrainingDayList.forEach((x,idx1) => {
            let res = x.weekStartDate.localeCompare(weekStart.toDateString())
            if (res == 0) {

                x.exercisesDays.forEach((y,idx2) => {
                    if (temp == idx2) {
                        const deepCopyWithLodashCloneDeep = _.cloneDeep(currUser[0].TrainingDayList[idx1].exercisesDays)
                        deepCopyWithLodashCloneDeep

                    

                        var dailyExercises = []
                        var selectExercises = []
                        //select the exercises for the day
                        for (var i=0; i <5;i++) {
                            var alreadyAdd = false;
                            let value = exercisesDB[Math.floor(Math.random() * exercisesDB.length)]
                            selectExercises.forEach(x=> {
                                if (value.name == x.name) {
                                    alreadyAdd = true
                                }
                            }) 
                            if (alreadyAdd == true) {
                                i=i-1
                            } else {
                                selectExercises.push(value)
                                const exercisesGened = new Exercises({
                                    "name": value.name,
                                    "videolink": "",
                                    "numberOfReps":value.numberOfReps,
                                    "sets": value.sets
                
                                })
                
                                dailyExercises.push(exercisesGened);
                            }
            
                        }

                        deepCopyWithLodashCloneDeep[idx2].exercises =dailyExercises;
                        console.log(deepCopyWithLodashCloneDeep[idx2].exercises)
                        DataStore.save(
                            User.copyOf(currUser[0], updated => {
                            updated.TrainingDayList[idx1].exercisesDays = deepCopyWithLodashCloneDeep;
                
                            })
                        );

                    }

                })
            }

        })
        alert("Day Generated Again With New Exercises")
     }catch (error) {
        console.log(error)
    }
     }
    const GenerateWeek = async ()=> {

        try{

        let weekStart = getWeekBegin();
        //Get username of curret user
        const username = Auth.Credentials.Auth.user.username;
        let user = await DataStore.query(User,  u => u.username("eq", username));
        if (user == undefined) {
            Alert.alert("Next weeks schedule has already been made!"); 
            throw console.error("Week Already Made");
        }
        user[0].TrainingDayList.forEach(x => {
            let res = x.weekStartDate.localeCompare(weekStart.toDateString())
            if (res == 0) {
                Alert.alert("Next weeks schedule has already been made!"); 
                throw console.error("Week Already Made");
            }
        })
        //pull all exercises
        const exercisesDB = await DataStore.query(ExercisesStorage);

        var days = [];

        for (var x=0; x < 7;x++) {
            var dailyExercises = []
            var selectExercises = []
            //select the exercises for the day
            for (var i=0; i <5;i++) {
                var alreadyAdd = false;
                let value = exercisesDB[Math.floor(Math.random() * exercisesDB.length)]
                selectExercises.forEach(x=> {
                    if (value.name == x.name) {
                        alreadyAdd = true
                    }
                }) 
                if (alreadyAdd == true) {
                    i=i-1
                } else {
                    selectExercises.push(value)
                    const exercisesGened = new Exercises({
                        "name": value.name,
                        "videolink": "",
                        "numberOfReps":value.numberOfReps,
                        "sets": value.sets
    
                    })
    
                    dailyExercises.push(exercisesGened);
                }

            }
            let dayOfWorkout = getWeekBegin();
            
            dayOfWorkout.setDate(dayOfWorkout.getDate() + x)
            let m = moment(dayOfWorkout).format('YYYY-MM-DD')
            const dayGened = new Day({
                "Date": m,
                "startTime": "1",
                "endTime":"11",
                "exercises": dailyExercises,
            })
            days.push(dayGened);
            
        }
    
        const tempWeek = new Week({
            "weekStartDate": weekStart.toDateString(),
            "exercisesDays": days
        })

        const deepCopyWithLodashCloneDeep = _.cloneDeep(user[0].TrainingDayList)
        deepCopyWithLodashCloneDeep.push(tempWeek);

        currUser=deepCopyWithLodashCloneDeep;
        
        
        await DataStore.save(
            User.copyOf(user[0], updated => {
            updated.TrainingDayList = deepCopyWithLodashCloneDeep;

            })
        );
        

     
        } catch (error) {
            console.log(error)
        }
    }

    return (
        
        <View  style={styles.root}>
            
            <Text style={[styles.title]}>Change Next Weeks Schedule</Text>
            <Text style={[styles.subtitle]}>Select a Day</Text>
            <RadioGroup 
                radioButtons={radioButtons} 
                onPress={onPressRadioButton} 
                layout="column"
            />
            <Text style={[styles.subtitle]}>Select a New Time</Text>
            <RnIncrementDecrementBtn minVal={0} minreq={0} max={24} val={12} 
                styleBtn={{width:100,height:100,backgroundColor:'#3B71F3',color:'white'}}
                styleTextInput={{width:100,height:100,backgroundColor:'#3B71F3'}}
                labelStyle={{fontSize:25,color:'white'}}
                handleClick={(number)=>{time = number
                }}
                />
            <View style={styles.temp}>
            <CustomButton onPress={ChangeSchedule} text="Confirm Change" />
            <CustomButton onPress={ReGenerateDay} text="Generate Day Again" />
            <CustomButton onPress={GenerateWeek} text="Generate Next Weeks Schedule" />
            <CustomButton onPress={GoCalScreen} text="Go Back" />
            <CustomButton onPress={signOut} text="Sign Out" bgColor="#E3242B"/>
            </View>
        </View>
    )


}

const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
        padding:20,
        flex:1
    },
    title: {
        fontSize:30,
        fontWeight:'bold',
        color:'#051C60',
        margin:10,
    },
    subtitle: {
        fontSize:24,
        fontWeight:'bold',
        color:'#051C60',
        margin:10,
    },

})
export default ModifyScreen;