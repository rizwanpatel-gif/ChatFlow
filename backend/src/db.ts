import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export const initDb = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS flows (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(255) NOT NULL DEFAULT 'My Flow',
      nodes      JSONB        NOT NULL DEFAULT '[]',
      edges      JSONB        NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `)
  console.log('Database ready')
}
