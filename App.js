import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);


const mainImage = require('./assets/mileage.jpg');

function HomeScreen({ navigation }){
  return(
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcome}>WelCome!</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={mainImage} style={styles.image} />
      </View> 
      <View style={styles.btnsContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("Calculate")
          }}                   
          style={styles.calculateBtn}>
          <Text style={styles.calculateLabel}>Calculate</Text>
        </Pressable>
      </View>           
      <StatusBar style="auto" />
    </View>
  );
}

function CalculationScreen ({ route, navigation }){
  const [miles, setMiles] = useState(0);
  const [date, setDate] = useState("");
  const [gallons, setGallons] = useState(0);
  const [milesGallons, setMilesGallons] = useState(0);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  const getDate = () => {
    let newDate = new Date(date).toLocaleDateString();
    return date !== "" ? newDate : "";
  };

  const onChangeMiles = (input) => {      
    setMiles(input);
  }

  const onChangeDate = (input) => {      
    setDate(input);
  }

  const onChangeGallons = (input) => {      
    setGallons(input);
  }

  const handleCalculateMiles = () =>{
    let total = 0;

    total = (miles / gallons).toFixed(2);
    
    setMilesGallons(total);   
  }

  return (
    <View style={styles.calculationContainer}>
      <View style={styles.form}>
        <View style={styles.formInput}>
          <Text style={styles.formLabel}>Number of Miles</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeMiles}
            value={miles ? miles : ""}
            keyboardType='numeric'
          />
        </View>
        <View style={styles.formInput}>
          <Text style={styles.formLabel}>Date of Purchase</Text>
          <TextInput
            style={styles.inputDate}
            onChangeText={onChangeDate}
            value={getDate()}
            editable = {false}
          />
          <TouchableOpacity
            onPress={showDatePicker}
            style={styles.selectDate}
            activeOpacity={0.8}>
            <Text style={styles.dateLabel}>Select Date</Text>
          </TouchableOpacity>     
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />   
        </View>
        <View style={styles.formInput}>
          <Text style={styles.formLabel}>Gallons</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeGallons}
            value={gallons ? gallons : ""}
            keyboardType='numeric'
          />
        </View>
        <View style={styles.calculationContainesBtns}>
          <Pressable
              onPress={handleCalculateMiles}                   
              style={styles.calculateBtnForm}>
              <Text style={styles.calculateBtnFormLabel}>Calculate</Text>
          </Pressable>
          <Pressable
              onPress={() => {
                navigation.navigate("MPG Calculation")
              }}                   
              style={styles.cancelBtnForm}>
              <Text style={styles.cancelBtnFormLabel}>Cancel</Text>
          </Pressable>
        </View>
        {miles != 0 && date != '' && gallons != 0 && milesGallons != 0 ? 
        <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Result</Text>
              <View style={styles.resultDetailsContainer}>
                <Text style={styles.resultDetails}>{date != '' ? new Date(date).toLocaleDateString() : 'mm/dd/yyyy'}</Text> 
                <Text style={styles.resultDetails}>({miles != 0 ? miles : 0} M {gallons != 0 ? gallons : 0} G)</Text>
                <Text style={styles.resultDetails}>{milesGallons != 0 ? milesGallons : 0} MPG</Text>
              </View>
        </View>
        : ""}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MPG Calculation" component={HomeScreen} 
                      options={{ 
                        headerStyle: { backgroundColor: '#D9D9D9'},
                        headerTintColor: '#000'}} />
        <Stack.Screen name="Calculate" component={CalculationScreen} options={{ 
                        headerStyle: { backgroundColor: '#D9D9D9'},
                        headerTintColor: '#000'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculationContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  welcomeContainer: {
    paddingBottom: 30,
  },
  welcome: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: 'bold',
  },
  image: {
    width: 320,
    height: 230,
  },
  calculateLabel: {
    backgroundColor: "#ffffff",
  },
  btnsContainer: {
    flex: 0.8,
    paddingTop: 80
  },
  calculateBtn:{
    width: 151,
    height: 40,    
    backgroundColor: '#ADD8E6'
  },
  calculateLabel: {    
    textAlign: 'center',
    backgroundColor: '#ADD8E6',
    fontSize: 28,
    fontWeight: 'bold'
  },
  form:{
    marginTop: 25,
  },
  formInput: {
    marginBottom: 10,
    padding: 10,
    marginLeft: 'auto',
    marginRight: 'auto',    
  },
  formLabel: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    height: 48,
    width: 280,
    fontSize: 25,
    paddingLeft: 10
  },
  inputDate: {
    backgroundColor: '#d4d4d4',
    height: 48,
    width: 280,
    fontSize: 25,
    paddingLeft: 10,
    color: '#5a5a5a'
  },
  selectDate: {
    justifyContent: 'center',
    backgroundColor: '#ADD8E6',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    width: 150,
    height: 30,
    borderRadius: 18,
  },
  dateLabel: {
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
  },
  calculateBtnForm: {  
    justifyContent: 'center',  
    width: 123,
    height: 40,    
    backgroundColor: '#90EE90',
  },
  calculationContainesBtns: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto', 
    borderBottomColor: '#ffffff',
    borderBottomWidth: 2  
  },
  cancelBtnForm: {
    justifyContent: 'center',
    width: 123,
    height: 40,    
    backgroundColor: '#FF7276',
  },
  calculateBtnFormLabel: {
    textAlign: 'center',
    backgroundColor: '#90EE90',
    fontSize: 20,
    fontWeight: 'bold'
  },
  cancelBtnFormLabel: {
    textAlign: 'center',
    backgroundColor: '#FF7276',
    fontSize: 20,
    fontWeight: 'bold'
  },
  resultContainer: {
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto', 
  },
  resultDetails: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  resultText: {
    textAlign: 'center',
    paddingBottom: 20,
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold'
  },
  resultDetailsContainer: {
    flexDirection: 'row',
    gap: 20
  }
});
