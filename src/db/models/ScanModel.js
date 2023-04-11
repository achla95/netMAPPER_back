import { model } from "mongoose"
import ScanSchema from "../schemas/ScanSchema.js"

const ScanModel = model("Scan", ScanSchema)

export default ScanModel
