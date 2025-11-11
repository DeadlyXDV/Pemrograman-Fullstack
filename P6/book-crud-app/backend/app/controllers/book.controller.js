const db = require("../models");
const Book = db.Book;
exports.findAll = async (req, res) => { res.send(await Book.findAll()); };
exports.findOne = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  book ? res.send(book) : res.status(404).send({ message: "Book not found" });
};
exports.create = async (req, res) => {
  try { const b = await Book.create(req.body); res.status(201).send(b); }
  catch (err) { res.status(500).send({ message: err.message }); }
};
exports.update = async (req, res) => {
  const [updated] = await Book.update(req.body, { where: { id: req.params.id } });
  updated ? res.send({ message: "Updated" }) : res.status(404).send({ message: "Not found" });
};
exports.delete = async (req, res) => {
  const deleted = await Book.destroy({ where: { id: req.params.id } });
  deleted ? res.send({ message: "Deleted" }) : res.status(404).send({ message: "Not found" });
};
