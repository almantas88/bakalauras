const router = require("express").Router();
const auth = require("../middleware/auth");
const Book = require("../models/book.model");

router.post("/newBook", auth, async (req, res) => {
    console.log(req.body);
  try {
    let { title, author, description, bookID } = req.body;
    if (!title || !author || !bookID) {
      return res.status(400).json({ msg: "Ne visi laukai buvo užpildyti." });
    }

    const existingBookID = await Book.findOne({ bookID: bookID });
    if (existingBookID)
      return res
        .status(400)
        .json({ msg: "Knyga su tokia knygos ID jau egzistuoja." });

    const newBook = new Book({
      title,
      author,
      description,
      bookID,
    });
    const savedBook = await newBook.save();
    res.status(200).json({ msg: "Knyga sukurta!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Delete
// cia butinai reiks dar patikrinti ar dar neliko pas ji knygu, jeiguy dar turi kad neleistu istrinti
router.delete("/deleteBook", auth, async (req, res) => {
  try {
    const existingBook = await Book.findOne({ bookID: req.body.bookID });
    if (!existingBook)
      return res
        .status(400)
        .json({ msg: "Nera tokios knygos su tokia knygos ID." });

    const deletedBook = await Book.deleteOne({ bookID: req.body.bookID });
    res.json({ msg: "Knyga sėkmingai ištrinta!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/allBooks", auth, async (req, res) => {
  try {
    const allBooks = await Book.find().sort({
      title: "asc",
    });
    return res.status(200).send({
      books: allBooks,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/oneBook/:bookID", auth, async (req, res) => {
  try {
    const foundBook = await Book.findOne({ bookID: req.params.bookID });
    if (!foundBook)
      return res.status(400).send({ msg: "Knyga neegzistuoja!" });
    return res.status(200).send({
      book: foundBook,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});



router.put("/updateBook", auth, async (req, res) => {
  try {
    console.log(req.body);
    let { bookID, title, author, description, initialBookID } =
      req.body;

    if (!bookID || !title || !author) {
      return res.status(400).json({ msg: "Ne visi laukai buvo užpildyti." });
    }
    const foundBook = await Book.findOne({ bookID: req.body.initialBookID });
    if (!foundBook)
      return res.status(400).send({ msg: "Knyga neegzistuoja" });

    const newBookInfo = {
      bookID,
      title,
      author,
      description
    };

    const updatedBook = await Book.findOneAndUpdate(
      { bookID: req.body.initialBookID },
      newBookInfo
    );

    return res.status(200).json({
      book: updatedBook,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
