import { findPostById } from "../db/posts.js"
import read from "../db/read.js"
import write from "../db/write.js"
import fetchComment from "../middlewares/fetchComment.js"

const prepareCommentRoutes = (app) => {
  // CREATE
  app.post("/comments", async (req, res) => {
    const {
      body: { content, postId },
      ctx: {
        util: { handleNotFound },
      },
    } = req
    const post = findPostById(postId)

    if (handleNotFound(post)) {
      return
    }

    const { comments } = await read()
    const lastId = comments.lastId + 1
    const comment = {
      id: lastId,
      userId: 1,
      content,
      postId,
      createdAt: new Date().toISOString(),
    }

    await write({
      comments: {
        lastId,
        rows: {
          [lastId]: comment,
        },
      },
    })

    res.send({ result: comment })
  })

  // READ collection
  app.get("/comments", async (req, res) => {
    const {
      ctx: {
        util: { handleNotFound },
      },
    } = req
    const postId = Number.parseInt(req.query.postId, 10)
    const {
      comments: { rows },
    } = await read()
    const comments = Object.values(rows)

    if (!postId) {
      res.send({ result: comments })

      return
    }

    const post = await findPostById(postId)

    if (handleNotFound(post)) {
      return
    }

    const postComments = comments.filter(({ postId }) => postId === post.id)

    res.send({ result: postComments })
  })

  // READ single
  app.get("/comments/:commentId", fetchComment, async (req, res) => {
    res.send({ result: req.ctx.comment })
  })

  // UPDATE
  app.patch("/comments/:commentId", fetchComment, async (req, res) => {
    const {
      body: { content },
      ctx: { comment },
    } = req

    const updateComment = {
      ...comment,
      content: content ?? comment.content,
    }

    await write({
      comments: {
        rows: {
          [comment.id]: updateComment,
        },
      },
    })

    res.send({ result: updateComment })
  })

  // DELETE
  app.delete("/comments/:commentId", fetchComment, async (req, res) => {
    const {
      ctx: { comment },
    } = req

    await write({
      comments: {
        rows: {
          [comment.id]: undefined,
        },
      },
    })

    res.send({ result: comment })
  })
}

export default prepareCommentRoutes
