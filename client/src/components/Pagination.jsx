import React, { useEffect } from 'react';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link, useLocation } from 'react-router-dom'; // Add useLocation
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles.js';
import { getPosts } from '../actions/posts'; // Adjust the path to your action file

const Paginate = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation(); // Get URL info

  // Extract page from URL query (e.g., ?page=2)
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page')) || 1; // Default to 1 if not in URL

  // Get pagination data from Redux store
  const { totalPages } = useSelector((state) => state.posts);

  // Fetch posts when the page changes
  useEffect(() => {
    dispatch(getPosts(page)); // Dispatch action to fetch posts for the current page
  }, [dispatch, page]);

  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={totalPages || 5} // Total pages from Redux, default to 5 if not available
      page={page} // Use page from URL query
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/posts?page=${item.page}`} // Dynamic page link
        />
      )}
    />
  );
};

export default Paginate;