import { API, graphqlOperation } from "aws-amplify";
import { createNotification } from "../graphql/mutations";
import { notificationsByUserID } from "../graphql/queries";

export async function createNotificationOnDB(
  senderID,
  receiverID,
  type,
  postID,
  chatRoomID
) {
  try {
    const { data } = await API.graphql({
      query: createNotification,
      variables: {
        input: {
          notificationSenderId: senderID,
          receiver: receiverID,
          type: type,
          postID: postID ?? "",
          chatRoomID: chatRoomID ?? "",
          isSeen: false,
        },
      },
    });
    console.log("notification created!");
    if (data.createNotification) {
      return data.createNotification;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getNotificationsByUserID(userID, nextToken) {
  try {
    const { data } = await API.graphql(
      graphqlOperation(notificationsByUserID, {
        receiver: userID,
        limit: 100,
        sortDirection: "DESC",
        nextToken: nextToken ?? null,
      })
    );
    return {
      nextTokenUtil: data.notificationsByUserID.nextToken ?? null,
      notificationsList: data.notificationsByUserID.items ?? null,
    };
  } catch (e) {
    console.log(e);
  }
}

export async function sendPushNotification(token, title, body, data, category) {
  if (token !== null) {
    const message = {
      to: token,
      sound: "default",
      title: title,
      body: body,
      data: data ?? {},
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
      categoryIdentifier: category ?? "",
    });
  }
  return;
}
