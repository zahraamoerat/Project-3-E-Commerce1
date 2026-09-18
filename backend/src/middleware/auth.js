const crypto = require("crypto");

const getSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not defined in environment variables.");
  }
  return secret;
};

const sign = (value) =>
  crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");

const createToken = (user, expiresInHours = 8) => {
  const payloadData = {
    id: user.user_id || user.id,
    email: user.email,
    role: user.user_role || user.role,
    exp: Math.floor(Date.now() / 1000) + expiresInHours * 3600,
  };

  const payload = Buffer.from(JSON.stringify(payloadData)).toString(
    "base64url",
  );
  const signature = sign(payload);

  return `${payload}.${signature}`;
};

const verifyToken = (token) => {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  const expectedSignature = sign(payload);

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return false;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    );
    if (decoded.exp && Math.floor(Date.now() / 1000) > decoded.exp) {
      return false;
    }
    return decoded;
  } catch {
    return false;
  }
};

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const user = verifyToken(token);

  if (!user) {
    return res
      .status(401)
      .json({ message: "Authentication required or token expired." });
  }

  req.user = user;
  return next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }

  return next();
};

module.exports = { createToken, verifyToken, requireAuth, requireAdmin };
