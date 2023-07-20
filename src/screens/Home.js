import * as React from "react";
import MyText from "../components/MyText";
import { useNavigation } from "@react-navigation/native";
import { View } from "../components/themed/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, graphqlOperation } from "aws-amplify";
import { postsByDate } from "../graphql/queries";
import { FlashList } from "@shopify/flash-list";
import ListHeader from "../components/ListHeader";
import { Button } from "react-native";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setPostsReducer } from "../features/posts";

export default function Home() {
  const navigation = useNavigation();
  const { posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [nextToken, setNextToken] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function checkFirstLaunch() {
      const firstLaunch = await AsyncStorage.getItem("@firstLaunch");
      if (firstLaunch === null) navigation.navigate("Onboarding");
    }
    checkFirstLaunch();
    fetchPost();
  }, []);

  async function fetchPost() {
    const { data } = await API.graphql(
      graphqlOperation(postsByDate, {
        type: "Post",
        sortDirection: "DESC",
        limit: 100,
      })
    );
    dispatch(setPostsReducer(data.postsByDate.items));
    setNextToken(data.postsByDate.nextToken);
    setIsLoading(false);
    // console.log(data.postsByDate.nextToken);
  }

  async function fetchMorePost() {
    if (nextToken) {
      setIsLoading(true);
      const { data } = await API.graphql(
        graphqlOperation(postsByDate, {
          type: "Post",
          sortDirection: "DESC",
          limit: 100,
          nextToken: nextToken,
        })
      );
      setPosts([...posts, ...data.postsByDate.items]);
      setNextToken(data.postsByDate.nextToken);
      if (data.postsByDate.nextToken === null) {
        alert("No more posts to load 🤯");
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    // console.log(data.postsByDate.items);
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 0 }}>
      <FlashList
        data={posts}
        renderItem={({ item }) => <PostCard {...item} />}
        contentContainerStyle={Platform.OS === "ios" && { paddingVertical: 30 }}
        estimatedItemSize={200}
        ListHeaderComponent={() => (
          <ListHeader
            title={"Posts"}
            iconName="add-circle-sharp"
            handleNavigation={() => navigation.navigate("NewPost")}
          />
        )}
        ListFooterComponent={() => (
          <Button
            onPress={fetchMorePost}
            title={isLoading ? "loading" : "load more posts"}
            disabled={isLoading || nextToken === null}
          />
        )}
      />
    </View>
  );
}
