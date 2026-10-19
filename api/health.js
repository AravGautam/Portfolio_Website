import dbConnect from '../src/lib/dbConnect.js';

export default async function handler(req, res) {
  try {
    const conn = await dbConnect();
    return res.status(200).json({
      status: 'online',
      database: conn.connection.name,
      host: conn.connection.host,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}
