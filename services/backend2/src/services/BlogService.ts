import Blog from '../models/BlogModel';

// Create a blog post
export const createBlogPost = (title: string, content: string, authorId: string) => {
  return Blog.createBlog(title, content, authorId);
};

// List all blogs with user info
export const listBlogs = () => {
  return Blog.getAllBlogs();
};

// Find a blog by ID with user info
export const findBlogById = (id: number) => {
  return Blog.getBlogById(id);
};

