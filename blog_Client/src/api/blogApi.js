import axios from "axios";
import { AuthContext } from "../context/Context";
import { APIURL } from "./index";

export const getBlogs = async (setAllBlogs) => {
  try {
    const blogData = await axios.get(`${APIURL}/blog`);
    setAllBlogs(blogData.data.blog);
  } catch (error) {
    console.log(error.message);
  }
};

export const getMyFavBlogs = async (setMyCategorieBlogs, categorie) => {
  const favBlog = await axios.get(`${APIURL}/searchblog/${categorie}`);
  setMyCategorieBlogs(favBlog.data.blog);
};

export const getThisBlogPost = async (id) => {
  try {
    const data = await axios.get(`${APIURL}/blog/${id}`);
    return data.data.blog;
  } catch (error) {
    console.log(error.message);
  }
};
