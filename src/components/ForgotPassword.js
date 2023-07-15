import * as React from "react";
import MyInput from "./MyInput";
import MyButton from "./MyButton";
import MyText from "./MyText";
import { AuthContext } from "../Context/AuthContext";

export default function ForgotPassword() {
  const { setAuthState, setEmail, isLoading } = React.useContext(AuthContext);

  return (
    <React.Fragment>
      <MyText type="title" style={{ marginBottom: 5 }}>
        Forgot Password
      </MyText>
      <MyText type="caption" style={{ marginBottom: 15 }}>
        Enter your email address and we'll send you a code to reset your
        password.
      </MyText>
      <MyInput label="Email" onChangeText={setEmail} />
      <MyButton
        title={isLoading ? "Sending Code..." : "Send Code"}
        disabled={isLoading ? true : false}
        style={{ marginTop: 20 }}
        onPress={() => setAuthState("confirmForgotPassword")}
      />
      <MyButton
        type="secondary"
        title="Back to Login"
        onPress={() => setAuthState("signIn")}
      />
    </React.Fragment>
  );
}
