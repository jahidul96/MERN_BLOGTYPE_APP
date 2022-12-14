import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Height, Width } from "../../../utils/Dimensions";
import COLOR from "../../COLOR/COLOR";
import ProfileComponent from "../../component/ProfileComponent";
import Entypo from "react-native-vector-icons/Entypo";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  AppBar,
  ButtonComp,
  Input,
  LoadingComp,
} from "../../component/Reuse/Reuse";

import { Tag } from "../../component/Tag";
import axios from "axios";
import { APIURL } from "../../api";
import { AuthContext, FavoriteContext } from "../../context/Context";
import { addFavToDb, getAccountData } from "../../api/userApi";
import { getThisBlogPost } from "../../api/blogApi";

const BlogDetails = ({ navigation, route }) => {
  const { data } = route.params;
  const [blog, setSingleBlog] = useState(null);
  const [loadding, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [spinner, setSpinner] = useState(false);
  const { user } = useContext(AuthContext);
  const [blogLikes, setBlogLikes] = useState([]);
  const [blogComments, setBlogComments] = useState([]);
  const [bloggerProfile, setBloggerProfile] = useState(null);
  const { favorites, setFavorites } = useContext(FavoriteContext);
  const { _id, postedBy } = data;

  const isLiked = blogLikes.filter((like) => like.likedBy == user.email);

  const isAlreadyFavorite = favorites.filter((fav) => fav == _id);

  useEffect(() => {
    getThisBlogPost(_id).then((data) => {
      setSingleBlog(data);
      setBlogLikes(data.likes);
      setBlogComments(data.comments);
    });
    getAccountData(postedBy._id).then((data) => {
      setBloggerProfile(data);
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const addToFavorite = () => {
    if (isAlreadyFavorite.length == 0) {
      const val = [...favorites, blog._id];
      setFavorites(val);
      addFavToDb(val, user._id).then((value) => {
        setFavorites(value);
      });
    } else {
      const val = favorites.filter((fav) => fav != blog._id);
      setFavorites(val);
      addFavToDb(val, user._id).then((value) => {
        setFavorites(value);
      });
    }
  };

  const newNotification = true;

  const commentonBlog = async (val, notifyVal) => {
    await axios.put(`${APIURL}/blog/comment/${blog?._id}`, val);

    await axios.put(`${APIURL}/user/follow/${postedBy._id}`, {
      val: bloggerProfile?.followers,
      notifyVal,
      newNotification,
    });
  };

  const likePost = async (val, notifyVal) => {
    await axios.put(`${APIURL}/blog/likeblog/${blog?._id}`, val);

    await axios.put(`${APIURL}/user/follow/${postedBy._id}`, {
      val: bloggerProfile?.followers,
      notifyVal,
      newNotification,
    });
  };

  const _likePost = () => {
    if (isLiked.length == 0) {
      let val = [
        ...blogLikes,
        {
          likedBy: user.email,
        },
      ];

      let notifyVal = [
        ...bloggerProfile?.notifications,
        {
          userEmail: user.email,
          username: user.username,
          type: "like",
        },
      ];
      likePost(val, notifyVal);
      setBlogLikes(val);
    } else {
      let val = blogLikes.filter((st) => st.likedBy != user.email);
      likePost(val);
      setBlogLikes(val);
    }
  };

  const _commentOnPost = () => {
    const val = [
      ...blogComments,
      { commentedBy: user.username, comment, createdAt: Date.now() },
    ];

    let notifyVal = [
      ...bloggerProfile?.notifications,
      {
        userEmail: user.email,
        username: user.username,
        type: "comment",
      },
    ];
    commentonBlog(val, notifyVal);
    setBlogComments(val);
    setComment("");
  };

  const fetchBlogByTag = async (tag) => {
    try {
      const res = await axios.get(`${APIURL}/searchbytag/${tag}`);
      navigation.navigate("FetchBlogByTag", { blogs: res.data.blogs, tag });
    } catch (error) {
      console.log(error);
    }
  };

  const seeProfile = () => {
    navigation.navigate("Profile", { writer: data?.postedBy });
  };
  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLOR.lightBlue} barStyle="light-content" />
      {loadding ? (
        <LoadingComp loadercolor={COLOR.lightBlue} text="LoadingBLOG..." />
      ) : (
        <>
          {spinner && <LoadingComp loadercolor={COLOR.red} />}
          <ImageBackground
            source={{ uri: data?.featuredImg }}
            style={styles.imgStyle}
          >
            <View style={styles.topContainer}>
              <AppBar color={COLOR.red} navigation={navigation} />
              <TouchableOpacity
                style={styles.likeContainer}
                onPress={() => _likePost(blog)}
              >
                <Fontisto
                  name="heart"
                  size={18}
                  color={isLiked?.length == 0 ? COLOR.white : COLOR.red}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.profileContainer}>
              <ProfileComponent
                extraColorStyle={styles.extraColorStyle}
                onPress={seeProfile}
                userData={data?.postedBy}
              />
              {blog?.postedBy._id == user?._id ? null : (
                <TouchableOpacity
                  style={[styles.likeContainer, { marginTop: 0 }]}
                  onPress={addToFavorite}
                >
                  <Fontisto
                    name="favorite"
                    size={20}
                    color={
                      isAlreadyFavorite.length > 0 ? COLOR.red : COLOR.white
                    }
                  />
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
          {/* likes comment and share */}
          <View style={styles.likeandDateWrapper}>
            <View style={styles.countMainContainer}>
              <CountComp text={blogLikes.length} name="heart" />
              <CountComp text={blogComments.length} name="message" />
              <CountComp text={blog?.click} name="eye" />
            </View>

            <Text style={[styles.time, { marginTop: 0 }]}>
              {blog?.createdAt.slice(0, 10)}
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 15,
            }}
          >
            <Tag tags={data?.tags} onPress={fetchBlogByTag} />
          </View>

          <ScrollView style={styles.bottomContentWrapper}>
            <View style={styles.descContainer}>
              <View
                style={{
                  paddingHorizontal: 15,
                }}
              >
                <Text style={styles.descText}>{data?.description}</Text>
              </View>
            </View>

            {/* comment comp */}

            <View style={styles.commentContainer}>
              {blogComments.length > 0 ? (
                blogComments.map((commentValue, index) => (
                  <Comments key={index} commentData={commentValue} />
                ))
              ) : (
                <View>
                  <Text style={styles.noCommentText}>
                    No comment Till now...
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.commentWriteWrapper} behavior="height">
              <Input
                placeholder="your comment"
                extraStyle={styles.extraInputStyle}
                multiline
                setValue={setComment}
                value={comment}
              />
              <ButtonComp
                text="Add"
                extraStyle={styles.extraButtonStyle}
                onPress={_commentOnPost}
              />
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default BlogDetails;

const CountComp = ({ text, name }) => (
  <View style={styles.countSingleContainer}>
    <Entypo name={name} size={16} style={{ marginRight: 5 }} />
    <Text style={styles.likesText}>{text}</Text>
  </View>
);

const Comments = ({ commentData }) => (
  <View style={styles.singleComment}>
    <Ionicons name="person-circle-sharp" size={28} />
    <View style={{ flex: 1 }}>
      <View style={styles.commenterNameContainer}>
        <Text style={styles.name}>{commentData?.commentedBy}</Text>
        <Text style={styles.commentText}>{commentData?.comment} </Text>
      </View>
      <Text style={styles.time}>
        {/* {commentData?.postedAt.toDate().toLocaleDateString()} */}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLOR.white,
    flex: 1,
  },

  imgStyle: {
    width: Width,
    height: Height / 4,
    justifyContent: "space-between",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  likeContainer: {
    backgroundColor: COLOR.darkGray,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    borderRadius: 100,
    marginTop: 10,
  },
  profileContainer: {
    width: Width,
    height: 60,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  extraColorStyle: {
    color: COLOR.white,
    elevation: 100,
  },
  bottomContentWrapper: {
    flex: 1,
  },
  likeandDateWrapper: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countMainContainer: {
    flexDirection: "row",

    marginVertical: 8,
  },
  countSingleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  likesText: {
    fontFamily: "Poppins-Bold",
  },
  descContainer: {
    width: Width,
    paddingBottom: 20,
    borderBottomColor: COLOR.gray,
    borderBottomWidth: 1,
  },
  descText: {
    fontFamily: "Poppins-Light",
    fontSize: 16,
    letterSpacing: 1,
    lineHeight: 30,
  },
  commentContainer: {
    width: Width,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  commentWriteWrapper: {
    height: 80,
    alignItems: "center",
    backgroundColor: COLOR.lightGray,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  extraInputStyle: {
    width: "70%",
    height: 55,
    borderRadius: 10,
  },
  extraButtonStyle: {
    width: "25%",
    height: 40,
    borderRadius: 10,
    backgroundColor: COLOR.lightBlue,
  },
  singleComment: {
    flexDirection: "row",
    marginBottom: 8,
  },
  commenterNameContainer: {
    marginLeft: 5,
    backgroundColor: COLOR.gray,
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  name: {
    fontFamily: "Poppins-Bold",
    color: COLOR.orangeRed,
    fontSize: 11,
  },
  commentText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },
  noCommentText: {
    fontFamily: "Poppins-Regular",
    borderBottomColor: COLOR.gray,
    width: "60%",
    color: COLOR.darkGray,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  time: {
    marginTop: 5,
    fontSize: 12,
    color: COLOR.darkGray,
  },
});
