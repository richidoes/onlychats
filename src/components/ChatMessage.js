import React from "react";
import { View, StyleSheet, useColorScheme, Image } from "react-native";
import { useSelector } from "react-redux";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";
import MyText from "./MyText";
import Colors from "../../constants/colors";

export default function ChatMessage({ message }) {
  const user = useSelector((state) => state.user);
  const theme = useColorScheme();
  const myMessage = message.author.id === user.id;

  return (
    <View style={myMessage ? {} : styles.otherBubbleWrapper}>
      {!myMessage && (
        <Image
          source={{
            uri: message.author.profilePicture
              ? message.author.profilePicture
              : "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
          }}
          style={styles.photo}
        />
      )}
      <View style={myMessage ? styles.mineInfo : {}}>
        <LinearGradient
          style={myMessage ? styles.mineBubble : styles.otherBubble}
          colors={
            myMessage
              ? [Colors[theme].messageFrom, Colors[theme].messageTo]
              : [`${Colors[theme].text  }10`, `${Colors[theme].text  }10`]
          }
        >
          <MyText style={myMessage && { color: "#fff" }}>
            {message.content}
          </MyText>
        </LinearGradient>
        <MyText
          style={[styles.createdAt, , myMessage && { textAlign: "right" }]}
        >
          {moment(message.createdAt).fromNow()}
        </MyText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  otherBubbleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 17,
  },
  photo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  createdAt: {
    fontSize: 11,
    fontWeight: "500",
    opacity: 0.4,
    marginVertical: 5,
  },
  mineInfo: {
    display: "flex",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    paddingHorizontal: 17,
    maxWidth: "90%",
  },
  otherBubble: {
    marginRight: 60,
    borderRadius: 20,
    padding: 10,
    overflow: "hidden",
  },
  mineBubble: {
    borderRadius: 20,
    padding: 10,
    overflow: "hidden",
  },
});
