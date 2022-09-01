import { Router } from "express";
import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import Tags from "../entities/Tags";

const router = Router();

router.get("/", async (req, res) => {
  const tags = await Tags.find();
  return res.json(tags);
});

router.get("/:id", async (req, res) => {
  const id = +req.params.id;
  const tag = await Tags.findBy({ id: id });
  return res.json(tag);
});

router.post("/new", async (req, res) => {
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
    return res.json(tags);
  } else {
    return res.send("tag already created!!");
  }
});

export default router;
