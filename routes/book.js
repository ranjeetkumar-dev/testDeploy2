const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

//add book admin

router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { url, title, author, price, language } = req.body;

    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res
        .status(500)
        .json({ msg: "please login as admin to add books" });
    }

    // const newBook = new Book({
    //   url: req.body.url,
    //   title: req.body.title,
    //   author: req.body.author,
    //   price: req.body.price,
    //   language: req.body.language,
    // });
    const newBook = new Book({
      url: url,
      title: title,
      author: author,
      price: price,
      language: language,
    });
    await newBook.save();
    return res.status(200).json({ msg: "book added successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
});

router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;

    const user = await User.findById(id);

    if (user.role !== "admin") {
      return res
        .status(500)
        .json({ msg: "please login as admin to update books" });
    }

    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      language: req.body.language,
    });

    return res.status(200).json({ msg: "book updated sucessfully" });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
});
router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.headers;

    const user = await User.findById(id);

    if (user.role !== "admin") {
      return res
        .status(500)
        .json({ msg: "please login as admin to update books" });
    }

    await Book.findByIdAndDelete(bookid);

    return res.status(200).json({ msg: "book deleted sucessfully" });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
});

router.get("/get-all-books", async (req, res) => {
  try {
    const allBooks = await Book.find().sort({ createdAt: -1 });
    return res.json({ msg: "success", data: allBooks });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
});
router.get("/get-recent-books", async (req, res) => {
  try {
    const allBooks = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({ msg: "success", data: allBooks });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
});
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const {id}=req.params;
    const book = await Book.findById(id);
    return res.json({ msg: "success", data: book });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
});

module.exports = router;
