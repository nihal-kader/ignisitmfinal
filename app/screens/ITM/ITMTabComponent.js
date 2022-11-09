import React from 'react';
import { Image, View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { Avatar, Button, SegmentedButtons, Switch, Text, TextInput, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker";
// import { Audio } from "expo-av";

function ITMTabComponent(props) {

    const [selectedButton, setSelectedButton] = React.useState();
    const [isSatisfactory, setIsSatisfactory] = React.useState(false);
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

    // //Voice Message
    // //Audio recorder
    // async function startRecording() {
    //     try {
    //     console.log("Requesting permissions..");
    //     await Audio.requestPermissionsAsync();
    //     await Audio.setAudioModeAsync({
    //         allowsRecordingIOS: true,
    //         playsInSilentModeIOS: true,
    //     });
    //     console.log("Starting recording..");
    //     const { recording } = await Audio.Recording.createAsync(
    //         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    //     );
    //     setRecording(recording);
    //     console.log("Recording started");
    //     } catch (err) {
    //     console.error("Failed to start recording", err);
    //     }
    // }

    // async function stopRecording() {
    //     console.log("Stopping recording..");
    //     setRecording(undefined);
    //     await recording.stopAndUnloadAsync();
    //     const uri = recording.getURI();
    //     setAudioPath(uri);
    //     console.log("Recording stopped and stored at", uri);
    // }

    // //Playing audio
    // const [sound, setSound] = React.useState();

    // async function playSound() {
    //     try {
    //     console.log("Loading Sound");
    //     const { sound } = await Audio.Sound.createAsync(
    //         // require('./assets/Hello.mp3')
    //         { uri: audioPath }
    //     );
    //     setSound(sound);

    //     console.log("Playing Sound");
    //     await sound.playAsync();
    //     // await sound.unloadAsync();
    //     } catch (error) {
    //     // An error occurred!
    //     console.error("Failed to start playing", err);
    //     }
    // }

    // React.useEffect(() => {
    //     return sound
    //     ? () => {
    //         console.log("Unloading Sound");
    //         sound.unloadAsync();
    //         }
    //     : undefined;
    // }, [sound]);
    // // Voice message -end

    return (
        <View flex={1} style={{ backgroundColor: "white" }}>
            <View flexDirection={"row"} flex={1}>
                <View flex={2}>
                <ScrollView>
                    <View flex={1} padding={5} space={5}>
                    <View flexDirection={"row"} space={1} alignItems={"center"}>
                        <Text style={styles.title}>Instructions: </Text>
                        <Text>Dummy text</Text>
                    </View>
                    <View flexDirection={"row"} space={1} alignItems={"center"}>
                        <Text style={styles.title}>Satisfactory: </Text>
                        {/* <SegmentedButtons
                        width={100}
                        buttons={["No", "Yes"]}
                        selectedIndex={selectedButton}
                        onPress={(value) => {
                            setSelectedButton(value);
                        }}
                        selectedButtonStyle={{ backgroundColor: "#377dff" }}
                        textStyle={{ color: "#8a94a6" }}
                        containerStyle={{ borderRadius: 10, marginBottom: 20 }}
                        /> */}
                        <Switch value={isSatisfactory} onValueChange={()=>{setIsSatisfactory(!isSatisfactory)}}/>
                    </View>
                    <View flexDirection={"row"} space={1} alignItems={"center"}>
                        <Text style={styles.title}>Reading: </Text>
                        <View w={300}>
                        <TextInput
                            bgColor={"coolGray.100"}
                            mx="3"
                            placeholder="Input"
                            w="90%"
                        />
                        </View>
                    </View>
                    <View
                        borderWidth={1}
                        borderColor={"coolGray.300"}
                        rounded={10}
                        bgColor={"coolGray.100"}
                        height={100}
                    >
                        <View flexDirection={"row"} justifyContent={"center"} alignItems={"center"}>
                        <TextInput
                            borderColor={"coolGray.100"}
                            h={100}
                            placeholder="Remarks"
                            w="90%"
                            multiline={true}
                        />
                        {/* <Icon size={40} name="microphone" type="material-community" color="grey" /> */}
                        {/* <View>
                            <TouchableOpacity
                            onPress={recording ? stopRecording : startRecording}
                            >
                            {recording ? (
                                <Icon
                                size={40}
                                name="stop"
                                type="material-community"
                                color="grey"
                                />
                            ) : (
                                <Icon
                                size={40}
                                name="microphone"
                                type="material-community"
                                color="grey"
                                />
                            )}
                            </TouchableOpacity>
                            {audioPath ? (
                            <View flexDirection={"row"} justifyContent={"center"}>
                                <TouchableOpacity onPress={playSound}>
                                <Icon
                                    size={40}
                                    name="play"
                                    type="material-community"
                                    color="grey"
                                />
                                </TouchableOpacity>
                                <TouchableOpacity
                                onPress={() => setAudioPath(undefined)}
                                >
                                <Icon
                                    size={40}
                                    name="close"
                                    type="material-community"
                                    color="grey"
                                />
                                </TouchableOpacity>
                            </View>
                            ) : undefined}
                        </View> */}
                        </View>
                    </View>
                    </View>
                    <Button>Submit</Button>
                </ScrollView>
                </View>
                <View flex={1} padding={5}>
                {pickedImagePath == "" ? (
                    <View
                    flex={1}
                    style={styles.card}
                    justifyContent={"center"}
                    alignItems={"center"}
                    >
                    <TouchableRipple onPress={openCamera}>
                        <View space={10} alignItems={"center"}>
                        <Text style={styles.title}>Add Image</Text>
                        {/* <Icon
                            size={100}
                            name="camera"
                            type="material-community"
                            color="grey"
                        /> */}
                        <Avatar.Icon icon="camera"/>
                        </View>
                    </TouchableRipple>
                    </View>
                ) : (
                    <View flex={1} space={2}>
                    <View
                        flex={1}
                        style={styles.card}
                        justifyContent={"center"}
                        alignItems={"center"}
                    >
                        <Image
                        flex={1}
                        source={{ uri: pickedImagePath }}
                        style={{ width: "100%" }}
                        />
                    </View>
                    <Button
                        color="#4e5d78"
                        bgColor="#4e5d78"
                        onPress={openCamera}
                    >Retake</Button>
                    </View>
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
    card: {
      borderRadius: 5,
      borderColor: "#e5e5e5",
      borderWidth: 1,
      maxHeight: 350,
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