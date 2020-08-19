const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/userModel");

const router = new express.Router();

// ***************/ post endpoints ***********?

// ########## signing up #############
router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// ########## logging in ############
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send();
    }

    if (user.password !== req.body.password) {
      return res.status(400).send("Email or password is incorrect");
    } else {
      res.status(200).send(user);
    }
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
