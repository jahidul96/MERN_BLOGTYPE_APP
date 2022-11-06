const Blog = require("../models/blogSchema");

const router = require("express").Router();

router.get("/blog", async (req, res, next) => {
  try {
    const blog = await Blog.find({})
      .populate("postedBy", "username _id email categorie")
      .sort({ createdAt: -1 });
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
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json({
      status: "succes",
      message: "Blog post Succesfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/searchblog/:categorie", async (req, res, next) => {
  try {
    const categorie = req.params.categorie;

    console.log(categorie);

    const blog = await Blog.find({ categorie: categorie }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      succes: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
