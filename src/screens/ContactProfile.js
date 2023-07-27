import * as React from 'react';
import { useRoute } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import {
  Pressable,
  Dimensions,
  Image,
  StyleSheet,
  useColorScheme,
  View,
  Linking,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import moment from 'moment';
import { bool, func, string } from 'prop-types';
import { getUser } from '../graphql/queries';
import { ScrollView } from '../components/themed/Themed';
import Colors from '../../constants/colors';
import MyText from '../components/MyText';

export default function ContactProfile() {
  const [contact, setContact] = React.useState();
  const theme = useColorScheme();
  const route = useRoute();

  React.useEffect(() => {
    getContactInfo();
  }, []);

  async function getContactInfo() {
    const { data } = await API.graphql(
      graphqlOperation(getUser, { id: route.params.id })
    );
    setContact(data.getUser);
  }

  function handleReport() {
    Alert.alert('Report User', 'Would you like to report this user?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Report User',
        onPress: async () => {
          await sendReportEmail();
          Alert.alert(
            'Thank you for your report. We will review it as soon as possible.'
          );
        },
        style: 'destructive',
      },
    ]);
  }

  const sendReportEmail = async () => {
    const url = `mailto:${'codewithbeto.dev@gmail.com'}?subject=Report&body=${
      `This is an automatic email to the Code With Beto Reporting team. Please write any concerns above this paragraph and do not delete anything below. ` +
      `User ID: ${contact.id}`
    }`;
    await Linking.openURL(url);
  };

  if (contact === undefined || contact === null) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: Number.isNaN(parseFloat(contact.latitude))
            ? 37.78825
            : parseFloat(contact.latitude),
          longitude: Number.isNaN(parseFloat(contact.longitude))
            ? -122.4324
            : parseFloat(contact.longitude),
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        <Marker
          coordinate={{
            latitude: Number.isNaN(parseFloat(contact.latitude))
              ? 37.78825
              : parseFloat(contact.latitude),
            longitude: Number.isNaN(parseFloat(contact.longitude))
              ? -122.4324
              : parseFloat(contact.longitude),
          }}
        />
      </MapView>
      <Image
        source={{
          uri: contact.profilePicture
            ? contact.profilePicture
            : 'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png',
        }}
        style={styles.image}
      />
      <MyText
        style={{
          fontWeight: '600',
          textAlign: 'center',
          marginTop: Dimensions.get('window').height < 700 ? 50 : 40,
        }}
      >
        {contact.firstName} {contact.lastName}
      </MyText>
      <MyText
        type="caption"
        style={{
          fontWeight: '600',
          textAlign: 'center',
          color: `${Colors[theme].text}70`,
        }}
      >
        {contact.status
          ? `"${contact.status}"`
          : '"Learn to create this app 👉🏼 codewithbeto.dev"'}
      </MyText>

      <MyText
        type="caption"
        style={{
          fontWeight: '600',
          color: `${Colors[theme].text}40`,
          marginTop: 26,
        }}
      >
        INFORMATION
      </MyText>
      <InfoField label="Email" value={contact.email} theme={theme} />
      <InfoField
        label="Member since"
        value={moment(contact.createdAt).fromNow()}
        theme={theme}
      />
      <View
        style={{ height: Dimensions.get('window').height < 700 ? 30 : 80 }}
      />
      <InfoField
        label="Report Contact"
        theme={theme}
        onPress={handleReport}
        danger
      />
      {/* <InfoField
        label={"Delete Conversation"}
        theme={theme}
        onPress={() => alert("Delete Conversation")}
        danger
      /> */}
    </ScrollView>
  );
}

function InfoField({ label, value, onPress, theme, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.infoContainer,
        { borderBottomColor: `${Colors[theme].text}80` },
      ]}
    >
      <MyText
        type="caption"
        style={{
          fontWeight: '500',
          color: danger ? Colors[theme].red : `${Colors[theme].text}80`,
          paddingRight: 10,
        }}
      >
        {label}
      </MyText>
      <MyText
        type="caption"
        style={{
          fontWeight: '500',
          paddingRight: 10,
        }}
      >
        {' '}
        {value}{' '}
      </MyText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: '35%',
    alignSelf: 'center',
  },
  image: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 15,
  },
});

InfoField.propTypes = {
  label: string,
  value: string,
  onPress: func,
  theme: string,
  danger: bool,
};
