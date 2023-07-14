import * as React from "react";
import { View } from "../components/themed/Themed";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import ConfirmSignUp from "../components/ConfirmSignUp";
import { AuthProvider, AuthContext } from "../Context/AuthContext";
import { Image, useColorScheme } from "react-native";

export default function Wrapper() {
  return (
    <AuthProvider>
      <Auth />
    </AuthProvider>
  );
}

function Auth() {
  const { authState } = React.useContext(AuthContext);
  const theme = useColorScheme();
  const image =
    theme === "dark"
      ? require("../../assets/LogoDark.png")
      : require("../../assets/LogoLight.png");
  console.log("authState", authState);
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Image
        source={image}
        style={{ width: 178, height: 178, alignSelf: "center" }}
      />
      {authState === "signIn" && <SignIn />}
      {authState === "signUp" && <SignUp />}
      {authState === "confirmSignUp" && <ConfirmSignUp />}
    </View>
  );
}
