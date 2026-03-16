import knex from '../db/knex';

class Blog {
  public static table = 'blogs';

  // Create a blog with authorId (string), title, and content
  public static async createBlog(
    title: string,
    content: string,
    authorId: string
  ) {
    const [blog] = await knex(this.table)
      .insert({ title, content, authorId })
      .returning('*');
    return blog;
  }

  // Get all blogs, joined with user info, ordered by createdAt descending
  public static async getAllBlogs() {
    return await knex(this.table)
      .join('users', 'blogs.authorId', 'users.id')
      .select(
        'blogs.*',
        'users.id as userId',
        'users.firstName',
        'users.lastName'
      )
      .orderBy('blogs.createdAt', 'desc');
  }

  // Get a blog by its id, joined with user info
  public static async getBlogById(id: number) {
    return await knex(this.table)
      .join('users', 'blogs.authorId', 'users.id')
      .select(
        'blogs.*',
        'users.id as userId',
        'users.firstName',
        'users.lastName'
      )
      .where('blogs.id', id)
      .first();
  }
}

export default Blog;
