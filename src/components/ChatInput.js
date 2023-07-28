import * as React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  Pressable,
  useColorScheme,
} from 'react-native';
import { useSelector } from 'react-redux';
import { API, graphqlOperation } from 'aws-amplify';
import Colors from '../../constants/colors';
import { createMessage, updateChatRoom } from '../graphql/mutations';

export default function ChatInput({ chatRoomId, contactToken }) {
  const user = useSelector(state => state.user);
  const [text, setText] = React.useState('');
  const theme = useColorScheme();

  async function handleSubmit() {
    const input = {
      content: text.trim(),
      messageAuthorId: user.id,
      chatRoomID: chatRoomId,
      chatRoomMessagesId: chatRoomId,
    };
    try {
      const { data } = await API.graphql(
        graphqlOperation(createMessage, { input })
      );
      await API.graphql(
        graphqlOperation(updateChatRoom, {
          input: {
            id: chatRoomId,
            chatRoomLastMessageId: data.createMessage.id,
            isSeenBy: user.id,
          },
        })
      );
      console.log('message sent and chatRoom updated');
      setText('');
      await sendPushNotification();
    } catch (e) {
      console.log(e);
    }
  }

  async function sendPushNotification() {
    if (contactToken !== null) {
      const message = {
        to: contactToken,
        sound: 'default',
        title: `${user.firstName} ${user.lastName}`,
        body: text,
        data: { someData: 'goes here' },
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        categoryIdentifier: 'replyMessage',
      });
    }
  }

  return (
    <View style={styles.textInputBar}>
      <TextInput
        style={[
          styles.textInput,
          {
            borderColor: `${Colors[theme].text}65`,
            color: Colors[theme].text,
            backgroundColor: theme === 'dark' ? '#000' : '#fff',
          },
        ]}
        placeholder="Go to codewithbeto.dev :)"
        placeholderTextColor="gray"
        scrollEnabled
        textAlign="left"
        textAlignVertical="bottom"
        onChangeText={setText}
        defaultValue={text}
        multiline
      />
      <Pressable
        onPress={handleSubmit}
        disabled={text.trim().length === 0}
        style={styles.sendButtonWrapper}
      >
        <Image
          style={[
            styles.sendButton,
            text.trim().length < 1 ? { opacity: 0.3 } : { opacity: 1 },
          ]}
          source={
            theme === 'light'
              ? require('../../assets/send.png')
              : require('../../assets/sendDark.png')
          }
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputBar: {
    width: '95%',
    flexDirection: 'row',
    alignSelf: 'center',
    flexGrow: 0,
  },
  textInput: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 8,
    paddingVertical: 8,
    paddingTop: 8,
    paddingRight: 40,
    flexGrow: 0,
    minWidth: '95%',
  },
  sendButtonWrapper: {
    position: 'absolute',
    bottom: -4,
    right: -8,
    width: 44,
    height: 44,
    flexShrink: 0,
  },
  sendButton: {
    width: 28,
    height: 28,
  },
});
