import * as React from 'react';
import { Image, StyleSheet, View as DefaultView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import MyButton from '../components/MyButton';
import { ThemedView } from '../components/Themed';
import MyText from '../components/MyText';
import { resetNotificationToken } from '../features/user';
import { registerForPushNotificationsAsync } from '../utils/registerForPushNotificationsAsync';
import { updateUserNotificationToken } from '../utils/userOperations';

export default function Onboarding() {
  const { id } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  async function handleOnContinue() {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token !== null) {
        await updateUserNotificationToken(id, token);
        dispatch(resetNotificationToken(token));
      }
      await AsyncStorage.setItem('@firstLaunch', 'true');
      navigation.navigate('Home');
    } catch (e) {
      console.log('Onboarding error', e);
    }
  }

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center' }}>
      <MyText style={styles.title} type="title">
        Welcome to
      </MyText>
      <MyText style={[styles.title, { marginBottom: 30 }]} type="title">
        Only Chats
      </MyText>
      {appFeatures.map(feature => (
        <ThemedView key={feature.title} style={styles.itemContainer}>
          <Image source={feature.icon} style={styles.icon} />
          <DefaultView style={styles.textWrapper}>
            <MyText type="caption" style={{ fontWeight: 'bold' }}>
              {feature.title}
            </MyText>
            <MyText type="caption">{feature.description}</MyText>
          </DefaultView>
        </ThemedView>
      ))}
      <MyButton
        style={{ marginTop: 50 }}
        title="Continue"
        onPress={handleOnContinue}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  icon: {
    width: 58,
    height: 58,
    marginRight: 13,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 13,
  },
  textWrapper: {
    flexShrink: 1,
  },
});

const appFeatures = [
  {
    icon: require('../../assets/post.png'),
    title: 'Creating Post',
    description: 'Create post and share ideas with members of the community',
  },
  {
    icon: require('../../assets/message.png'),
    title: 'Create chats with friends',
    description:
      'Start a conversation with friends, send messages at the speed of light',
  },
  {
    icon: require('../../assets/bell.png'),
    title: 'Keep updated with notifications',
    description:
      'Get notified whenever someone likes your posts or sends you a message',
  },
];
