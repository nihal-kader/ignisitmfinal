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

function ITMTabComponent(props) {
  const [selectedButton, setSelectedButton] = React.useState();
  const [isSatisfactory, setIsSatisfactory] = React.useState();
  const [pickedImagePath, setPickedImagePath] = React.useState("");
  const [recording, setRecording] = React.useState();
  const [audioPath, setAudioPath] = React.useState();

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
              <DataTable.Row>
                <DataTable.Cell>
                  <Text style={styles.title}>Reading: </Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ padding: 5 }}>
                  <TextInput
                    style={{ width: 150 }}
                    mode="outlined"
                    placeholder="Input"
                  />
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>

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
            <Button mode="contained">Submit</Button>
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
