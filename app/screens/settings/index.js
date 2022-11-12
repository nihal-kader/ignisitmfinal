import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import SettingsHome from "./settings";

const StNav = createNativeStackNavigator();

function SettingScreen(props) {
  return (
    <StNav.Navigator>
      <StNav.Screen
        name="SettingsHome"
        component={SettingsHome}
        options={{ title: "Settings", headerShown: false }}
      />
    </StNav.Navigator>
  );
}

export default SettingScreen;
