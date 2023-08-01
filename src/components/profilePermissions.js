import * as React from 'react';
import {
  View,
  useColorScheme,
  StyleSheet,
  Switch,
  Alert,
  Pressable,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { isDevice } from 'expo-device';
import { Auth } from 'aws-amplify';
import { bool, func, oneOfType, string } from 'prop-types';
import MyText from './MyText';
import Colors from '../../constants/colors';
import {
  deleteUser,
  updateUserLocation,
  updateUserNotificationToken,
} from '../utils/userOperations';
import { registerForPushNotificationsAsync } from '../utils/registerForPushNotificationsAsync';
import { requestLocationPermissions } from '../utils/requestUserLocation';
import {
  resetNotificationToken,
  resetLocation,
  resetUser,
} from '../features/user';

export default function ProfilePermissions() {
  const user = useSelector(state => state.user);
  const theme = useColorScheme();
  const dispatch = useDispatch();

  async function handleToggleLocation() {
    if (user.latitude === null) {
      const location = await requestLocationPermissions();
      if (location !== null) {
        await updateUserLocation(user.id, location);
        dispatch(resetLocation(location));
      }
    } else {
      await updateUserLocation(user.id, { latitude: null, longitude: null });
      dispatch(resetLocation({ latitude: null, longitude: null }));
    }
  }

  async function handleToggleNotifications() {
    if (isDevice) {
      if (user.notificationToken === null) {
        const token = await registerForPushNotificationsAsync();
        if (token !== null) {
          await updateUserNotificationToken(user.id, token);
          dispatch(resetNotificationToken(token));
        }
      } else {
        await updateUserNotificationToken(user.id, null);
        dispatch(resetNotificationToken(null));
      }
    } else {
      alert('this do not work on a simulator');
    }
  }

  async function handleSignOut() {
    try {
      await Auth.signOut();
      dispatch(resetUser());
    } catch (e) {
      alert('Error signing out the user');
      console.log('Error signing out the user', e);
    }
  }

  async function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      "Your information will be permanently deleted, you can't revert this action",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          onPress: async () => {
            await deleteUser(user.id);
            await Auth.deleteUser();
            dispatch(resetUser());
          },
          style: 'destructive',
        },
      ]
    );
  }

  return (
    <View>
      <MyText
        type="caption"
        style={{ fontWeight: '600', color: `${Colors[theme].text}40` }}
      >
        PERMISSIONS
      </MyText>
      <InfoField
        theme={theme}
        label="Notifications"
        value={!!user.notificationToken}
        handleUpdate={handleToggleNotifications}
      />
      <InfoField
        theme={theme}
        label="Location"
        value={!!user.latitude}
        handleUpdate={handleToggleLocation}
      />
      <Pressable
        onPress={handleSignOut}
        style={[
          styles.fieldContainer,
          { borderBottomColor: `${Colors[theme].text}80`, paddingVertical: 22 },
        ]}
      >
        <MyText
          type="caption"
          style={{
            fontWeight: '500',
            color: `${Colors[theme].text}80`,
            paddingRight: 10,
          }}
        >
          Sign out
        </MyText>
      </Pressable>
      <Pressable
        onPress={handleDeleteAccount}
        style={[
          styles.fieldContainer,
          { borderBottomColor: `${Colors[theme].text}80`, paddingVertical: 22 },
        ]}
      >
        <MyText
          type="caption"
          style={{
            fontWeight: '500',
            color: Colors[theme].red,
            paddingRight: 10,
          }}
        >
          Delete Account
        </MyText>
      </Pressable>
    </View>
  );
}

function InfoField({ label, value, theme, handleUpdate }) {
  return (
    <View
      style={[
        styles.fieldContainer,
        { borderBottomColor: `${Colors[theme].text}80` },
      ]}
    >
      <MyText
        type="caption"
        style={{
          fontWeight: '500',
          color: `${Colors[theme].text}80`,
          paddingRight: 10,
        }}
      >
        {label}
      </MyText>
      <Switch value={value} onChange={handleUpdate} />
    </View>
  );
}

InfoField.propTypes = {
  label: string,
  value: oneOfType([string, bool]),
  theme: string,
  handleUpdate: func,
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 15,
  },
});
