const express = require("express");

const User = require("../models/userModel");
const auth = require("../middleware/auth");

const router = new express.Router();

// ***************/ post endpoints /***********/

// ########## signing up #############
router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user: user, token: token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// ########## logging in ############
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user: user, token: token });
  } catch (e) {
    res.status(400).send();
  }
});

// ***************/ get endpoints /**************/

// ############## user profile ############
router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

// ****************/ updating user profile /*************/
router.patch("/users/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["email", "password", "username"];
    const isAllowed = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isAllowed) {
      res.status(400).send({ error: "Not a valid update" });
    }

    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
