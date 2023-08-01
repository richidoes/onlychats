import * as React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { string } from 'prop-types';
import MyText from './MyText';

export default function ChatRoomHeader({ id, firstName, profilePicture }) {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate('ContactProfile', { id })}
      style={styles.container}
    >
      <Image
        source={{
          uri:
            profilePicture ||
            'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png',
        }}
        style={styles.image}
      />
      <MyText style={{ fontWeight: 'bold' }}>{firstName}</MyText>
    </Pressable>
  );
}

ChatRoomHeader.propTypes = {
  id: string,
  firstName: string,
  profilePicture: string,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    marginRight: 10,
  },
});
