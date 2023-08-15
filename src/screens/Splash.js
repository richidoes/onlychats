import * as React from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { func } from 'prop-types';
import { ThemedView } from '../components/Themed';
import MyText from '../components/MyText';
import { setUser } from '../features/user';
import { setChatRooms } from '../features/chatRooms';
import { getUser } from '../graphql/queries';
import { getNotificationsByUserID } from '../utils/notifications';
import { setNotifications } from '../features/notifications';

export default function Splash({ setIsLoading }) {
  const dispatch = useDispatch();
  React.useEffect(() => {
    (async () => {
      try {
        const { attributes } = await Auth.currentAuthenticatedUser();
        const { data } = await API.graphql(
          graphqlOperation(getUser, { id: attributes.sub })
        );
        const { notificationsList } = await getNotificationsByUserID(
          attributes.sub
        );
        if (notificationsList) dispatch(setNotifications(notificationsList));

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
        if (data.getUser.chatRooms.items !== null) {
          dispatch(setChatRooms(data.getUser.chatRooms.items));
        }
        setIsLoading(false);
      } catch (e) {
        console.log('Error loading user data', e);
        setIsLoading(false);
      }
    })();
  }, []);

  Splash.propTypes = {
    setIsLoading: func,
  };

  return (
    <ThemedView
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <MyText type="title">🕰</MyText>
      <MyText type="title">Loading...</MyText>
    </ThemedView>
  );
}
