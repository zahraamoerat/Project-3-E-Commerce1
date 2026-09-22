const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access token required" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret_key_here",
    (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });
      req.user = user;
      next();
    }
  );
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: `Access denied. Requires ${role} role.` });
    }
  };
}

module.exports = { authenticateToken, requireRole };