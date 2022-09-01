import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Post from "./Post";
import User from "./User";

@Entity()
class Comments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column({
    nullable: false,
  })
  body: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  dateCreated: Date;

  @UpdateDateColumn({
    type: "timestamp",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  dateUpdated: Date;

  @ManyToOne(() => Post, (post) => post.comments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user: User;
}

export default Comments;
