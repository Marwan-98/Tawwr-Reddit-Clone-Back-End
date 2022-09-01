import {
  Entity,
  BaseEntity,
  ManyToOne,
  Column,
  PrimaryColumn,
  JoinColumn,
  Check,
} from "typeorm";
import Post from "./Post";
import User from "./User";

@Entity()
class Vote extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => User, (user) => user.vote, {
    nullable: false,
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Post, (post) => post.vote, {
    nullable: false,
  })
  @JoinColumn({ name: "postId" })
  post: Post;

  @Column({
    nullable: false,
  })
  @Check(`"value" = 1 or "value" = -1`)
  value: number;
}

export default Vote;
