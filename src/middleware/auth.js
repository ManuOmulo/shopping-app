const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decodedtoken = jwt.verify(token, "modelapplication");
    const user = await User.findById({
      _id: decodedtoken._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch {
    res.status(500).send();
  }
};

module.exports = auth;
