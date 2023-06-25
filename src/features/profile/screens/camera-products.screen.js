import React, { useRef, useState, useEffect, useContext } from "react";
import { Camera, requestCameraPermissionsAsync } from "expo-camera";
import styled from "styled-components";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "../../../components/typography/text.component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContext } from "../../../resources/authentication/authentication.context";
import { storage } from "../../../utils/firebase/firebase.utils";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { ProfileButton } from "../components/profile.styles";
import { Image, View, Platform } from "react-native";

const ProfileCamera = styled(Camera)`
  width: 100%;
  height: 100%;
`;
export const CameraProductsScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [field, setField] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const snap = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 0.2,
      //base64: true,
    });

    //console.log(result);

    if (!result.canceled) {
      setField(result.assets[0].uri);
    }
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    //console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {image && (
        <Image
          source={{ uri: image }}
          style={{ flex: 0.5, width: 200, height: 200 }}
        />
      )}
      <ProfileButton
        icon="camera"
        mode="contained"
        title="Pick an image from camera roll"
        onPress={pickImage}
      />
      <ProfileButton
        title="tirar foto"
        onPress={snap}
        icon="camera"
        mode="contained"
      />
      {field && (
        <Image
          source={{ uri: field }}
          style={{ flex: 0.5, width: 200, height: 200 }}
        />
      )}
    </View>
  );
};
