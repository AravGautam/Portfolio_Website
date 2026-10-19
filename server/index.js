import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dbConnect from '../src/lib/dbConnect.js';
import Signature from '../src/models/Signature.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 signature images

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const conn = await dbConnect();
    return res.json({
      status: 'online',
      database: conn.connection.name,
      host: conn.connection.host,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET all signatures
app.get('/api/signatures', async (req, res) => {
  try {
    await dbConnect();
    const signatures = await Signature.find({}).sort({ createdAt: -1 }).limit(100).lean();
    return res.json({
      success: true,
      count: signatures.length,
      data: signatures
    });
  } catch (error) {
    console.error('Error fetching signatures:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST new signature
app.post('/api/signatures', async (req, res) => {
  try {
    await dbConnect();
    const {
      name,
      role,
      location,
      date,
      sentiment,
      sentimentColor,
      message,
      signatureDataUrl,
      signatureText,
      inkColor
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const newSignature = await Signature.create({
      name: name.trim(),
      role: role ? role.trim() : 'Visitor',
      location: location ? location.trim() : '',
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      sentiment: sentiment || 'Mind Blown',
      sentimentColor: sentimentColor || 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
      message: message ? message.trim() : '',
      signatureDataUrl: signatureDataUrl || null,
      signatureText: signatureText ? signatureText.trim() : null,
      inkColor: inkColor || '#38bdf8'
    });

    console.log(`[MongoDB] New signature saved from: ${newSignature.name} (${newSignature.location})`);

    return res.status(201).json({
      success: true,
      data: newSignature
    });
  } catch (error) {
    console.error('Error creating signature:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Start Express server and verify DB connection
async function startServer() {
  try {
    const conn = await dbConnect();
    console.log(`-----------------------------------------------`);
    console.log(`[MongoDB] Connected successfully to database: ${conn.connection.name}`);
    console.log(`[MongoDB] Host: ${conn.connection.host}`);
    console.log(`-----------------------------------------------`);

    app.listen(PORT, () => {
      console.log(`[Server] Local backend API listening on http://localhost:${PORT}`);
      console.log(`[Server] Endpoints:`);
      console.log(`         GET  http://localhost:${PORT}/api/health`);
      console.log(`         GET  http://localhost:${PORT}/api/signatures`);
      console.log(`         POST http://localhost:${PORT}/api/signatures`);
      console.log(`-----------------------------------------------`);
    });
  } catch (err) {
    console.error('[Server Error] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();
