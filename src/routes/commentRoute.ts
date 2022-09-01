import { Router } from "express";
import Comments from "../entities/Comment";

const router = Router();

router.get("/", async (req, res) => {
  const comment = await Comments.find();

  return res.json(comment);
});

router.post("/new", async (req, res) => {
  const { body, post, user } = req.body;

  const comment = Comments.create({
    body: body,
    post: post,
    user: user,
  });

  await comment.save();
  res.json({ comment });
});

router.delete("/:id/delete", async (req, res) => {
  const commentId = +req.params.id;
  const deleted = await Comments.delete(commentId);

  return res.json(deleted);
});

export default router;
