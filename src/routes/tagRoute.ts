import { Router } from "express";
import Tags from "../entities/Tags";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tags = await Tags.find();
    return res.status(200).json(tags);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    const tag = await Tags.findBy({ id: id });
    return res.status(200).json(tag);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tags.findOne({
      where: {
        name: name,
      },
    });
    if (!tag) {
      const tags = await Tags.create({
        name: name,
      });
      await tags.save();
      return res.status(200).json(tags);
    } else {
      return res.status(409).send("tag already created!!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
