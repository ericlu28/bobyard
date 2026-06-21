// Comment interface, mirrors backend response.
export interface Comment {
  id: number;
  author: string;
  text: string;
  date: string; // raw ISO8601 string, e.g. "2015-09-01T12:00:00Z"
  likes: number;
  image: string;
}

// Request body for adding/editing a comment
export interface CommentRequest {
  text: string;
  image?: string;
}
