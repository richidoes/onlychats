import * as React from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import MyText from "./MyText";
import { Button } from "react-native";
import { AuthContext } from "../Context/AuthContext";
import { Auth, Amplify } from "aws-amplify";
import * as WebBrowser from "expo-web-browser";
import awsconfig from "../aws-exports";

export default function SignIn() {
  const { setAuthState, setEmail, setPassword, handleSignIn } =
    React.useContext(AuthContext);

  return (
    <React.Fragment>
      <MyText type="title">The new way of messaging</MyText>
      <MyInput label="Email" onChangeText={setEmail} />
      <MyInput label="Password" secureTextEntry onChangeText={setPassword} />
      <MyButton title="Sign In" onPress={handleSignIn} />
      {/* <MyButton
        title="Sign In With Google"
        onPress={() => Auth.federatedSignIn()}
      /> */}
      <MyButton
        type="secondary"
        title="Sign Up"
        onPress={() => setAuthState("signUp")}
      />
    </React.Fragment>
  );
}
