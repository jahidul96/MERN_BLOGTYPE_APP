import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Height, Width } from "../../../utils/Dimensions";
import COLOR from "../../COLOR/COLOR";
import { AppBar, LoadingComp } from "../../component/Reuse/Reuse";

import { SingleBlog } from "../../component/SingleBlog";
import { AuthContext } from "../../context/Context";

const img = "http://cdn.onlinewebfonts.com/svg/img_550782.png";

const Profile = ({ navigation, route }) => {
  const [loadding, setLoading] = useState(true);
  const [myBlogs, setMyBlogs] = useState([]);
  const [blogerProfile, setBlogerProfile] = useState({});
  // const { user } = route.params;
  const { user, setUser } = useContext(AuthContext);

  const isFollowedAlready = [];

  const loggedUser = {};

  const followThisUser = () => {
    // console.log(user);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // console.log("myBlogs", myBlogs);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLOR.lightBlue} barStyle="light-content" />
      {loadding ? (
        <LoadingComp loadercolor={COLOR.lightBlue} />
      ) : (
        <>
          <View style={{ paddingHorizontal: 15 }}>
            <AppBar navigation={navigation} />
          </View>
          <ScrollView
            contentContainerStyle={styles.mainwrapper}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profileImageWrapper}>
              <Image
                source={{
                  uri: user?.profileImg ? user?.profileImg : img,
                }}
                style={styles.imgStyle}
              />
              <Text style={styles.name}>{user?.username}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
            <View style={styles.postContainer}>
              {user.uid == loggedUser.uid ? null : isFollowedAlready?.length >
                0 ? (
                <Counter text="UnFollow" btn onPress={followThisUser} />
              ) : (
                <Counter text="Follow" btn onPress={followThisUser} />
              )}

              <Counter
                user={user}
                loggedUser={loggedUser}
                total={myBlogs?.length}
                text="Blog"
              />

              <Counter
                user={user}
                loggedUser={loggedUser}
                total={blogerProfile?.followers?.length}
                text="Follower's"
              />
            </View>
            <Text style={styles.postText}>
              {user.uid == loggedUser.uid
                ? "MY BLOGS"
                : `${user.username} Blogs`}
            </Text>
            <View>
              {myBlogs.length > 0 ? (
                myBlogs.map((blog, index) => (
                  <SingleBlog blog={blog} key={index} myBlog={true} />
                ))
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    No Blog Till Now!
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const Counter = ({ total, text, btn, user, loggedUser, onPress }) => (
  <>
    {btn ? (
      <TouchableOpacity
        style={[styles.counterWrapper, { backgroundColor: COLOR.lightBlue }]}
        onPress={onPress}
      >
        <Text style={[styles.text, { color: COLOR.white }]}>{text}</Text>
      </TouchableOpacity>
    ) : (
      <View
        style={[
          styles.counterWrapper,
          user.uid == loggedUser.uid && {
            width: Width / 2.7,
          },
        ]}
      >
        <Text style={styles.total}>{total}</Text>
        <Text style={[styles.text]}>{text}</Text>
      </View>
    )}
  </>
);

export default Profile;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mainwrapper: {
    paddingBottom: 10,
  },
  profileImageWrapper: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomColor: COLOR.lightGray,
    borderBottomWidth: 1,
  },

  name: {
    fontSize: 17,
    fontFamily: "Poppins-Regular",
    letterSpacing: 1,
  },
  email: {
    marginTop: 3,
    letterSpacing: 1,
    color: COLOR.darkGray,
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 17,
    marginBottom: 7,
  },
  imgStyle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 10,
    marginTop: 10,
  },
  postContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  counterWrapper: {
    width: Width / 3.5,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.lightGray,
    elevation: 2,
    borderRadius: 5,
    marginRight: 5,
  },
  total: {
    fontFamily: "Poppins-Regular",
    marginBottom: -3,
  },
  text: {
    fontFamily: "Poppins-Bold",
  },
  postText: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  mypostContainer: {
    marginTop: 10,
    backgroundColor: COLOR.white,
    elevation: 2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  postContentWrapper: {
    marginVertical: 12,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "flex-end",
    width: "50%",
    marginVertical: 5,
  },
  flexStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconStyle: {
    marginRight: 7,
  },
});
