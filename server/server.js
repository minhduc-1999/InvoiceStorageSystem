require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const users = [];

app.use(express.json());

app.get("/users", authenticateToken, (req, res) => {
  res.json(users.find((user) => user.username === req.body.username));
});

app.post("/users", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = {
      username: req.body.username,
      password: hashedPass,
    };
    users.push(user);
    res.status(201).send({ message: "Created new user" });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/login", async (req, res) => {
  const user = users.find((user) => user.username === req.body.username);
  if (!user) {
    console.log(user);
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        {
          username: user.username,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({ accessToken });
    } else {
      res.send("Not Allow");
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
    next();
  });
}

app.listen(3000);
