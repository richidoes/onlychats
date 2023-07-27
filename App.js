import * as React from 'react';
import { useColorScheme } from 'react-native';
import { Amplify, Hub, API, graphqlOperation } from 'aws-amplify';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { setNotificationHandler } from 'expo-notifications';
import awsconfig from './src/aws-exports';
import Root from './src/navigation/Root';
import Splash from './src/screens/Splash';
import AuthScreen from './src/screens/Auth';
import { setUser, resetUser } from './src/features/user';
import { store } from './src/app/store';
import { getUser } from './src/graphql/queries';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

Amplify.configure(awsconfig);

export default function Wrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const user = useSelector(state => state.user);
  const [isLoading, setIsLoading] = React.useState(true);
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();

  const listener = async data => {
    switch (data.payload.event) {
      case 'signIn':
        const userDB = await API.graphql(
          graphqlOperation(getUser, { id: data.payload.data.attributes.sub })
        );
        dispatch(
          setUser({
            id: userDB.data.getUser.id,
            firstName: userDB.data.getUser.firstName,
            lastName: userDB.data.getUser.lastName,
            profilePicture: userDB.data.getUser.profilePicture,
            email: userDB.data.getUser.email.toLowerCase(),
            status: userDB.data.getUser.status,
            notificationToken: userDB.data.getUser.notificationToken,
            latitude: userDB.data.getUser.latitude,
            longitude: userDB.data.getUser.longitude,
          })
        );
        break;
      case 'signOut':
        dispatch(resetUser());
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    Hub.listen('auth', listener);
  }, []);

  if (isLoading) return <Splash setIsLoading={setIsLoading} />;
  return user.email ? (
    <Root user={user} colorScheme={colorScheme} />
  ) : (
    <AuthScreen />
  );
}
