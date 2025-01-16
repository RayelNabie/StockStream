import mongoose from 'mongoose';
import { config } from './env.js';
import { info, error } from '../utils/logger.js';

export async function connectToDatabase() {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    info('Succesvol verbonden met MongoDB');
  } catch (err) {
    error(`MongoDB-verbinding mislukt: ${err.message}`);
    process.exit(1); // Stop de applicatie bij verbindingsfout
  }
}