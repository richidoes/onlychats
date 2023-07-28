import * as React from "react";
import { useColorScheme, StatusBar } from "react-native";
import { ScrollView } from "../components/themed/Themed";
import ProfilePicture from "../components/profilePicture";
import ProfileInformation from "../components/profileInformation";
import ProfilePermissions from "../components/profilePermissions";

export default function Profile() {
  const theme = useColorScheme();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <ProfilePicture />
      <ProfileInformation />
      <ProfilePermissions />
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
    </ScrollView>
  );
}
