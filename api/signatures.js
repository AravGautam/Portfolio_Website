import dbConnect from '../src/lib/dbConnect.js';
import Signature from '../src/models/Signature.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await dbConnect();

    if (req.method === 'GET') {
      const signatures = await Signature.find({}).sort({ createdAt: -1 }).limit(100).lean();
      return res.status(200).json({
        success: true,
        count: signatures.length,
        data: signatures
      });
    }

    if (req.method === 'POST') {
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

      return res.status(201).json({
        success: true,
        data: newSignature
      });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('API Error in /api/signatures:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
}
