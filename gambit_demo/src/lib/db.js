import { Pool } from 'pg';
import dotenv from 'dotenv'
dotenv.config();
const pool = new Pool({
  user: process.env.DB_USERNAME,       // Your database username
  password: process.env.DB_PASSWORD,   // Your database password
  host: process.env.DB_HOST,           // Your database host (e.g., localhost)
  port: parseInt(process.env.DB_PORT || '5432', 10), // Your database port, default is 5432
  database: process.env.DB_NAME,       // The name of your database
});

export default pool;
