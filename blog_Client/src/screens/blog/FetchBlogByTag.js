import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import COLOR from "../../COLOR/COLOR";
import { AppBar, LoadingComp } from "../../component/Reuse/Reuse";
import { SingleBlog } from "../../component/SingleBlog";

const FetchBlogByTag = ({ route }) => {
  const navigation = useNavigation();
  const { blogs, tag } = route.params;
  const [loadding, setLoading] = useState(true);
  const [tagMatchBlogs, setTagMatchBlogs] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={COLOR.lightBlue} barStyle="light-content" />
      {loadding ? (
        <LoadingComp loadercolor={COLOR.lightBlue} />
      ) : (
        <>
          <View
            style={{
              paddingHorizontal: 15,
            }}
          >
            <AppBar navigation={navigation} text={tag} />
          </View>
          <ScrollView>
            <View>
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
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

export default FetchBlogByTag;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
