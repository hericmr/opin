// knexfile.cjs
// Configuração do Knex para rodar migrações em um Postgres local

require("dotenv").config();

const path = require("path");

/** @type {import("knex").Knex.Config} */
const config = {
  client: "pg",
  connection:
    process.env.DATABASE_URL ||
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "opin_user",
      password: process.env.DB_PASSWORD || "opin_password",
      database: process.env.DB_NAME || "opin_local",
    },
  migrations: {
    directory: path.join(__dirname, "../migrations"),
    tableName: "knex_migrations",
  },
};

module.exports = config;


