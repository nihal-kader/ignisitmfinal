import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ITMHome from "./ITMHome";
import ITMExecution from "./ITMExecution";


const ITMNav = createNativeStackNavigator();

function ITM({ navigation, route }) {
  return (
    <ITMNav.Navigator>
      <ITMNav.Screen
        name="ITMHome"
        component={ITMHome}
        options={{ title: "ITM Work Order", headerShown: false, gestureEnabled: false}}
      />
      <ITMNav.Screen
        name="ExecutionScreen"
        component={ITMExecution}
        options={{ title: "Execute Work Order", headerShown: false }}
      />
    </ITMNav.Navigator>
  );
}

export default ITM;