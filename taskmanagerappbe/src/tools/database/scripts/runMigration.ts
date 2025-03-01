import { createDb, migrate } from "postgres-migrations";
import { Client } from "pg";
import config from "../../../config";

const { dbMigrationPath: filePath, dbConfig } = config

const dropMigrations = async () => {
  const client = new Client(dbConfig)

  await client.connect()
  console.log("Dropping migrations table")
  await client.query("DROP TABLE IF EXISTS migrations;")
  await client.end()
}

const runDbPatches = async () => {
  if (process.env.IS_DEV) await dropMigrations()

  await createDb(dbConfig.database, dbConfig)

  await migrate(dbConfig, filePath)
  console.log("Migrations done")
}

runDbPatches().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
