const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const authToken = authHeader.split(" ")[1];

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

    console.log("DECODED DATA:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

module.exports = authMiddleware;
