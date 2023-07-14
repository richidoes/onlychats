import * as React from "react";
import { useColorScheme, View as DefaultView } from "react-native";
import Colors from "../../../constants/colors";

export function useThemeColor({ light, dark }) {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? dark : light;
}

export function View(props) {
  const theme = useColorScheme();
  const { style, ...otherProps } = props;

  return (
    <DefaultView
      style={[
        { backgroundColor: Colors[theme].background, paddingHorizontal: 17 },
        style,
      ]}
      {...otherProps}
    />
  );
}
