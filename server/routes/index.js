const express = require("express");
const router = express.Router();

const userRoute = require("./user");

router.get("/", (req, res) => {
  res.send("hello");
});

router.use("/users", userRoute);

module.exports = router;
