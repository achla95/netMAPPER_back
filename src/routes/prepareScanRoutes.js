import ScanModel from "../db/models/ScanModel.js"
import auth from "../middlewares/auth.js"
import fetchScan from "../middlewares/fetchScan.js"

const prepareScanRoutes = (app) => {
  // CREATE
  app.post("/scan", auth, async (req, res) => {
    const { content, command } = req.body
    const {
      ctx: { session },
    } = req
    const scan = await new ScanModel({
      command,
      content,
      user: session.user,
    }).save()

    res.send({ result: scan })
  })

  // READ collection
  app.get("/scans", async (req, res) => {
    const scan = await ScanModel.find()

    res.send({ result: scan })
  })

  // READ single
  app.get("/scans/:scanId", fetchScan, async (req, res) => {
    res.send({ result: req.ctx.post })
  })

  // DELETE
  app.delete("/scans/:scanId", auth, fetchScan, async (req, res) => {
    const { scan } = req.ctx

    await ScanModel.findByIdAndDelete(scan._id)

    res.send({ result: scan })
  })
}

export default prepareScanRoutes
