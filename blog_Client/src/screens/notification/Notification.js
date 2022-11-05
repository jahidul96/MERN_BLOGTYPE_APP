import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import COLOR from "../../COLOR/COLOR";

import { AppBar, LoadingComp } from "../../component/Reuse/Reuse";

const Notification = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.lightBlue} />
      {loading ? (
        <LoadingComp loadercolor={COLOR.lightBlue} />
      ) : (
        <>
          <View
            style={{
              paddingHorizontal: 15,
            }}
          >
            <AppBar navigation={navigation} text="Notifications" />
          </View>
          <ScrollView style={styles.contentWrapper}>
            <Text style={styles.emptyText}>No Notification</Text>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  contentWrapper: {
    paddingVertical: 10,
  },
  NotificationView: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: COLOR.lightGray,
    marginBottom: 10,
  },
  name: {
    fontFamily: "Poppins-Bold",
    color: COLOR.lightBlue,
    fontSize: 16,
  },
  text: {
    fontFamily: "Poppins-Regular",
  },
  emptyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});
