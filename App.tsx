import React, { useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Import existing screens
import HomeScreen from "./app/(tabs)/Home";
import SearchScreen from "./app/(tabs)/Searchscreen";
import AppointmentsScreen from "./app/(tabs)/appointments";
import TrackerScreen from "./app/(tabs)/Trackerscreen";
import MenuScreen from "./app/(tabs)/MoreScreen";

// Import detail screens
import HospitalsScreen from "./app/(tabs)/HospitalsScreen";
import CoordinatorsScreen from "./app/(tabs)/CoordinatorsScreen";
import FAQScreen from "./app/(tabs)/FAQScreen";

// Import custom tab bar
import CustomTabBar from "./components/CustomTabBar";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator({ onMenuPress }: { onMenuPress: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} onMenuPress={onMenuPress} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Menu"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            onMenuPress();
          },
        }}
      />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Tracker" component={TrackerScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigationRef = useRef<any>(null);

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleMenuClose = () => {
    setIsMenuVisible(false);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0b3b5c" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Main App Screens via the Tab Navigator */}
          <Stack.Screen name="MainTabs">
            {(props) => (
              <TabNavigator {...props} onMenuPress={handleMenuPress} />
            )}
          </Stack.Screen>

          {/* FIX: Changed names to match your MenuScreen navigation array string expectations
           */}
          <Stack.Screen name="Hospitals" component={HospitalsScreen} />
          <Stack.Screen name="Coordinators" component={CoordinatorsScreen} />
          <Stack.Screen name="FAQ" component={FAQScreen} />
        </Stack.Navigator>

        {/* Menu Modal */}
        {isMenuVisible && (
          <MenuScreen
            visible={isMenuVisible}
            onClose={handleMenuClose}
            navigation={navigationRef.current}
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
