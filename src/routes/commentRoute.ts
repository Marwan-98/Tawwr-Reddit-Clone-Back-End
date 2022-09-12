import { Router } from "express";
import Comments from "../entities/Comment";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const comment = await Comments.find();

    return res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { body, post, user } = req.body;

    const comment = Comments.create({
      body: body,
      post: post,
      user: user,
    });

    await comment.save();
    res.status(200).json({ comment });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id/delete", async (req, res) => {
  try {
    const commentId = +req.params.id;
    const deleted = await Comments.delete(commentId);

    return res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
