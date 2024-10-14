import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedPlates, setSavedPlates] = useState([]);
  const [newPlate, setNewPlate] = useState('');

  useEffect(() => {
    loadSavedPlates();
    loadNotificationSettings();
  }, []);

  const loadSavedPlates = async () => {
    try {
      const plates = await AsyncStorage.getItem('savedPlates');
      if (plates) {
        setSavedPlates(JSON.parse(plates));
      }
    } catch (error) {
      console.error('Error loading saved plates:', error);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('notificationsEnabled');
      setNotificationsEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const toggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notificationsEnabled', value.toString());
  };

  const addPlate = async () => {
    if (newPlate.trim() !== '') {
      const updatedPlates = [...savedPlates, newPlate.trim()];
      setSavedPlates(updatedPlates);
      setNewPlate('');
      await AsyncStorage.setItem('savedPlates', JSON.stringify(updatedPlates));
    }
  };

  const removePlate = async (plate) => {
    const updatedPlates = savedPlates.filter(p => p !== plate);
    setSavedPlates(updatedPlates);
    await AsyncStorage.setItem('savedPlates', JSON.stringify(updatedPlates));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.row}>
          <Text>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved License Plates</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={newPlate}
            onChangeText={setNewPlate}
            placeholder="Enter license plate"
          />
          <Button title="Add" onPress={addPlate} />
        </View>
        <FlatList
          data={savedPlates}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.plateItem}>
              <Text>{item}</Text>
              <Button title="Remove" onPress={() => removePlate(item)} />
            </View>
          )}
        />
      </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  plateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});