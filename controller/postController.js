const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

// Post Create
const create = asyncHandler(async (req, res) => {
  const { title, detail, authorId, categoryId } = req.body;
  const image = req.file ? req.file.path : null;

  if (!title || !detail || !authorId || !categoryId) {
    return res.status(400).json({ Error: "Missing required fields" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        detail,
        authorId: parseInt(authorId),
        categoryId: parseInt(categoryId),
        image,
      },
    });
    return res.status(200).json(newPost);
  } catch (error) {
    return res.status(500).json({ error: "Error creating new post" });
  }
});

// Post Update
const update = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const { detail } = req.body;
  try {
    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: {
        detail: detail,
      },
    });
    return res
      .status(200)
      .json({ success: true, data: updatedPost, message: "Updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Not Updated" });
  }
});

// Post Delete
const deletePost = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const response = await prisma.post.delete({
      where: { id: id },
    });
    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Unsuccessful delete operation" });
  }
});

// Read indv post
const readPost = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const thePost = await prisma.post.findUnique({
      where: { id: id, published: true },
    });
    return res.status(200).json({ success: true, message: thePost });
  } catch (error) {
    return res.status(500).json({ success: false, message: "NO post found" });
  }
});

// Home -> get un-approved posts
const getPostsUnapproved = asyncHandler(async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany({
      where: {
        published: {
          equals: false,
        },
      },
    });

    const postsWithImages = allPosts.map((post) => {
      const imageURL = `/postImage/${post.image.split("\\").pop()}`;
      return {
        ...post,
        image: imageURL,
      };
    });

    return res.status(200).json({ allPosts: allPosts });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Home -> get approved posts
const getPostsApproved = asyncHandler(async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany({
      where: {
        published: {
          equals: true,
        },
      },
    });

    // const postsWithImages = allPosts.map((post) => {
    //   const imageURL = `/postImage/${post.image.split("\\").pop()}`;
    //   return {
    //     ...post,
    //     image: imageURL,
    //   };
    // });
    return res.status(200).json({ allPosts: allPosts });
  } catch (error) {
    return res.status(400).json(error);
  }
});

// Post approve
const approvePost = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: id, published: false },
    });

    if (!existingPost) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: {
        published: true,
      },
    });
    return res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error updating post" });
  }
});

module.exports = {
  create,
  update,
  deletePost,
  readPost,
  getPostsUnapproved,
  getPostsApproved,
  approvePost,
};
