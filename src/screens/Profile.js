import { Auth } from "aws-amplify";
import * as React from "react";
import MyText from "../components/MyText";
import MyButton from "../components/MyButton";
import { View } from "../components/themed/Themed";
import { useSelector } from "react-redux";

export default function Profile() {
  const user = useSelector((state) => state.user);

  async function handleSignOut() {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <MyText type="title">Welcome back! 🚀</MyText>
      <MyText>{user.id}</MyText>
      <MyText>{user.email}</MyText>
      <MyText>{user.firstName}</MyText>
      <MyText>{user.lastName}</MyText>
      <MyButton title={"Sign Out"} onPress={handleSignOut} />
    </View>
  );
}
