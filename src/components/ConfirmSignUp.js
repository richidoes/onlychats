import * as React from "react";
import { Button } from "react-native";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import MyText from "./MyText";
import { AuthContext } from "../Context/AuthContext";

export default function ConfirmSignUp() {
  const {
    email,
    setEmail,
    setVerificationCode,
    handleConfirmSignUp,
    setAuthState,
    handleResendVerificationCode,
  } = React.useContext(AuthContext);
  return (
    <>
      <MyText type="title" style={{ marginBottom: 5 }}>
        Confirm Sign Up
      </MyText>
      <MyText type="caption" style={{ marginBottom: 15 }}>
        Enter your email address and we'll send you a code to reset your
        password.
      </MyText>
      <MyInput label="Email" value={email} onChangeText={setEmail} />
      <MyInput label="Code" onChangeText={setVerificationCode} />
      <MyButton title="Create Account" onPress={handleConfirmSignUp} />
      <MyButton
        title="Re-send Code"
        type="secondary"
        onPress={handleResendVerificationCode}
      />
      <MyButton
        title="Back to Login"
        type="secondary"
        onPress={() => setAuthState("signIn")}
      />
    </>
  );
}
