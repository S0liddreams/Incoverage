import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens
import HomeScreen from "./Home";
import SearchScreen from "./Searchscreen";
import AppointmentsScreen from "./appointments";
import TrackerScreen from "./Trackerscreen";
import HospitalsScreen from "./HospitalsScreen";
import CoordinatorsScreen from "./CoordinatorsScreen";
import FAQScreen from "./FAQScreen";

const Stack = createNativeStackNavigator();

export default function TabsLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="Tracker" component={TrackerScreen} />

      {/* Add "Screen" to the names here to match your Menu configuration */}
      <Stack.Screen name="HospitalsScreen" component={HospitalsScreen} />
      <Stack.Screen name="CoordinatorsScreen" component={CoordinatorsScreen} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
    </Stack.Navigator>
  );
}
