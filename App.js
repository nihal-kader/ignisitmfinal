import * as React from "react";
import {
  BottomNavigation,
  DefaultTheme,
  Provider,
  Text,
} from "react-native-paper";
import { SafeAreaView, StatusBar } from "react-native";
import DashboardScreen from "./app/screens/dashboard";
import LoginScreen from "./app/screens/Login";
import Ionicons from "react-native-vector-icons/Ionicons";

import WorkOrder from "./app/screens/workorders";
import { NavigationContainer } from "@react-navigation/native";

import ScheduleScreen from "./app/screens/schedule";
import SettingsScreen from "./app/screens/settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const theme = {
  ...DefaultTheme,
  colors: {
    primary: "rgb(0, 104, 116)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(151, 240, 255)",
    onPrimaryContainer: "rgb(0, 31, 36)",
    secondary: "rgb(74, 98, 103)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(205, 231, 236)",
    onSecondaryContainer: "rgb(5, 31, 35)",
    tertiary: "rgb(82, 94, 125)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(218, 226, 255)",
    onTertiaryContainer: "rgb(14, 27, 55)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(250, 253, 253)",
    onBackground: "rgb(25, 28, 29)",
    surface: "rgb(250, 253, 253)",
    onSurface: "rgb(25, 28, 29)",
    surfaceVariant: "rgb(219, 228, 230)",
    onSurfaceVariant: "rgb(63, 72, 74)",
    outline: "rgb(111, 121, 122)",
    outlineVariant: "rgb(191, 200, 202)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(46, 49, 50)",
    inverseOnSurface: "rgb(239, 241, 241)",
    inversePrimary: "rgb(79, 216, 235)",
    elevation: {
      level0: "transparent",
      level1: "rgb(238, 246, 246)",
      level2: "rgb(230, 241, 242)",
      level3: "rgb(223, 237, 238)",
      level4: "rgb(220, 235, 237)",
      level5: "rgb(215, 232, 234)",
    },
    surfaceDisabled: "rgba(25, 28, 29, 0.12)",
    onSurfaceDisabled: "rgba(25, 28, 29, 0.38)",
    backdrop: "rgba(41, 50, 52, 0.4)",
  },
};

const App = () => {
  const MainNav = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();

  function MyTab() {
    return (
      <Tab.Navigator
        id="MyTab"
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Dashboard") {
              iconName = focused ? "grid" : "grid-outline";
            } else if (route.name === "Work Orders") {
              iconName = focused ? "briefcase" : "briefcase-outline";
            } else if (route.name === "Schedule") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Requests") {
              iconName = focused ? "mail-open" : "mail-open-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Work Orders" component={WorkOrder} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
        {/* <Tab.Screen name="Requests" component={Requests} /> */}
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <Provider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar />
        <NavigationContainer>
          <MainNav.Navigator>
            <MainNav.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <MainNav.Screen
              name="Tab"
              component={MyTab}
              options={{ headerShown: false }}
            />
          </MainNav.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
};

export default App;