import { API, graphqlOperation } from 'aws-amplify';
import {
  deletePost as deletePostMutation,
  createPost as createPostMutation,
  updatePost,
} from '../graphql/mutations';

export const createPost = async (authorID, postContent) => {
  try {
    const newPost = await API.graphql({
      query: createPostMutation,
      variables: {
        input: {
          content: postContent,
          postAuthorId: authorID,
          numberOfLikes: 0,
          likedBy: [],
        },
      },
    });

    return newPost;
  } catch (e) {
    console.log('Error creating post: ', e);
  }

  return { data: {} };
};

export const deletePost = async postID => {
  try {
    await API.graphql({
      query: deletePostMutation,
      variables: {
        input: {
          id: postID,
        },
      },
    });
  } catch (e) {
    console.log('Error deleting post: ', e);
  }
};

export const incrementLikesMutation = async (
  postID,
  likedBy,
  numberOfLikes,
  userID
) => {
  try {
    await API.graphql(
      graphqlOperation(updatePost, {
        input: {
          id: postID,
          likedBy: likedBy.concat(userID),
          numberOfLikes: numberOfLikes + 1,
        },
      })
    );
  } catch (e) {
    console.log('Error liking post: ', e);
  }
};

export const decrementLikesMutation = async (
  postID,
  likedBy,
  numberOfLikes,
  userID
) => {
  try {
    await API.graphql(
      graphqlOperation(updatePost, {
        input: {
          id: postID,
          likedBy: likedBy.filter(id => id !== userID),
          numberOfLikes: numberOfLikes - 1,
        },
      })
    );
  } catch (e) {
    console.log('Error disliking post: ', e);
  }
};
