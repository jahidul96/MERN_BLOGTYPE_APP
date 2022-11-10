import axios from "axios";
import { APIURL } from "./index";

export const getAccountData = async (id) => {
  try {
    const res = await axios.get(`${APIURL}/user/${id}`);

    return res.data.user;
  } catch (error) {
    console.log(error.message);
  }
};

export const addFavToDb = async (val, id) => {
  try {
    const res = await axios.put(`${APIURL}/user/addtofavorites/${id}`, val);
    return res.data.user.favorites;
  } catch (error) {
    console.log(error);
  }
};
