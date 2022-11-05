const router = require("express").Router();
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  const { username, email, password, profilePic, categorie } = req.body;
  const hasedPassword = await bcrypt.hash(password, 10);

  try {
    const alredyUser = await User.findOne({ email: email });
    if (alredyUser) {
      return next({
        message: "User already Exits",
      });
    }
    const user = new User({
      email,
      username,
      password: hasedPassword,
      categorie,
      profilePic,
    });
    await user.save();

    const token = jwt.sign(
      {
        email,
        username,
        categorie,
        profilePic,
        userId: user._id,
      },
      process.env.JWT_SECRET
    );
    user.password = undefined;
    res.status(201).json({
      status: "created",
      user,
      token,
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
      const token = jwt.sign(
        {
          email: isThere.email,
          username: isThere.username,
          categorie: isThere.categorie,
          profilePic: isThere.categorie,
          userId: isThere._id,
        },
        process.env.JWT_SECRET
      );

      isThere.password = undefined;
      res.status(200).json({
        status: "succefull",
        token,
        user: isThere,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
