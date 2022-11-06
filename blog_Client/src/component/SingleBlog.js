import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import COLOR from "../COLOR/COLOR";
import ProfileComponent from "./ProfileComponent";
import Entypo from "react-native-vector-icons/Entypo";
import axios from "axios";
import { APIURL } from "../api";
import { AuthContext } from "../context/Context";

export const SingleBlog = ({ blog, favorite, onPress }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const loggedUser = {};

  const isAlreadyFavorite = [];
  // const { postedBy } = value;

  // console.log("blogdata", blog);

  // console.log("user", user);

  const addtoFavorite = () => {};

  const _seeBlogDetails = async () => {
    axios
      .put(`${APIURL}/blog/${blog._id}`)
      .then(() => {
        navigation.navigate("BlogDetails", { data: blog });
      })
      .catch((err) => {
        console.log(err.message);
        navigation.navigate("BlogDetails", { data: blog });
      });
  };

  const _seeMyFavBlogDetails = () => {
    // const { postId } = blog.value;
    // navigation.navigate("BlogDetails", { id: postId, value });
  };

  const seeProfile = () => {
    navigation.navigate("Profile", { writer: blog?.postedBy });
  };
  return (
    <View
      style={{
        marginBottom: 15,
      }}
    >
      <View style={styles.profileContainer}>
        <ProfileComponent onPress={seeProfile} userData={blog?.postedBy} />

        {favorite ? (
          <TouchableOpacity
            style={styles.popupBtn}
            onPress={() => onPress(blog)}
          >
            <Entypo name="circle-with-minus" size={28} color={COLOR.red} />
          </TouchableOpacity>
        ) : (
          <>
            {blog?.postedBy?._id == user?._id ? null : (
              <TouchableOpacity style={styles.popupBtn} onPress={addtoFavorite}>
                <Entypo
                  name={
                    isAlreadyFavorite.length > 0
                      ? "circle-with-minus"
                      : "circle-with-plus"
                  }
                  size={28}
                  color={
                    isAlreadyFavorite.length > 0 ? COLOR.red : COLOR.lightBlue
                  }
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      <View>
        <Image source={{ uri: blog?.featuredImg }} style={styles.imgStyle} />
        <View style={styles.horizontalPadding}>
          <Text style={styles.blogText}>
            {blog?.description.length > 150
              ? blog.description.slice(0, 100) + "..."
              : blog.description}
          </Text>
          {favorite ? (
            <TouchableOpacity
              style={styles.readmoreBtn}
              onPress={_seeMyFavBlogDetails}
            >
              <Text style={styles.readmoreText}>Read more</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.readmoreBtn}
              onPress={_seeBlogDetails}
            >
              <Text style={styles.readmoreText}>Read more</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imgStyle: {
    width: "100%",
    height: 150,
  },
  profileContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  blogText: {
    fontFamily: "Poppins-Regular",
    letterSpacing: 0.7,
    marginVertical: 5,
    lineHeight: 26,
  },
  horizontalPadding: {
    paddingHorizontal: 10,
  },
  readmoreBtn: {},
  readmoreText: {
    fontFamily: "Poppins-Bold",
    borderBottomColor: COLOR.lightBlue,
    borderBottomWidth: 1,
    alignSelf: "flex-start",
  },
});
