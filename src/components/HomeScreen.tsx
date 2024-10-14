import React, { useState, useEffect } from "react";
import { RouteProp } from '@react-navigation/core';
import { FrameNavigationProp } from "react-nativescript-navigation";
import { StyleSheet } from "react-nativescript";
import { Dialogs, Utils } from '@nativescript/core';
import * as geolocation from "@nativescript/geolocation";
import * as Toast from 'nativescript-toast';
import { MainStackParamList } from "../NavigationParamList";
import { ParkingService } from '../services/ParkingService';

type HomeScreenProps = {
    route: RouteProp<MainStackParamList, "Home">,
    navigation: FrameNavigationProp<MainStackParamList, "Home">,
};

export function HomeScreen({ navigation }: HomeScreenProps) {
    const [plateNumber, setPlateNumber] = useState("");
    const [zone, setZone] = useState("");
    const [duration, setDuration] = useState("");
    const [timeLeft, setTimeLeft] = useState("");
    const [savedPlates, setSavedPlates] = useState<string[]>([]);

    useEffect(() => {
        loadSavedPlates();
        const timer = setInterval(updateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    const loadSavedPlates = async () => {
        const plates = await ParkingService.getSavedPlates();
        setSavedPlates(plates);
    };

    const updateTimeLeft = () => {
        const remainingTime = ParkingService.getRemainingTime();
        setTimeLeft(remainingTime);
        
        if (remainingTime === "00:05:00") {
            Utils.playSystemSound(Utils.android.SystemSounds.Notification);
            Toast.makeText("Parking expires in 5 minutes!").show();
        }
    };

    const handleStartParking = async () => {
        if (!plateNumber || !zone || !duration) {
            Dialogs.alert("Please fill in all fields");
            return;
        }

        await ParkingService.startParking(plateNumber, zone, parseInt(duration));
        Toast.makeText("Parking started successfully").show();
    };

    const handleDetectZone = async () => {
        try {
            const location = await geolocation.getCurrentLocation({
                desiredAccuracy: 3,
                updateDistance: 10,
                maximumAge: 20000,
                timeout: 20000
            });
            // Here you would typically make an API call to get the zone based on coordinates
            // For this example, we'll just set a mock zone
            setZone("XXXA");
            Toast.makeText("Zone detected: XXXA").show();
        } catch (error) {
            console.error(error);
            Toast.makeText("Failed to detect zone").show();
        }
    };

    return (
        <scrollView>
            <stackLayout style={styles.container}>
                <label className="text-2xl mb-4 font-bold text-center">
                    UAE Parking Ticket
                </label>
                
                <textField
                    hint="Plate Number"
                    text={plateNumber}
                    onTextChange={(args) => setPlateNumber(args.value)}
                    className="input mb-2"
                />
                
                <wrapLayout className="mb-2">
                    {savedPlates.map((plate, index) => (
                        <button
                            key={index}
                            text={plate}
                            onTap={() => setPlateNumber(plate)}
                            className="btn btn-outline mr-2 mb-2"
                        />
                    ))}
                </wrapLayout>
                
                <gridLayout columns="*, auto" className="mb-2">
                    <textField
                        hint="Zone"
                        text={zone}
                        onTextChange={(args) => setZone(args.value)}
                        className="input"
                        col="0"
                    />
                    <button
                        text="Detect"
                        onTap={handleDetectZone}
                        className="btn btn-primary"
                        col="1"
                    />
                </gridLayout>
                
                <textField
                    hint="Duration (hours)"
                    text={duration}
                    onTextChange={(args) => setDuration(args.value)}
                    keyboardType="number"
                    className="input mb-2"
                />
                
                <button
                    className="btn btn-primary mb-4"
                    onTap={handleStartParking}
                >
                    Start Parking
                </button>
                
                <label className="text-lg text-center">
                    Time Left: {timeLeft}
                </label>
                
                <button
                    className="btn btn-secondary mt-4"
                    onTap={() => navigation.navigate("ParkingHistory")}
                >
                    View Parking History
                </button>
                
                <button
                    className="btn btn-secondary mt-2"
                    onTap={() => navigation.navigate("Settings")}
                >
                    Settings
                </button>
            </stackLayout>
        </scrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        padding: 20,
    },
});