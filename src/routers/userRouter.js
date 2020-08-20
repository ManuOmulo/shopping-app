const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

const router = new express.Router();

// ***************/ post endpoints /***********/

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

    if (!bcrypt.compare(user.password, req.body.password)) {
      return res.status(400).send("Email or password is incorrect");
    } else {
      res.status(200).send(user);
    }
  } catch (e) {
    res.status(400).send();
  }
});

// ############## user profile ############
router.post("/me", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// ****************/ updating user profile /*************/
router.patch("/me", async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["email", "password", "username"];
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send();
    }

    const isAllowed = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isAllowed) {
      throw new Error({ error: "Not a valid update" });
    }

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
