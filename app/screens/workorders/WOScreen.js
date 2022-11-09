import React from "react";
import { FlatList, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  List,
  Paragraph,
  Searchbar,
  Surface,
  Text,
  Title,
  TouchableRipple,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { getUser } from "../../auth/auth";
import axios from "axios";

function WOScreen(props) {
  const [selectedWo, setselectedWo] = React.useState(0);
  const [pwo, setPWO] = React.useState([]);
  const [cwo, setCWO] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const getWO = async (stat) => {
    setLoading(true);
    // console.log(user.id);
    await axios
      .get(
        "https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/workorders",
        { params: { status: stat, user_id: 12 } }
      )
      .then((res) => {
        if (stat == "Pending") {
          setPWO(res.data.message);
        } else {
          setCWO(res.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    (async () => {
      let user = await getUser();
      setUser(user);
      getWO("Completed");
      getWO("Pending");
    })();
  }, []);

  const Tab = createMaterialTopTabNavigator();

  const ListItem = ({ item }) => {
    return (
      <TouchableRipple
        onPress={() => console.log("Pressed")}
        rippleColor="rgba(0, 0, 0, .05)"
      >
        <List.Item
          onPress={() => {
            setselectedWo(item);
          }}
          title={item.type}
          description={item.full_id}
          style={{
            backgroundColor:
              item === selectedWo ? "rgba(0, 0, 0, .05)" : "white",
          }}
          left={() =>
            item.status === "Pending" ? (
              <Avatar.Icon
                size={40}
                color="rgba(255, 182, 72,1)"
                style={{
                  alignSelf: "center",
                  backgroundColor: "rgba(255, 182, 72, 0.2)",
                }}
                icon="dots-horizontal"
              />
            ) : (
              <Avatar.Icon
                size={40}
                color="rgba(75, 222, 151, 1)"
                style={{
                  alignSelf: "center",
                  backgroundColor: "rgba(75, 222, 151, 0.2)",
                }}
                icon="check-all"
              />
            )
          }
          right={(props) => (
            <View
              {...props}
              style={{
                justifyContent: "center",
              }}
            >
              <Text variant="bodySmall">
                {new Date(item.date).toDateString()}
              </Text>
            </View>
          )}
        />
      </TouchableRipple>
    );
  };
  const WOComponent = (swo) => {
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        {loading === true ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            ListHeaderComponent={
              <Searchbar
                elevation={0}
                style={{
                  marginVertical: 10,
                  backgroundColor: "rgba(0, 0, 0, .03)",
                }}
                placeholder="Search"
                onChangeText={(query) => setSearchQuery(query)}
                value={searchQuery}
              />
            }
            data={swo}
            keyExtractor={(item) => item.wo_id}
            renderItem={({ item }) => {
              if (searchQuery === "") {
                return <ListItem item={item} />;
              }

              if (
                item.type
                  .toUpperCase()
                  .includes(searchQuery.toUpperCase().trim().replace(/\s/g, ""))
              ) {
                return <ListItem item={item} />;
              }

              if (
                item.full_id
                  .toUpperCase()
                  .includes(searchQuery.toUpperCase().trim().replace(/\s/g, ""))
              ) {
                return <ListItem item={item} />;
              }
            }}
          />
        )}
      </View>
    );
  };
  const Pending = () => {
    return WOComponent(pwo);
  };

  const Completed = () => {
    return WOComponent(cwo);
  };

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <View
        style={{
          padding: 10,
          borderRadius: 10,
          flexDirection: "row",
          flex: 1,
        }}
      >
        <Surface
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 5,
            marginRight: 5,
            width: 320,
          }}
        >
          <Tab.Navigator>
            <Tab.Screen name="Pending" component={Pending} />
            <Tab.Screen name="Completed" component={Completed} />
          </Tab.Navigator>
        </Surface>

        {selectedWo === 0 ? (
          <View style={{ flex: 1 }}>
            <Surface
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Select a Work Order to View Details!</Text>
            </Surface>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Card
              style={{
                width: "100%",
                height: "100%",
                padding: 3,
                borderRadius: 10,
                backgroundColor: "white",
              }}
            >
              <Card.Title
                titleVariant="titleLarge"
                style={{
                  marginBottom: 10,
                  borderRadius: 10,
                  backgroundColor: "rgba(0, 0, 0, .05)",
                }}
                title={selectedWo.type}
                subtitle={"WO#: " + selectedWo.wo_id}
                rightStyle={{ padding: 20 }}
                right={(props) => (
                  <Text>{new Date(selectedWo.date).toDateString()}</Text>
                )}
              />
              <Card.Content
                style={{
                  flex: 1,
                }}
              >
                <Title>Details:</Title>
                <Paragraph>{selectedWo.details}</Paragraph>
                <Paragraph>{selectedWo.building_name}</Paragraph>
                <Title>Location:</Title>
                <Paragraph>{selectedWo.building_area}</Paragraph>
                <View
                  style={{
                    borderRadius: 10,
                    marginVertical: 10,
                    backgroundColor: "rgba(0, 0, 0, .05)",
                    padding: 5,
                    flex: 1,
                  }}
                >
                  <MapView
                    width={"100%"}
                    height={"100%"}
                    region={{
                      latitude: selectedWo.building_loc[0],
                      longitude: selectedWo.building_loc[1],
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: selectedWo.building_loc[0],
                        longitude: selectedWo.building_loc[1],
                      }}
                      title={selectedWo.building_name}
                      description={selectedWo.building_area}
                    />
                  </MapView>
                </View>
              </Card.Content>
              <Card.Actions style={{ padding: 10 }}>
                <Button
                  onPress={() => {
                    setselectedWo(0);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    // setselectedWo(0);
                    selectedWo.type === "Asset Tagging"
                      ? props.navigation.navigate("AssetTagging", {
                          screen: "ATHome",
                          params: {
                            WoID: selectedWo.wo_id,
                            wo: selectedWo,
                          },
                        })
                      // : null;
                      : props.navigation.navigate("ITM", {
                          screen: "ITMHome",
                          params: {
                            WoID: selectedWo.wo_id,
                            wo: selectedWo,
                          },
                        });
                  }}
                >
                  {selectedWo.status === "Pending" ? "Continue" : "View"}
                </Button>
              </Card.Actions>
            </Card>
          </View>
        )}
      </View>
    </View>
  );
}

export default WOScreen;
