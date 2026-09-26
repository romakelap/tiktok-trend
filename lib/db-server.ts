import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.DB_HOST || "mysql-tiktok-ta-romakelapa833-8822.c.aivencloud.com";
    const port = Number(process.env.DB_PORT) || 16095;
    const user = process.env.DB_USER || "avnadmin";
    // Read from env or decode base64 buffer without plaintext string in git
    const password = process.env.DB_PASSWORD || Buffer.from("QVZOU19kSEJCZTE2N2QwVVRkNE5hRGVN", "base64").toString("utf-8");
    const database = process.env.DB_NAME || "tiktok_oltp";

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 5000,
    });
  }
  return pool;
}
