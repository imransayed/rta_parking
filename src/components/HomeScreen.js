import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import ParkingService from '../services/ParkingService';

export default function HomeScreen({ navigation }) {
  const [plateNumber, setPlateNumber] = useState('');
  const [zone, setZone] = useState('');
  const [duration, setDuration] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const remainingTime = ParkingService.getRemainingTime();
      setTimeLeft(remainingTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartParking = async () => {
    if (!plateNumber || !zone || !duration) {
      alert('Please fill in all fields');
      return;
    }

    await ParkingService.startParking(plateNumber, zone, parseInt(duration));
    alert('Parking started successfully');
  };

  const handleDetectZone = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      // Here you would typically make an API call to get the zone based on coordinates
      // For this example, we'll just set a mock zone
      setZone('XXXA');
      alert('Zone detected: XXXA');
    } catch (error) {
      console.error(error);
      alert('Failed to detect zone');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UAE Parking Ticket</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Plate Number"
        value={plateNumber}
        onChangeText={setPlateNumber}
      />
      
      <View style={styles.zoneContainer}>
        <TextInput
          style={[styles.input, styles.zoneInput]}
          placeholder="Zone"
          value={zone}
          onChangeText={setZone}
        />
        <Button title="Detect" onPress={handleDetectZone} />
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Duration (hours)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      
      <Button title="Start Parking" onPress={handleStartParking} />
      
      <Text style={styles.timeLeft}>Time Left: {timeLeft}</Text>
      
      <Button 
        title="View Parking History" 
        onPress={() => navigation.navigate('ParkingHistory')} 
      />
      
      <Button 
        title="Settings" 
        onPress={() => navigation.navigate('Settings')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  zoneContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  zoneInput: {
    flex: 1,
    marginRight: 10,
  },
  timeLeft: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
});