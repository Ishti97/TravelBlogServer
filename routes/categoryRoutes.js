const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/jwtToken.js");
const {isAdmin} = require("../middleware/checkUser.js");
const{  createCategory, removeCategory, getCategory, getCategoryCount } = require("../controller/categoryController.js") 


// Define base URL
const baseUrl = "/category";

router.post(`${baseUrl}/create`, validateToken, isAdmin, createCategory);
router.delete(`${baseUrl}/delete/:id`,validateToken, isAdmin, removeCategory);
router.get(`${baseUrl}`,validateToken, getCategory);
router.get("/categories/chart", validateToken, isAdmin, getCategoryCount);
module.exports = router;
