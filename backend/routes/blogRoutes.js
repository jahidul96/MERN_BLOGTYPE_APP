const Blog = require("../models/blogSchema");

const router = require("express").Router();

router.get("/blog", async (req, res, next) => {
  try {
    const blog = await Blog.find({}).populate(
      "postedBy",
      "username _id email categorie"
    );
    res.status(200).json({
      status: "succes",
      total: blog.length,
      blog,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/blog/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const blog = await Blog.findOne({ _id: id }).populate(
      "postedBy",
      "username _id email categorie"
    );
    res.status(200).json({
      status: "succes!",
      blog,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/blog/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Blog.findById({ _id: id });
    await Blog.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          click: data.click + 1,
        },
      }
    );

    res.status(201).json({
      message: "updated succesfully!!",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/blog/post", async (req, res, next) => {
  const {} = req.body;
  try {
    const blog = new Blog(req.body);

    const data = await blog.save();

    res.status(201).json({
      message: "Blog post Succesfull",
      data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
