const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const expressAsyncHandler = require("express-async-handler");

// Middleware to check if the user is the editor
const editor = expressAsyncHandler(async (req, res, next) => {
  const postId = parseInt(req.params.id);
  const userId = res.locals.user.id;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post) {
    return res.status(400).json({ success: false, error: "Post not found" });
  }

  const isEditor = post.authorId === userId;

  if (isEditor) {
    return next();
  } else {
    return res
      .status(400)
      .json({ success: false, error: "No authority to edit post" });
  }
});

// Middleware to check if the user is the editor or admin
const authority = expressAsyncHandler(async (req, res, next) => {
  const postId = parseInt(req.params.id);
  const userId = res.locals.user.id;
  const userRole = res.locals.user.role;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });

  if (!post) {
    return res.status(400).json({ success: false, error: "Post not found" });
  }

  const isAuthor = post.authorId === userId;
  const isAdmin = userRole === "ADMIN";

  if (isAuthor || isAdmin) {
    return next();
  } else {
    return res
      .status(400)
      .json({ success: false, error: "No authority to delete post" });
  }
});

// Middleware to check if the authenticated user is an AUTHOR
const isAuthor = expressAsyncHandler(async (req, res, next) => {
  const userRole = res.locals.user.role;

  if (userRole === "AUTHOR") {
    return next();
  } else {
    return res.status(400).json({ success: false, error: "Not an AUTHOR" });
  }
});

// Middleware to check if the authenticated user is an ADMIN
const isAdmin = expressAsyncHandler(async (req, res, next) => {
  const userRole = res.locals.user.role;
  
  if (userRole === "ADMIN") {
    return next();
  } else {
    return res.status(400).json({ success: false, error: "Not an ADMIN" });
  }
});

// Middleware to check if the authenticated user is 'USER'
const isUser = expressAsyncHandler(async (req, res, next) => {
  const userRole = res.locals.user.role;

  if (userRole === "USER") {
    return next();
  } else {
    return res.status(400).json({ success: false, error: "Not an USER" });
  }
});

module.exports = { isAuthor, editor, authority, isAdmin, isUser };
