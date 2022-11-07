import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { homeStyles } from "./homeStyles";
import Tab from "../../component/Tab";
import COLOR from "../../COLOR/COLOR";
import ProfileComponent from "../../component/ProfileComponent";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppBar, LoadingComp } from "../../component/Reuse/Reuse";
import { APIURL } from "../../api";
import {
  getUserFromAsync,
  removeValueFromAsync,
} from "../../../utils/LocalStorage";
import { AuthContext, UpdatedContext } from "../../context/Context";

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState([]);
  const [myCategorieBlogs, setMyCategorieBlogs] = useState([]);
  const [myblogerProfile, setMyBloggerProfile] = useState(null);
  const { user, setUser } = useContext(AuthContext);
  const { updatedUser, setUpdatedUser } = useContext(UpdatedContext);

  // console.log("updatedUser", updatedUser);

  const goToAccount = () => {
    navigation.navigate("Account");
  };

  const goToNotification = async () => {
    await axios.put(`${APIURL}/user/notification/${user._id}`, {
      newNotification: false,
    });
    navigation.navigate("Notification", { myblogerProfile });
  };

  const getBlogs = async () => {
    try {
      const blogData = await axios.get(`${APIURL}/blog`);
      setAllBlogs(blogData.data.blog);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getMyAccount = async () => {
    const res = await axios.get(`${APIURL}/user/${user._id}`);
    setMyBloggerProfile(res.data.user);
    setUpdatedUser(res.data.user);

    // console.log("home user data", res.data.user);
  };

  const getMyFavBlogs = async () => {
    const favBlog = await axios.get(`${APIURL}/searchblog/${user.categorie}`);
    setMyCategorieBlogs(favBlog.data.blog);
    // console.log(favBlog.data.blog);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserFromAsync()
        .then((data) => {
          getBlogs();
          getMyFavBlogs();
          getMyAccount();
          setUser(data);
        })
        .catch((err) => console.log(err.message));
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={homeStyles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.lightBlue} />
      {loading ? (
        <LoadingComp
          text="LOADING..."
          loadercolor={COLOR.lightBlue}
          extraLoadderStyle={homeStyles.extraLoadderStyle}
        />
      ) : (
        <>
          <View style={homeStyles.profileWrapper}>
            <ProfileComponent onPress={goToAccount} userData={user} />
            <TouchableOpacity onPress={goToNotification}>
              <Feather name="bell" size={22} />
              {myblogerProfile?.newNotification == true && (
                <View style={styles.notifyView}></View>
              )}
            </TouchableOpacity>
          </View>
          <View style={homeStyles.contentWrapper}>
            <Tab allBlogs={allBlogs} myCategorieBlogs={myCategorieBlogs} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  btn: {
    marginTop: 50,
    marginLeft: 20,
  },
  notifyView: {
    position: "absolute",
    top: -2,
    right: 0,
    width: 10,
    height: 10,
    backgroundColor: COLOR.red,
    borderRadius: 100,
  },
});
