import { API, graphqlOperation } from 'aws-amplify';
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
    console.log('Error updating user photo: ', e);
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
    console.log('Error updating user status: ', e);
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
    console.log('Error updating user firstName: ', e);
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
    console.log('Error updating user lastName: ', e);
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
    console.log('Error updating user push notification token: ', e);
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
    console.log('Error updating user location: ', e);
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
    console.log('Error deleting user: ', e);
  }
};

export const getUserByID = async ID => {
  try {
    const { data } = await API.graphql(
      graphqlOperation(getUser, {
        id: ID,
      })
    );
    if (data.getUser) {
      return data.getUser;
    }
  } catch (e) {
    console.log('Error getting user by ID: ', e);
  }

  return null;
};

export const getUserByEmail = async email => {
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
      return data.listUsers.items[0];
    }
  } catch (e) {
    console.log('Error getting user by Email: ', e);
  }

  return null;
};

export const createNewChatRoom = async () => {
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
      return data.createChatRoom.id;
    }
  } catch (e) {
    console.log('Error creating new chatRoom: ', e);
  }

  return null;
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
    console.log('Error adding user to chatRoom: ', e);
  }
};
