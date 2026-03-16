import knex from "../db/knex";

class User {
  public static table = "users";

  public static async addUser(
    id: string,
    firstName: string,
    lastName: string
  ) {
    const insertedValue = await knex(this.table)
      .insert({
        id,
        firstName,
        lastName,
      })
      .returning("*");
    return insertedValue;
  }

  public static async getUserById(id: string) {
    const user = await knex(this.table).where({ id }).first();
    return user;
  }
}

export default User;
