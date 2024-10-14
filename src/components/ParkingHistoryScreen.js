import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ParkingService from '../services/ParkingService';

export default function ParkingHistoryScreen() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const parkingHistory = await ParkingService.getParkingHistory();
      setHistory(parkingHistory);
    };
    fetchHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text>Plate: {item.plateNumber}</Text>
      <Text>Zone: {item.zone}</Text>
      <Text>Duration: {item.duration}h</Text>
      <Text>Date: {new Date(item.startTime).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking History</Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 10,
  },
});