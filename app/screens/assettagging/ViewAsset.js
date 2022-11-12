import React from "react";
import {
  ActivityIndicator,
  Button,
  Card,
  DataTable,
  Text,
} from "react-native-paper";

function ViewAsset({ asset, setVisible }) {
  return (
    <Card style={{ margin: 50 }}>
      <Card.Title title="View Asset" />
      <Card.Cover
        loadingIndicatorSource={<ActivityIndicator />}
        resizeMode="contain"
        source={{ uri: asset.image }}
      />
      <Card.Content>
        <DataTable>
          <DataTable.Row>
            <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
              Device
            </DataTable.Cell>
            <DataTable.Cell>{asset.device}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
              System
            </DataTable.Cell>
            <DataTable.Cell>{asset.system}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
              Manufacturer Name
            </DataTable.Cell>
            <DataTable.Cell>{asset.mfr_name}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
              Manufacturer P/N
            </DataTable.Cell>
            <DataTable.Cell>{asset.mfr_pn}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
              Specification
            </DataTable.Cell>
            <DataTable.Cell>{asset.specification}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
              Drawing No.
            </DataTable.Cell>
            <DataTable.Cell>{asset.drawing_no}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
              Floor No.
            </DataTable.Cell>
            <DataTable.Cell>{asset.floor_no}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
              Room No.
            </DataTable.Cell>
            <DataTable.Cell>{asset.room_no}</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell textStyle={{ fontWeight: "bold" }}>
              Asset Tag:
            </DataTable.Cell>
            <DataTable.Cell>{asset.asset_tag}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => setVisible(false)}>Close</Button>
      </Card.Actions>
    </Card>
  );
}

export default ViewAsset;
