import Comment from '../models/CommentModel';

// Create a comment
export const createComment = (content: string, userId: string, blogId: number) => {
  return Comment.createComment(content, userId, blogId);
};

// Get all comments for a blog, joined with user info
export const getCommentsForBlog = (blogId: number) => {
  return Comment.getCommentsForBlog(blogId);
};