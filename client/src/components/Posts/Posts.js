import React from "react"
import { Grid, CircularProgress } from "@material-ui/core"
import { useSelector } from "react-redux"

import Post from "./Post/Post"
import useStyles from "./styles"

const Posts = ({ setCurrentId }) => {
  const { posts } = useSelector((state) => state.posts)
  const classes = useStyles()

  return !posts.length ? (
    <CircularProgress style={{ color: "#ef1e7a" }} />
  ) : (
    <Grid
      className={classes.container}
      container
      alignItems="stretch"
      spacing={3}
    >
      {posts.map((post) => (
        <Grid key={post._id} item xs={12} sm={6}>
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  )
}

export default Posts
