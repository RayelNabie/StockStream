import { envConfig } from './env.js';

export const loggerConfig = {
  logLevel: envConfig.logLevel || 'info', // Standaard logniveau
  logDir: './logs',                      // Map waar logbestanden worden opgeslagen
  maxFileSize: 5 * 1024 * 1024,          // Maximale grootte van logbestanden (5 MB)
  consoleOutput: true,                   // Toon logs ook in de console
};