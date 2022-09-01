import { DataSource } from "typeorm";
import { config } from "dotenv";
import Comments from "./entities/Comment";
import Post from "./entities/Post";
import Tags from "./entities/Tags";
import User from "./entities/User";
import Vote from "./entities/Vote";

config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST,
  port: +process.env.PGPORT!,
  username: process.env.USER,
  password: process.env.PASS,
  synchronize: true,
  entities: [Post, User, Comments, Vote, Tags],
  database: "postgres",
});

export default AppDataSource;
