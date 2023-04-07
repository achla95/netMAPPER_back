import { Schema } from "mongoose"
import EmbeddedUserSchema from "./EmbeddedUserSchema.js"

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String],
    publishedAt: Date,
    author: {
      type: EmbeddedUserSchema,
      required: true,
    },
    comments: {
      type: [
        new Schema({
          content: {
            type: String,
            required: true,
          },
          author: {
            type: EmbeddedUserSchema,
            required: true,
          },
        }),
      ],
    },
  },
  {
    timestamps: true,
  }
)

export default PostSchema
