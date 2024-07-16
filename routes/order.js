const router = require("express").Router();
const User = require("../models/user");

const Order = require("../models/order");
const { authenticateToken } = require("./userAuth");

router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData in order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });
      //clear cart
      await User.findByIdAndUpdate(id, { $pull: { cart: orderData._id } });
    }
    return res
      .status(200)
      .json({ status: "success", msg: "order placed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "internal server error while placing order", error: error });
  }
});

//get order history of a perticular user

router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });
    const ordersData = userData.orders.reverse();
    return res.status(200).json({ status: "success", data: ordersData });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error", error: error });
  }
});

//get all orders //by admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({ path: "user" })
      .sort({ createdAt: -1 });
    return res.status(200).json({ status: "success", data: userData });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error", error: error });
  }
});

//update order by admin

router.put("/update-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await User.findById(id);

    if (userData.id == "admin") {
      await Order.findByIdAndUpdate(id, { status: req.body.status });
      return res
        .status(200)
        .json({ status: "success", msg: "order updated successfully" });
    } else {
      return res.status(500).json({ msg: "login as admin to update order" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "internal server error", error: error });
  }
});
module.exports = router;
