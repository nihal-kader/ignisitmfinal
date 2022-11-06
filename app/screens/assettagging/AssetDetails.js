import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, TextInput, View } from "react-native";
import { Avatar, Button, Card, Surface, Text, Title } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import FormInput from "../../components/forminput";
import FormSelect from "../../components/formselect";

function AssetDetails(props) {
  const [loading, setLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    setLoading(true);

    console.log(data);
  };
  const mockData = [
    { id: 1, name: "React Native Developer", checked: true }, // set default checked for render option item
    { id: 4, name: "Android Developer" },
    { id: 3, name: "iOS Developer" },
  ];
  const [pickedImagePath, setPickedImagePath] = React.useState("");
  const [filePath, setFilePath] = React.useState({});

  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      setFilePath(result);
      console.log(result.uri);
    }
  };
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      setFilePath(result);
      console.log(result.uri);
    }
  };

  return (
    <View style={{ flexDirection: "row", flex: 1, padding: 10 }}>
      <View style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
        <Title>Asset Details</Title>
        <ScrollView style={{ paddingTop: 10 }}>
          <FormSelect
            control={control}
            name="system_id"
            rules={{ required: "System is required" }}
            data={mockData}
            label="System"
          />

          <FormSelect
            control={control}
            name={"device_id"}
            rules={{ required: "Device is required" }}
            data={mockData}
            label="Device"
          />
          <FormInput
            control={control}
            name="mfr_name"
            rules={{ required: "Username is required" }}
            label="Manufacturer Name"
          />
          <FormInput
            control={control}
            name="mfr_pn"
            rules={{ required: "Manufacturer P/N is required" }}
            label="Manufacturer P/N"
          />
          <FormInput
            control={control}
            name="specification"
            rules={{ required: "Specification is required" }}
            label="Specification"
          />
          <FormInput
            control={control}
            name="drawing_no"
            rules={{ required: "Drawing No. is required" }}
            label="Drawing No."
          />

          <FormInput
            control={control}
            name="floor_no"
            rules={{ required: "Floor No. is required" }}
            label="Floor No."
          />
          <FormInput
            control={control}
            name="room_no"
            rules={{ required: "Room No. is required" }}
            label="Room No."
          />
          <View style={{ alignItems: "center", flexDirection: "row" }}>
            <View style={{ flex: 3 / 2 }}>
              <FormInput
                control={control}
                name="asset_tag"
                rules={{ required: "Tag is required" }}
                label="Asset Tag"
                placeholder={"Enter Tag or Generate New"}
              />
            </View>
            <View style={{ flex: 1, padding: 10 }}>
              <Button style={{ marginTop: 20 }} mode="outlined">
                Generate
              </Button>
            </View>
          </View>

          <Button
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            style={{ marginVertical: 20 }}
            mode="contained"
          >
            Submit
          </Button>
        </ScrollView>
      </View>

      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          padding: 50,
          flex: 1,
        }}
      >
        <View>
          {pickedImagePath == "" ? (
            <View>
              <Card onPress={showImagePicker} style={{ margin: 5 }}>
                <Card.Content
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar.Icon icon="upload" />
                  <Title>Upload Image</Title>
                </Card.Content>
              </Card>
              <Card onPress={openCamera} style={{ margin: 5 }}>
                <Card.Content
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar.Icon icon="camera" />
                  <Title>Open Camera</Title>
                </Card.Content>
              </Card>
            </View>
          ) : (
            <Card>
              <Card.Cover
                style={{ height: 300 }}
                resizeMode="contain"
                source={{ uri: pickedImagePath }}
              />
              <Card.Actions style={{ alignSelf: "center" }}>
                <Button
                  onPress={() => {
                    console.log(pickedImagePath);
                    setPickedImagePath("");
                  }}
                >
                  Change Photo
                </Button>
              </Card.Actions>
            </Card>
          )}
        </View>
      </View>
    </View>
  );
}

export default AssetDetails;
