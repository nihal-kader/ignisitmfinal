import React from "react";
import { Image, View, StyleSheet, StatusBar, ScrollView } from "react-native";
import {
  Avatar,
  Button,
  Card,
  DataTable,
  IconButton,
  SegmentedButtons,
  Switch,
  Text,
  TextInput,
  Title,
  ToggleButton,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import { RNS3 } from "react-native-aws3";
import axios from "axios";

function ITMTabComponent({props, wo_id, asset_id, type, asset_tag}) {
  const [selectedButton, setSelectedButton] = React.useState();
  const [isSatisfactory, setIsSatisfactory] = React.useState();
  const [pickedImagePath, setPickedImagePath] = React.useState("");
  const [recording, setRecording] = React.useState();
  const [audioPath, setAudioPath] = React.useState();
  const [remarks, setRemarks] = React.useState("");
  const [reading, setReading] = React.useState("");

  const [imageLocation, setImageLocation] = React.useState("");
  const [isLoadingSubmit, setLoadingSubmit] = React.useState(false);


  //Open Camera
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
      console.log(result.uri);
    }
  };

  //Voice Message
  //Audio recorder
  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioPath(uri);
    console.log("Recording stopped and stored at", uri);
  }

  //Playing audio
  const [sound, setSound] = React.useState();

  async function playSound() {
    try {
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync(
        // require('./assets/Hello.mp3')
        { uri: audioPath }
      );
      setSound(sound);

      console.log("Playing Sound");
      await sound.playAsync();
      // await sound.unloadAsync();
    } catch (error) {
      // An error occurred!
      console.error("Failed to start playing", err);
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  // Voice message -end


  const uploadFile = async (filePath, fileType) => {
    setLoadingSubmit(true);
    let dirName = asset_tag;
    dirName = dirName + "/" + fileType + "/" + type + "/";
    let time = new Date().toJSON().slice(0, 16);
    time = time.replace(":", "");
    let filename = asset_tag.concat("-", time);

    const filetype = filePath.split(".").pop();
    fileType = fileType + "/" + filetype;
    filename = filename + "." + filetype;
    console.log(dirName);
    console.log(filename);
    console.log(fileType);

    // if (Object.keys(filePath).length == 0) {
    if (filePath.length == 0) {
      alert("Please select file first");
      return;
    }
    return await RNS3.put(
      {
        // `uri` can also be a file system path (i.e. file://)
        uri: filePath,
        name: filename,
        type: fileType,//"image/jpeg"
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
    //   .then((response) => {
    //     if (response.status !== 201) alert("Failed to upload image to S3");
    //     console.log(response.body);
    //     // setFilePath("");
    //     setImageLocation(response.body.postResponse.location);
    //     setLoadingSubmit(false);

    //   });
  };

  const onSubmit = async () => {
    
    let imagepath = ""
    let audiopath = ""
    if ((isSatisfactory===undefined) && (type==="I" || type==="T")) {
        alert("Please select satisfactory or not!")
    } else if ((pickedImagePath==="") && (type==="I" || type==="M")){
        alert("Please take an image of the asset!")
    } else {
        console.log(data);
        await uploadFile(pickedImagePath,"image")
        .then((response) => {
            if (response.status !== 201) alert("Failed to upload image to S3");
            console.log(response.body);
            // setFilePath("");
            // setImageLocation(response.body.postResponse.location);
            // setLoadingSubmit(false);
            imagepath = response.body.postResponse.location;
            setLoadingSubmit(false);
          });

        if (audioPath!==undefined) {
            console.log("In Audio upload")
            await uploadFile(audioPath, "audio")
            .then((response) => {
                if (response.status !== 201) alert("Failed to upload audio to S3");
                console.log(response.body);
                // console.log("Audio");
                audiopath = response.body.postResponse.location
                setLoadingSubmit(false);
            });
        }

        console.log("image:", imagepath);
        console.log("audio:", audiopath);

        const data = {
            // wo_id: wo_id,
            // asset_id: asset_id,
            // type: type,
            "date_submit": new Date(),
            "remarks": remarks,
            "remarks_audio": audiopath,
            "image": imagepath,
            "satisfactory": isSatisfactory.toString(),
            "readings": reading,
            "status": 'Completed',
        }

        await axios({
            method: "put",
            url: "https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/itmworkorder",
            data: {
              data: data,
              asset_id: asset_id,
              wo_id: wo_id,
              type: type
            },
          })
            .then((res) => {
              console.log(res.status);
            })
            .catch((err) => {
              console.log(err.response.data);
            });
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ margin: 10, flex: 1 }}>
          <ScrollView>
            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>
                  <Text style={styles.title}>Instructions: </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>Dummy text</Text>
                </DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>
                  <Text style={styles.title}>Satisfactory: </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <ToggleButton.Row
                    onValueChange={(value) => setIsSatisfactory(value)}
                    value={isSatisfactory}
                  >
                    <ToggleButton icon="thumb-up" value={true} />
                    <ToggleButton icon="thumb-down" value={false} />
                  </ToggleButton.Row>
                </DataTable.Cell>
              </DataTable.Row>
          
            </DataTable>
            <View
              style={{
                marginLeft: 15,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text style={styles.title}>Reading: </Text>
              <TextInput
                style={{ marginLeft: 100, width: 150 }}
                mode="outlined"
                placeholder="Input"
                value={reading}
                onChangeText={value => setReading(value)}
              />
            </View>
            <View
              style={{
                margin: 10,
                borderColor: "grey",
                borderRadius: 10,
                borderWidth: 1,
                flex: 1,
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ margin: 5, flex: 1 }}>
                <TextInput
                  style={{ height: 100 }}
                  outlineColor="white"
                  activeOutlineColor="white"
                  mode="outlined"
                  placeholder="Remarks"
                  multiline={true}
                  value={remarks}
                  onChangeText={value => setRemarks(value)}
                />
              </View>

              <View>
                {recording ? (
                  <IconButton
                    size={40}
                    icon="stop"
                    iconColor="grey"
                    onPress={recording ? stopRecording : startRecording}
                  />
                ) : (
                  <IconButton
                    size={40}
                    icon="microphone"
                    iconCcolor="grey"
                    onPress={recording ? stopRecording : startRecording}
                  />
                )}

                {audioPath ? (
                  <View flexDirection={"row"} justifyContent={"center"}>
                    <IconButton
                      size={40}
                      icon="play"
                      iconColor="grey"
                      onPress={playSound}
                    />

                    <IconButton
                      size={40}
                      icon="close"
                      IconColor="grey"
                      onPress={() => setAudioPath(undefined)}
                    />
                  </View>
                ) : undefined}
              </View>
            </View>
            <Button mode="contained" loading={isLoadingSubmit} onPress={() => {onSubmit()}}>Submit</Button>
          </ScrollView>
        </View>
        <View style={{ margin: 10, flex: 1 }}>
          {pickedImagePath == "" ? (
            <Card onPress={openCamera}>
              <Card.Content
                style={{
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar.Icon icon="image" />
                <Title>Select Image</Title>
              </Card.Content>
            </Card>
          ) : (
            <Card>
              <Card.Cover source={{ uri: pickedImagePath }} />
              <Card.Actions style={{ alignSelf: "center" }}>
                <Button>Retake</Button>
              </Card.Actions>
            </Card>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    borderRadius: 10,
  },

  scene: {
    flex: 1,
  },
  title: {
    color: "#4e5d78",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default ITMTabComponent;
