const express = require("express");
const router = express.Router();

const{ logIn, register, logOut, token } = require("../controller/userController.js") 

const { validateRegistrationData } = require ("../middleware/validateRegistrationData.js")

// Define base URL
const baseUrl = "/user";

// Route for user login
router.post(`${baseUrl}/login`, logIn);

// Route for user logout
router.post(`${baseUrl}/logout`, logOut);

// Route for user registration
router.post(`${baseUrl}/register`, validateRegistrationData, register);

// Route for refreshing token
router.post(`${baseUrl}/token`, token);

module.exports = router;
