import React  from "react";
import { View,StyleSheet,Text,Animated } from "react-native";

const FormHeader=({leftHeading,rightHeading,leftHeaderTranslatex=40,rightHeaderTranslateY=-20, rightHeaderOpacity=0})=>{
    return( <>
          <View style={styles.container}>
  <Animated.Text style={[styles.heading,{transform:[{translateX:leftHeaderTranslatex}]}]}>{leftHeading}</Animated.Text>
  <Animated.Text style={[styles.heading,{opacity:rightHeaderOpacity, transform:[{translateY:rightHeaderTranslateY}]}]}>{rightHeading}</Animated.Text>
</View>
    </>
    );   
}

const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:"center",
        alignItems:"center",
    },
    heading:{fontSize:30,fontWeight:'bold',color:'#1b1b33'}
})

export default FormHeader;