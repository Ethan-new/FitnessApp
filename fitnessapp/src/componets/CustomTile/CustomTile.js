import React from "react";
import {View, Text, StyleSheet, Pressable} from 'react-native'


const CustomTile = ({onPress, text}) => {

    
    return (
        <Pressable onPress={onPress} style={[styles.container]}>
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container:{ 
        width: '50%',
        height:'99%',
        padding: 15,
        marginHorizontal:5,
        marginVertical: 8,
        backgroundColor:'#3B71F3',
        alignItems:'center',
        borderRadius: 5,
},

    text: {  
        fontWeight:'bold',
        color:'white',  
        fontSize:60,
},
}
)
export default CustomTile;