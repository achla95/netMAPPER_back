import read from "./read.js"

export const findCommentById = async (commentId) => {
  const {
    comments: {
      rows: { [commentId]: comment },
    },
  } = await read()

  return comment
}
