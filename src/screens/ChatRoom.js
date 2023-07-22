import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import MyText from "../components/MyText";
import { useRoute } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import { messagesByChatRoom } from "../graphql/queries";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/core";
import Colors from "../../constants/colors";
import ChatRoomHeader from "../components/ChatRoomHeader";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../features/user";
import { setChatRooms } from "../features/chatRooms";
import { getUser } from "../graphql/queries";
import { onCreateMessage } from "../graphql/subscriptions";

export default function ChatRoom() {
  const route = useRoute();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { chatRoomID, contactInfo } = route.params;
  const navigation = useNavigation();
  const theme = useColorScheme();
  const [messages, setMessages] = React.useState([]);
  const phoneHeight = useWindowDimensions();

  React.useEffect(() => {
    fetchMessages();
  }, []);

  React.useEffect(() => {
    API.graphql(
      graphqlOperation(onCreateMessage, { chatRoomID: chatRoomID })
    ).subscribe({
      next: ({ provider, value }) => {
        fetchMessages();
        fetchUser();
      },
      error: (e) => console.log(e),
    });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <ChatRoomHeader {...contactInfo} />,
    });
  }, []);

  async function fetchMessages() {
    try {
      const { data } = await API.graphql(
        graphqlOperation(messagesByChatRoom, {
          chatRoomID: chatRoomID,
          limit: 100,
          sortDirection: "DESC",
        })
      );
      setMessages(data.messagesByChatRoom.items);
    } catch (e) {
      console.log;
    }
  }

  async function fetchUser() {
    const { data } = await API.graphql(
      graphqlOperation(getUser, { id: user.id })
    );
    dispatch(
      setUser({
        id: data.getUser.id,
        firstName: data.getUser.firstName,
        lastName: data.getUser.lastName,
        profilePicture: data.getUser.profilePicture,
        email: data.getUser.email.toLowerCase(),
        status: data.getUser.status,
        notificationToken: data.getUser.notificationToken,
        latitude: data.getUser.latitude,
        longitude: data.getUser.longitude,
      })
    );
    if (data.getUser.chatRooms.items !== null) {
      dispatch(setChatRooms(data.getUser.chatRooms.items));
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={phoneHeight.height < 700 ? 60 : 90}
      style={{
        flex: 1,
        backgroundColor: Colors[theme].background,
      }}
    >
      <FlashList
        data={messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        estimatedItemSize={200}
        inverted
      />
      <ChatInput
        chatRoomID={chatRoomID}
        contactToken={contactInfo.notificationToken ?? null}
      />
    </KeyboardAvoidingView>
  );
}
