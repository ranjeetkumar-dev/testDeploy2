const express = require("express");
require("dotenv").config();
require("./connection/conn");
const User = require("./routes/user");
const Book = require("./routes/book");
const Favorite = require("./routes/favorite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

const app = express();

//middlewere
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Book Store");
});

app.use("/api", User);
app.use("/api", Book);
app.use("/api", Favorite);
app.use("/api", Cart);
app.use("/api", Order);

app.listen(process.env.PORT, () =>
  console.log("server started at port:", process.env.PORT)
);
