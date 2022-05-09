import React,{useState,useEffect} from "react";
import {View, Text, TouchableOpacity, Alert, ActivityIndicator,StyleSheet,Pressable} from 'react-native'
import {Auth} from "aws-amplify"

import moment, { months } from "moment";
import { DataStore } from '@aws-amplify/datastore';
import { Day, Exercises, User, Week, ExercisesStorage } from '../../models';
import _ from "lodash"

import { useNavigation, useIsFocused} from "@react-navigation/native";


function getTodaysDate() {
  var next = new Date();
  return next;
}

function getWeekBegin() {
  var now = new Date();
  var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  return next;
}


const CalanderScreen = () => {
    const navigation = useNavigation();
    const [loaded, setLoaded] = useState(false);
    const [currUser, setUser]= useState(undefined)
    const [currWeek, setWeek]= useState(undefined)
    const [currDay, setDay]= useState(undefined)


    const GoToModScreen =  ()=> {
      setLoaded(false)
      navigation.navigate('ModifyScreen');

  }
  const GoToHome =  ()=> {
    
    navigation.navigate('Home');
}
    
  function prevDay() {
    var next = new Date();
    if (currDay.Date == currWeek.exercisesDays[0].Date) {
      return;
    }
    currWeek.exercisesDays.forEach((x,idx)=> {

      if (x.Date == currDay.Date) {
        setDay(currWeek.exercisesDays[idx-1])
        return;
      }

    })
  }


  function NextDay() {
    var next = new Date();
    if (currDay.Date == currWeek.exercisesDays[6].Date) {
      return;
    }
    currWeek.exercisesDays.forEach((x,idx)=> {

      if (x.Date == currDay.Date) {
        setDay(currWeek.exercisesDays[idx+1])
        return;
      }

    })

  }

  const IsFocused = useIsFocused()

    useEffect(() => {
        loadData()
    } , [IsFocused])
    
    async function loadData() {
      try {
          console.log(Auth.Credentials.Auth.user.username);
          const username = Auth.Credentials.Auth.user.username;
          let user = await DataStore.query(User,  u => u.username("eq", username))
          setUser(user[0])

          let weekStart = getWeekBegin();
          const d = new Date();
          user[0].TrainingDayList.forEach((x) => {
              let res = x.weekStartDate.localeCompare(weekStart.toDateString())
              if (res == 0) {
                  setWeek(x)
                  x.exercisesDays.forEach((y,idx2) => {
                      if (d.getDay() == idx2) {
                          setDay(y)
                      }
                  })
              }
          })

      } catch (err) {console.log(err)}

        setLoaded(true)

     };



    const signOut = ()=> {
        Auth.signOut()
    }




      if (loaded == false) {
        
          return(
          <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator></ActivityIndicator>
          </View>)
      }
      console.log(currUser)
      console.log(currWeek)
      console.log(currDay)
      

    return (
        
       <>
        <View style={styles.topnav}>
 
        <Pressable style={styles.topnavLeftArrow} onPress={prevDay}> <Text style={styles.buttonText}>Previous Day</Text></Pressable>    
        <Text style={styles.navText}>{moment(currDay.Date).format('ddd MMM D')}</Text> 
        <Pressable style={styles.topnavRightArrow} onPress={NextDay}> <Text style={styles.buttonText}>Next Day</Text></Pressable>
        </View>

        <View style={styles.container}>
          <Text style={styles.timings}>Todays Start Time Is : {currDay.startTime}</Text>
          <Text style={styles.description}>Enjoy your workout</Text>
        </View>

        <View style={styles.container2}>
          <Text style={styles.exeName}>{currDay.exercises[0].name}</Text>
          <Text style={styles.exeDesc}>{currDay.exercises[0].numberOfReps} reps for {currDay.exercises[0].sets} sets</Text>
        </View>

        <View style={styles.container2}>
          <Text style={styles.exeName}>{currDay.exercises[1].name}</Text>
          <Text style={styles.exeDesc}>{currDay.exercises[1].numberOfReps} reps for {currDay.exercises[0].sets} sets</Text>
        </View>

        <View style={styles.container2}>
          <Text style={styles.exeName}>{currDay.exercises[2].name}</Text>
          <Text style={styles.exeDesc}>{currDay.exercises[2].numberOfReps} reps for {currDay.exercises[0].sets} sets</Text>
        </View>

        <View style={styles.container2}>
          <Text style={styles.exeName}>{currDay.exercises[3].name}</Text>
          <Text style={styles.exeDesc}>{currDay.exercises[4].numberOfReps} reps for {currDay.exercises[0].sets} sets</Text>
        </View>

        <View style={styles.container2}>
          <Text style={styles.exeName}>{currDay.exercises[4].name}</Text>
          <Text style={styles.exeDesc}>{currDay.exercises[4].numberOfReps} reps for {currDay.exercises[0].sets} sets</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.timings}>Remember you can change</Text>
          <Text style={styles.timings}>your schedule</Text>
          <Pressable style={styles.button} onPress={GoToModScreen}>
              <Text style={styles.buttonText}>Modify Plan</Text>
          </Pressable>
        </View>

        <View style={styles.botnav}>
         <Pressable style={styles.HomeButton} onPress={GoToHome}> <Text style={styles.buttonText}>Home</Text></Pressable>    
        </View>
       </>
    )
}


const styles = StyleSheet.create({
  botnav: {
    backgroundColor: '#031b36',
    justifyContent:"flex-end",
    paddingVertical: 20,
    width: '100%',
    maxWidth: '100%',
    alignItems:"center",
    flex:1
  },
  HomeButton: {

    backgroundColor: '#22d3ee',
    alignSelf: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
    width: '45%',

  },
  topnav: {
    backgroundColor: '#031b36',
    paddingVertical: 20,

    width: '100%',
    maxWidth: '100%',
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  topnavLeftArrow: {

    backgroundColor: '#22d3ee',
    alignSelf: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
    width: '30%',

  },
  topnavRightArrow: {

    backgroundColor: '#22d3ee',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
    width: '30%',

  },
  navText: {
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 20,

    alignSelf:"center"

  },
  container2: {
    marginTop: 1,
    borderColor: "black",
    backgroundColor: '#64c437',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth:2,
    alignSelf: 'center',
    width: '90%',
    maxWidth: '100%',
    
  },
  container: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: '#0891b2',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'center',
    width: '80%',
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
    alignItems: "center",
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 14,
    alignSelf: "center"
  },
  exeName: {
    color: '#fff',
    fontSize: '25px',
    alignSelf: 'center'
  },
  exeDesc: {
    color: '#fff',
    fontSize: '25px',
    alignSelf: 'center'
  }
});

export default CalanderScreen;