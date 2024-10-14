import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";

import { HomeScreen } from "./HomeScreen";
import { ParkingHistoryScreen } from "./ParkingHistoryScreen";
import { SettingsScreen } from "./SettingsScreen";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => (
    <BaseNavigationContainer>
        <StackNavigator.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#65adf1",
                },
                headerTintColor: "#ffffff",
                headerShown: true,
            }}
        >
            <StackNavigator.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "UAE Parking Ticket" }}
            />
            <StackNavigator.Screen
                name="ParkingHistory"
                component={ParkingHistoryScreen}
                options={{ title: "Parking History" }}
            />
            <StackNavigator.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: "Settings" }}
            />
        </StackNavigator.Navigator>
    </BaseNavigationContainer>
);