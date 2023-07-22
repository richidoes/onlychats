export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      firstName
      lastName
      profilePicture
      email
      status
      notificationToken
      latitude
      longitude
      chatRooms {
        items {
          id
          userId
          chatRoomId
          createdAt
          updatedAt
          __typename
          chatRoom {
            id
            isSeenBy
            participants {
              items {
                user {
                  id
                  firstName
                  lastName
                  profilePicture
                  notificationToken
                  __typename
                }
                __typename
              }
            }
            lastMessage {
              content
              createdAt
              __typename
            }
            __typename
          }
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
