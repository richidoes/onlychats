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
          userID
          chatRoomID
          createdAt
          updatedAt
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
                }
              }
            }
            lastMessage {
              content
              createdAt
            }
          }
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
