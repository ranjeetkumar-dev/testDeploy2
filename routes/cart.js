const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

//add to card
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookid);

    if (!isBookInCart) {
      await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
      return res.status(200).json({ msg: "book added to cart successfully" });
    } else {
      return res.status(500).json({ msg: "book already in cart " });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "internal server error while adding to cart",
      error: error,
    });
  }
});

//remove from cart
router.delete("/remove-from-cart", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;
    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookid);

    if (!isBookInCart) {
      return res
        .status(500)
        .json({ msg: "book is not added in  cart already" });
    } else {
      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      return res.status(200).json({ msg: "book is removed from cart" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "internal server error while removing from cart" });
  }
});

//fetch cart of user
router.get("/get-cart-info", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const cartData = userData.cart;
    return res.status(200).json({ msg: "success", cart: cartData });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "internal server error while fetching cart data" });
  }
});

module.exports = router;
