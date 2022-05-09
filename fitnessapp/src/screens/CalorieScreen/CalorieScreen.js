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


const CalorieScreen = () => {
    const navigation = useNavigation();
    const [loaded, setLoaded] = useState(false);
    const [currUser, setUser]= useState(undefined)
    const [userInput, setUserInput]= useState(null)
    const [userInputQua, setUserInputQua]= useState(null)
    const [currDate, setCurrDate]= useState(null)
    const [currFood, setCurrFood]= useState([])
    const [allFood, setAllFood]= useState(null)

  const GoToHome =  ()=> {
    
    navigation.navigate('Home');
}
    
const GoToView =  ()=> {
    
  navigation.navigate('ViewScreen');
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

          const today = new Date()
          let newday = true
          
          
          user[0].CalCount.allDays.forEach ((x)=> {
            if (x.Date.slice(0,16) === today.toString().slice(0,16)) {
              setCurrDate(x)
              setCurrFood(user[0].CalCount.allDays[7].foodItems)
              console.log(user[0].CalCount.allDays[7].foodItems)
              newday = false
            }
          })

          if (newday == true) {
            console.log("made new day")

              const newDayToAdd = new CalDays({
              "Date": today.toString(),
              "currCals": "0",
              "foodItems": [],
              "goalCals": user[0].CalCount.currTargetCals
            })

            
            const deepCopyWithLodashCloneDeep = _.cloneDeep(user[0].CalCount.allDays)

            deepCopyWithLodashCloneDeep.push(newDayToAdd)

            const newCals = new Cals({
              "currTargetCals": user[0].CalCount.currTargetCals,
              "allDays": deepCopyWithLodashCloneDeep,
            })
            

            await DataStore.save(
              User.copyOf(user[0], updated => {
              updated.height = user[0].height
              updated.weight = user[0].weight
              updated.gender = user[0].gender
              updated.numberOfPreferedExercises =  user[0].numberOfPreferedExercises
              updated.CalCount = newCals;
              updated.TrainingDayList = [user[0].TrainingDayList[0],user[0].TrainingDayList[0]];
              updated.username = user[0].username
              })
          );
          }





          //divider
          
          
          user[0].CalCount.allDays.forEach ((x)=> {
            console.log(x)
            if (x.Date.slice(0,16) === today.toString().slice(0,16)) {
              setCurrDate(x)
            }
          })
          
      } catch (err) {console.log(err)}

        setLoaded(true)

     };


     async function  addItem() {
      let isitemfound = false;
      let itemfound 
      allFood.forEach((x) => {


        if (x.name == userInput) {
          isitemfound = true
          itemfound = x

        }
      })

      if (isitemfound == true) {

        const foodnamecap = itemfound.name.charAt(0).toUpperCase() + itemfound.name.slice(1);
        const totalcal = parseInt(itemfound.calperpound, 10) * parseInt(userInputQua, 10)

        const newFoodtoAdd = new DailyFoodItems({
          "name": foodnamecap,
          "weight": userInputQua,
          "calCount": totalcal.toString()
        })

        const deepCopyWithLodashCloneDeep = _.cloneDeep(currDate)
    
        deepCopyWithLodashCloneDeep.foodItems.push(newFoodtoAdd)
        console.log("Food")
        console.log(deepCopyWithLodashCloneDeep.foodItems)
        let newCalCount = parseInt(currDate.currCals, 10) + totalcal
        setCurrFood(deepCopyWithLodashCloneDeep.foodItems)
        const updatedDay = new CalDays({
          "Date": currDate.Date,
          "currCals": newCalCount.toString(),
          "foodItems": deepCopyWithLodashCloneDeep.foodItems,
          "goalCals": currDate.goalCals
        })
        console.log(updatedDay)


        const deepCopyWithLodashCloneDeep2 = _.cloneDeep(currUser.CalCount.allDays)

        deepCopyWithLodashCloneDeep2[7] = updatedDay

        const updatedCals = new Cals({
          "currTargetCals": currUser.CalCount.currTargetCals,
          "allDays": deepCopyWithLodashCloneDeep2,

        })

        /* Models in DataStore are immutable. To update a record you must use the copyOf function
        to apply updates to the item’s fields rather than mutating the instance directly */
        
            await DataStore.save(
              User.copyOf(currUser, updated => {
              updated.height = currUser.height
              updated.weight = currUser.weight
              updated.gender = currUser.gender
              updated.numberOfPreferedExercises =  currUser.numberOfPreferedExercises
              updated.CalCount = updatedCals;
              updated.TrainingDayList = [currUser.TrainingDayList[0],currUser.TrainingDayList[0]];
              updated.username = currUser.username
              })
          );
        


        setCurrDate(updatedDay)

      } else {
        console.warn("Item not found")
      }
     }
      if (loaded == false) {
        
          return(
          <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator></ActivityIndicator>
          </View>)
      }
      console.log("---------")
      console.log(currUser)
      console.log(currDate)
      console.log(allFood)
      console.log(currFood)
      console.log("---------")
      var now = new Date();
      var next = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return (
        
       <>

          <View style={styles.topnav}>
          
          <Pressable style={styles.topnavLeftArrow} onPress={prevDay}> <Text style={styles.buttonText}>Previous Day</Text></Pressable>    
          <Text style={styles.navText}>{moment(next).format('ddd MMM D')}</Text> 
          <Pressable style={styles.topnavRightArrow} onPress={NextDay}> <Text style={styles.buttonText}>Next Day</Text></Pressable>
          </View>
          <View style={styles.container}>
            <View>
              <Text style={styles.timings}>You have eaten {currDate.currCals} </Text>
              <Text style={styles.timings}>calories today </Text>
              <Text style={styles.timings}>{currDate.goalCals - currDate.currCals} more to go!</Text>
            </View>
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
                onChangeText={t => setUserInputQua(t)}
                value={userInputQua || ""}
                placeholder="Item Quantity"
                />
                  <Pressable style={styles.button} onPress={addItem}>
                    <Text style={styles.buttonText}>Add Item To Today</Text>
                  </Pressable>
            </View>
          </View>

          <View style={styles.container}>
            <View>
              <Text style={styles.timings}>All Items Eaten Today</Text>
              
              {currFood.map((x,idx) => {
                
                return <Text style={styles.description} key={idx}>{x.weight} {x.name} for a total of {x.calCount} cals</Text>

              })}

            <Pressable style={styles.button} onPress={GoToView}> <Text style={styles.buttonText}>View all Items</Text></Pressable>    
            </View>
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
export default CalorieScreen;