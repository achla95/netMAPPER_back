import ScanModel from "../db/models/ScanModel.js"

const fetchScan = async (req, res, next) => {
  const scan = await ScanModel.findById(req.params.scanId)

  if (req.ctx.util.handleNotFound(scan)) {
    return
  }

  req.ctx.scan = scan

  next()
}

export default fetchScan
