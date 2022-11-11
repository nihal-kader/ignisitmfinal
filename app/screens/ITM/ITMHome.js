import React from "react";
import { View, FlatList } from "react-native";
import {
  Text,
  Surface,
  Button,
  Chip,
  ActivityIndicator,
  TouchableRipple,
  Badge,
  useTheme,
} from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import axios from "axios";

function ITMHome(props) {
  const theme = useTheme();
  const { wo } = props.route.params;
  const [pendingAssets, setPendingAssets] = React.useState([]);
  const [completedAssets, setCompletedAssets] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);

  // Function to get assets from database
  const getAssets = async (stat) => {
    setLoading(true);
    await axios
      .get(
        "https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/itmworkorder",
        { params: { status: stat, wo_id: wo.wo_id } }
      )
      .then((res) => {
        if (stat == "Pending") {
          setPendingAssets(res.data.message);
        } else {
          setCompletedAssets(res.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    getAssets("Pending");
    getAssets("Completed");
  }, []);

  const ListItem = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          borderBottomColor: "rgba(0, 0, 0, .1)",
          borderBottomWidth: 1,
        }}
      >
        <View style={{ flex: 2 }}>
          <Text>
            <Text variant="titleSmall">{item.device}</Text>
          </Text>

          <Text>
            <Text variant="titleSmall">Location: </Text>
            <Text>
              Room {item.room_no}, Floor {item.floor_no}
            </Text>
          </Text>

          <Text>
            <Text variant="titleSmall">Tag: </Text>
            <Text>{item.asset_tag}</Text>
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {item.types.includes("I") && (
              <Badge
                style={{
                  backgroundColor: theme.colors.primary,
                  marginHorizontal: 2,
                }}
              >
                Inspection
              </Badge>
            )}
            {item.types.includes("T") && (
              <Badge
                style={{
                  backgroundColor: theme.colors.primary,
                  marginHorizontal: 2,
                }}
              >
                Testing
              </Badge>
            )}
            {item.types.includes("M") && (
              <Badge
                style={{
                  backgroundColor: theme.colors.primary,
                  marginHorizontal: 2,
                }}
              >
                Maintenance
              </Badge>
            )}
          </View>
        </View>
        <View style={{ flex: 1 / 2, minWidth: 10, justifyContent: "center" }}>
          <Button
            mode="outlined"
            onPress={() => {
              props.navigation.navigate("ExecutionScreen", { asset: item });
            }}
          >
            Start
          </Button>
        </View>
      </View>
    );
  };

  const Tab = createMaterialTopTabNavigator();
  const TabComponent = (assets) => (
    <View padding={3} flex={1}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={assets}
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.Tag}
        />
      )}
    </View>
  );

  const Pending = () => {
    return TabComponent(pendingAssets);
  };
  const Completed = () => {
    return TabComponent(completedAssets);
  };

  return (
    <View flex={1} padding={10}>
      <View
        style={{
          flex: 1,
        }}
      >
        <Surface
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <View style={{ flex: 5 }}>
            <Text variant="titleLarge">Work Order</Text>
            <Text>
              <Text variant="titleMedium">WO#: </Text>
              <Text variant="bodyLarge">{wo.wo_id}</Text>
            </Text>
            <Text>
              <Text variant="titleMedium">Type: </Text>
              <Text variant="bodyLarge">{wo.type}</Text>
            </Text>
            <Text>
              <Text variant="titleMedium">Property: </Text>
              <Text variant="bodyLarge">{wo.building_name}</Text>
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Button style={{ marginVertical: 5 }} mode="outlined">
              Submit
            </Button>
            <Button style={{ marginVertical: 5 }} mode="contained">
              Save & Exit
            </Button>
          </View>
        </Surface>
        <View style={{ flex: 1 }}>
          <Surface
            style={{
              backgroundColor: "white",
              padding: 5,
              borderRadius: 10,
              marginTop: 10,
              height: "100%",
            }}
          >
            <Tab.Navigator>
              <Tab.Screen name="Pending" component={Pending} />
              <Tab.Screen name="Completed" component={Completed} />
            </Tab.Navigator>
          </Surface>
        </View>
      </View>
    </View>
  );
}

export default ITMHome;
