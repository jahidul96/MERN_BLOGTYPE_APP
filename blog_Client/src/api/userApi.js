import axios from "axios";
import { APIURL } from "./index";

export const getMyAccount = async (routepath) => {
  try {
    await axios.get(`${APIURL}/${routepath}`);
  } catch (error) {
    console.log(error.message);
  }

  // console.log("home user data", res.data.user);
};
