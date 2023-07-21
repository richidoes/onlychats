import * as React from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
import { View } from '../components/themed/Themed';
import ListHeader from '../components/ListHeader';
import MyText from '../components/MyText';
import ChatRoomCard from '../components/ChatRoomCard';

export default function Chats() {
  const { chatRooms } = useSelector(state => state.chatRooms);
  return (
    <View style={{ flex: 1, paddingHorizontal: 0 }}>
      <FlashList
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomCard {...item} />}
        contentContainerStyle={Platform.OS === 'ios' && { paddingVertical: 30 }}
        estimatedItemSize={200}
        ListHeaderComponent={() => (
          <ListHeader
            title="Chats"
            iconName="add-circle-sharp"
            handleNavigation={() => {}}
          />
        )}
      />
    </View>
  );
}
