import * as React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import MyText from "./MyText";

export default function ChatRoomHeader({
  id,
  firstName,
  lastName,
  profilePicture,
}) {
  return (
    <Pressable style={styles.container} onPress={() => alert("hello")}>
      <Image
        source={{
          uri: profilePicture
            ? profilePicture
            : "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
        }}
        style={styles.image}
      />
      <MyText style={{ fontWeight: "bold" }}>{firstName}</MyText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    marginRight: 10,
  },
});
