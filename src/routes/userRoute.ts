import { Router } from "express";
import User from "../entities/User";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const user = await User.find({ relations: { posts: { comments: true } } });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    const user = await User.findOne({
      where: { id },
    });
    if (!user)
      return res
        .status(404)
        .json({ message: `No user with the id:${id} was found` });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { firstname, lastname, mail } = req.body;

    const user = User.create({
      firstname: firstname,
      lastname: lastname,
      mail: mail,
    });

    await user.save();
    res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/:id/delete", async (req, res) => {
  try {
    const userId = +req.params.id;
    const deleted = await User.delete(userId);
    return res.status(400).json(deleted);
  } catch (err) {
    return res.status(500).json(err);
  }
});

export default router;
