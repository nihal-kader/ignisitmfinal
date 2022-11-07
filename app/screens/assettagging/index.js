import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AssetHome from "./AssetHome";
import AssetDetails from "./AssetDetails";

const ATNav = createNativeStackNavigator();

function AssetTagging({ navigation, route }) {
  return (
    <ATNav.Navigator>
      <ATNav.Screen
        name="ATHome"
        component={AssetHome}
        options={{ title: "Asset Tagging", headerShown: false }}
      />

      <ATNav.Screen
        name="DetailScreen"
        component={AssetDetails}
        options={{ title: "Asset Details" }}
      />
    </ATNav.Navigator>
  );
}

export default AssetTagging;
