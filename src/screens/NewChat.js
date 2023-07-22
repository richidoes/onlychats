import * as React from "react";
import { View } from "../components/themed/Themed";
import MyText from "../components/MyText";
import MyInput from "../components/MyInput";
import { Alert, StyleSheet } from "react-native";
import MyButton from "../components/MyButton";
import { useSelector, useDispatch } from "react-redux";
import { setChatRooms } from "../features/chatRooms";
import {
  getUserByEmail,
  addUserToChatRoom,
  createNewChatRoom,
  getUserByID,
} from "../utils/userOperations";
import { sendPushNotification } from "../utils/notifications";
import { useNavigation } from "@react-navigation/native";

export default function NewChat() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // search for user by email

  // if user exists, create a chatroom

  // after create chatroom create userChatRooms
  // add current user to chatroom
  // add contact user to chatroom

  // set User Chatrooms to redux

  // if success! take user to chatroom with contact
  // send push notification to contact

  // if error show alert

  async function handleNewChat() {
    try {
      if (email.toLowerCase().trim() === user.email) {
        alert("That's your email 😅");
        return;
      }
      setIsLoading(true);
      const contact = await getUserByEmail(email.toLowerCase().trim());
      if (contact === null) {
        alert(`There is no user with email: ${email}`);
        setIsLoading(false);
        return;
      }
      const newChatRoomID = await createNewChatRoom();
      await addUserToChatRoom(contact.id, newChatRoomID);
      await addUserToChatRoom(user.id, newChatRoomID);
      const refreshedUser = await getUserByID(user.id);
      if (refreshedUser.chatRooms !== undefined) {
        dispatch(setChatRooms(refreshedUser.chatRooms.items));
      }
      await sendPushNotification(
        contact.notificationToken,
        "🚨 New conversation started!",
        `${
          user.firstName + " " + user.lastName
        } started a conversation with you`
      );
      setIsLoading(false);
      Alert.alert("Success!", "Conversation started successfully", [
        {
          text: "Let's chat!",
          onPress: () => navigation.goBack(),
          style: "default",
        },
      ]);
    } catch (e) {
      alert("something went wrong");
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <MyText style={{ fontWeight: "bold", marginBottom: 11 }}>
        Start a new chat by entering the email of the user you want to chat with
      </MyText>
      <MyInput
        label="betomoedano@outlook.com"
        hiddenLabel
        onChangeText={setEmail}
        value={email}
      />
      <MyButton
        title={isLoading ? "Loading..." : "Start new chat"}
        onPress={handleNewChat}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
});
