import mongoose from 'mongoose';

const SignatureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters']
    },
    role: {
      type: String,
      trim: true,
      default: 'Visitor & Innovator',
      maxlength: [120, 'Role cannot be more than 120 characters']
    },
    location: {
      type: String,
      trim: true,
      default: 'Earth',
      maxlength: [120, 'Location cannot be more than 120 characters']
    },
    date: {
      type: String,
      trim: true
    },
    sentiment: {
      type: String,
      default: 'Mind Blown',
      trim: true
    },
    sentimentColor: {
      type: String,
      default: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'
    },
    message: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    signatureDataUrl: {
      type: String,
      default: null
    },
    signatureText: {
      type: String,
      default: null,
      trim: true
    },
    inkColor: {
      type: String,
      default: '#38bdf8'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent re-compilation of model in hot-reload or serverless re-entry
export const Signature = mongoose.models.Signature || mongoose.model('Signature', SignatureSchema);

export default Signature;
