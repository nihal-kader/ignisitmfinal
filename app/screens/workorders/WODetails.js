import axios from "axios";
import React from "react";
import { Alert, FlatList, View } from "react-native";
import {
  Button,
  FAB,
  Searchbar,
  Surface,
  Text,
  Chip,
  TouchableRipple,
  ActivityIndicator,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";


function WODetails(props) {
  const [pendingTaskList, setPendingTasks] = React.useState([]);
  const [completedTaskList, setCompletedTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { wo } = props.route.params;
  const getTasks = async () => {
    setLoading(true);
    await axios({
      method: "get",
      url: `https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/tasks?wo_id=${wo.wo_id}`,
    })
      .then((res) => {
        console.log(res.data.message);
        setPendingTasks(res.data.message.filter(item => item.status === 'pending'))
        setCompletedTasks(res.data.message.filter(item => item.status === 'completed'))
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };


  const submit = async () => {
    await axios({
      method: "put",
      url: "https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/workorders",
      data: {
        wo_id: wo.wo_id
      },
    })
      .then((res) => {
        console.log(res.status);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  React.useEffect(() => {
    (async () => {
      getTasks();
    })();
  }, []);

  const ListComponent = ({ item }) => {
    return (
      <TouchableRipple
        onPress={() => console.log("Pressed")}
        rippleColor="rgba(0, 0, 0, .05)"
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            borderBottomColor: "rgba(0, 0, 0, .1)",
            borderBottomWidth: 1,
          }}
        >
          <View>
            <Text>
              <Text variant="titleSmall">{item.activity}</Text>
            </Text>

            <Text>
              {/* <Text variant="titleSmall">Location: </Text>
              <Text>
                Room {item.room_no}, Floor {item.floor_no}
              </Text> */}
              <Text>{item.reason}</Text>
            </Text>

            <Text>
              <Text variant="titleSmall">System: </Text>
              <Text>{item.system_name}</Text>
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
                {item.status === 'pending' && (
              <Chip
                icon="play"
                style={{ marginHorizontal: 10 }}
                // onPress={() =>
                //   props.navigation.navigate("DetailScreen", {
                //     asset: item,
                //     editmode: true,
                //     WoID: WoID,
                //     wo: wo,
                //   })
                // }
                onPress={() => {
                    if (item.activity === "Asset Tagging") {
                        props.navigation.navigate("AssetTagging", {
                                    screen: "ATHome",
                                    params: {
                                      wo: wo,
                                      task_id: item.id,
                                    },
                                  })
                    } else {
                        props.navigation.navigate("ITM", {
                                    screen: "ITMHome",
                                    params: {
                                      wo: wo,
                                    },
                                  })
                    }
                }}
              >
                Start
              </Chip>)}
            </View>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  const Tab = createMaterialTopTabNavigator();

  const TabComponent = (tasks) => {
    return(
        <View
        style={{
          flex: 1,
        }}
      >
        <Surface
          style={{
            borderRadius: 10,
            padding: 10,
            backgroundColor: "white",
            height: "100%",
          }}
        >
          {loading === true ? (
            <View style={{ justifyContent: "center", flex: 1 }}>
              <ActivityIndicator size={"large"} />
            </View>
          ) : tasks.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text>
                All tasks done! Submit work order!
              </Text>
            </View>
          ) : (
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.asset_tag}
              renderItem={({ item }) => <ListComponent item={item} />}
            />
          )}
        </Surface>
      </View>
    )
  }

  useFocusEffect(
    React.useCallback(() => {
      getTasks();
    }, [])
  );

  return (
    <View
      style={{
        marginTop: 10,
        padding: 20,
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
        <View style={{ minWidth: 70, flex: 1 }}>
          <Button style={{ marginVertical: 5 }} mode="outlined" onPress={() => {submit()}}>
            Submit
          </Button>
          <Button style={{ marginVertical: 5 }} mode="contained" onPress={() => {props.navigation.navigate("WOHome")}}>
            Save & Exit
          </Button>
        </View>
      </Surface>
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginVertical: 15,
        }}
      >
        <Text variant="titleLarge">Tasks</Text>
        <View style={{ flex: 1 / 2 }}>
          <Searchbar placeholder="Search" />
        </View>
      </View>
      <Tab.Navigator>
        {/* <Tab.Screen name="Pending" component={() => PendingTabComponent(pendingTaskList)} /> */}
        <Tab.Screen name="Pending">{() => TabComponent(pendingTaskList)}</Tab.Screen>
        {/* <Tab.Screen name="Completed" component={() => PendingTabComponent(completedTaskList)} /> */}
        <Tab.Screen name="Completed">{() => TabComponent(completedTaskList)}</Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

export default WODetails;