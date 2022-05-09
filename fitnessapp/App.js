import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';


import Navigation from "./src/navigation";

import Amplify from 'aws-amplify'
import {withAuthenticator} from "aws-amplify-react-native"
import config from './src/aws-exports'

Amplify.configure(config)

const App = () => {
//  Auth.signOut();
  return (
    <View style={styles.container}>
      <Navigation/>
      <StatusBar style="auto" />

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFC'
  },
});




export default App
