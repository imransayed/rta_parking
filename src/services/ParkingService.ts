import { ApplicationSettings } from '@nativescript/core';
import * as LocalNotifications from '@nativescript/local-notifications';

class ParkingService {
  async startParking(plateNumber: string, zone: string, duration: number): Promise<void> {
    const parkingData = {
      plateNumber,
      zone,
      duration,
      startTime: new Date().toISOString(),
    };

    ApplicationSettings.setString('currentParking', JSON.stringify(parkingData));
    this.scheduleNotification(duration);

    // Save to parking history
    const history = await this.getParkingHistory();
    history.push(parkingData);
    ApplicationSettings.setString('parkingHistory', JSON.stringify(history));
  }

  async getCurrentParking(): Promise<any> {
    const parking = ApplicationSettings.getString('currentParking', '');
    return parking ? JSON.parse(parking) : null;
  }

  async getParkingHistory(): Promise<any[]> {
    const history = ApplicationSettings.getString('parkingHistory', '');
    return history ? JSON.parse(history) : [];
  }

  getRemainingTime(): string {
    const currentParking = ApplicationSettings.getString('currentParking', '');
    if (!currentParking) return '00:00:00';

    const { startTime, duration } = JSON.parse(currentParking);
    const endTime = new Date(startTime).getTime() + duration * 3600000;
    const remaining = endTime - Date.now();

    if (remaining <= 0) return '00:00:00';

    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  scheduleNotification(duration: number): void {
    LocalNotifications.schedule([{
      id: 1,
      title: "Parking Expiring Soon",
      body: "Your parking will expire in 5 minutes!",
      at: new Date(Date.now() + (duration * 3600000) - 300000) // 5 minutes before expiry
    }]);
  }

  async getSavedPlates(): Promise<string[]> {
    const plates = ApplicationSettings.getString('savedPlates', '');
    return plates ? JSON.parse(plates) : [];
  }

  async savePlate(plate: string): Promise<void> {
    const plates = await this.getSavedPlates();
    if (!plates.includes(plate)) {
      plates.push(plate);
      ApplicationSettings.setString('savedPlates', JSON.stringify(plates));
    }
  }

  async removePlate(plate: string): Promise<void> {
    const plates = await this.getSavedPlates();
    const updatedPlates = plates.filter(p => p !== plate);
    ApplicationSettings.setString('savedPlates', JSON.stringify(updatedPlates));
  }
}

export default new ParkingService();