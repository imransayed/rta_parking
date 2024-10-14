import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

class ParkingService {
  async startParking(plateNumber, zone, duration) {
    const parkingData = {
      plateNumber,
      zone,
      duration,
      startTime: new Date().toISOString(),
    };

    await AsyncStorage.setItem('currentParking', JSON.stringify(parkingData));
    this.scheduleNotification(duration);

    // Save to parking history
    const history = await this.getParkingHistory();
    history.push(parkingData);
    await AsyncStorage.setItem('parkingHistory', JSON.stringify(history));
  }

  async getCurrentParking() {
    const parking = await AsyncStorage.getItem('currentParking');
    return parking ? JSON.parse(parking) : null;
  }

  async getParkingHistory() {
    const history = await AsyncStorage.getItem('parkingHistory');
    return history ? JSON.parse(history) : [];
  }

  getRemainingTime() {
    // Implementation of remaining time calculation
    // This should be called periodically to update the UI
  }

  scheduleNotification(duration) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Parking Expiring Soon",
        body: "Your parking will expire in 5 minutes!",
      },
      trigger: { seconds: (duration * 3600) - 300 }, // 5 minutes before expiry
    });
  }
}

export default new ParkingService();