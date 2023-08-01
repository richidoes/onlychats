import * as React from 'react';
import {
  Image,
  StyleSheet,
  useColorScheme,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API } from 'aws-amplify';
import { object } from 'prop-types';
import Colors from '../../constants/colors';
import MyText from './MyText';
import { deleteNotification, updateNotification } from '../graphql/mutations';
import {
  deleteNotification as deleteNotificationReducer,
  markNotificationAsSeen,
} from '../features/notifications';

export default function NotificationCard({ notification }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { sender } = notification;
  const theme = useColorScheme();
  const notificationBody =
    notification.type === 'LIKED_POST'
      ? 'Liked your post'
      : 'Started a conversation with you';

  async function handleDeleteNotification() {
    Alert.alert(
      'Delete Notification',
      'Do you want to delete this notification?',
      [
        {
          text: 'Confirm',
          onPress: async () => {
            await API.graphql({
              query: deleteNotification,
              variables: {
                input: {
                  id: notification.id,
                },
              },
            });
            dispatch(deleteNotificationReducer(notification.id));
          },
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  }

  async function handleOnPress() {
    if (!notification.isSeen) {
      await API.graphql({
        query: updateNotification,
        variables: {
          input: {
            id: notification.id,
            notificationSenderId: sender.id,
            isSeen: true,
          },
        },
      });
    }
    dispatch(markNotificationAsSeen(notification.id));
    notification.type === 'LIKED_POST'
      ? navigation.navigate('ShowPost', { postID: notification.postID })
      : navigation.navigate('ChatRoom', {
          chatRoomID: notification.chatRoomID,
          contactInfo: sender,
        });
  }

  return (
    <Pressable
      style={[
        styles.container,
        { borderBottomColor: `${Colors[theme].text}60` },
      ]}
      onPress={handleOnPress}
    >
      <View style={styles.containerWithPadding}>
        <View
          style={[
            styles.isSeen,
            notification.isSeen && { backgroundColor: 'transparent' },
          ]}
        />
        <Image
          source={{
            uri: sender.profilePicture
              ? sender.profilePicture
              : 'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png',
          }}
          style={styles.image}
        />
        <View style={{ flexShrink: 1 }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <MyText style={{ fontWeight: '500' }}>
              {sender.firstName} {sender.lastName}
            </MyText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MyText
                type="caption"
                style={{
                  color: `${Colors[theme].text}80`,
                  fontWeight: '500',
                  marginRight: 13,
                }}
              >
                {moment(notification.createdAt).fromNow().slice(0, 13)}
              </MyText>
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={`${Colors[theme].text}80`}
                onPress={handleDeleteNotification}
              />
            </View>
          </View>
          <MyText
            style={{ color: `${Colors[theme].text}90` }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {notificationBody}
          </MyText>
        </View>
      </View>
    </Pressable>
  );
}

NotificationCard.propTypes = {
  notification: object,
};

const styles = StyleSheet.create({
  container: {
    height: 77,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  containerWithPadding: {
    flexDirection: 'row',
    alignItems: 'center',
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
