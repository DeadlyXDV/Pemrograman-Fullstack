const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
exports.verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (token && token.startsWith("Bearer ")) token = token.slice(7);
  if (!token) return res.status(403).send({ message: "No token provided!" });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized!" });
    req.userId = decoded.id; req.userRole = decoded.role; next();
  });
};
exports.isAdmin = (req, res, next) => {
  if (req.userRole === "admin") next();
  else res.status(403).send({ message: "Require Admin Role!" });
};
