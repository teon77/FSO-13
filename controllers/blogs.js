const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (err) {
    return res.status(400).json({ err });
  }
});

router.get(":id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete(":id", async (req, res) => {
  const deleteComplete = await Blog.destroy({
    where: {
      id: req.params.id,
    },
  });
  deleteComplete === 1
    ? res.send("deleted successfully")
    : res.status(400).send("oops, didn't find such blog");
});

router.put("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes += 1;
    await req.blog.save();
    res.json(req.blog.likes);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
