import PostModel from "../db/models/PostModel.js"

const fetchPost = async (req, res, next) => {
  const post = await PostModel.findById(req.params.postId)

  if (req.ctx.util.handleNotFound(post)) {
    return
  }

  req.ctx.post = post

  next()
}

export default fetchPost
