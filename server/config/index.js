const fs = require('fs');
const { resolve } = require('path');
const ModuleAlias = require('module-alias');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.tmp = process.env.tmp || '/tmp';

ModuleAlias.addAliases({
  '@': resolve(__dirname, '..', fs.existsSync(resolve(__dirname, '..', 'dist')) ? 'dist' : 'src'),
  '@config': resolve(__dirname, '..', 'config')
})

module.exports = {
  protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  port: 9999,
  bodyParser: {
    limit: '50mb',
    extended: true
  },
  logs: {
    directory: resolve(__dirname, '..', 'logs'),
    filename: 'logfile.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 25,
    colorize: false
  },

  authentication: {
    userPasswordSalt: 8,
    expiresIn: 60*60*24,
    jwtSecret: "super-secret",
  },

  dateFormat: 'DD MMM YY, H:mm:ss',

  // Database
  storageLimits: {
    userLoginHistory: 12
  },
  development: {
    username: "root",
    password: "root",
    storage: "database.sqlite",
    host: "localhost",
    dialect: "sqlite",
    logging: true
  },
  test: {
    username: "root",
    password: "root",
    storage: "database_test.sqlite",
    host: "localhost",
    dialect: "sqlite",
    logging: true
  },
  production: {
    username: "root",
    password: "root",
    storage: "database_production.sqlite",
    host: "localhost",
    dialect: "sqlite",
    logging: false
  }
};
