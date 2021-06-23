const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  }, // String is shorthand for {type: String}
  passwordHash: {
    type: String,
    required: true,
  },
  claims: {
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
