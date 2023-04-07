import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import config from "./src/config.js"
import prepareCommentRoutes from "./src/routes/prepareCommentRoutes.js"
import preparePostRoutes from "./src/routes/preparePostRoutes.js"
import prepareSignRoutes from "./src/routes/prepareSignRoutes.js"

await mongoose.connect(config.db.uri)

const app = express()

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  req.ctx = {
    util: {
      handleNotFound: (x) => {
        if (!x) {
          res.status(404).send({ error: "Not found" })

          return true
        }

        return false
      },
    },
  }

  next()
})

prepareSignRoutes(app)
preparePostRoutes(app)
prepareCommentRoutes(app)

app.listen(config.port, () => console.log(`Listening on :${config.port}`))
