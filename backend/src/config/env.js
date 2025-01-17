import "dotenv/config.js";

// Laad de variabelen uit het .env-bestand
dotenv.config();

// Exporteer alleen verwijzingen naar `process.env`
export const envConfig = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/defaultdb',
  jwtSecret: process.env.JWT_SECRET || 'default_secret'
};
