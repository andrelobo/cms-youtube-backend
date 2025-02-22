const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // check all the missing fields.
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: `Por favor, preencha todos os campos obrigatórios.` });

  // name validation.
  if (name.length > 25)
    return res
      .status(400)
      .json({ error: "O nome só pode ter menos de 25 caracteres." });

  // email validation.
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "Por favor, insira um endereço de e-mail válido." });

  // validation of password.
  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "A senha deve ter pelo menos 6 caracteres." });
  try {
    const doesUserAlreadyExist = await User.findOne({ email });

    if (doesUserAlreadyExist)
      return res.status(400).json({
        error: `Um usuário com esse email [${email}] já existe, por favor tente outro.`,
      });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    // save the user.
    const result = await newUser.save();

    result._doc.password = undefined;

    return res.status(201).json({ ...result._doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ error: "Por favor, preencha todos os campos obrigatórios!" });

  // email validation.
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "please enter a valid email address." });

  try {
    const doesUserExits = await User.findOne({ email });

    if (!doesUserExits)
      return res.status(400).json({ error: "Invalid email or password!" });

    // if there were any user present.
    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch)
      return res.status(400).json({ error: "Invalid email or password!" });

    const payload = { _id: doesUserExits._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const user = { ...doesUserExits._doc, password: undefined };
    return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.get("/me", auth, async (req, res) => {
  return res.status(200).json({ ...req.user._doc });
});

module.exports = router;
