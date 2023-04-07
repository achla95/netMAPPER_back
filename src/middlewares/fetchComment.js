import { findCommentById } from "../db/comments.js"

const fetchComment = async (req, res, next) => {
  const commentId = Number.parseInt(req.params.commentId, 10)
  const comment = await findCommentById(commentId)

  if (req.ctx.util.handleNotFound(comment)) {
    return
  }

  req.ctx.comment = comment

  next()
}

export default fetchComment
