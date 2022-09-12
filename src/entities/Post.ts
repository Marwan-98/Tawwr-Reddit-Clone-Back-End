import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import Comments from "./Comment";
import Tags from "./Tags";
import User from "./User";
import Vote from "./Vote";

@Entity()
class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column()
  body: string;

  @CreateDateColumn({
    type: "timestamp",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user: User;

  @OneToMany(() => Comments, (comments) => comments.post)
  comments: Comments[];

  @OneToMany(() => Vote, (vote) => vote.post)
  vote: Vote[];

  @ManyToMany(() => Tags, {
    cascade: true,
  })
  @JoinTable({ name: "postTags" })
  tags: Tags[];
}

export default Post;
