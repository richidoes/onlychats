import { Auth } from "aws-amplify";
import * as React from "react";
import MyText from "../components/MyText";
import MyButton from "../components/MyButton";
import { View } from "../components/themed/Themed";
import { useSelector } from "react-redux";
import ProfilePicture from "../components/profilePicture";
import { useColorScheme, StatusBar } from "react-native";

export default function Profile() {
  const user = useSelector((state) => state.user);
  const theme = useColorScheme();

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
      <ProfilePicture />
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
    </View>
  );
}
