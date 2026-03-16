import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("comments", (table) => {
    table.increments("id").primary();
    table.text("content").notNullable();
    table.string("user_id").notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.integer("blog_id").notNullable()
      .references("id").inTable("blogs").onDelete("CASCADE");
    table.timestamps(true, true); // created_at and updated_at
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("comments");
}

