import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import MyText from "./MyText";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/colors";

export default function ListHeader({ title, iconName, handleNavigation }) {
  return (
    <View style={styles.container}>
      <MyText type="title">{title}</MyText>
      <Pressable onPress={handleNavigation}>
        <Ionicons
          size={30}
          style={{ marginBottom: -3 }}
          name={iconName}
          color={Colors.light.tabIconSelected}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 17,
    marginVertical: 23,
  },
});
