import { API } from "aws-amplify";
import {
  updateUser,
  deleteUser as deleteUserMutation,
} from "../graphql/mutations";

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
    console.log("profile picture updated");
  } catch (e) {
    console.log("error updating user photo");
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
    console.log("user status updated");
  } catch (e) {
    console.log("error updating user status");
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
    console.log("user firstName updated");
  } catch (e) {
    console.log("error updating user firstName");
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
    console.log("user lastName updated");
  } catch (e) {
    console.log("error updating user lastName");
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
    console.log("user push notification token updated");
  } catch (e) {
    console.log("error updating user push notification token");
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
          latitude: latitude,
          longitude: longitude,
        },
      },
    });
    console.log("user location updated");
  } catch (e) {
    console.log("error updating user location");
  }
};

export const deleteUser = async (userID) => {
  try {
    await API.graphql({
      query: deleteUserMutation,
      variables: {
        input: {
          id: userID,
        },
      },
    });
    console.log("user deleted successfully");
  } catch (e) {
    console.log("error deleting user");
  }
};
