const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

//add book to fav

router.put("/add-to-favorite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    const userData = await User.findById(id);
    const isBookFavorite = userData.favorite.includes(bookid);

    if (!isBookFavorite) {
      await User.findByIdAndUpdate(id, { $push: { favorite: bookid } });
      return res
        .status(200)
        .json({ msg: "book added to favorite successfully" });
    } else {
      return res.json({ msg: "book is already in favorites" });
    }
  } catch (error) {
    return res.json({ msg: "book id is invalid" }).status(500);
  }
});

//delete book from fev

router.delete("/delete-from-favorite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    const userData = await User.findById(id);
    const isBookFavorite = userData.favorite.includes(bookid);

    if (!isBookFavorite) {
      return res.status(200).json({ msg: "given id book not in favorite" });
    } else {
      await User.findByIdAndUpdate(id, { $pull: { favorite: bookid } });

      return res.json({ msg: "book is deleted from favorite" });
    }
  } catch (error) {
    return res.json({ msg: "book id is invalid" }).status(500);
  }
});

//fetch all favorites of a user

router.get("/get-favorites", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const  userDta = await User.findById(id).populate("favorite");
    const favoritesBooks = userDta.favorite;
    return res.status(200).json({ msg: "sucess", data: favoritesBooks });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
});

module.exports = router;
