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

// Import new screens
import ProfileScreen from "./profile";
import PremiumScreen from "./premium";
import SettingsScreen from "./settings";
import AICoverageAssistant from "./ai-coverage-assistant";
import AIHealthDigest from "./ai-health-digest";
import AIReportReader from "./ai-report-reader";

const Stack = createNativeStackNavigator();

export default function TabsLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Tab Screens */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
      <Stack.Screen name="Tracker" component={TrackerScreen} />

      {/* Menu Modal Screens */}
      <Stack.Screen name="HospitalsScreen" component={HospitalsScreen} />
      <Stack.Screen name="CoordinatorsScreen" component={CoordinatorsScreen} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />

      {/* Side Drawer Screens */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />

      {/* AI Tools Screens (Premium) */}
      <Stack.Screen
        name="AICoverageAssistant"
        component={AICoverageAssistant}
      />
      <Stack.Screen name="AIHealthDigest" component={AIHealthDigest} />
      <Stack.Screen name="AIReportReader" component={AIReportReader} />
    </Stack.Navigator>
  );
}
