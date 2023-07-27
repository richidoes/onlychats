import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API, graphqlOperation } from 'aws-amplify';
import { FlashList } from '@shopify/flash-list';
import { Alert, Button, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { postsByDate } from '../graphql/queries';
import ListHeader from '../components/ListHeader';
import PostCard from '../components/PostCard';
import { setPostsReducer, loadMorePostReducer } from '../features/posts';
import { View } from '../components/themed/Themed';

export default function Home() {
  const navigation = useNavigation();
  const { posts } = useSelector(state => state.posts);
  const dispatch = useDispatch();
  const [nextToken, setNextToken] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        const notificationData = response.notification.request.content.data;
        switch (notificationData.type) {
          case 'LIKED_POST': {
            navigation.navigate('ShowPost', {
              postID: notificationData.postID,
            });
            break;
          }
          case 'STARTED_CONVERSATION': {
            navigation.navigate('ChatRoom', {
              chatRoomId: notificationData.chatRoomID,
              contactInfo: notificationData.sender,
            });
            break;
          }
          default:
            break;
        }
      }
    );
    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    async function checkFirstLaunch() {
      const firstLaunch = await AsyncStorage.getItem('@firstLaunch');
      if (firstLaunch === null) navigation.navigate('Onboarding');
    }
    checkFirstLaunch();
    fetchPost();
  }, []);

  async function fetchPost() {
    const { data } = await API.graphql(
      graphqlOperation(postsByDate, {
        type: 'Post',
        sortDirection: 'DESC',
        limit: 100,
      })
    );
    dispatch(setPostsReducer(data.postsByDate.items));
    setNextToken(data.postsByDate.nextToken);
    setIsLoading(false);
  }

  async function fetchMorePost() {
    if (nextToken) {
      setIsLoading(true);
      const { data } = await API.graphql(
        graphqlOperation(postsByDate, {
          type: 'Post',
          sortDirection: 'DESC',
          limit: 100,
          nextToken,
        })
      );
      dispatch(loadMorePostReducer(data.postsByDate.items));
      setNextToken(data.postsByDate.nextToken);
      if (data.postsByDate.nextToken === null) {
        Alert.alert('No more posts to load 🤯');
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 0 }}>
      <FlashList
        data={posts}
        renderItem={({ item }) => <PostCard {...item} />}
        contentContainerStyle={Platform.OS === 'ios' && { paddingVertical: 30 }}
        estimatedItemSize={200}
        ListHeaderComponent={() => (
          <ListHeader
            title="Posts"
            iconName="add-circle-sharp"
            handleNavigation={() => navigation.navigate('NewPost')}
          />
        )}
        ListFooterComponent={() => (
          <Button
            onPress={fetchMorePost}
            title={isLoading ? 'loading' : 'load more posts'}
            disabled={isLoading || nextToken === null}
          />
        )}
        refreshing={isLoading}
        onRefresh={fetchPost}
      />
    </View>
  );
}
