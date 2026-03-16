import knex from '../db/knex';

class Comment {
  public static table = 'comments';

  // Create a comment with content, userId, and blogId
  public static async createComment(
    content: string,
    userId: string,
    blogId: number
  ) {
    const [comment] = await knex(this.table)
      .insert({ content, userId, blogId })
      .returning('*');
    return comment;
  }

  // Get all comments for a blog, joined with user info, ordered by createdAt ascending
  public static async getCommentsForBlog(blogId: number) {
    return await knex(this.table)
      .join('users', 'comments.userId', 'users.id')
      .select(
        'comments.*',
        'users.id as userId',
        'users.firstName',
        'users.lastName'
      )
      .where('comments.blogId', blogId)
      .orderBy('comments.createdAt', 'asc');
  }
}

export default Comment;