import { Schema } from "mongoose"
import EmbeddedUserSchema from "./EmbeddedUserSchema.js"

const ScanSchema = new Schema(
  {
    ipAddress: {
      type: String,
      required: true,
    },
    result: {
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
