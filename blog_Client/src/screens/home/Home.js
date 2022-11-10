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
import { getUserFromAsync } from "../../../utils/LocalStorage";
import {
  AuthContext,
  FavoriteContext,
  UpdatedContext,
} from "../../context/Context";
import { getAccountData } from "../../api/userApi";
import { getBlogs, getMyFavBlogs } from "../../api/blogApi";

const Home = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState([]);
  const [myCategorieBlogs, setMyCategorieBlogs] = useState([]);
  const [myblogerProfile, setMyBloggerProfile] = useState(null);
  const { user, setUser } = useContext(AuthContext);
  const { updatedUser, setUpdatedUser } = useContext(UpdatedContext);
  const { setFavorites } = useContext(FavoriteContext);

  const goToAccount = () => {
    navigation.navigate("Account");
  };

  const goToNotification = async () => {
    await axios.put(`${APIURL}/user/notification/${user._id}`, {
      newNotification: false,
    });
    navigation.navigate("Notification", { myblogerProfile });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserFromAsync()
        .then((data) => {
          getBlogs(setAllBlogs);
          getMyFavBlogs(setMyCategorieBlogs, data.categorie);
          getAccountData(data._id)
            .then((value) => {
              setMyBloggerProfile(value);
              setUpdatedUser(value);
              setFavorites(value.favorites);
            })
            .catch((err) => {
              console.log(err.message);
            });
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
            <ProfileComponent onPress={goToAccount} userData={updatedUser} />
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
