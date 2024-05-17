import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text,  View ,Animated,Dimensions,scrollTo} from 'react-native';
import React, { useRef } from 'react';

import FormHeader from './FormHeader';
import FormSelectorBtn from './FormSelectorBtn';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';


const {width}=Dimensions.get('window')
export default function AppForm({navigation}) {
  const animation=useRef(new Animated.Value(0)).current;

  const scrollViewRef = useRef();


  const rightHeaderOpacity=animation.interpolate({
    inputRange:[0,width],
    outputRange:[1,0],
  });

  const leftHeaderTranslatex=animation.interpolate({
    inputRange:[0,width],
    outputRange:[0,40],
  });

  const rightHeaderTranslateY=animation.interpolate({
    inputRange:[0,width],
    outputRange:[0,-20],
  });

  const loginColorInterpolate=animation.interpolate({
    inputRange:[0,width],
    outputRange:['rgba(27,27,51,1)','rgba(27,27,51,0.4)'],
  });

  const signupColorInterpolate=animation.interpolate({
    inputRange:[0,width],
    outputRange:['rgba(27,27,51,0.4)','rgba(27,27,51,1)'],
  });



  return (
   <View style={{flex:1, paddingTop:60}}>
<View style={{height:80}}>
<FormHeader  leftHeading='Welcome'   rightHeading='Back' rightHeaderOpacity={rightHeaderOpacity} leftHeaderTranslatex={leftHeaderTranslatex}  rightHeaderTranslateY={rightHeaderTranslateY}></FormHeader>
</View>
<View style={{flexDirection:'row',paddingHorizontal:20 ,marginBottom:70}}>
<FormSelectorBtn style={styles.borderLeft}  backgroundColor={loginColorInterpolate} title='Login'   onPress={()=> scrollViewRef.current.scrollTo({x:0})}></FormSelectorBtn>
<FormSelectorBtn style={styles.borderRight} backgroundColor={signupColorInterpolate}  title='Sign Up'   onPress={()=> scrollViewRef.current.scrollTo({x:width})}></FormSelectorBtn>
</View>
<ScrollView 
  ref={scrollViewRef}
  horizontal 
  pagingEnabled 
  showsHorizontalScrollIndicator={false}
  scrollEventThrottle={16}
  onScroll={Animated.event([{nativeEvent:{contentOffset:{x:animation}}},],{useNativeDriver:false})} >

 
<LoginForm navigation={navigation}></LoginForm>
  <ScrollView>
  <SignUpForm></SignUpForm>
    </ScrollView>

</ScrollView>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderLeft:{
    borderTopLeftRadius:8,
    borderBottomLeftRadius:8,
  },
  borderRight:{
    borderTopRightRadius:8,
    borderBottomRightRadius:8,
  }
});
