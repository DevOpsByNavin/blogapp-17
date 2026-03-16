import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("blogs", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.string("author_id").notNullable()
      .references("id").inTable("users").onDelete("CASCADE");
    table.timestamps(true, true); // created_at and updated_at
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("blogs");
}

