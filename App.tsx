import React, { useRef, useState } from "react";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Tab screens
import HomeScreen from "./app/(tabs)/Home";
import SearchScreen from "./app/(tabs)/Searchscreen";
import AppointmentsScreen from "./app/(tabs)/appointments";
import TrackerScreen from "./app/(tabs)/Trackerscreen";

// Stack-only detail screens
import HospitalsScreen from "./app/(tabs)/HospitalsScreen";
import CoordinatorsScreen from "./app/(tabs)/CoordinatorsScreen";
import FAQScreen from "./app/(tabs)/FAQScreen";

// Drawer / side menu
import MenuScreen from "./app/(tabs)/MoreScreen";
import CustomTabBar from "./components/CustomTabBar";

// ---------------------------------------------------------------------------
// Navigation typing
// ---------------------------------------------------------------------------

export type RootStackParamList = {
  MainTabs: undefined;
  Hospitals: undefined;
  Coordinators: undefined;
  FAQ: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Menu: undefined;
  Appointments: undefined;
  Tracker: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// The "Menu" tab never actually renders a screen — pressing it opens the
// side drawer instead. Kept as a stable, module-level component so React
// Navigation doesn't see a new component identity on every render (an
// inline `component={() => null}` would force the tab to remount each time).
function EmptyTabScreen() {
  return null;
}

// TODO: replace with the authenticated user once auth/session state is wired up.
const currentUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  initials: "JD",
  isPremium: false,
};

function TabNavigator({ onMenuPress }: { onMenuPress: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} onMenuPress={onMenuPress} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Menu"
        component={EmptyTabScreen}
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
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  const handleMenuPress = () => setIsMenuVisible(true);
  const handleMenuClose = () => setIsMenuVisible(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0b3b5c" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs">
            {(props) => (
              <TabNavigator {...props} onMenuPress={handleMenuPress} />
            )}
          </Stack.Screen>

          <Stack.Screen name="Hospitals" component={HospitalsScreen} />
          <Stack.Screen name="Coordinators" component={CoordinatorsScreen} />
          <Stack.Screen name="FAQ" component={FAQScreen} />
        </Stack.Navigator>

        {/* Side drawer stays mounted at all times; `visible` controls its
            own open/close animation. Conditionally mounting it on
            isMenuVisible would unmount it the instant it closes, skipping
            the exit animation entirely. */}
        <MenuScreen
          visible={isMenuVisible}
          onClose={handleMenuClose}
          navigation={navigationRef.current}
          userName={currentUser.name}
          userEmail={currentUser.email}
          userInitials={currentUser.initials}
          isPremium={currentUser.isPremium}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
