const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
exports.signup = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await User.create({ username, password: hashedPassword, role: role || "user" });
    res.status(201).send({ message: "User registered!", user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) { res.status(500).send({ message: err.message }); }
};
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) return res.status(404).send({ message: "User not found" });
    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) return res.status(401).send({ message: "Invalid password" });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: 86400 });
    res.send({ id: user.id, username: user.username, role: user.role, accessToken: token });
  } catch (err) { res.status(500).send({ message: err.message }); }
};
