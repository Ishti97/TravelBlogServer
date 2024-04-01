const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

// POST Endpoint to create a new Category Bookmark
const create = asyncHandler(async (req, res) => {
  const { contentId, userId} = req.body;
 // const userId = res.locals.user.id;
  const contentIdInt = parseInt(contentId);
  console.log(contentIdInt, userId);
  try {
    const CreateNew = await prisma.bookmark.create({
      data: {
        userId: userId,
        postId: contentIdInt,
      },
    });

    return res.status(200).json({ success: true, data: CreateNew });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Error creating Book mark" });
  }
});

// DELETE Endpoint to delete a Book mark
const remove = asyncHandler(async (req, res) => {
  const bookmarkId = parseInt(req.params.id);

  try {
    const deletedBookmark = await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
    return res
      .status(200)
      .json({ success: true, message: "Bookmark deleted successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Error deleting Bookmark" });
  }
});

// GET Endpoint to get Book mark
const get = asyncHandler(async (req, res) => {
  const {userId} = req.body;

  try {
    const data = await prisma.bookmark.findMany({
      where: { userId: userId },
    });
    return res.status(201).json({ success: true, data: data });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: "Error getting bookmark data" });
  }
});

module.exports = { create, remove, get };
