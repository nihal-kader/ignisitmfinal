import React from 'react';
import { Image, View } from 'react-native';
import { Text, Surface, Button, ActivityIndicator } from 'react-native-paper';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import axios from "axios";
import ITMTabComponent from './ITMTabComponent';

function ITMExecution(props) {

    const {asset} = props.route.params;
    const [imagepath, setImagePath] = React.useState("");
    const [isLoading, setLoading] = React.useState(false);

    const getAssetImage = async (id) => {
        setLoading(true);
        await axios({
        method: "get",
        url: `https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/assets`,
        params: { type: "Image", asset_id : id },
        })
        .then((res) => {
            console.log(res.data.message);
            setImagePath(res.data.message);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        });
    };

    React.useEffect(() => {
        getAssetImage(asset.asset_id);
      },[]);

    const Tab = createMaterialTopTabNavigator();
    const TabComponent = (assets) => (
        <ITMTabComponent/>
    );
    const Testing = () => {return TabComponent("Testing")};
    const Inspection = () => {return TabComponent("Inspection")};
    const Maintenance = () => {return TabComponent("Maintenance")}

    return (
        <View padding={5} flex={1}>
            <View flexDirection={"row"}
                // padding={2}
                alignItems={"center"}
                justifyContent={"center"}
                rounded={10}
                bgColor={"gray.200"}
            >
                <Button
                colorScheme={"blue"}
                width={100}
                // leftIcon={<ChevronLeftIcon />}
                variant={"ghost"}
                rounded={100}
                >
                Previous
                </Button>

                {/* <Spacer /> */}
                <Text>Device 1/30</Text>
                {/* <Spacer /> */}
                <Button
                colorScheme={"blue"}
                width={100}
                // endIcon={<ChevronRightIcon />}
                variant={"ghost"}
                rounded={100}
                onPress={()=>{console.log(asset)}}
                >
                Next
                </Button>
            </View>
            <Surface flexDirection={"row"} space={5} minHeight={200}>
                <View padding={5} rounded={10} bgColor={"white"} flex={3}>
                <View flexDirection={"row"} flex={1} padding={5}>
                    <View flex={2} space={2} paddingLeft={5}>
                        <Text variant="titleLarge">{asset.asset_tag}</Text>
                        <Text variant="bodyLarge">Device: {asset.device}</Text>
                        <Text variant="bodyLarge">System: {asset.system}</Text>
                        <Text variant="bodyLarge">Room No: {asset.room_no}</Text>
                        <Text variant="bodyLarge">Floor No: {asset.floor_no}</Text>
                    </View>
                    <View bgColor={"green.100"} flex={1} alignItems={"center"} justifyContent={"center"}>
                    {imagepath==="" ? (
                    <Text>Device Image</Text>
                    ) : (
                        <Image
                        alt="Device image"
                        source={{ uri: imagepath.image }}
                        loadingIndicatorSource={require("../../assets/loading.gif")}
                        borderWidth={2}
                        borderColor={"black"}
                        flex={1}
                        style={{ width: "100%", maxHeight: 400 }}/>
                    )}
                    </View>
                </View>
                </View>
                <View justifyContent={"center"} space={5} padding={5} flex={1 / 2}>
                <Button colorScheme={"lightBlue"} rounded={100}>
                    Save
                </Button>
                <Button colorScheme={"blueGray"} rounded={100}>
                    Skip
                </Button>
                </View>
            </Surface>
            <View rounded={10} bgColor={"white"} flex={3}>
                <Tab.Navigator>
                    {asset.types.includes('I') && (<Tab.Screen name="Inspection" component={Inspection} />)}
                    {asset.types.includes('T') && (<Tab.Screen name="Testing" component={Testing} />)}
                    {asset.types.includes('M') && (<Tab.Screen name="Maintenance" component={Maintenance} />)}
                </Tab.Navigator>
            </View>
            </View>
    );
}

export default ITMExecution;