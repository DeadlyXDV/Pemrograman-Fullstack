const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Book = sequelize.define("Book", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nama_buku: { type: DataTypes.STRING, allowNull: false },
    pengarang: { type: DataTypes.STRING, allowNull: false },
    thn_terbit: { type: DataTypes.INTEGER, allowNull: false },
  }, { timestamps: false });
  return Book;
};
