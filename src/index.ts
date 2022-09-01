import express, { json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";
import AppDataSource from "./data-source";
import postRouter from "./routes/postRoutes";
import userRoute from "./routes/userRoute";
import commentRoute from "./routes/commentRoute";
import voteRoute from "./routes/voteRoute";
import tagRoute from "./routes/tagRoute";

const app = express();

config();
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/posts", postRouter);
app.use("/users", userRoute);
app.use("/comments", commentRoute);
app.use("/votes", voteRoute);
app.use("/tags", tagRoute);

app.listen(4000, () => {
  console.log("running");
  AppDataSource.initialize();
});
