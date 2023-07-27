import * as React from 'react';
import {
  Image,
  StyleSheet,
  useColorScheme,
  View,
  Alert,
  Pressable,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import Colors from '../../constants/colors';
import {
  incrementLikesReducer,
  decrementLikesReducer,
  deletePostReducer,
} from '../features/posts';
import {
  deletePost,
  incrementLikesMutation,
  decrementLikesMutation,
} from '../utils/postsOperations';
import MyText from './MyText';
import {
  createNotificationOnDB,
  sendPushNotification,
} from '../utils/notifications';

export default function PostCard(post) {
  const user = useSelector(state => state.user);
  const theme = useColorScheme();
  const dispatch = useDispatch();
  const { author, content, createdAt, id, likedBy, numberOfLikes } = post;

  async function handleLike() {
    const data = {
      userID: user.id,
      postID: id,
    };

    if (likedBy.includes(user.id)) {
      notificationAsync(NotificationFeedbackType.Error);
      dispatch(decrementLikesReducer(data));
      await decrementLikesMutation(id, likedBy, numberOfLikes, user.id);
    } else {
      // increment likes
      notificationAsync(NotificationFeedbackType.Success);
      dispatch(incrementLikesReducer(data));
      await incrementLikesMutation(id, likedBy, numberOfLikes, user.id);
      if (author.id !== user.id) {
        const notificationData = await createNotificationOnDB(
          user.id,
          author.id,
          'LIKED_POST',
          id
        );
        await sendPushNotification(
          author.notificationToken,
          `${user.firstName} liked your post 👍`,
          'Go to Only Chats to check it out!',
          notificationData
        );
      }
    }
  }

  function handleReport() {
    if (author.id !== user.id) {
      return Alert.alert('Report Post', 'Would you like to report this post?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          onPress: async () => {
            dispatch(deletePostReducer(id));
            await deletePost(id);
            Alert.alert(
              'Thank you for your report. We will review it as soon as possible.'
            );
          },
          style: 'destructive',
        },
      ]);
    }

    return Alert.alert('Delete Post', 'Would you like to delete this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          dispatch(deletePostReducer(id));
          await deletePost(id);
          Alert.alert('Your post was successfully deleted 👍🏻');
        },
        style: 'destructive',
      },
    ]);
  }

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: `${Colors[theme].text}80` },
      ]}
    >
      <View style={{ paddingHorizontal: 17 }}>
        <View style={styles.postHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{
                uri: author?.profilePicture
                  ? author.profilePicture
                  : 'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png',
              }}
              style={styles.image}
            />
            <View style={{ paddingLeft: 10 }}>
              <MyText style={{ fontWeight: '500' }}>{author?.firstName}</MyText>
              <MyText
                type="caption"
                style={{ color: `${Colors[theme].text}70`, fontWeight: '500' }}
              >
                {moment(createdAt).fromNow()}
              </MyText>
            </View>
          </View>
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={`${Colors[theme].text}70`}
            onPress={handleReport}
          />
        </View>
        <MyText
          style={{ color: `${Colors[theme].text}70`, paddingVertical: 10 }}
        >
          {content}
        </MyText>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Pressable onPress={handleLike}>
            {likedBy !== null && likedBy.includes(user.id) ? (
              <AntDesign
                name="like1"
                size={21}
                color={Colors.light.tabIconSelected}
              />
            ) : (
              <AntDesign
                name="like2"
                size={21}
                color={`${Colors[theme].text}50`}
              />
            )}
          </Pressable>
          <MyText
            type="caption"
            style={[
              likedBy !== null && likedBy.includes(user.id)
                ? {
                    color: Colors.light.tabIconSelected,
                  }
                : { color: `${Colors[theme].text}50` },
              { marginLeft: 5 },
            ]}
          >
            {numberOfLikes}
          </MyText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
