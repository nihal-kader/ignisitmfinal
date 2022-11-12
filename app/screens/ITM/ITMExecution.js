import React from "react";
import { Image, View } from "react-native";
import {
  Text,
  Surface,
  Button,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import axios from "axios";
import ITMTabComponent from "./ITMTabComponent";

function ITMExecution(props) {
  const { asset, wo_id } = props.route.params;
  const [imagepath, setImagePath] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  const getAssetImage = async (id) => {
    setLoading(true);
    await axios({
      method: "get",
      url: `https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/assets`,
      params: { type: "Image", asset_id: id },
    })
      .then((res) => {
        console.log(res.data.message);
        setImagePath(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    getAssetImage(asset.asset_id);
  }, []);

  const Tab = createMaterialTopTabNavigator();
  const TabComponent = (type) => <ITMTabComponent asset_id={asset.asset_id} wo_id={wo_id} type={type} asset_tag={asset.asset_tag}/>;
  const Testing = () => {
    return TabComponent("T");
  };
  const Inspection = () => {
    return TabComponent("I");
  };
  const Maintenance = () => {
    return TabComponent("M");
  };

  return (
    <View style={{ flex: 1, padding: 5 }}>
      <Surface
        style={{
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <IconButton mode="outlined" icon="chevron-left" />

        <Text variant="titleMedium">Device 1/30</Text>

        <IconButton mode="outlined" icon="chevron-right" />
      </Surface>

      <Surface
        style={{
          minHeight: 70,
          backgroundColor: "white",
          borderRadius: 10,
          marginVertical: 10,
          padding: 10,
          flexDirection: "row",

        }}
      >
        <View style={{ justifyContent: "center", marginHorizontal: 10 }}>
          <Text variant="titleLarge">{asset.asset_tag}</Text>
          <Text variant="bodyLarge">Device: {asset.device}</Text>
          <Text variant="bodyLarge">System: {asset.system}</Text>
          <Text variant="bodyLarge">Room No: {asset.room_no}</Text>
          <Text variant="bodyLarge">Floor No: {asset.floor_no}</Text>
        </View>
        <View style={{ marginHorizontal: 10, flex: 1 }}>
          {imagepath === "" ? (
            <Text>Device Image</Text>
          ) : (
            <Image
              resizeMode="contain"
              style={{ flex: 1 }}
              alt="Device image"
              source={{ uri: imagepath.image }}
              loadingIndicatorSource={require("../../assets/loading.gif")}
            />
          )}
        </View>

        <View justifyContent={"center"} space={5} padding={5} flex={1 / 2}>
          <Button colorScheme={"lightBlue"} rounded={100}>
            Save
          </Button>
          <Button colorScheme={"blueGray"} rounded={100}>
            Skip
          </Button>
        </View>
      </Surface>
      <View rounded={10} bgColor={"white"} flex={3}>
        <Tab.Navigator>
          {asset.types.includes("I") && (
            <Tab.Screen name="Inspection" component={Inspection} />
          )}
          {asset.types.includes("T") && (
            <Tab.Screen name="Testing" component={Testing} />
          )}
          {asset.types.includes("M") && (
            <Tab.Screen name="Maintenance" component={Maintenance} />
          )}
        </Tab.Navigator>
      </View>
    </View>
  );
}

export default ITMExecution;
