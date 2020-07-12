const { v4: uuidv4 } = require("uuid");
const { log } = require("./log");

// The Token DB is completely in-memory, 
// if you stop the server it will go away.

let tokenDB = new Map();

const removeExpiredTokens = () => {
  const now = new Date();
  const newTokenDB = new Map();
  tokenDB.forEach((expires, token) => {
    if (expires > now) {
      newTokenDB.set(token, { expires });
    } else {
      log(`Removing token ${token}`);
    }
  });
  tokenDB = newTokenDB;
};

const createToken = ({ maxAge, admin = false }) => {
  removeExpiredTokens();
  const newToken = uuidv4();
  const now = new Date();
  const expires = new Date(Number(now) + maxAge);
  tokenDB.set(newToken, { expires, admin });
  log("New token created: ", newToken, expires);
  return newToken;
};

const getToken = (token) => {
  if (!tokenDB.has(token)) {
    log(`Token ${token} not found.`);
    return null;
  }
  const info = tokenDB.get(token);
  const now = new Date();
  if (info.expires < now) {
    log(`Token ${token} expired.`);
    tokenDB.delete(token);
    return null;
  }
  log(`Token ${token} is valid.`);
  return info;
};

const hasToken = (token) => {
  return getToken(token) !== null;
}

const deleteToken = (token) => {
  if (tokenDB.has(token)) {
    tokenDB.delete(token);
    log("Delete token: ${token}");
    return true;
  }
  log("Attempted to delete token ${token} (not found)");
  return false;
};

module.exports = {
  createToken,
  getToken,
  hasToken,
  deleteToken,
};
