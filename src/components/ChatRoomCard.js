import * as React from "react";
import {
  Image,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Pressable,
} from "react-native";
import MyText from "./MyText";
import { useSelector } from "react-redux";
import moment from "moment";
import Colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ChatRoomCard(chat) {
  const user = useSelector((state) => state.user);
  const { chatRoomID, chatRoom } = chat;
  const { isSeenBy, participants, lastMessage } = chatRoom;
  const theme = useColorScheme();
  const navigation = useNavigation();

  const contactInfo =
    participants.items[0].user.id === user.id
      ? {
          id: participants.items[1].user.id,
          firstName: participants.items[1].user.firstName,
          lastName: participants.items[1].user.lastName,
          profilePicture: participants.items[1].user.profilePicture,
        }
      : {
          id: participants.items[0].user.id,
          firstName: participants.items[0].user.firstName,
          lastName: participants.items[0].user.lastName,
          profilePicture: participants.items[0].user.profilePicture,
        };
  const isSeenByCurrentUser = isSeenBy !== null && isSeenBy.includes(user.id);
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ChatRoom", { contactInfo, chatRoomID })
      }
      style={[
        styles.container,
        { borderBottomColor: Colors[theme].text + "60" },
      ]}
    >
      <View style={styles.containerWithPadding}>
        <View
          style={[
            styles.isSeen,
            isSeenByCurrentUser && { backgroundColor: "transparent" },
          ]}
        />
        <Image
          source={{
            uri: contactInfo.profilePicture
              ? contactInfo.profilePicture
              : "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
          }}
          style={styles.image}
        />
        <View style={{ flexShrink: 1 }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <MyText style={{ fontWeight: "500" }}>
              {contactInfo.firstName} {contactInfo.lastName}
            </MyText>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MyText
                type="caption"
                style={{
                  color: Colors[theme].text + "80",
                  fontWeight: "500",
                  marginRight: 13,
                }}
              >
                {moment(lastMessage?.createdAt).fromNow()}
              </MyText>
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={Colors[theme].text + "80"}
              />
            </View>
          </View>
          <MyText
            style={{ color: Colors[theme].text + "90" }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {chatRoom.lastMessage?.content.slice(0, 25)}
          </MyText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 77,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  containerWithPadding: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  isSeen: {
    width: 8,
    height: 8,
    backgroundColor: Colors.light.tabIconSelected,
    borderRadius: 4,
  },
});
