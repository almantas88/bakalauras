const router = require("express").Router();
const auth = require("../middleware/auth");
const Book = require("../models/book.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
var validator = require("email-validator");
var generator = require("generate-password");
const nodemailer = require("nodemailer");
const moment = require("moment");
moment().format("LT");

router.get("/books", auth, async (req, res) => {
  console.log(req.user);
  try {
    moment().format("LT");
    const foundUser = await User.findOne({ _id: req.user }).populate(
      "books.bookId"
    );
    if (!foundUser)
      return res.status(400).send({ msg: "Vartotojas neegzistuoja" });

    var booksArr = [];
    foundUser.books.forEach((element) => {
      console.log(element);
      booksArr.push({
        _id: element.bookId._id,
        title: element.bookId.title,
        author: element.bookId.author,
        description: element.bookId.description,
        bookID: element.bookId.bookID,
        dateTaken: moment(element.dateGiveOut).format("YYYY-MM-DD"),
        returnDate: moment(element.returnDate).format("YYYY-MM-DD"),
      });
    });
    // man atroDo čia reikia formuoti duomenis

    console.log(booksArr);

    return res.status(200).send({
      booksArr,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.post("/passwordChange", auth, async (req, res) => {
  console.log(req.user);
  console.log(req.body);

  let { newPassword, newPasswordRepeat, oldPassword } = req.body;
  if (!newPassword || !newPasswordRepeat || !oldPassword) {
    return res.status(400).json({ msg: "Ne visi laukai buvo užpildyti." });
  }

  if (newPassword.length < 5 || newPasswordRepeat.length < 5) {
    return res
      .status(400)
      .json({ msg: "Slaptažodis turi būti bent 5 raidžių ilgio." });
  }

  if (newPassword !== newPasswordRepeat) {
    return res.status(400).json({ msg: "Nauji slaptažodžiai nesutampa." });
  }

  const user = await User.findOne({ _id: req.user });
  console.log(user);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  console.log(isMatch);
  if (!isMatch)
    return res.status(400).send({ msg: "Netinkamas senas slaptažodis." });

  try {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const existingCardID = await User.updateOne(
      { _id: req.user },
      { password: passwordHash }
    );
    res.status(200).json({ msg: "Slaptažodis sėkmingai atnaujintas." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

router.post("/passwordReset", async (req, res) => {
  console.log(req.body);

  let { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Užpildykite el. pašto teksto lauką." });
  }

  if (!validator.validate(email)) {
    return res.status(400).json({ msg: "El. paštas yra netinkamas." });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ msg: "Toks el. paštas neegzistuoja." });
  }

  try {
    var password = generator.generate({
      length: 8,
      numbers: true,
    });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    await User.updateOne({ email: email }, { password: passwordHash });

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ga.almantas@gmail.com",
        pass: "Renkudepozita88*",
      },
    });

    let details = {
      from: "ga.almantas@gmail.com",
      to: "almantas88@gmail.com",
      subject: "Slaptažodžio atstatymas",
      html: `
      <h1>Bibliotekos valdymo sistema<h1/>
      <p>Jūsų naujas slaptažodis yra: <strong>${password}<strong/><p/>`,
    };

    transporter.sendMail(details);
    res
      .status(200)
      .json({ msg: `Naujas slaptažodis išsiųstas į ${email} el. paštą.` });
  } catch (error) {
    console.log(error);
  }
});

router.get("/bookDelays", auth, async (req, res) => {
  const allUsers = await User.find({ role: { $ne: "ADMIN" } }).populate(
    "books.bookId"
  );
  //console.log(allUsers);
  var delayedBooksUsers = [];

  function daysRemaining(eventdate) {
    var eventdate = moment(eventdate);
    var todaysdate = moment();
    return eventdate.diff(todaysdate, "days");
  }
  //alert(daysRemaining());

  allUsers.forEach((item) => {
    item.books.forEach((element) => {
      console.log(element);
      if (daysRemaining(element.returnDate) <= 14) {
        delayedBooksUsers.push({
            email: item.email,
            firstName: item.firstName,
            lastName: item.lastName,
            cardID: item.cardID,
            grade: item.grade,
            title: element.bookId.title,
            bookID: element.bookId.bookID,
            dateGiveOut: moment(element.dateGiveOut).format("YYYY-MM-DD"),
            returnDate:moment(element.returnDate).format("YYYY-MM-DD")
          
        });
      }
    });
  });

  res.status(200).json({ delayedBooksUsers });
});

module.exports = router;
