import React from "react";
import { View } from "react-native";
import { Button, Card } from "react-native-paper";
import { useForm } from "react-hook-form";
import { setUserSession } from "../../auth/auth";
import FormInput from "../../components/forminput";
import api from "../../../axiosConfig";

function LoginScreen(props) {
  const [loading, setLoading] = React.useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    setLoading(true);

    console.log(data);

    api
      .post("/auth/login", { userInfo: data })
      .then(async (res) => {
        setLoading(false);
        console.log(res);
        if (res.status === 200) {
          const user = res.data.message.user;
          const token = res.data.message.token;
          await setUserSession({ user, token });

          // if (user.first_login) {
          // 	navigate("/resetpassword");
          // } else {
          // 	navigate("/");
          // }
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response && err.response.data && err.response.data.message)
          alert(err.response.data.message);
        else alert("Server Error");
      });
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 100,
        flex: 1,
      }}
    >
      <Card style={{ height: 500, width: 300 }}>
        <Card.Cover
          style={{ padding: 40, backgroundColor: "white" }}
          resizeMode="contain"
          source={require("../../assets/logo.png")}
        />
        <Card.Content
          style={{
            flex: 1,
          }}
        >
          <FormInput
            control={control}
            name="username"
            rules={{ required: "Username is required" }}
            label="Username"
          />
          <FormInput
            control={control}
            name="password"
            rules={{ required: "Password is required" }}
            label="Password"
            secureTextEntry
          />

          <Button
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            style={{ marginVertical: 20 }}
            mode="contained"
          >
            Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

export default LoginScreen;
