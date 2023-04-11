import { Schema } from "mongoose"
import EmbeddedUserSchema from "./EmbeddedUserSchema.js"

const ScanSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    command: {
      type: String,
      required: true,
    },
    user: {
      type: EmbeddedUserSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default ScanSchema
