import * as React from "react";
import { Image, StyleSheet, useColorScheme, View } from "react-native";
import MyText from "./MyText";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { useSelector } from "react-redux";
import moment from "moment";

export default function PostCard(post) {
  const user = useSelector((state) => state.user);
  const theme = useColorScheme();
  const { author, content, createdAt, id, likedBy, numberOfLikes } = post;
  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: Colors[theme].text + "80" },
      ]}
    >
      <View style={{ paddingHorizontal: 17 }}>
        <View style={styles.postHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{
                uri: author?.profilePicture
                  ? author.profilePicture
                  : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
              }}
              style={styles.image}
            />
            <View style={{ paddingLeft: 10 }}>
              <MyText style={{ fontWeight: "500" }}>{author?.firstName}</MyText>
              <MyText
                type="caption"
                style={{ color: Colors[theme].text + "70", fontWeight: "500" }}
              >
                {moment(createdAt).fromNow()}
              </MyText>
            </View>
          </View>
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={Colors[theme].text + "70"}
          />
        </View>
        <MyText
          style={{ color: Colors[theme].text + "70", paddingVertical: 10 }}
        >
          {content}
        </MyText>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          {likedBy !== null && likedBy.includes(user.id) ? (
            <AntDesign
              name="like1"
              size={21}
              color={Colors.light.tabIconSelected}
            />
          ) : (
            <AntDesign
              name="like2"
              size={21}
              color={Colors[theme].text + "50"}
            />
          )}
          <MyText
            type="caption"
            style={[
              likedBy !== null && likedBy.includes(user.id)
                ? {
                    color: Colors.light.tabIconSelected,
                  }
                : { color: Colors[theme].text + "50" },
              { marginLeft: 5 },
            ]}
          >
            {numberOfLikes}
          </MyText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
