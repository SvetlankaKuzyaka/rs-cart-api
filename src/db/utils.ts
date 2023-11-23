import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: +PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
};

export const invoke = async (query: string, params: any) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    return await client.query(query, params);
  } catch (err) {
    console.log(`Error: ${err}`);
  } finally {
    client.end();
  }
};