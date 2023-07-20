import * as React from "react";
import {
  Image,
  StyleSheet,
  useColorScheme,
  View,
  Linking,
  Alert,
  Pressable,
} from "react-native";
import MyText from "./MyText";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../constants/colors";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  incrementLikesReducer,
  decrementLikesReducer,
  deletePostReducer,
} from "../features/posts";
import {
  deletePost,
  incrementLikesMutation,
  decrementLikesMutation,
} from "../utils/postsOperations";
import { notificationAsync, NotificationFeedbackType } from "expo-haptics";

export default function PostCard(post) {
  const user = useSelector((state) => state.user);
  const theme = useColorScheme();
  const dispatch = useDispatch();
  const { author, content, createdAt, id, likedBy, numberOfLikes } = post;

  async function handleLike() {
    const data = {
      userID: user.id,
      postID: id,
    };

    if (likedBy.includes(user.id)) {
      notificationAsync(NotificationFeedbackType.Error);
      dispatch(decrementLikesReducer(data));
      await decrementLikesMutation(id, likedBy, numberOfLikes, user.id);
    } else {
      // increment likes
      notificationAsync(NotificationFeedbackType.Success);
      dispatch(incrementLikesReducer(data));
      await incrementLikesMutation(id, likedBy, numberOfLikes, user.id);
    }
  }

  function handleReport() {
    Alert.alert("Report User", "Would you like to report this post or user?", [
      {
        text: "Cancel",
        onPress: () => console.log("canceled"),
        style: "cancel",
      },
      {
        text: "Resport Post or User",
        onPress: async () => {
          dispatch(deletePostReducer(id));
          await sendReportEmail();
          await deletePost(id);
        },
        style: "destructive",
      },
    ]);
  }

  async function sendReportEmail() {
    const url = `mailto:${"codewithbeto.dev@gmail.com"}?subject=Report&body=${
      "This is an automatic email to the Code With Beto Reporting team. Please write any concerns above this paragraph and do not delete anything below. " +
      "User ID: " +
      user.id +
      "\n" +
      "Post ID: " +
      id
    }`;

    await Linking.openURL(url);
    alert("Thank you for your report. We will review it as soon as possible.");
  }

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
                  : "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
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
            onPress={handleReport}
          />
        </View>
        <MyText
          style={{ color: Colors[theme].text + "70", paddingVertical: 10 }}
        >
          {content}
        </MyText>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Pressable onPress={handleLike}>
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
          </Pressable>
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
