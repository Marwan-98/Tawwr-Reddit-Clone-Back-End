import { Router } from "express";
import Post from "../entities/Post";
import Tags from "../entities/Tags";
import User from "../entities/User";
import Vote from "../entities/Vote";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({
      relations: {
        comments: true,
        vote: true,
        tags: true,
        user: true,
      },
      select: {
        user: { id: true, firstname: true, lastname: true },
      },
    });

    const modifiedPosts = await Promise.all(
      posts.map(async (post) => {
        return {
          ...post,
          upVotesTotal: await Vote.count({
            where: { postId: post.id, value: 1 },
          }),
          downVotesTotal: await Vote.count({
            where: { postId: post.id, value: -1 },
          }),
          commentsTotal: post.comments.length,
        };
      })
    );

    return res.status(200).json(modifiedPosts);
  } catch (err) {
    throw err;
  }
});

router.get("/:id", async (req, res) => {
  try {
    const postId = +req.params.id;
    const post = await Post.findOne({
      where: { id: postId },
      relations: {
        comments: { user: true },
        vote: true,
        tags: true,
        user: true,
      },
      select: {
        user: { id: true, firstname: true, lastname: true },
        comments: {
          id: true,
          body: true,
          dateCreated: true,
          user: { id: true, firstname: true, lastname: true },
        },
      },
    });
    const modifiedPost = {
      ...post,
      upVotesTotal: await Vote.count({
        where: { postId: post?.id, value: 1 },
      }),
      downVotesTotal: await Vote.count({
        where: { postId: post?.id, value: -1 },
      }),
      commentsTotal: post?.comments.length,
    };
    return res.status(200).json(modifiedPost);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { title, body, user, tags } = req.body;

    if (!title || !body || !user)
      res.status(400).send("We need a title, body and user");

    const findUser = await User.findOne({
      where: { id: user },
    });

    if (!findUser) return res.status(404).send("User not found");

    const post = Post.create({
      title: title,
      user: findUser,
      body: body,
      tags: [],
    });

    await post.save();

    for (let i = 0; i < tags.length; i++) {
      const findTag = await Tags.findOne({ where: { id: tags[i] } });

      if (!findTag) return res.status(400).send("Couldn't find tag");

      post.tags.push(findTag);
    }

    await post.save();

    res.json({ post });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/:postid/addtag/:tagid", async (req, res) => {
  try {
    const { postid, tagid } = req.params;

    const post = await Post.findOne({
      where: { id: +postid },
      relations: { tags: true },
    });

    const tag = await Tags.findOne({
      where: { id: +tagid },
    });

    if (!post || !tag) {
      return res.status(404).send("Post or Tag is not found");
    }

    post.tags = [...post.tags, tag];

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/:postid/deletetag/:tagid", async (req, res) => {
  try {
    const { postid, tagid } = req.params;

    const post = await Post.findOne({
      where: { id: +postid },
      relations: { tags: true },
    });

    const tag = await Tags.findOne({
      where: { id: +tagid },
    });

    if (!post || !tag) {
      return res.status(404).send("Post or Tag is not found");
    }

    for (let i = 0; i < post.tags.length; i++) {
      if (post.tags[i].id === tag.id) {
        post.tags.splice(i, 1);
      }
    }

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/:id/delete", async (req, res) => {
  try {
    const id = +req.params.id;
    const post = await Post.findOne({
      where: { id },
    });
    if (!post)
      return res
        .status(404)
        .json({ message: `no post with the id: ${id} was found` });

    const deleted = await Post.delete(id);
    return res.status(200).json(deleted);
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
