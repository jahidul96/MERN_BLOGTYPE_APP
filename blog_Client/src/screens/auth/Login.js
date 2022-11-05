import { Alert, Image, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { authStyles } from "./authStyles";

import {
  ButtonComp,
  Input,
  LinkTextComp,
  LoadingComp,
} from "../../component/Reuse/Reuse";
import COLOR from "../../COLOR/COLOR";
import axios from "axios";
import { APIURL } from "../../api";
import { AuthContext } from "../../context/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const img =
  "https://cdn2.iconfinder.com/data/icons/aami-web-internet/64/aami4-02-512.png";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);

  const login = async () => {
    if (!email || !password) {
      return Alert.alert("All Field Required!");
    }

    setLoading(true);

    const data = { email: email.toLowerCase(), password };

    try {
      const response = await axios.post(`${APIURL}/login`, data);

      const value = response.data.user;
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);

      setUser(value);

      setLoading(false);
      setTimeout(() => {
        navigation.navigate("Home");
      }, 1500);
      Alert.alert("LOGIN SUCCESFUL!");
    } catch (error) {
      console.log("user not found!");
      setLoading(false);
    }
  };
  return (
    <View style={authStyles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLOR.orangeRed} />
      {loading && (
        <LoadingComp
          text="LOGINGIN..."
          loadercolor={COLOR.lightBlue}
          textColor={COLOR.lightBlue}
          extraLoadderStyle={authStyles.extraLoadderStyle}
        />
      )}
      <View style={authStyles.imgContainer}>
        <Image source={{ uri: img }} style={authStyles.imgStyle} />
      </View>
      <Input placeholder="Email" setValue={setEmail} />
      <Input placeholder="Password" setValue={setPassword} secureTextEntry />
      {loading ? null : <ButtonComp text="LOGIN" onPress={login} />}
      <LinkTextComp
        text="Forgot Password ?"
        pageNavigation={() => navigation.navigate("ResetPassword")}
        textClick
      />
      <LinkTextComp
        text="Don't Have An Account ?"
        linkText="SIGNIN"
        pageNavigation={() => navigation.navigate("Register")}
        extraStyle={{ marginTop: 15 }}
      />
    </View>
  );
};

export default Login;
