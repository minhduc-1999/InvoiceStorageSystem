if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const app = express();
const indexRoute = require("./routes/index");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Server"));

app.use(express.json());
app.use(indexRoute);

app.listen(3000);
