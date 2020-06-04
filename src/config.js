require("dotenv").config();
const path = require('path');

const getEnvVar = (varName) => {
  const variable = process.env[varName];
  if (!variable) {
    console.error(`Environment variable ${varName} not set.`);
    process.exit(1);
  }
  return variable;
};

const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const VIDEO_DIR = getEnvVar("VIDEO_DIR");

const ABS_VIDEO_DIR = path.isAbsolute(VIDEO_DIR)
  ? VIDEO_DIR
  : path.resolve(VIDEO_DIR);

module.exports = {
  LOG: process.env.LOG || false, // This variable is not required
  MAX_AGE: 12 * HOUR,
  THUMBNAIL_DIR: ABS_VIDEO_DIR + '/.thumbnails',
  
  PORT: getEnvVar("PORT"),
  PASSWORD: getEnvVar("PASSWORD"),
  ADMIN_PASSWORD: getEnvVar("ADMIN_PASSWORD"),
  VIDEO_DIR: ABS_VIDEO_DIR,
  TITLE: getEnvVar("TITLE"),
};
