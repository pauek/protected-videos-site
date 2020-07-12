const getEnvVar = (varName) => {
  const variable = process.env[varName];
  if (!variable) {
    console.error(`Environment variable ${varName} not set.`);
    process.exit(1);
  }
  console.log("Found env variable:", variable);
  return variable;
};

const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

module.exports = {
  LOG: "true",
  MAX_AGE: 12 * HOUR,
  THUMBNAIL_DIR: '/videos/.thumbnails',
  PORT: 8080,
  PASSWORD: getEnvVar("PASSWORD"),
  ADMIN_PASSWORD: getEnvVar("ADMIN_PASSWORD"),
  VIDEO_DIR: '/videos',
  TITLE: getEnvVar("TITLE"),
};
