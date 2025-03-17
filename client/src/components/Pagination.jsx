import React, { useEffect } from "react"
import { Pagination, PaginationItem } from "@material-ui/lab"
import { Link, useLocation, useNavigate } from "react-router-dom" // Add useNavigate
import { useDispatch, useSelector } from "react-redux"
import useStyles from "./styles.js"
import { getPosts } from "../actions/posts" // Adjust the path to your action file

const Paginate = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const location = useLocation()

  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get("page")) || 1

  const { posts, totalPages, isLoading } = useSelector((state) => state.posts)

  // Fetch posts when the page changes
  useEffect(() => {
    dispatch(getPosts(page))
  }, [dispatch, page])

  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={totalPages || 1} // Default to 1 instead of 5 if totalPages isn’t available
      page={page}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/posts?page=${item.page}`}
        />
      )}
    />
  )
}

export default Paginate
