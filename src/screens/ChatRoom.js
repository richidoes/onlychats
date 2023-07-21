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

export default function ChatRoom() {
  const route = useRoute();
  const { chatRoomID, contactInfo } = route.params;
  const navigation = useNavigation();
  const theme = useColorScheme();
  const [messages, setMessages] = React.useState([]);
  const phoneHeight = useWindowDimensions();

  React.useEffect(() => {
    fetchMessages();
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
      <ChatInput chatRoomID={chatRoomID} />
    </KeyboardAvoidingView>
  );
}
