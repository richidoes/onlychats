import * as React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createTodo } from "../graphql/mutations";
import { Button } from "react-native";
import { View } from "./themed/Themed";
import MyInput from "./MyInput";

export default function AddTodo({ setTodos }) {
  const [name, setName] = React.useState("");

  const handleSubmit = async () => {
    const { data } = await API.graphql(
      graphqlOperation(createTodo, {
        input: {
          name,
        },
      })
    );
    setName("");
    setTodos((prevTodos) => [...prevTodos, data.createTodo]);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
      }}
    >
      <MyInput label={"Create Todo"} value={name} onChangeText={setName} />
      <Button title="Add" onPress={handleSubmit} />
    </View>
  );
}
