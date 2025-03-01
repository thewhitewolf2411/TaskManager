import { Pool, Client, PoolClient, QueryResult, ClientConfig } from "pg";
import config from "../../../config";
import WithLogger from "../classes/withLogger";


class DB extends WithLogger {
  private pool: Pool;
  private dbConfig: string | ClientConfig;

  constructor(configs: ClientConfig) {
    super();
    this.dbConfig = {
      user: configs.user,
      host: configs.host,
      database: configs.database,
      password: configs.password,
      port: Number(configs.port),
    };

    this.pool = new Pool({
      ...this.dbConfig,
      max: 10,
    });
  }

  query(text: string, params?: any[]): Promise<QueryResult<any>> {
    return this.pool.query(text, params);
  }

  disconnect(): Promise<void> {
    return this.pool.end();
  }

  getClient(callback: (err: Error | undefined, client?: PoolClient, release?: (releaseErr?: Error) => void) => void) {
    this.pool.connect((err: Error | undefined, client: PoolClient | undefined, done: (releaseErr?: Error) => void) => {
      if (err || !client) {
        this.logger.error("Error acquiring client", { error: err });
        return callback(err);
      }

      const { query } = client;
      const timeout = setTimeout(() => {
        this.logger.error("A client has been checked out for more than 5 seconds!");
        this.logger.error(`Last executed query was: ${(client as any).lastQuery}`);
      }, 5000);

      const release = (releaseErr?: Error) => {
        clearTimeout(timeout);
        done();
        if (err) {
          this.logger.error("Client release error", { error: err });
        }
      };

      callback(undefined, client, release);
    });
  }

  async getPgClient(): Promise<Client> {
    const client = new Client(this.dbConfig);
    await client.connect();
    return client;
  }
}

const db = new DB(config.dbConfig);

export default db;
