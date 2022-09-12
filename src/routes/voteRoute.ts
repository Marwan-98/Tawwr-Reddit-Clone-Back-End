import { Router } from "express";
import Vote from "../entities/Vote";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const votes = await Vote.find();
    return res.status(200).json(votes);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { user, post, vote } = req.body;
    const findVote = await Vote.findOne({
      where: { userId: user, postId: post },
    });
    if (findVote && findVote.value === vote) {
      return res.status(409).json("Already Voted");
    } else if (findVote && findVote.value !== vote) {
      await Vote.update({ postId: post, userId: user }, { value: vote });
      return res.status(204).json("Vote Updated");
    }
    const newVote = await Vote.create({
      userId: user,
      postId: post,
      value: vote,
    });
    await newVote.save();
    return res.status(200).json("Vote Added");
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
