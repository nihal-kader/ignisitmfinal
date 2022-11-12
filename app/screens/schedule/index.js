import React from "react";
import Calendar, { modeToNum } from "react-native-big-calendar";
import dayjs from "dayjs";
import axios from "axios";
import { getUser } from "../../auth/auth";
import { View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";

function ScheduleScreen(props) {
  const [schedule, setSchedule] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      getSchedule();
    })();
  }, []);

  const getSchedule = async () => {
    setLoading(true);
    let user = await getUser();

    setUser(user);
    await axios({
      method: "get",
      url: `https://bjiwogsbrc.execute-api.us-east-1.amazonaws.com/Prod/schedule?id=${user.id}`,
    })
      .then((res) => {
        setLoading(false);
        console.log(res.data.message);
        let schedule = res.data.message.map((item) => ({
          title: item.activity,
          start: new Date(item.start),
          end: new Date(item.end),
          wo_id: item.wo_id,
        }));
        console.log(schedule);
        setSchedule(schedule);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const today = new Date();

  const [date, setDate] = React.useState(today);

  const _onPrevDate = () => {
    setDate(
      dayjs(date)
        .add(dayjs(date).date() * -1, "day")
        .toDate()
    );
  };

  const _onNextDate = () => {
    setDate(dayjs(date).add(modeToNum("month", date), "day").toDate());
  };

  const _onToday = () => {
    setDate(today);
  };
  return loading === true ? (
    <View style={{ justifyContent: "center", flex: 1 }}>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
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
        <Button mode="outlined" icon={"chevron-left"} onPress={_onPrevDate} />

        <Text variant="bodyLarge">{dayjs(date).format("MMMM YYYY")}</Text>

        <Button mode="outlined" icon={"chevron-right"} onPress={_onNextDate} />
      </View>
      <Calendar
        onPressEvent={(item) => props.navigation.navigate("Work Orders")}
        swipeEnabled={false}
        showAdjacentMonths
        date={date}
        events={schedule}
        height={100}
        mode="month"
      />
    </View>
  );
}

export default ScheduleScreen;
