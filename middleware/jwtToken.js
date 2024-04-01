const { sign, verify } = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const REF_SECRET = process.env.REF_SECRET;

const accessTokenCreate = (id, email, role) => {
  const Token = sign({ id: id, email: email, role: role }, JWT_SECRET, {
    expiresIn: "1m",
  });
  return Token;
};

const refreshTokenCreate = (id, email, role) => {
  const Token = sign({ id: id, email: email, role: role }, REF_SECRET, {
    expiresIn: "1h",
  });
  return Token;
};

// Create Access Token & Refresh Token to Login
const generateToken = (user, res) => {
  const id = user.id;
  const email = user.email;
  const role = user.role;

  const accessToken = accessTokenCreate(id, email, role);
  const refreshToken = refreshTokenCreate(id, email, role);

  return {
    userData: {
      id: id,
      email: email,
      role: role,
      refreshToken: refreshToken,
    },
    accessToken: accessToken,
  };
};

// Create New AccessToken Using Refresh Token
const newToken = (refreshToken) => {
  const validToken = verify(refreshToken, REF_SECRET);

  if (!validToken) {
    return res.status(400).json({ error: "Invalid refresh token" });
  }

  if (validToken.exp < Date.now() / 1000) {
    return res.status(400).json({ error: "Refresh token expired" });
  }

  const accessToken = accessTokenCreate(
    validToken.id,
    validToken.email,
    validToken.role
  );

  return accessToken;
};

const validateToken = (req, res, next) => {
  // Get the token from cookie
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(400).json({ error: "No token found" });
  }

  const validToken = verify(accessToken, JWT_SECRET);

  if (!validToken) {
    return res.status(400).json({ error: "Invalid token" });
  }

  if (validToken.exp < Date.now() / 1000) {
    return res.status(400).json({ error: "Token expired" });
  }

  res.locals.user = {
    id: validToken.id,
    email: validToken.email,
    role: validToken.role,
  };

  return next();
};
module.exports = { generateToken, validateToken, newToken };
