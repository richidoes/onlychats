import * as React from "react";
import { View, Pressable, StyleSheet, Image } from "react-native";
import MyText from "../components/MyText";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { CLOUD_NAME, UPLOAD_PRESET } from "@env";
import { resetProfilePicture } from "../features/user";
import { updateUserPicture } from "../utils/userOperations";

function ProfileFallback({ firstName }) {
  return (
    <View style={styles.fallback}>
      <MyText style={styles.initialLetter}>{firstName[0]}</MyText>
    </View>
  );
}

export default function ProfilePicture() {
  const user = useSelector((state) => state.user);
  const { firstName, lastName, profilePicture, id } = user;
  const dispatch = useDispatch();

  const pickeImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      base64: true,
    });

    let base64Img = `data:image/jpg;base64,${result.base64}`;
    const data = new FormData();
    data.append("file", base64Img);
    data.append("upload_preset", UPLOAD_PRESET);

    if (!result.cancelled) {
      savePhotoInCloudinary(data);
    }
  };

  const savePhotoInCloudinary = async (data) => {
    let apiUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload/`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: data,
      });
      const json = await response.json();
      // save to db
      await updateUserPicture(id, json.url);
      // set image to redux
      dispatch(resetProfilePicture(json.url));
      console.log("image save to db and cloudinary", json.url);
    } catch (e) {
      console.log(e);
    }
  };

  // const updateUserPicture = async (newPhoto) => {
  //   try {
  //     await API.graphql({
  //       query: updateUser,
  //       variables: {
  //         input: {
  //           id: id,
  //           profilePicture: newPhoto,
  //         },
  //       },
  //     });
  //   } catch (e) {
  //     console.log("error updating user photo");
  //   }
  // };

  return (
    <View style={styles.container}>
      <Pressable onPress={pickeImage}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.image} />
        ) : (
          <ProfileFallback firstName={firstName} />
        )}
      </Pressable>
      <MyText style={{ fontWeight: "bold" }}>
        {firstName} {lastName}
      </MyText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
  fallback: {
    backgroundColor: "lightcoral",
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 6,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 6,
  },
  initialLetter: {
    fontSize: 60,
    lineHeight: 100,
    textAlign: "center",
    color: "white",
  },
});
