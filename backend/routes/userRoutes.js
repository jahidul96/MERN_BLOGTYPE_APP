const router = require("express").Router();
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res, next) => {
  const {
    username,
    email,
    password,
    profileImg,
    categorie,
    followers,
    newNotification,
    notifications,
  } = req.body;
  const hasedPassword = await bcrypt.hash(password, 10);

  try {
    const alredyUser = await User.findOne({ email: email });
    if (alredyUser) {
      return res.status(403).json({
        message: "User Already Active!!!",
      });
    }
    const user = new User({
      email,
      username,
      password: hasedPassword,
      categorie,
      profileImg,
      followers,
      newNotification,
      notifications,
    });
    await user.save();

    user.password = undefined;
    res.status(201).json({
      status: "created",
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const isThere = await User.findOne({ email: email });
    if (!isThere) {
      return next({
        message: "Wrong Credential's!",
      });
    }

    const comparePassword = await bcrypt.compare(password, isThere.password);

    if (!comparePassword) {
      return next({
        message: "Wrong Credential's!",
      });
    } else {
      isThere.password = undefined;
      res.status(200).json({
        status: "succefull",
        user: isThere,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/user/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    res.status(200).json({
      succes: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
