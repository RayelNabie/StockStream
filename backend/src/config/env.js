import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: process.env.DB_PORT || "27017",
  dbName: process.env.DB_NAME || "defaultdb",
  serverPort: process.env.PORT || "3000",
  serverUrl: `http://${process.env.DB_HOST || "127.0.0.1"}:${process.env.PORT || "3000"}`,
  mongoUri: `mongodb://${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "27017"}/${process.env.DB_NAME || "defaultdb"}`,
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  logLevel: process.env.LOG_LEVEL || "info"
};