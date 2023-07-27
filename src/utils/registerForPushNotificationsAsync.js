import * as Notifications from 'expo-notifications';
import { isDevice } from 'expo-device';
import { Alert, Linking, Platform } from 'react-native';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync() {
  let token = null;

  if (isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notifications permission denied',
        'Please enable notifications for this app in your phone settings',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Go to Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:notifications');
              }

              if (Platform.OS === 'android') {
                startActivityAsync(ActivityAction.NOTIFICATION_SETTINGS);
              }
            },
            style: 'default',
          },
        ]
      );
      return null;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.easConfig?.projectId,
      })
    ).data;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  return token;
}
