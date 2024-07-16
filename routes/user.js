const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

router.get("/", (req, res) => {
  console.log("hellow from server");
  return res.send("hello from server");
});

//sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    //check username is more than 4

    if (username.length < 4) {
      return res
        .status(400)
        .json({ msg: "username length should be greater than 3" });
    }

    //check username already exist

    const existingUsername = await User.findOne({ username: username });

    if (existingUsername) {
      return res.status(400).json({ msg: "username already exist" });
    }
    //check email
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({ msg: "email already exists" });
    }

    //check pass length
    if (password.length <= 5) {
      return res.status(400).json({ msg: "password should be greater than 5" });
    }

    //create user
    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
      address: address,
    });

    await newUser.save();
    return res.status(200).json({ msg: "sign up successfully" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});

//sign in

router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(400).json({ msg: "invalid crediatials" });
    }
    await bcrypt.compare(password, existingUser.password, (error, data) => {
      if (data) {
        const authClaims = [
          { name: existingUser.username },
          { role: existingUser.role },
        ];
        const token = jwt.sign({ authClaims }, "bookStore123", {
          expiresIn: "30d",
        });
        res.status(200).json({
          id: existingUser._id,
          role: existingUser.role,
          token: token,
        });
      } else {
        res.status(400).json({ msg: "invalid crediatials" });
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
});

//get-user-info

router.get("/get-user-info", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//update address

router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ msg: "address updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
