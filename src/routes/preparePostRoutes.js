import PostModel from "../db/models/PostModel.js"
import auth from "../middlewares/auth.js"
import fetchPost from "../middlewares/fetchPost.js"

const preparePostRoutes = (app) => {
  // CREATE
  app.post("/posts", auth, async (req, res) => {
    const { title, content, tags, publishedAt } = req.body
    const {
      ctx: { session },
    } = req
    const post = await new PostModel({
      title,
      content,
      tags,
      publishedAt: publishedAt || new Date().toISOString(),
      author: session.user,
    }).save()

    res.send({ result: post })
  })

  // READ collection
  app.get("/posts", async (req, res) => {
    const posts = await PostModel.find()

    res.send({ result: posts })
  })

  // READ single
  app.get("/posts/:postId", fetchPost, async (req, res) => {
    res.send({ result: req.ctx.post })
  })

  // UPDATE
  app.patch("/posts/:postId", auth, fetchPost, async (req, res) => {
    const { title, content, tags, publishedAt } = req.body
    const { post } = req.ctx

    Object.assign(post, {
      title: title ?? post.title,
      content: content ?? post.content,
      tags: tags ?? post.tags,
      publishedAt: publishedAt ?? post.publishedAt,
    })

    await post.save()

    res.send({ result: post })
  })

  // DELETE
  app.delete("/posts/:postId", auth, fetchPost, async (req, res) => {
    const { post } = req.ctx

    await PostModel.findByIdAndDelete(post._id)

    res.send({ result: post })
  })
}

export default preparePostRoutes
