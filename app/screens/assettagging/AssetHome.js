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
  Portal,
  Modal,
  ActivityIndicator,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import ViewAsset from "./ViewAsset";

function AssetHome(props) {
  const [assetList, setAsset] = React.useState([]);
  const [selectedAsset, setSelectedAsset] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const { WoID, wo } = props.route.params;
  const getAssets = async () => {
    setLoading(true);
    await axios({
      method: "get",
      url: `https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/assets?id=${WoID}`,
    })
      .then((res) => {
        console.log(res.data.message);
        setAsset(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const deleteAsset = async (id) => {
    await axios({
      method: "delete",
      url: "https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/assets",
      data: { asset_id: id },
    })
      .then((res) => {
        console.log(res.status);
        getAssets();
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  React.useEffect(() => {
    (async () => {
      getAssets();
    })();
  }, []);

  const AseetListComponent = ({ item }) => {
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
              alignItems: "center",

              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Chip
                icon="eye"
                onPress={() => {
                  showModal(), setSelectedAsset(item);
                }}
              >
                View
              </Chip>
              <Chip
                icon="pencil"
                style={{ marginHorizontal: 10 }}
                onPress={() =>
                  props.navigation.navigate("DetailScreen", {
                    asset: item,
                    editmode: true,
                    WoID: WoID,
                    wo: wo,
                  })
                }
              >
                Edit
              </Chip>
              <Chip
                icon="delete"
                onPress={() =>
                  Alert.alert(
                    "Delete Asset",
                    "This will remove all data relating to " +
                      item.asset_tag +
                      ". This action cannot be reversed. Deleted data can not be recovered.",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => deleteAsset(item.asset_id),
                      },
                    ]
                  )
                }
              >
                Delete
              </Chip>
            </View>
          </View>
        </View>
      </TouchableRipple>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      getAssets();
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
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}>
          <ViewAsset asset={selectedAsset} setVisible={setVisible} />
        </Modal>
      </Portal>
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
            <Text variant="bodyLarge">{WoID}</Text>
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
          <Button style={{ marginVertical: 5 }} mode="outlined">
            Submit
          </Button>
          <Button style={{ marginVertical: 5 }} mode="contained">
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
        <Text variant="titleLarge">Assets</Text>
        <View style={{ flex: 1 / 2 }}>
          <Searchbar placeholder="Search" />
        </View>
      </View>
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
          ) : assetList.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Text>
                No Assets to View! Click Add Asset to add a new Asset.
              </Text>
            </View>
          ) : (
            <FlatList
              data={assetList}
              keyExtractor={(item) => item.asset_tag}
              renderItem={({ item }) => <AseetListComponent item={item} />}
            />
          )}
        </Surface>
        <FAB
          variant="surface"
          icon="plus"
          label="Add Asset"
          style={{
            margin: 10,
            alignSelf: "flex-end",
            position: "absolute",
            bottom: 0,
          }}
          onPress={() =>
            props.navigation.navigate("DetailScreen", {
              editmode: false,
              WoID: WoID,
              wo: wo,
            })
          }
        />
      </View>
    </View>
  );
}

export default AssetHome;
