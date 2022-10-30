import axios from "axios";
import React from "react";
import { FlatList, View } from "react-native";
import {
  Button,
  FAB,
  Searchbar,
  Surface,
  Text,
  Chip,
  TouchableRipple,
} from "react-native-paper";

function AssetHome(props) {
  const [assetList, setAsset] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
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
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Chip
              style={{ marginHorizontal: 10 }}
              icon="eye"
              onPress={() => console.log("Pressed")}
            >
              View
            </Chip>
            <Chip icon="delete" onPress={() => console.log("Pressed")}>
              Delete
            </Chip>
          </View>
        </View>
      </TouchableRipple>
    );
  };
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
        <View style={{ flex: 1 }}>
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
          <FlatList
            data={assetList}
            keyExtractor={(item) => item.asset_tag}
            renderItem={({ item }) => <AseetListComponent item={item} />}
          />
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
          onPress={() => console.log("Pressed")}
        />
      </View>
    </View>
  );
}

export default AssetHome;
