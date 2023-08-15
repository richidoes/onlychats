import * as React from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/core';
import { useSelector, useDispatch } from 'react-redux';
import { messagesByChatRoom, getUser } from '../graphql/queries';
import Colors from '../../constants/colors';
import ChatRoomHeader from '../components/ChatRoomHeader';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import { setUser } from '../features/user';
import { setChatRooms } from '../features/chatRooms';
import { onCreateMessage } from '../graphql/subscriptions';

export default function ChatRoom() {
  const route = useRoute();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { chatRoomId, contactInfo } = route.params;
  const navigation = useNavigation();
  const theme = useColorScheme();
  const [messages, setMessages] = React.useState([]);
  const phoneHeight = useWindowDimensions();
  const [nextToken, setNextToken] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const CustomHeader = React.useCallback(
    () => <ChatRoomHeader {...contactInfo} />,
    []
  );

  React.useEffect(() => {
    fetchMessages();
  }, []);

  React.useEffect(() => {
    API.graphql(
      graphqlOperation(onCreateMessage, { chatRoomID: chatRoomId })
    ).subscribe({
      next: () => {
        fetchMessages();
        fetchUser();
      },
      error: e => console.log('onCreateMessage subscription error', e),
    });
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: CustomHeader,
    });
  }, []);

  async function fetchMessages() {
    try {
      setIsLoading(true);
      const { data } = await API.graphql(
        graphqlOperation(messagesByChatRoom, {
          chatRoomID: chatRoomId,
          limit: 100,
          sortDirection: 'DESC',
        })
      );
      setNextToken(data.messagesByChatRoom.nextToken);
      setMessages(data.messagesByChatRoom.items);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      alert('Error loading messages');
      console.log('Error loading messages', e);
    }
  }

  async function fetchMoreMessages() {
    if (nextToken === null) {
      alert('no more messages to load');
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await API.graphql(
        graphqlOperation(messagesByChatRoom, {
          chatRoomID: chatRoomId,
          limit: 100,
          sortDirection: 'DESC',
          nextToken,
        })
      );
      setMessages([...messages, ...data.messagesByChatRoom.items]);
      setNextToken(data.messagesByChatRoom.nextToken);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      alert('Error loading more messages');
      console.log('Error loading more messages', e);
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        ListFooterComponent={
          <Button
            title={isLoading ? 'loading' : 'load more messages'}
            disabled={isLoading || nextToken === null}
            onPress={fetchMoreMessages}
          />
        }
      />
      <ChatInput
        chatRoomId={chatRoomId}
        contactToken={contactInfo.notificationToken ?? null}
      />
    </KeyboardAvoidingView>
  );
}
