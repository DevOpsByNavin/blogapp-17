import Knex from "knex";
import config from "./knexfile";

// @ts-ignore
import knexStringCase from "knex-stringcase";

const knexStringCaseConfig = knexStringCase(
  config[process.env.NODE_ENV || "local"] as any,
);

const knex = Knex(knexStringCaseConfig);

export default knex;