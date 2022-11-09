import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import COLOR from "../../COLOR/COLOR";
import { AppBar, LoadingComp } from "../../component/Reuse/Reuse";
import { useNavigation } from "@react-navigation/native";

import { SingleBlog } from "../../component/SingleBlog";
import { AuthContext, FavoriteContext } from "../../context/Context";
import axios from "axios";
import { APIURL } from "../../api";

const Favorites = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { favorites, setFavorites } = useContext(FavoriteContext);
  const [favoriteBlog, setFavoriteBlog] = useState([]);

  console.log("favoriteBlogs", favoriteBlog);

  const removefromDb = async (val) => {
    await axios.put(`${APIURL}/user/addtofavorites/${user._id}`, val);
  };
  const removeFromFavorite = (data) => {
    const val = favorites?.filter((fav) => fav._id != data._id);
    setFavorites(val);
    removefromDb(val);
  };

  const getMyAccount = async () => {
    try {
      const res = await axios.get(`${APIURL}/user/favorite/${user._id}`);

      setFavoriteBlog(res.data.user.favorites);
    } catch (error) {
      console.log(error);
    }

    // console.log("home user data", res.data.user);
  };

  useEffect(() => {
    getMyAccount();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  //   console.log("favoriteBlog", favoriteBlogs);
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.lightBlue} />
      {loading ? (
        <LoadingComp loadercolor={COLOR.lightBlue} />
      ) : (
        <>
          <View style={styles.paddingHorizontal}>
            <AppBar text="Favorite" navigation={navigation} />
          </View>

          <ScrollView
            style={{
              flex: 1,
            }}
          >
            {favoriteBlog.length > 0 ? (
              favoriteBlog.map((blog, i) => (
                <SingleBlog
                  blog={blog}
                  key={i}
                  favorite={true}
                  onPress={removeFromFavorite}
                />
              ))
            ) : (
              <View style={styles.emptyView}>
                <Text>NO FAVORITE TILL NOW</Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  paddingHorizontal: {
    paddingHorizontal: 15,
  },
  emptyView: {
    marginTop: 30,
    alignItems: "center",
  },
});
