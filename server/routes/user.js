const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

router.get("/", authenticateToken, async (req, res) => {
  if (req.query.id !== req.body.userId) {
    res.sendStatus(403);
  }
  const claim = await User.findById(req.body.userId).select("claims").exec();
  if (!claim) res.status(400).send("User Not Found");
  res.json(claim);
});

router.put("/", authenticateToken, async (req, res) => {
  if (req.query.id !== req.body.userId) {
    res.sendStatus(403);
  }
  const upRes = await User.updateOne(
    { _id: req.body.userId },
    {
      claims: req.body.updateClaim,
    }
  ).exec();
  if (upRes.nModified === 0) res.status(500).send("Cannot update profile");
  res.status(200).send("Profile Updated");
});

router.post("/register", async (req, res) => {
  const user = await User.findOne({ username: req.body.username }).exec();
  if (user) {
    return res.status(400).send("Username has been existed");
  }
  const hashedPass = await bcrypt.hash(req.body.password, 10);
  const newUser = {
    ...req.body,
    passwordHash: hashedPass,
  };
  delete newUser.password;
  User.create(newUser)
    .then((user) => res.status(200).send())
    .catch((err) => res.status(500).send(err));
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username }).exec();
  console.log(user);
  if (!user) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.passwordHash)) {
      const accessToken = jwt.sign(
        {
          username: user.username,
          userId: user._id,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ userId: user._id, username: user.username, accessToken });
    } else {
      res.status(400).send("Username or password not correct");
    }
  } catch (error) {
    res.status(500).send();
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.body.username = payload.username;
    req.body.userId = payload.userId;
    next();
  });
}

module.exports = router;
