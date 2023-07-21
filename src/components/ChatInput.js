import * as React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  Pressable,
  useColorScheme,
} from "react-native";
import Colors from "../../constants/colors";

export default function ChatInput({ chatRoomID }) {
  const [text, setText] = React.useState("");
  const theme = useColorScheme();

  return (
    <View style={styles.textInputBar}>
      <TextInput
        style={[
          styles.textInput,
          {
            borderColor: Colors[theme].text + "65",
            color: Colors[theme].text,
            backgroundColor: theme === "dark" ? "#000" : "#fff",
          },
        ]}
        placeholder="Go to codewithbeto.dev :)"
        placeholderTextColor="gray"
        scrollEnabled={true}
        textAlign="left"
        textAlignVertical="bottom"
        onChangeText={setText}
        defaultValue={text}
        multiline
      />
      <Pressable style={styles.sendButtonWrapper}>
        <Image
          style={[
            styles.sendButton,
            text.length < 1 ? { opacity: 0.3 } : { opacity: 1 },
          ]}
          source={
            theme === "light"
              ? require("../../assets/send.png")
              : require("../../assets/sendDark.png")
          }
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputBar: {
    width: "95%",
    flexDirection: "row",
    alignSelf: "center",
    flexGrow: 0,
  },
  textInput: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    marginVertical: 8,
    paddingVertical: 8,
    paddingTop: 8,
    paddingRight: 40,
    flexGrow: 0,
    minWidth: "95%",
  },
  sendButtonWrapper: {
    position: "absolute",
    bottom: -4,
    right: -8,
    width: 44,
    height: 44,
    flexShrink: 0,
  },
  sendButton: {
    width: 28,
    height: 28,
  },
});
