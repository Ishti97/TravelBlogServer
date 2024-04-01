const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/jwtToken.js");
const {isUser} = require("../middleware/checkUser.js");
const{  create, remove, get } = require("../controller/bookmarkController.js") 


// Define base URL
const baseUrl = "/bookmark";

router.post(`${baseUrl}/create`, validateToken, isUser, create);
router.delete(`${baseUrl}/delete/:id`,validateToken, isUser, remove);
router.get(`${baseUrl}`,validateToken, get);

module.exports = router;
