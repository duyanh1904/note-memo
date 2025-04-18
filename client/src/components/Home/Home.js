import React, { useState, useEffect } from "react"
import {
  Container,
  Grow,
  Grid,
  Paper,
  AppBar,
  TextField,
  Button,
} from "@material-ui/core"
import Posts from "../Posts/Posts"
import Form from "../Form/Form"
import ChipInput from "material-ui-chip-input"
import { useDispatch } from "react-redux"
import { getPosts, getPostsBySearch } from "../../actions/posts"
import useStyles from "./styles"
import Pagination from "../Pagination"
import { useLocation, useNavigate } from "react-router-dom"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export const Home = () => {
  const [currentId, setCurrentId] = useState(null)
  const classes = useStyles()
  const dispatch = useDispatch()
  const query = useQuery()
  const navigate = useNavigate()
  const page = query.get("page") || 1
  const searchQuery = query.get("searchQuery")
  const [search, setSearch] = useState("")
  const [tags, setTags] = useState([])
  const searchPost = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(",") }))
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(
          ","
        )}&page=1`
      )
    } else {
      navigate("/")
    }
  }

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      //logic search
      searchPost()
    }
  }
  const handleAdd = (tag) => setTags([...tags, tag])
  const handleDelete = (tagToDelete) =>
    setTags(tags.filter((tag) => tag !== tagToDelete))

  useEffect(() => {
    dispatch(getPosts())
  }, [currentId, dispatch])
  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          className={classes.gridContainer}
          container
          justify="space-between"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppBar
              className={classes.appBarSearch}
              position="static"
              color="inherit"
            >
              <TextField
                name="search"
                variant="outlined"
                label="Search Memories"
                fullWidth
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
                onKeyUp={handleKeyPress}
              />
              <ChipInput
                style={{ margin: "10px 0" }}
                value={tags}
                onAdd={handleAdd}
                onDelete={handleDelete}
                label="Search Tags"
                variant="outlined"
              />
              <Button
                className={classes.searchButton}
                onClick={searchPost}
                color="primary"
                variant="contained"
              >
                Search
              </Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            <Paper className={classes.pagination} elevation={6}>
              <Pagination />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  )
}
