import { Router } from "express";
import Post from "../entities/Post";
import Vote from "../entities/Vote";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const votes = await Vote.find();
    res.json(votes);
  } catch (err) {
    res.send(err);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { user, post, vote } = req.body;
    const findVote = await Vote.findOne({
      where: {userId: user, postId: post}
    })
    if(findVote && findVote.value === vote) {
      return res.json(findVote);
    } else if (findVote && findVote.value !== vote) {
      await Vote.update({postId: post, userId: user}, {value: vote})
      return res.json("Vote Updated")
    }
  } catch (err) {
    res.send(err);
  }
});

export default router;
