import * as React from 'react';
import { useRoute } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';
import { ThemedView } from '../components/Themed';
import { getPost } from '../graphql/queries';
import PostCard from '../components/PostCard';

export default function ShowPost() {
  const route = useRoute();
  const { postID } = route.params;
  const [post, setPost] = React.useState();

  React.useEffect(() => {
    getPostByID();
  }, []);

  async function getPostByID() {
    const { data } = await API.graphql(
      graphqlOperation(getPost, {
        id: postID,
      })
    );
    setPost(data.getPost);
  }

  if (post === undefined) return null;

  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 0 }}>
      <PostCard post={post} />
    </ThemedView>
  );
}
