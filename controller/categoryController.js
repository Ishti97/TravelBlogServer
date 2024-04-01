const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

// POST Endpoint to create a new Category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = await prisma.category.create({
      data: {
        name: name,
      },
    });

    return res.status(200).json({ success: true, data: newCategory });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error});
  }
});

// DELETE Endpoint to delete a Category
const removeCategory = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);

  try {
    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    });
    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error deleting category" });
  }
});

// GET Endpoint to get Category
const getCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await prisma.category.findMany();
    return res.status(200).json({ success: true, data: newCategory });
  } catch (error) {
    return res
      .status(500)
      .json(error);
  }
});

// GET Endpoint to Count Category
const getCategoryCount = asyncHandler(async (req, res) => {
  try {
    const categoryPostCounts = await prisma.post.groupBy({
      by: ["categoryId"],
      _count: {
        id: true,
      },
      where: {
        published: true,
      },
    });

    const categoryNames = await Promise.all(
      categoryPostCounts.map(async (categoryCount) => {
        const category = await prisma.category.findUnique({
          where: {
            id: categoryCount.categoryId,
          },
        });
        return {
          category: category.name,
          count: categoryCount._count.id,
        };
      })
    );

    return res.status(200).json({ data: categoryNames });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Error creating category" });
  }
});

module.exports = {
  createCategory,
  removeCategory,
  getCategory,
  getCategoryCount,
};
