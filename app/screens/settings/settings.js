import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { resetUserSession, getUser } from "../../auth/auth";

function SettingsHome(props) {
  const [user, setUser] = React.useState({});
  React.useEffect(() => {
    (async () => {
      let user = await getUser();

      setUser(user);
    })();
  }, []);

  return (
    <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
      <Text variant="labelLarge">Signed in as {user.name}</Text>
      <Button
        style={{ marginVertical: 20 }}
        mode="outlined"
        onPress={() => {
          resetUserSession();
        //   console.log(props);
        //   console.log(props.navigation.navigate('Login'));
          props.navigation.navigate("Login");
        }}
      >
        Sign Out
      </Button>
    </View>
  );
}

export default SettingsHome;