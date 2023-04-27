import ScanModel from "../db/models/ScanModel.js"
import auth from "../middlewares/auth.js"
import fetchScan from "../middlewares/fetchScan.js"
import { spawn } from "node:child_process"
import jwt from "jsonwebtoken"

const nmapScan = (address, options) => {
  return new Promise((resolve, reject) => {
    const splittedOptions = []
    for (let i = 0; i < options.length; i++) {
      splittedOptions.push(options[i].split(" "))
    }
    const optionsFormated = splittedOptions.flat()

    const nmap = spawn("nmap", [address, ...optionsFormated])

    let stdout = ""
    nmap.stdout.on("data", (data) => {
      stdout += data.toString()
    })

    let stderr = ""
    nmap.stderr.on("data", (data) => {
      stderr += data.toString()
    })

    nmap.on("exit", (code) => {
      console.log(`Nmap exited with code ${code}`)

      if (code === 0) {
        resolve(stdout)
      } else {
        reject(
          new Error(`Nmap exited with error code ${code}. stderr: ${stderr}`)
        )
      }
    })
  })
}

const prepareScanRoutes = (app) => {
  app.post("/scan", auth, async (req, res) => {
    const { ipAddress, options, command } = req.body
    const {
      ctx: { session },
    } = req

    try {
      const result = await nmapScan(ipAddress, options)
      const scan = await new ScanModel({
        ipAddress,
        command,
        result,
        user: session.user,
      }).save()

      res.send({ result: scan })
    } catch (error) {
      console.error(error)
      res.status(500).send(error.message)
    }
  })

  app.get("/scans", auth, async (req, res) => {
    const token = req.headers.authorization
    const decodedToken = jwt.decode(token)
    const userId = decodedToken.payload.user.id
    const scans = await ScanModel.find({
      "user.id": userId,
    })
    const allScans = []
    scans.forEach((scan) => {
      allScans.push(scan)
    })
    res.send({ result: allScans })
  })

  app.get("/scans/:scanId", fetchScan, async (req, res) => {
    res.send({ result: req.ctx.scan })
  })

  app.delete("/scans/:scanId", auth, fetchScan, async (req, res) => {
    const { scan } = req.ctx

    await ScanModel.findByIdAndDelete(scan._id)

    res.send({ result: scan })
  })
}

export default prepareScanRoutes
