import * as React from "react";
import MyText from "./MyText";
import { Button, ScrollView, View as NativeView } from "react-native";
import { API, graphqlOperation } from "aws-amplify";
import { listTodos } from "../graphql/queries";
import { deleteTodo, updateTodo } from "../graphql/mutations";
import AddTodo from "./AddTodo";
import { View } from "./themed/Themed";

export default function ListTodos() {
  const [todos, setTodos] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const { data } = await API.graphql(graphqlOperation(listTodos));
      setTodos(data.listTodos.items);
    })();
  }, []);

  const handleDeleteTodo = async (id) => {
    await API.graphql(graphqlOperation(deleteTodo, { input: { id } }));
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    console.log("Todo deleted!");
  };

  const handleUpdateTodo = async (id, name) => {
    await API.graphql(graphqlOperation(updateTodo, { input: { id, name } }));
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, name } : todo))
    );
    console.log("Todo updated!");
  };

  // commented because error

  // React.useEffect(() => {
  //   (async () => {
  //     try {
  //       const subscription = await API.graphql({
  //         query: onCreateTodo,
  //       }).subscribe({
  //         next: (eventData) => {
  //           console.log(eventData);
  //           const newTodo = eventData.value.data.onCreateTodo;
  //           setTodos([...todos, newTodo]);
  //         },
  //       });
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   })();
  // }, []);

  return (
    <View style={{ flex: 1 }}>
      <AddTodo setTodos={setTodos} />
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <MyText type="title">Todos</MyText>
        {todos.map((todo) => (
          <NativeView
            key={todo.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MyText>{todo.name}</MyText>
            <NativeView
              style={{
                flexDirection: "row",
              }}
            >
              <Button title="Edit" onPress={() => {}} />
              <Button
                title="Delete"
                color={"red"}
                onPress={() => handleDeleteTodo(todo.id)}
              />
            </NativeView>
          </NativeView>
        ))}
      </ScrollView>
    </View>
  );
}
