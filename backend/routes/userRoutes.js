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

router.put("/resetpassword", async (req, res, next) => {
  const { email, password } = req.body;
  const id = req.params.id;
  const hasedPassword = await bcrypt.hash(password, 10);

  try {
    const isThere = await User.findOne({ email: email });
    if (!isThere) {
      return res.status(500).json({
        status: "Failed",
        message: "Wrong Email!",
      });
    }

    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          password: hasedPassword,
        },
      },
      { new: true }
    );

    res.status(201).json({
      status: "succes",
      user,
      message: "Password Updated succesfully!",
    });
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

router.get("/user/favorite/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).populate({
      path: "favorites",
      model: "Blog",
      populate: {
        path: "postedBy",
        model: "User",
      },
    });

    res.status(200).json({
      succes: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/user/follow/:id", async (req, res, next) => {
  const id = req.params.id;
  const { val, notifyVal, newNotification } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          followers: val,
          notifications: notifyVal,
          newNotification: newNotification,
        },
      }
    );
    res.status(201).json({
      succes: true,
      message: "updated succesfullY!!!",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/user/notification/:id", async (req, res, next) => {
  const id = req.params.id;
  const { newNotification } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          newNotification: newNotification,
        },
      }
    );
    res.status(201).json({
      message: "updated succesfullY!!!",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/user/addtofavorites/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          favorites: req.body,
        },
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      message: "updated succesfullY!!!",
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/user/updateprofilepic/:id", async (req, res, next) => {
  const { url } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          profileImg: url,
        },
      },
      { new: true }
    );

    res.status(201).json({
      status: "succes",
      user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
