import { Schema } from "mongoose"

const EmbeddedUserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
)

export default EmbeddedUserSchema
