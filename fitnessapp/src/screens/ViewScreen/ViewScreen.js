import React,{useState,useEffect} from "react";
import {View, Text, TouchableOpacity, Alert, ActivityIndicator,StyleSheet,Pressable, TextInput} from 'react-native'
import {Auth} from "aws-amplify"

import moment, { months } from "moment";
import { DataStore } from '@aws-amplify/datastore';
import { Day, Exercises, User, Week, ExercisesStorage, CalDays, Cals, DailyFoodItems } from '../../models';
import _ from "lodash"

import { useNavigation, useIsFocused} from "@react-navigation/native";
import { FoodItems } from "../../models";


function getTodaysDate() {
  var next = new Date();
  return next;
}

function getWeekBegin() {
  var now = new Date();
  var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  return next;
}


const ViewScreen = () => {
    const navigation = useNavigation();
    const [loaded, setLoaded] = useState(false);
    const [currUser, setUser]= useState(undefined)
    const [userInput, setUserInput]= useState(null)
    const [userInputQua, setUserInputQua]= useState(null)
    const [userInputCal, setUserInputCal]= useState(null)
    const [allFood, setAllFood]= useState(null)

  const GoToHome =  ()=> {
    
    navigation.navigate('Home');
}
    

  const IsFocused = useIsFocused()

    useEffect(() => {
        loadData()
    } , [IsFocused])
    
    function prevDay() {

    }
  
  
    function NextDay() {

  
    }

    async function loadData() {
      try {

          const username = Auth.Credentials.Auth.user.username;
          let user = await DataStore.query(User,  u => u.username("eq", username))
          setUser(user[0])
          
          let allfood = await DataStore.query(FoodItems)
          setAllFood(allfood)

   

          

          
    
          
      } catch (err) {console.log(err)}

        setLoaded(true)

     };
     async function addItem() {


      await DataStore.save(
        new FoodItems({
        "name": userInput,
        "calperpound": userInputCal,
        "extraInfo": userInputQua
      })
    );

    let allfood = await DataStore.query(FoodItems)
    setAllFood(allfood)

    setUserInput("")
    setUserInputCal("")
    setUserInputQua("")
     }
     function goToCalScreen() {
      navigation.navigate('CalorieScreen');
    }

      if (loaded == false) {
        
          return(
          <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator></ActivityIndicator>
          </View>)
      }
      console.log("---------")
      console.log(currUser)
 
      console.log(allFood)

      console.log("---------")
      var now = new Date();
      var next = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return (
        
       <>

          <View style={styles.topnav}>
          
          <Pressable style={styles.topnavLeftArrow} onPress={goToCalScreen}> <Text style={styles.buttonText}>Back</Text></Pressable>    


          </View>

          <View style={styles.container}>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={t => setUserInput(t)}
                value={userInput || ""}
                placeholder="Item Name"
                />
                <TextInput
                style={styles.input}
                onChangeText={t => setUserInputCal(t)}
                value={userInputCal || ""}
                placeholder="Calorie amount"
                />
              <TextInput
                style={styles.input}
                onChangeText={t => setUserInputQua(t)}
                value={userInputQua || ""}
                placeholder="Item Quantity(per _______)"
                />
                  <Pressable style={styles.button} onPress={addItem}>
                    <Text style={styles.buttonText}>Add Item To Database</Text>
                  </Pressable>
            </View>
          </View>

          <View style={styles.container}>
            <View>
              <Text style={styles.timings}>All Items</Text>
              
              {allFood.map((x,idx) => {
                
                return <Text style={styles.description} key={idx}>{x.name} for a total of {x.calperpound} cals {x.extraInfo}</Text>

              })}
            </View>
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
  container: {
    marginTop: 10,
    backgroundColor: '#1f9c4d',
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
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    fontSize: 14
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,

  },
});
export default ViewScreen;