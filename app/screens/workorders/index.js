import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WOScreen from "./WOScreen";
import AssetTagging from "../assettagging";

const WONav = createNativeStackNavigator();

function WorkOrder() {
  return (
    <WONav.Navigator>
      <WONav.Screen
        name="WOHome"
        component={WOScreen}
        options={{ title: "Work Orders", headerShown: false }}
      />
      <WONav.Screen
        name="AssetTagging"
        component={AssetTagging}
        options={{
          title: "Asset Tagging",
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
    </WONav.Navigator>
  );
}

export default WorkOrder;
