import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import React, { useCallback, useEffect, useState } from "react";

import Home from "./src/screens/home/Home";
import Register from "./src/screens/auth/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Login from "./src/screens/auth/Login";
import ResetPassword from "./src/screens/auth/ResetPassword";
import Account from "./src/screens/account/Account";
import Favorites from "./src/screens/favorite/Favorites";
import Notification from "./src/screens/notification/Notification";

import Profile from "./src/screens/profile/Profile";
// import BlogDetails from "./src/screens/blog/BlogDetails";

// import PostBlog from "./src/screens/blog/PostBlog";

// import SearchedBlog from "./src/screens/blog/SearchedBlog";

// import FetchBlogByTag from "./src/screens/blog/FetchBlogByTag";

const Stack = createNativeStackNavigator();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
          "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
          "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <NavigationContainer onLayout={onLayoutRootView}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Favorites" component={Favorites} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
