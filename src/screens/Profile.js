import { Auth } from "aws-amplify";
import * as React from "react";
import MyText from "../components/MyText";
import MyButton from "../components/MyButton";
import { View } from "../components/themed/Themed";

export default function Profile() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const { attributes } = await Auth.currentAuthenticatedUser();
        setUser(attributes);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  async function handleSignOut() {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <MyText type="title">Welcome back! 🚀</MyText>
      <MyText>{user?.sub}</MyText>
      <MyText>{user?.email}</MyText>
      <MyButton title={"Sign Out"} onPress={handleSignOut} />
    </View>
  );
}
