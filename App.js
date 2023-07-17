import * as React from "react";
import { useColorScheme } from "react-native";
import { Amplify, Auth, Hub, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./src/aws-exports";
import Root from "./src/navigation/Root";
import Splash from "./src/screens/Splash";
import AuthScreen from "./src/screens/Auth";
import { Provider, useSelector, useDispatch } from "react-redux";
import { setUser, resetUser } from "./src/features/user";
import { store } from "./src/app/store";
import { getUser } from "./src/graphql/queries";

Amplify.configure(awsconfig);

export default function Wrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  // const [user, setUser] = React.useState(null);
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = React.useState(true);
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  const listener = async (data) => {
    switch (data.payload.event) {
      case "signIn":
        const user = await API.graphql(
          graphqlOperation(getUser, { id: data.payload.data.attributes.sub })
        );
        dispatch(
          setUser({
            id: user.data.getUser.id,
            firstName: user.data.getUser.firstName,
            lastName: user.data.getUser.lastName,
            profilePicture: user.data.getUser.profilePicture,
            email: user.data.getUser.email.toLowerCase(),
            status: user.data.getUser.status,
            notificationToken: user.data.getUser.notificationToken,
          })
        );
        // console.log("lisener", data.payload);
        // setUser({ sub: data.payload.email, email: data.payload.email });
        console.log("user signed in");
        break;
      case "signOut":
        // setUser(null);
        dispatch(resetUser());
        console.log("user signed out");
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    Hub.listen("auth", listener);
  }, []);

  if (isLoading) return <Splash setIsLoading={setIsLoading} />;
  return user.email ? (
    <Root user={user} colorScheme={colorScheme} />
  ) : (
    <AuthScreen />
  );
}
