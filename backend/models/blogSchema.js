const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    categorie: {
      type: String,
      required: true,
    },
    featuredImg: {
      type: String,
      required: true,
    },
    tags: Array,
    click: {
      type: Number,
      default: 0,
    },
    likes: Array,
    comments: Array,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
