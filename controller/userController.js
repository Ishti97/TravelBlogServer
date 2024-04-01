const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateToken, newToken } = require("../middleware/jwtToken");
const bcrypt = require("bcrypt");

// LogIn
const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const dbPassword = user.password;

  const passwordMatch = await bcrypt.compare(password, dbPassword);
  if (!passwordMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Password matches, create and send access token
  const { userData, accessToken } = generateToken(user, res);

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    })
    .json(userData);
});

// LogOut
const logOut = (req, res) => {
  // Check if accessToken exists
  if (req.cookies && req.cookies.accessToken) {
    // Clear the access token cookie on the client-side
    res
      .status(200)
      .cookie("accessToken", "", {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
      })
      .json({ message: "Logged out successfully" });
  } else {
    res.status(200).json({ message: "Already logged out" });
  }
};

// Register
const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = await prisma.user.create({
    data: { email: email, password: hashed, role: role },
  });

  // Avoid sending back the hashed password
  delete newUser.password;

  return res.status(200).json(newUser);
});

// Create New Access Token using Refresh token
const token = (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(400).json({ error: "Missing refresh token" });
  }

  const accessToken = newToken(refreshToken);

  if (accessToken) {
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({ message: "Access token refreshed successfully" });
  } else {
    return res.status(400).json({ message: "No new access token" });
  }
};

module.exports = { logIn, register, logOut, token };
