import * as React from "react";
import { Button } from "react-native";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import MyText from "./MyText";
import { AuthContext } from "../Context/AuthContext";

export default function SignUp() {
  const {
    setAuthState,
    setEmail,
    setPassword,
    handleSignUp,
    setFirstName,
    setLastName,
    setConfirmPassword,
  } = React.useContext(AuthContext);
  return (
    <>
      <MyText type="title" style={{ marginBottom: 35 }}>
        Join the amazing community
      </MyText>
      <MyInput label="First Name" onChangeText={setFirstName} />
      <MyInput label="Last Name" onChangeText={setLastName} />
      <MyInput label="Email" onChangeText={setEmail} />
      <MyInput label="Password" onChangeText={setPassword} secureTextEntry />
      <MyInput
        label="Confirm Password"
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <MyButton title="Join Me" onPress={handleSignUp} />
      <MyButton
        title="Go Back"
        type="secondary"
        onPress={() => setAuthState("signIn")}
      />
    </>
  );
}
