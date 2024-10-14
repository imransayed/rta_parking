import { RouteProp } from '@react-navigation/core';
import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";

import { MainStackParamList } from "../NavigationParamList";
import { ParkingService } from '../services/ParkingService';

type ParkingHistoryScreenProps = {
    route: RouteProp<MainStackParamList, "ParkingHistory">,
    navigation: FrameNavigationProp<MainStackParamList, "ParkingHistory">,
};

export function ParkingHistoryScreen({ navigation }: ParkingHistoryScreenProps) {
    const [history, setHistory] = React.useState([]);

    React.useEffect(() => {
        const fetchHistory = async () => {
            const parkingHistory = await ParkingService.getParkingHistory();
            setHistory(parkingHistory);
        };
        fetchHistory();
    }, []);

    return (
        <scrollView>
            <stackLayout style={styles.container}>
                <label className="text-2xl mb-4 font-bold text-center">
                    Parking History
                </label>
                {history.map((item, index) => (
                    <gridLayout key={index} columns="*, *" rows="auto, auto" className="mb-4 p-2 border-b">
                        <label text={`Plate: ${item.plateNumber}`} row="0" col="0" />
                        <label text={`Zone: ${item.zone}`} row="0" col="1" />
                        <label text={`Duration: ${item.duration}h`} row="1" col="0" />
                        <label text={`Date: ${new Date(item.date).toLocaleDateString()}`} row="1" col="1" />
                    </gridLayout>
                ))}
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