import { API, graphqlOperation } from 'aws-amplify';
import { Alert } from 'react-native';
import {
  updateUser,
  deleteUser as deleteUserMutation,
  createChatRoom,
  createUserChatRooms,
} from '../graphql/mutations';
import { getUser, listUsers } from '../graphql/queries';

export const updateUserPicture = async (userID, newPhoto) => {
  try {
    await API.graphql({
      query: updateUser,
      variables: {
        input: {
          id: userID,
          profilePicture: newPhoto,
        },
      },
    });
  } catch (e) {
    Alert.alert('Error updating user photo', e);
  }
};

export const updateUserStatus = async (userID, newStatus) => {
  try {
    await API.graphql({
      query: updateUser,
      variables: {
        input: {
          id: userID,
          status: newStatus,
        },
      },
    });
  } catch (e) {
    Alert.alert('Error updating user status', e);
  }
};

export const updateUserFirstName = async (userID, newFirstName) => {
  try {
    await API.graphql({
      query: updateUser,
      variables: {
        input: {
          id: userID,
          firstName: newFirstName,
        },
      },
    });
  } catch (e) {
    Alert.alert('Error updating user first name', e);
  }
};

export const updateUserLastName = async (userID, newLastName) => {
  try {
    await API.graphql({
      query: updateUser,
      variables: {
        input: {
          id: userID,
          lastName: newLastName,
        },
      },
    });
  } catch (e) {
    Alert.alert('Error updating user last name', e);
  }
};

export const updateUserNotificationToken = async (userID, token) => {
  try {
    await API.graphql({
      query: updateUser,
      variables: {
        input: {
          id: userID,
          notificationToken: token,
        },
      },
    });
  } catch (e) {
    Alert.alert('Error updating user push notification token', e);
  }
};

export const updateUserLocation = async (userID, location) => {
  const { latitude, longitude } = location;
  try {
    await API.graphql({
      query: updateUser,
      variables: {
        input: {
          id: userID,
          latitude,
          longitude,
        },
      },
    });
  } catch (e) {
    Alert.alert('Error updating user location', e);
  }
};

export const deleteUser = async userID => {
  try {
    await API.graphql({
      query: deleteUserMutation,
      variables: {
        input: {
          id: userID,
        },
      },
    });
  } catch (e) {
    Alert.alert('Error deleting user', e);
  }
};

export const getUserByID = async ID => {
  let user = null;
  try {
    const { data } = await API.graphql(
      graphqlOperation(getUser, {
        id: ID,
      })
    );
    if (data.getUser) {
      user = data.getUser;
    }
  } catch (e) {
    console.log('Error getting user data', e);
  }
  return user;
};

export const getUserByEmail = async email => {
  let user = null;
  try {
    const { data } = await API.graphql({
      query: listUsers,
      variables: {
        filter: {
          email: {
            eq: email,
          },
        },
      },
    });
    if (data.listUsers.items) {
      user = data.listUsers.items[0];
    }
  } catch (e) {
    console.log('Error getting user data', e);
  }
  return user;
};

export const createNewChatRoom = async () => {
  let chatRoomId = null;
  try {
    const { data } = await API.graphql({
      query: createChatRoom,
      variables: {
        input: {
          chatRoomLastMessageId: '92e2cfe1-b1fd-4273-82a9-b1fdd4af7070',
          isSeenBy: [],
        },
      },
    });
    if (data.createChatRoom) {
      chatRoomId = data.createChatRoom.id;
    }
  } catch (e) {
    console.log('Error creating chatRoom', e);
  }
  return chatRoomId;
};

export const addUserToChatRoom = async (userId, chatRoomId) => {
  try {
    await API.graphql({
      query: createUserChatRooms,
      variables: {
        input: {
          userId,
          chatRoomId,
        },
      },
    });
  } catch (e) {
    console.log('Error adding user to chatRoom', e);
  }
};
