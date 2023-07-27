import * as React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { View } from '../components/themed/Themed';
import MyText from '../components/MyText';
import MyInput from '../components/MyInput';
import MyButton from '../components/MyButton';
import { setChatRooms } from '../features/chatRooms';
import {
  getUserByEmail,
  addUserToChatRoom,
  createNewChatRoom,
  getUserByID,
} from '../utils/userOperations';
import {
  sendPushNotification,
  createNotificationOnDB,
} from '../utils/notifications';

export default function NewChat() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleNewChat() {
    try {
      if (email.toLowerCase().trim() === user.email) {
        Alert.alert("That's your email 😅");
        return;
      }
      setIsLoading(true);

      // search for user by email
      const contact = await getUserByEmail(email.toLowerCase().trim());
      if (contact === null) {
        Alert.alert(`There is no user with email: ${email}`);
        setIsLoading(false);
        return;
      }

      // if user exists, create a chatroom
      const newChatRoomID = await createNewChatRoom();

      // after create chatroom create userChatRooms
      // add current user to chatroom
      await addUserToChatRoom(contact.id, newChatRoomID);
      // add contact user to chatroom
      await addUserToChatRoom(user.id, newChatRoomID);

      const refreshedUser = await getUserByID(user.id);
      if (refreshedUser.chatRooms !== undefined) {
        // set User ChatRooms to redux
        dispatch(setChatRooms(refreshedUser.chatRooms.items));
      }

      // if success! take user to chatroom with contact
      // send push notification to contact
      const notificationData = await createNotificationOnDB(
        user.id,
        contact.id,
        'STARTED_CONVERSATION',
        '',
        newChatRoomID
      );
      await sendPushNotification(
        contact.notificationToken,
        '🚨 New conversation started!',
        `${user.firstName} ${user.lastName} started a conversation with you`,
        notificationData
      );
      setIsLoading(false);
      Alert.alert('Success!', 'Conversation started successfully', [
        {
          text: "Let's chat!",
          onPress: () => navigation.goBack(),
          style: 'default',
        },
      ]);
    } catch (e) {
      // if error show alert
      Alert.alert('something went wrong');
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <MyText style={{ fontWeight: 'bold', marginBottom: 11 }}>
        Start a new chat by entering the email of the user you want to chat with
      </MyText>
      <MyInput
        label="betomoedano@outlook.com"
        hiddenLabel
        onChangeText={setEmail}
        value={email}
      />
      <MyButton
        title={isLoading ? 'Loading...' : 'Start new chat'}
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
