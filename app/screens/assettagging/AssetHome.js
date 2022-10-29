import React from "react";
import { View } from "react-native";
import {
  Button,
  Chip,
  DataTable,
  FAB,
  List,
  Searchbar,
  Surface,
  Text,
  Title,
  TouchableRipple,
} from "react-native-paper";

function AssetHome(props) {
  return (
    <View style={{ marginTop: 10, padding: 10 }}>
      <FAB style={{ position: "absolute", bottom: 0 }} icon="plus" />
      <Surface
        style={{
          backgroundColor: "white",
          padding: 10,
          borderRadius: 10,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 6 }}>
          <Title>Hello</Title>
        </View>
        <View style={{ flex: 1 }}>
          <Button style={{ marginVertical: 5 }} mode="outlined">
            Hi
          </Button>
          <Button style={{ marginVertical: 5 }} mode="outlined">
            Hi
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
      <Surface
        style={{
          borderRadius: 10,
          padding: 10,
          backgroundColor: "white",
          height: "100%",
        }}
      >
        <TouchableRipple
          onPress={() => console.log("Pressed")}
          rippleColor="rgba(0, 0, 0, .1)"
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <View>
              <Text>
                <Text variant="titleSmall">item.device</Text>
              </Text>

              <Text>
                <Text variant="titleSmall">Location: </Text>
                <Text>Room item.room_no, Floor item.floor_no</Text>
              </Text>

              <Text>
                <Text variant="titleSmall">Tag: </Text>
                <Text>item.asset_tag</Text>
              </Text>
            </View>
            <View
              style={{
                padding: 20,
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
      </Surface>
    </View>
  );
}

export default AssetHome;
