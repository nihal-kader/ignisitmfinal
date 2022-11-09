import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, TextInput, View } from "react-native";
import { Avatar, Button, Card, Modal, Portal, Title } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import FormInput from "../../components/forminput";
import FormSelect from "../../components/formselect";
import axios from "axios";
import { RNS3 } from "react-native-aws3";
function AssetDetails(props) {
  const { WoID, wo, editmode, asset } = props.route.params;
  const [formData, setData] = React.useState({});
  const [devTypes, setDevTypes] = React.useState([]);
  const [systems, setSystems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [gloading, setGLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [filePath, setFilePath] = React.useState({});
  const [uploadSuccessMessage, setUploadSuccessMessage] = React.useState("");
  const [imageLocation, setImageLocation] = React.useState("");
  const [pickedImagePath, setPickedImagePath] = React.useState(
    editmode === true ? asset.image : ""
  );
  const [selectsys, setselectSystems] =
    editmode === true
      ? React.useState({ id: asset.system_id, name: asset.system })
      : React.useState({});
  const [selectdev, setselectDev] =
    editmode === true
      ? React.useState({ id: asset.device_id, name: asset.device })
      : React.useState({});

  const selectedSValue = (value) => {
    setselectSystems(value);
  };
  const selectedDValue = (value) => {
    setselectDev(value);
  };

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = editmode === true ? useForm({ defaultValues: asset }) : useForm();
  const onSubmit = (data) => {
    setData({ ...data, system: selectsys.name, device: selectdev.name });
    console.log(formData);
    uploadFile();
  };

  const getDeviceData = async () => {
    console.log(selectsys.id);
    await axios({
      method: "get",
      url: `https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/devices?id=${selectsys.id}`,
    })
      .then((res) => {
        // console.log(res.data.message);
        setDevTypes(res.data.message);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const getSystemData = async () => {
    await axios({
      method: "get",
      url: "https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/systems",
    })
      .then((res) => {
        // console.log(res.data.message);
        setSystems(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinish = async () => {
    console.log(formData);

    await axios({
      method: "post",
      url: "https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/assets",
      data: {
        formData: formData,
        otherData: {
          image: imageLocation,
          building_id: wo.building_id,
          wo_id: wo.wo_id,
        },
      },
    })
      .then((res) => {
        console.log(res.status);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const generateTag = async () => {
    let ID = 1;
    setGLoading(true);
    await axios({
      method: "get",
      url: `https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/assets`,
      params: { type: "AssetID" },
    })
      .then((res) => {
        console.log(res.data.message);
        ID = parseInt(res.data.message.asset_id) + ID;
        let tag = ID.toString();
        tag = wo.building_id.toString() + tag;
        tag = "AS".concat(tag);
        console.log(tag);
        setValue("asset_tag", tag);
        setGLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setGLoading(false);
      });
  };

  const uploadFile = () => {
    setLoading(true);
    let dirName = formData.asset_tag;
    dirName = dirName + "/";
    let time = new Date().toJSON().slice(0, 16);
    time = time.replace(":", "");
    let filename = formData.asset_tag.concat("-", time);
    console.log(dirName);
    console.log(filename);

    if (Object.keys(filePath).length == 0) {
      alert("Please select image first");
      setLoading(false);
      return;
    }
    RNS3.put(
      {
        // `uri` can also be a file system path (i.e. file://)
        uri: filePath.uri,
        name: filename,
        type: "image/jpeg",
      },
      {
        keyPrefix: dirName, // Ex. myuploads/
        bucket: "ignis-building-docs", // Ex. aboutreact
        region: "us-east-1", // Ex. ap-south-1
        accessKey: "AKIA22XEQOCAMOW65Y6R",
        // Ex. AKIH73GS7S7C53M46OQ
        secretKey: "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",
        // Ex. Pt/2hdyro977ejd/h2u8n939nh89nfdnf8hd8f8fd
        successActionStatus: 201,
      }
    )
      .progress((progress) =>
        setUploadSuccessMessage(
          `Uploading: ${progress.loaded / progress.total} (${
            progress.percent
          }%)`
        )
      )
      .then((response) => {
        if (response.status !== 201) alert("Failed to upload image to S3");
        console.log(response.body);
        setFilePath("");
        setImageLocation(response.body.postResponse.location);
        setLoading(false);

        //Display asset tag QR code
        setVisible(true);
      });
  };

  React.useEffect(() => {
    (async () => {
      getSystemData();
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (selectsys.length != 0) {
        getDeviceData(selectsys);
      }
    })();
  }, [selectsys]);

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
      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)}>
          <Button onPress={() => console.log(formData)}>Set</Button>
        </Modal>
      </Portal>
      <View style={{ padding: 10, flex: 1, backgroundColor: "white" }}>
        {editmode === true ? (
          <Title>Edit Asset</Title>
        ) : (
          <Title>Asset Details</Title>
        )}

        <ScrollView style={{ paddingTop: 10 }}>
          <FormSelect
            control={control}
            name="system_id"
            rules={{ required: "System is required" }}
            data={systems}
            label="System"
            selectedValue={selectedSValue}
            title={editmode === true ? asset.system : "Select System"}
          />

          <FormSelect
            control={control}
            name={"device_id"}
            rules={{ required: "Device is required" }}
            data={devTypes}
            label="Device"
            selectedValue={selectedDValue}
            title={editmode === true ? asset.device : "Select Device"}
          />
          <FormInput
            control={control}
            name="mfr_name"
            rules={{ required: true }}
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

          {editmode === true ? (
            <FormInput
              control={control}
              name="asset_tag"
              rules={{ required: "Tag is required" }}
              label="Asset Tag"
              placeholder={"Enter Tag or Generate New"}
              disabled
            />
          ) : (
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
                <Button
                  onPress={generateTag}
                  style={{ marginTop: 20 }}
                  mode="outlined"
                  loading={gloading}
                >
                  Generate
                </Button>
              </View>
            </View>
          )}
          {editmode === true ? (
            <View>
              <Button
                loading={loading}
                onPress={handleSubmit(onSubmit)}
                style={{ marginVertical: 10 }}
                mode="contained"
              >
                Save
              </Button>
              <Button mode="outlined" style={{ marginBottom: 20 }}>
                Cancel
              </Button>
            </View>
          ) : (
            <Button
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              style={{ marginVertical: 20 }}
              mode="contained"
            >
              Submit
            </Button>
          )}
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
