// pages/api/test-connection.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ success: true, time: result.rows[0].now });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(500).json({ success: false, message: 'Error connecting to the database' });
  }
}
