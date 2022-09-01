import { Router } from "express";
import Post from "../entities/Post";
import Tags from "../entities/Tags";
import Vote from "../entities/Vote";

const router = Router();

router.get("/", async (req, res) => {
  const posts = await Post.find({
    relations: { comments: true, vote: true, tags: true },
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

  return res.json(modifiedPosts);
});

router.get("/:id", async (req, res) => {
  try {
    const postId = +req.params.id;
    const post = await Post.find({
      relations: { comments: true, vote: true, tags: true },
      where: { id: postId },
    });
      const modifiedPost = {
            ...post[0],
            upVotesTotal: await Vote.count({
              where: { postId: post[0].id, value: 1 },
            }),
            downVotesTotal: await Vote.count({
              where: { postId: post[0].id, value: -1 },
            }),
            commentsTotal: post[0].comments.length,
          };
    return res.json(modifiedPost);
  } catch (err) {
    throw err;
  }
});

router.post("/new", async (req, res) => {
  try {
    const { title, body, user } = req.body;

    if (!title || !body || !user)
      res.status(400).send("We need a title, body and user");

    const post = Post.create({
      title: title,
      body: body,
      userId: user,
    });

    await post.save();
    res.json({ post });
  } catch (err) {
    console.log(err);
  }
});

router.post("/:postid/addtag/:tagid", async (req, res) => {
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

  res.json(post);
});

router.delete("/:postid/deletetag/:tagid", async (req, res) => {
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

  res.json(post);
});

router.delete("/:id/delete", async (req, res) => {
  const id = +req.params.id;
  const post = await Post.findOne({
    where: { id },
  });
  if (!post)
    return res
      .status(404)
      .json({ message: `no post with the id: ${id} was found` });

  const deleted = await Post.delete(id);
  return res.json(deleted);
});

export default router;
