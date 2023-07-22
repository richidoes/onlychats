import * as React from "react";
import MyText from "../components/MyText";
import { useRoute } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "../graphql/queries";
import {
  Pressable,
  Dimensions,
  Image,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { ScrollView } from "../components/themed/Themed";
import MapView, { Marker } from "react-native-maps";
import Colors from "../../constants/colors";
import moment from "moment";

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

  if (contact === undefined || contact === null) return;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: isNaN(parseFloat(contact.latitude))
            ? 37.78825
            : parseFloat(contact.latitude),
          longitude: isNaN(parseFloat(contact.longitude))
            ? -122.4324
            : parseFloat(contact.longitude),
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        <Marker
          coordinate={{
            latitude: isNaN(parseFloat(contact.latitude))
              ? 37.78825
              : parseFloat(contact.latitude),
            longitude: isNaN(parseFloat(contact.longitude))
              ? -122.4324
              : parseFloat(contact.longitude),
          }}
        />
      </MapView>
      <Image
        source={{
          uri: contact.profilePicture
            ? contact.profilePicture
            : "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
        }}
        style={styles.image}
      />
      <MyText
        style={{
          fontWeight: "600",
          textAlign: "center",
          marginTop: Dimensions.get("window").height < 700 ? 50 : 40,
        }}
      >
        {contact.firstName} {contact.lastName}
      </MyText>
      <MyText
        type="caption"
        style={{
          fontWeight: "600",
          textAlign: "center",
          color: Colors[theme].text + "70",
        }}
      >
        {contact.status
          ? '"' + contact.status + '"'
          : '"Learn to create this app 👉🏼 codewithbeto.dev"'}
      </MyText>

      <MyText
        type="caption"
        style={{
          fontWeight: "600",
          color: Colors[theme].text + "40",
          marginTop: 26,
        }}
      >
        INFORMATION
      </MyText>
      <InfoField label={"Email"} value={contact.email} theme={theme} />
      <InfoField
        label={"Member since"}
        value={moment(contact.createdAt).fromNow()}
        theme={theme}
      />
      <View
        style={{ height: Dimensions.get("window").height < 700 ? 30 : 80 }}
      />
      <InfoField
        label={"Report Contact"}
        theme={theme}
        onPress={() => alert("Report Contact")}
        danger
      />
      <InfoField
        label={"Delete Conversation"}
        theme={theme}
        onPress={() => alert("Delete Conversation")}
        danger
      />
    </ScrollView>
  );
}

function InfoField({ label, value, onPress, theme, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.infoContainer,
        { borderBottomColor: Colors[theme].text + "80" },
      ]}
    >
      <MyText
        type="caption"
        style={{
          fontWeight: "500",
          color: danger ? Colors[theme].red : Colors[theme].text + "80",
          paddingRight: 10,
        }}
      >
        {label}
      </MyText>
      <MyText
        type="caption"
        style={{
          fontWeight: "500",
          paddingRight: 10,
        }}
      >
        {" "}
        {value}{" "}
      </MyText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: "35%",
    alignSelf: "center",
  },
  image: {
    position: "absolute",
    top: "25%",
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 15,
  },
});
