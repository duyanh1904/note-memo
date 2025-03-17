import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query.perPage) || 10
    const skip = (page - 1) * perPage

    const postMessages = await PostMessage.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(perPage)

    const totalPosts = await PostMessage.countDocuments()
    const totalPages = Math.ceil(totalPosts / perPage)

    res.status(200).json({
      posts: postMessages,
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalPosts,
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getPostsBySearch = async (req, res) => {
  try {
    const { searchQuery } = req.query
    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query.perPage) || 10
    const skip = (page - 1) * perPage

    console.log("searchQuery", searchQuery)

    const searchFilter = searchQuery
      ? {
          $or: [
            { title: { $regex: searchQuery, $options: "i" } },
            { message: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {}

    const postMessages = await PostMessage.find(searchFilter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(perPage)

    const totalPosts = await PostMessage.countDocuments(searchFilter)
    const totalPages = Math.ceil(totalPosts / perPage)

    res.status(200).json({
      posts: postMessages,
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalPosts,
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  const post = req.body
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  })

  try {
    await newPost.save()

    res.status(201).json(newPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updatePost = async (req, res) => {
  const { id: _id } = req.params
  const post = req.body

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id")

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  })

  res.json(updatedPost)
}

export const deletePost = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id")

  const updatedPost = await PostMessage.findByIdAndRemove(id)

  res.json({ message: "Delete success" })
}

export const likePost = async (req, res) => {
  const { id } = req.params

  if (!req.userId) return res.json({ message: "Unauthenticated" })

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id")

  const post = await PostMessage.findById(id)
  const index = post.likes.findIndex((id) => id === String(req.userId))

  if (index === -1) {
    post.likes.push(req.userId)
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId))
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  })
  res.json(updatedPost)
}
