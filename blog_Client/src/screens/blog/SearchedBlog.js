import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import COLOR from "../../COLOR/COLOR";
import { AppBar, LoadingComp } from "../../component/Reuse/Reuse";
import { SingleBlog } from "../../component/SingleBlog";
import { APIURL } from "../../api";
import axios from "axios";
import { getMyFavBlogs } from "../../api/blogApi";

const SearchedBlog = ({ navigation, route }) => {
  const { value } = route.params;
  const [searchedBlogs, setSearchedBlogss] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyFavBlogs(setSearchedBlogss, value);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.lightBlue} />
      {loading ? (
        <LoadingComp />
      ) : (
        <>
          <View
            style={{
              paddingHorizontal: 15,
            }}
          >
            <AppBar navigation={navigation} text={value} />
          </View>
          <ScrollView>
            {searchedBlogs.length > 0 ? (
              searchedBlogs.map((blog, index) => (
                <SingleBlog blog={blog} key={index} />
              ))
            ) : (
              <View style={styles.emptyView}>
                <Text style={styles.emptyText}>NO BLOG RELEATED </Text>
                <Text style={styles.value}>{value}</Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default SearchedBlog;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  emptyView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  emptyText: {
    fontFamily: "Poppins-Bold",
    textTransform: "uppercase",
  },
  value: {
    fontFamily: "Poppins-Bold",
    textTransform: "uppercase",
    color: COLOR.red,
    fontSize: 16,
  },
});
