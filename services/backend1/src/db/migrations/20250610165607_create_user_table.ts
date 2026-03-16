import type { Knex } from "knex";

export async function up(knex:Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.timestamps(true, true); // created_at and updated_at
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}

