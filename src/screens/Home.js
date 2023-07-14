import * as React from "react";
import { StatusBar, useColorScheme } from "react-native";
import ListTodos from "../components/ListTodos";

export default function Home() {
  const theme = useColorScheme();
  return (
    <>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <ListTodos />
    </>
  );
}
