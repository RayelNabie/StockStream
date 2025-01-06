import fs from 'fs';
import path from 'path';

// Configuratie
const LOG_DIR = path.resolve('./logs');
const APP_LOG = path.join(LOG_DIR, 'app.log');
const ERROR_LOG = path.join(LOG_DIR, 'error.log');
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 MB

// Controleer of de logmap en bestanden bestaan
function setupLogs() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }
  if (!fs.existsSync(APP_LOG)) {
    fs.writeFileSync(APP_LOG, '');
  }
  if (!fs.existsSync(ERROR_LOG)) {
    fs.writeFileSync(ERROR_LOG, '');
  }
}

// Rotatie van logbestanden
function rotateLogFile(logFile) {
  const stats = fs.statSync(logFile);
  if (stats.size > MAX_LOG_SIZE) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const archiveName = `${logFile.replace('.log', '')}-${timestamp}.log`;
    fs.renameSync(logFile, archiveName); // Verplaats log naar archief
    fs.writeFileSync(logFile, ''); // Maak een nieuw leeg logbestand
  }
}

// Algemene logfunctie
function log(level, message, logFile) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}\n`;

  // Rotatie controleren
  rotateLogFile(logFile);

  // Schrijf naar het juiste logbestand
  fs.appendFileSync(logFile, logMessage);

  // Altijd naar console loggen
  console.log(logMessage.trim());
}

// Specifieke logniveaus
export function info(message) {
  log('info', message, APP_LOG);
}

export function error(message) {
  log('error', message, ERROR_LOG);
}

export function debug(message) {
  log('debug', message, APP_LOG);
}

// Setup uitvoeren bij import
setupLogs();
