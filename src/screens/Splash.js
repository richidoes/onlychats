import * as React from "react";
import { View } from "react-native";
import MyText from "../components/MyText";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user";
import { getUser } from "../graphql/queries";

export default function Splash({ setIsLoading }) {
  const dispatch = useDispatch();
  React.useEffect(() => {
    (async () => {
      try {
        const { attributes } = await Auth.currentAuthenticatedUser();
        const { data } = await API.graphql(
          graphqlOperation(getUser, { id: attributes.sub })
        );
        // console.log(data);
        dispatch(
          setUser({
            id: attributes.sub,
            firstName: data.getUser.firstName,
            lastName: data.getUser.lastName,
            profilePicture: data.getUser.profilePicture,
            email: attributes.email.toLowerCase(),
            status: data.getUser.status,
            notificationToken: data.getUser.notificationToken,
            latitude: data.getUser.latitude,
            longitude: data.getUser.longitude,
          })
        );
        setIsLoading(false);
        // console.log(attributes);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MyText type="title">🕰</MyText>
      <MyText type="title">Loading...</MyText>
    </View>
  );
}
