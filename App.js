import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as SQLite from "expo-sqlite";
import * as WebBrowser from 'expo-web-browser';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("milesDB.db");
  return db;
}

const db = openDatabase();


const mainImage = require('./assets/mileage.jpg');

function HomeScreen({ navigation }){

  function handleUrl() {
    WebBrowser.openBrowserAsync('https://www.tomkadleckia.com/blogs/1309/good-mileage-preowned-car/');
    }

  return(
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcome}>Welcome!</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={mainImage} style={styles.image} />
      </View> 
      <View style={styles.homeContainersBtns}>
        <Pressable
          onPress={() => {
            navigation.navigate("Calculate")
          }}                   
          style={styles.calculateBtn}>
          <Text style={styles.calculateLabel}>Calculate</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("Your Records")
          }}                   
          style={styles.recordsBtn}>
          <Text style={styles.recordsLabel}>Records</Text>
        </Pressable>
      </View>   
      <View style={styles.btnsContainer}>
        <Pressable
          onPress={() => handleUrl()}                   
          style={styles.recommendationsBtn}>
          <Text style={styles.recommendationsLabel}>Recommendations</Text>
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

  useEffect(() => {
    db.transaction((tx) => {
      // tx.executeSql(
      //   "drop table MileageCalc;"
      // );
      tx.executeSql(
        "create table if not exists MileageCalc (id integer primary key not null, miles real, purchaseDate text, gallons real, milesGallons real);"
      );
    })
  }, []);

  const add = (miles, date, gallons, milesGallons) => {
    if (miles === null || miles === NaN || miles === ''){
      return false;
    }

    if (date === null || date === ''){
      return false;
    }

    if (gallons === null || gallons === NaN || gallons === ''){
      return false;
    }

    if(milesGallons === null || milesGallons === NaN || milesGallons === ''){
      return false;
    }

    console.log(milesGallons);
    
    db.transaction(
      (tx) => {
        tx.executeSql("insert into MileageCalc (miles, purchaseDate, gallons, milesGallons) values (?, ?, ?, ?)", [miles, date.toLocaleDateString(), gallons, milesGallons]);
        tx.executeSql("select * from MileageCalc", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      }
    );
  }

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
    let milesValid = false;
    let dateValid = false;
    let gallonsValid = false;

    if(miles == 0 || miles == null || miles == ""){
      alert('Please enter miles driven')
    }else{
      milesValid = true;
    }

    if(date == 0 || date == null || date == ""){
      alert('Please select a date')
    }else{
      dateValid = true;
    }

    if(gallons == 0 || gallons == null || gallons == ""){
      alert('Please enter gallons purchased')
    }else{
      gallonsValid = true;
    }

    if(milesValid && dateValid && gallonsValid){
      total = (miles / gallons).toFixed(2);
      setMilesGallons(total);  
      add(miles, date, gallons, total);
    } 
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
            returnKeyType='done'
            keyboardType='numeric'
          />
        </View>
        <View style={styles.formInput}>
          <Text style={styles.formLabel}>Date of Purchase</Text>
          <TextInput
            style={styles.inputDate}
            onChangeText={onChangeDate}
            value={getDate()}
            returnKeyType='done'
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
            returnKeyType='done'
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
        <View style={styles.btnsGoToRecordsContainer}>
          <Pressable
            onPress={() => {
              navigation.navigate("Your Records")
            }}                   
            style={styles.goToRecordsBtn}>
            <Text style={styles.goToRecordsLabel}>Go to Records</Text>
          </Pressable>  
        </View>   
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

function RecordsScreen ({navigation}){
  const [records, setRecords] = useState([]);

  useEffect(() => {

    db.transaction((tx) => {
      tx.executeSql(
        `select id, miles, purchaseDate, gallons, milesGallons from MileageCalc order by purchaseDate desc;`,
        null,
        (_, { rows: { _array } }) => setRecords(_array)
      )

    })
  }, []);

  return (
    <View style={styles.recordsContainer}>      
        <View style={styles.titleHeader}>
          <Text style={styles.headerTable}>Date</Text>
          <Text style={styles.headerTable}>       Miles</Text>
          <Text style={styles.headerTable}>Gallons</Text>
          <Text style={styles.headerTable}>MPG</Text>
        </View>
      <ScrollView>
        {records != null || records != "" || records.length != 0 ?
          <View style={styles.recordsContainer}>
            {records.map(({ id, miles, purchaseDate, gallons, milesGallons }) => (
            <View key={id} style={styles.recordsItemList}>   
              <Text style={styles.recordsItems}>{purchaseDate}</Text>
              <Text style={styles.recordsItems}>{miles}</Text>
              <Text style={styles.recordsItems}>{gallons} G</Text>
              <Text style={styles.recordsItems}>{milesGallons}</Text>
            </View>
            ))}
          </View> 
          : '' }
      </ScrollView>
      <View style={styles.calculatorBtnContainer}>
          <Pressable
            onPress={() => {
              navigation.navigate("Calculate")
            }}                   
            style={styles.goToRecordsBtn}>
            <Text style={styles.goToRecordsLabel}>Calculator</Text>
          </Pressable>  
        </View>   
    </View>
  )
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
        <Stack.Screen name="Your Records" component={RecordsScreen} options={{ 
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
  recordsContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  calculationContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  calculatorBtnContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  welcomeContainer: {
    paddingBottom: 45,
    paddingTop: 15,
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
    paddingTop: 50
  },
  btnsGoToRecordsContainer: {
    paddingTop: 20,
    alignItems: 'center',
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
  recordsBtn: {
    width: 151,
    height: 40,    
    backgroundColor: '#FFD580'
  },
  recordsLabel: {
    textAlign: 'center',
    backgroundColor: '#FFD580',
    fontSize: 28,
    fontWeight: 'bold'
  },
  goToRecordsBtn: {
    width: 151,
    height: 40,    
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD580',
  },
  goToRecordsLabel: {
    textAlign: 'center',
    backgroundColor: '#FFD580',
    fontSize: 20,
    fontWeight: 'bold',
  },
  recommendationsBtn: {
    width: 260,
    height: 40,    
    backgroundColor: '#90EE90'
  },
  recommendationsLabel: {
    textAlign: 'center',
    backgroundColor: '#90EE90',
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
  homeContainersBtns: {
    flexDirection: 'row',
    gap: 30,
    paddingTop: 100,
    width: 335,
    marginLeft: 'auto',
    marginRight: 'auto', 
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
  },
  headerTable: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20
  },
  recordsItems: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: 25,
    paddingLeft: 45,
    marginTop: 20
  }, 
  recordsItemList: {
    display: 'flex',
    flexDirection: 'row',
    gap: 45,
    marginBottom: 10,
    paddingLeft: 20
  }
});
