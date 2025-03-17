import {
  FETCH_ALL,
  CREATE,
  UPDATE,
  LIKE,
  DELETE,
  FETCH_BY_SEARCH,
} from "../constants/actionTypes"

// Initial state is an object with posts array, totalPages, and currentPage
const initialState = {
  posts: [],
  totalPages: 0,
  currentPage: 1,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case DELETE:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== action.payload),
      }
    case UPDATE:
    case LIKE:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        ),
      }
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.posts,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
      }
    case FETCH_BY_SEARCH:
      return {
        ...state,
        posts: action.payload,
      }
    case CREATE:
      return {
        ...state,
        posts: [...state.posts, action.payload],
      }
    default:
      return state
  }
}
