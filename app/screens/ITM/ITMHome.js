import React from 'react';
import { View, FlatList } from 'react-native';
import { Text, Surface, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import axios from "axios";


function ITMHome(props) {
    const { wo } = props.route.params;
    const [pendingAssets, setPendingAssets] = React.useState([]);
    const [completedAssets, setCompletedAssets] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);

    // Function to get assets from database
    const getAssets = async (stat) => {
        setLoading(true);
        await axios
          .get(
            "https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/itmworkorder",
            { params: { status: stat, wo_id: wo.wo_id } }
          )
          .then((res) => {
            if (stat == "Pending") {
              setPendingAssets(res.data.message);
            } else {
              setCompletedAssets(res.data.message);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
    
    };
    

    React.useEffect(() => {
        getAssets("Pending");
        getAssets("Completed");
        }, []);

    
    const ListItem = ({ item }) => {
        return (
        <View paddingY={1.5}>
           <View
            shadow={"0"}
            padding={3}
            rounded={10}
            bgColor={"coolGray.50"}
            > 
                <View flexDirection={"row"} alignItems={"center"} space={5}>

                    <View flexDirection={"column"} flex={2}>
                        <Text>
                        <Text bold>{item.device}</Text>
                        </Text>

                        <Text>
                        <Text bold>Location: </Text>
                        <Text>Floor: {item.floor_no}, Room: {item.room_no}</Text>
                        </Text>

                        <Text>
                        <Text bold>Tag: </Text>
                        <Text>{item.asset_tag}</Text>
                        </Text>
                    </View>
                    {/* <Spacer /> */}
                    <View flexDirection={"row"} space={2} flex={1}>
                        {item.types.includes('I') && (<Chip variant="outline" >Inspection</Chip>)}
                        {item.types.includes('T') && (<Chip variant="outline" colorScheme="info">Testing</Chip>)}
                        {item.types.includes('M') && (<Chip variant="outline" colorScheme="danger">Maintenance</Chip>)}
                    </View>
                    {/* <Spacer /> */}
                    <Button
                    colorScheme={"lightBlue"}
                    // rightIcon={<ChevronRightIcon />}
                    variant={"link"}
                    flex={1}
                    justifyContent={"flex-end"}
                    // onPress={() => {props.navigation.navigate("ExecutionScreen", {asset: item})}}
                    >
                    Start
                    </Button>
                </View>
            </View>
        </View>
        );};


    const Tab = createMaterialTopTabNavigator();
    const TabComponent = (assets) => (
        <View padding={3} flex={1}>
            {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator/>
            </View>) : (
            <FlatList
            data={assets}
            renderItem={({ item }) => <ListItem item={item} />}
            keyExtractor={(item) => item.Tag}
            />)}
        </View>
    );

    const Pending = () => {return TabComponent(pendingAssets)};
    const Completed = () => {return TabComponent(completedAssets)};

    return (
        <View flex={1} padding={10}>
            <View style={{
        //   padding: 10,
        //   borderRadius: 10,
        //   flexDirection: "row",
          flex: 1,
        }}>
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
                    <Text variant="bodyLarge">{wo.wo_id}</Text>
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
            <Surface 
            style={{
                backgroundColor: "white",
                padding: 5,
                borderRadius: 10,
                marginTop: 10,
                // width: "100%",
                height: "100%",
                }}>
                <Tab.Navigator>
                    <Tab.Screen name="Pending" component={Pending} />
                    <Tab.Screen name="Completed" component={Completed} />
                </Tab.Navigator>
            </Surface>
            </View>
        </View>
    );
}

export default ITMHome;