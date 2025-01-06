import dotenv from 'dotenv';

// Laad de variabelen uit het .env-bestand
dotenv.config();

// Exporteer alleen verwijzingen naar `process.env`
export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb',
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  logLevel: process.env.LOG_LEVEL || 'info',
};
