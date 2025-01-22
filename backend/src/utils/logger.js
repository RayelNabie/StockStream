import fs from 'fs';
import path from 'path';
import { loggerConfig } from '../config/loggerConfig.js';

// Padinstellingen
const LOG_DIR = path.resolve(loggerConfig.logDir);
const APP_LOG = path.join(LOG_DIR, 'app.log');
const ERROR_LOG = path.join(LOG_DIR, 'error.log');

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
  if (stats.size > loggerConfig.maxFileSize) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const archiveDir = path.join(LOG_DIR, 'archive');
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir);
    }
    const archiveName = path.join(archiveDir, `${path.basename(logFile, '.log')}-${timestamp}.log`);
    fs.renameSync(logFile, archiveName);
    fs.writeFileSync(logFile, '');
  }
}

// Algemene logfunctie
function log(level, message, logFile, metadata = {}) {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(metadata).length > 0 ? ` | Metadata: ${JSON.stringify(metadata)}` : '';
  const logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}${metaString}\n`;

  rotateLogFile(logFile);

  fs.appendFileSync(logFile, logMessage);

  if (loggerConfig.consoleOutput) {
    console.log(logMessage.trim());
  }
}

// Specifieke logniveaus
export function info(message, metadata = {}) {
  log('info', message, APP_LOG, metadata);
}

export function error(message, metadata = {}) {
  log('error', message, ERROR_LOG, metadata);
}

export function debug(message, metadata = {}) {
  if (loggerConfig.logLevel === 'debug') {
    log('debug', message, APP_LOG, metadata);
  }
}

// Initialiseer de logs
setupLogs();
