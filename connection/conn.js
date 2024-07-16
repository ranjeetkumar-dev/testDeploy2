const mongoose = require("mongoose");
require("dotenv").config();

const conn = async () => {
  try {
    await mongoose.connect(`${process.env.URI}`);
    console.log("mongodb connected");
  } catch (error) {
    console.log("error:", error);
  }
};

conn();
