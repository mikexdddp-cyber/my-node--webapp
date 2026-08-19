const mysql = require('mysql2');
require('dotenv').config();

// Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ตรวจสอบการเชื่อมต่อฐานข้อมูล
pool.getConnection((err, connection) => {
  if (err) {
    console.error('เกิดข้อผิดพลาด:', err.message);
  } else {
    console.log('เชื่อมต่อฐานข้อมูล MySQL สำเร็จ!');
    connection.release();
  }
});

module.exports = pool.promise();