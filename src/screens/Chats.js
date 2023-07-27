import * as React from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useSelector, useDispatch } from 'react-redux';
import { API, graphqlOperation } from 'aws-amplify';
import { View } from '../components/themed/Themed';
import ListHeader from '../components/ListHeader';
import ChatRoomCard from '../components/ChatRoomCard';
import { onCreateChatRoom } from '../graphql/subscriptions';
import { setChatRooms } from '../features/chatRooms';
import { getUserByID } from '../utils/userOperations';

export default function Chats() {
  const user = useSelector(state => state.user);
  const { chatRooms } = useSelector(state => state.chatRooms);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  React.useEffect(() => {
    API.graphql(graphqlOperation(onCreateChatRoom)).subscribe({
      next: () => {
        setTimeout(() => {
          handleNewChat();
        }, 2000);
      },
      error: e => console.log('onCreateChatRoom subscription error: ', e),
    });
  }, []);

  async function handleNewChat() {
    const userInfo = await getUserByID(user.id);
    if (userInfo.chatRooms !== undefined) {
      dispatch(setChatRooms(userInfo.chatRooms.items));
    }
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 0 }}>
      <FlashList
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomCard chat={item} />}
        contentContainerStyle={Platform.OS === 'ios' && { paddingVertical: 30 }}
        estimatedItemSize={200}
        ListHeaderComponent={() => (
          <ListHeader
            title="Chats"
            iconName="add-circle-sharp"
            handleNavigation={() => navigation.navigate('NewChat')}
          />
        )}
      />
    </View>
  );
}
