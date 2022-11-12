import Calendar, { modeToNum } from "react-native-big-calendar";
import dayjs from "dayjs";
import { getUser } from "../../auth/auth";
import axios from "axios";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Surface,
  Text,
} from "react-native-paper";
import React from "react";
import { View } from "react-native";

function DashboardScreen(props) {
  const [loading, setLoading] = React.useState(false);
  const [dash, setDash] = React.useState({});
  const [schedule, setSchedule] = React.useState([]);

  //Get Dashboard Data
  const getDash = async () => {
    setLoading(true);
    let user = await getUser();

    setUser(user);
    await axios({
      method: "get",
      url: `https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/dashboard?id=${1}`,
    })
      .then((res) => {
        setDash(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Get Schedule as events for calender
  const getSchedule = async () => {
    let user = await getUser();

    setUser(user);
    await axios({
      method: "get",
      url: `https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/schedule?id=${1}`,
    })
      .then((res) => {
        console.log(res.data.message);
        let schedule = res.data.message.map((item) => ({
          title: item.title,
          start: new Date(item.start),
          end: new Date(item.end),
        }));
        console.log(schedule);
        setSchedule(schedule);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    (async () => {
      getDash();
      getSchedule();
    })();
  }, []);

  const today = new Date();
  const [user, setUser] = React.useState({});
  const [date, setDate] = React.useState(today);

  const _onPrevDate = () => {
    setDate(
      dayjs(date)
        .add(modeToNum("week", date) * -1, "day")
        .toDate()
    );
  };

  const _onNextDate = () => {
    setDate(dayjs(date).add(modeToNum("week", date), "day").toDate());
  };

  return (
    <View padding={5} flex={1}>
      {loading === true ? (
        <View style={{ justifyContent: "center", flex: 1 }}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <View style={{ padding: 10, flex: 1 }}>
          <Text>Welcome {user.name}!</Text>
          <Surface
            style={{
              borderRadius: 10,
              backgroundColor: "white",
              marginTop: 20,
              padding: 10,
              paddingVertical: 20,
            }}
          >
            <Text>Overview</Text>
            <View style={{ marginTop: 20, flexDirection: "row" }}>
              <View style={{ flex: 1, marginRight: 20 }}>
                <Card>
                  <Card.Title
                    title={dash.pending}
                    subtitle="Pending"
                    left={(props) => (
                      <Avatar.Icon
                        {...props}
                        color="rgba(255, 182, 72,1)"
                        style={{ backgroundColor: "rgba(255, 182, 72, 0.2)" }}
                        icon="dots-horizontal"
                      />
                    )}
                  />
                </Card>
              </View>
              <View style={{ flex: 1, marginRight: 20 }}>
                <Card>
                  <Card.Title
                    title={dash.inprogress}
                    subtitle="In Progress"
                    left={(props) => (
                      <Avatar.Icon
                        {...props}
                        color="rgba(47, 73, 209,1)'"
                        style={{ backgroundColor: "rgba(47, 73, 209, 0.2)" }}
                        icon="progress-clock"
                      />
                    )}
                  />
                </Card>
              </View>
              <View style={{ flex: 1, marginRight: 20 }}>
                <Card>
                  <Card.Title
                    title={dash.completed}
                    subtitle="Completed"
                    left={(props) => (
                      <Avatar.Icon
                        {...props}
                        color="rgba(75, 222, 151, 1)"
                        style={{ backgroundColor: "rgba(75, 222, 151, 0.2)" }}
                        icon="check-all"
                      />
                    )}
                  />
                </Card>
              </View>
              <View style={{ justifyContent: "center" }}>
                <Button
                  mode="outlined"
                  onPress={() => props.navigation.navigate("Work Orders")}
                >
                  Work Orders
                </Button>
              </View>
            </View>
          </Surface>

          <View
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: "white",
              marginTop: 20,
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginBottom: 2,
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                marginBottom: 20,
              }}
            >
              <Button
                mode="outlined"
                icon={"chevron-left"}
                onPress={_onPrevDate}
              />

              <Text variant="bodyLarge">{dayjs(date).format("MMMM YYYY")}</Text>

              <Button
                mode="outlined"
                icon={"chevron-right"}
                onPress={_onNextDate}
              />
            </View>
            <Calendar
              swipeEnabled={false}
              date={date}
              events={schedule}
              height={600}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default DashboardScreen;
