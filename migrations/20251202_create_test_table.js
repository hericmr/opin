// Exemplo de migração de teste com Knex

/**
 * @param {import("knex").Knex} knex
 */
exports.up = async function up(knex) {
  // Cria uma tabela simples apenas para teste local
  const exists = await knex.schema.hasTable("test_table");
  if (!exists) {
    await knex.schema.createTable("test_table", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists("test_table");
};


