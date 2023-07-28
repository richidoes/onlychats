import { API, graphqlOperation } from "aws-amplify";
import {
  deletePost as deletePostMutation,
  createPost as createPostMutation,
  updatePost,
} from "../graphql/mutations";

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
    console.log("post created success");
    return newPost;
  } catch (e) {
    console.log(e, "error creating post");
  }
};

export const deletePost = async (postID) => {
  try {
    await API.graphql({
      query: deletePostMutation,
      variables: {
        input: {
          id: postID,
        },
      },
    });
    console.log("post deleted successfully");
  } catch (e) {
    console.log("error deleting post");
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
    console.log("post liked successfully");
  } catch (e) {
    console.log("error liking post");
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
          likedBy: likedBy.filter((id) => id !== userID),
          numberOfLikes: numberOfLikes - 1,
        },
      })
    );
    console.log("post disliked successfully");
  } catch (e) {
    console.log("error disliking post");
  }
};
