import * as React from 'react';
import { Alert, Button, Platform, StatusBar } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useDispatch, useSelector } from 'react-redux';
import { View } from '../components/themed/Themed';
import ListHeader from '../components/ListHeader';
import {
  loadMoreNotifications,
  setNotifications,
} from '../features/notifications';
import { getNotificationsByUserID } from '../utils/notifications';
import NotificationCard from '../components/NotificationCard';

export default function NotificationsScreen() {
  const user = useSelector(state => state.user);
  const { notifications } = useSelector(state => state.notifications);
  const [nextToken, setNextToken] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      setIsLoading(true);
      const { nextTokenUtil, notificationsList } =
        await getNotificationsByUserID(user.id);
      setNextToken(nextTokenUtil);
      dispatch(setNotifications(notificationsList));
      setIsLoading(false);
    } catch (e) {
      Alert.alert('Error loading notifications', e);
      setIsLoading(false);
    }
  }

  async function fetchMoreNotifications() {
    if (nextToken) {
      try {
        setIsLoading(true);
        const { nextTokenUtil, notificationsList } =
          await getNotificationsByUserID(user.id, nextToken);
        setNextToken(nextTokenUtil);
        if (nextTokenUtil === null) {
          Alert.alert('No more notifications to load 🤯');
        }
        dispatch(loadMoreNotifications(notificationsList));
        setIsLoading(false);
      } catch (e) {
        Alert.alert('Error loading notifications', e);
      }
    } else {
      setIsLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 0 }}>
      <FlashList
        data={notifications}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        contentContainerStyle={Platform.OS === 'ios' && { paddingVertical: 30 }}
        estimatedItemSize={200}
        ListHeaderComponent={() => <ListHeader title="Notifications" />}
        ListFooterComponent={() => (
          <Button
            onPress={fetchMoreNotifications}
            title={isLoading ? 'loading' : 'load more notifications'}
            disabled={isLoading || nextToken === null}
          />
        )}
        refreshing={isLoading}
        onRefresh={fetchNotifications}
      />
      <StatusBar />
    </View>
  );
}
