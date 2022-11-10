import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AppBar,
  ButtonComp,
  LoadingComp,
  NormalBtn,
} from "../../component/Reuse/Reuse";
import { accountStyles } from "./AccountStyle";
import Feather from "react-native-vector-icons/Feather";

import COLOR from "../../COLOR/COLOR";
import { AuthContext, UpdatedContext } from "../../context/Context";
import { removeValueFromAsync } from "../../../utils/LocalStorage";
import { uploadFileToStorage } from "../../firebase/FbFireStore";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { APIURL } from "../../api";

const img = "http://cdn.onlinewebfonts.com/svg/img_550782.png";

const Account = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const { updatedUser, setUpdatedUser } = useContext(UpdatedContext);

  const logout = () => {
    setUploading(true);
    setTimeout(() => {
      removeValueFromAsync();
      setUser(null);
      navigation.navigate("Register");
      setUploading(false);
    }, 1500);
  };

  const _pickDocument = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      setShow(true);
    }
  };

  const uploadProfilePic = async () => {
    setUploading(true);
    uploadFileToStorage(image).then(async (url) => {
      console.log("url", url);
      try {
        const res = await axios.put(
          `${APIURL}/user/updateprofilepic/${user._id}`,
          { url }
        );
        setUploading(false);
        setShow(false);
        console.log(res.data);
        setUpdatedUser(res.data.user);
      } catch (error) {
        console.log(error);
        setUploading(false);
        setShow(false);
      }
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLOR.white, flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.lightBlue} />
      {uploading && <LoadingComp loadercolor={COLOR.red} />}
      <View style={{ paddingHorizontal: 20 }}>
        <AppBar text="Account" navigation={navigation} />
      </View>
      <ScrollView style={accountStyles.contentWrapper}>
        <View style={accountStyles.profileContainer}>
          <View style={accountStyles.profileImageWrapper}>
            <Image
              source={{
                uri: updatedUser?.profileImg ? updatedUser?.profileImg : img,
              }}
              style={accountStyles.imgStyle}
            />
            <Text style={accountStyles.name}>
              {updatedUser?.username ? updatedUser?.username : "Username"}
            </Text>
            <Text style={accountStyles.email}>
              {updatedUser?.email ? updatedUser?.email : "user@gmail.com"}
            </Text>
          </View>
        </View>
        {show && image ? (
          <ImageModel
            image={image}
            uploadProfilePic={uploadProfilePic}
            onPress={_pickDocument}
          />
        ) : null}
        <AccountBtnComp
          text="Upload A Profile Picture"
          icon={
            <Feather name="chevron-right" size={22} color={COLOR.lightBlue} />
          }
          onPress={_pickDocument}
        />
        <AccountBtnComp
          text="Profile"
          icon={
            <Feather name="chevron-right" size={22} color={COLOR.lightBlue} />
          }
          onPress={() =>
            navigation.navigate("Profile", { writer: updatedUser })
          }
        />
        <AccountBtnComp
          text="Post a Blog"
          icon={
            <Feather name="chevron-right" size={22} color={COLOR.lightBlue} />
          }
          onPress={() => navigation.navigate("PostBlog")}
        />
        <AccountBtnComp
          text="Favorites"
          icon={
            <Feather name="chevron-right" size={22} color={COLOR.lightBlue} />
          }
          onPress={() => navigation.navigate("Favorites")}
        />
        <AccountBtnComp
          text="Password & Security"
          icon={
            <Feather name="chevron-right" size={22} color={COLOR.lightBlue} />
          }
          onPress={() => navigation.navigate("ResetPassword")}
        />
        <View style={{ marginTop: 15 }}>
          <NormalBtn text="Log Out" onPress={logout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const AccountBtnComp = ({ text, icon, onPress }) => (
  <TouchableOpacity style={accountStyles.btnContainer}>
    <NormalBtn text={text} onPress={onPress} />
    {icon}
  </TouchableOpacity>
);

const ImageModel = ({ image, uploadProfilePic, onPress }) => (
  <View style={accountStyles.imageModel}>
    {image ? (
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: image }} style={accountStyles.selectedImgStyle} />
      </TouchableOpacity>
    ) : null}
    <ButtonComp
      text="Upload"
      extraStyle={{ width: "50%", borderRadius: 5, height: 35 }}
      extraTextStyle={{ fontSize: 14 }}
      onPress={uploadProfilePic}
    />
  </View>
);

export default Account;
