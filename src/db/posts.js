import read from "./read.js"

export const findPostById = async (postId) => {
  const {
    posts: {
      rows: { [postId]: post },
    },
  } = await read()

  return post
}
