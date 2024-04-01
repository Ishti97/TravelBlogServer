const express = require("express");
const router = express.Router();

const {upload} = require("../middleware/multerSharp.js")

const{ create, update, deletePost, readPost,  getPostsUnapproved, getPostsApproved, approvePost } = require("../controller/postController.js") 

const {isAuthor, editor, authority, isAdmin} = require("../middleware/checkUser.js");
const { validateToken } = require("../middleware/jwtToken.js");

// Define base URL
const baseUrl = "/post";

router.post(`${baseUrl}/create`,  validateToken, isAuthor, upload.single('image'), create);
router.patch(`${baseUrl}/update/:id`, validateToken, editor, update);
router.delete(`${baseUrl}/delete/:id`, validateToken, authority, deletePost);
router.get(`${baseUrl}/:id`, validateToken, readPost);
router.get(`${baseUrl}`, validateToken, getPostsApproved);
router.get(`${baseUrl}/unapproved/data`, validateToken, isAdmin, getPostsUnapproved);


router.patch(`${baseUrl}/approve/:id`, validateToken, isAdmin, approvePost);

module.exports = router;
