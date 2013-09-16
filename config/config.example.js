
/**
 * WebTools - Configurations
 * Copyright(c) 2013 CHH <chh@chh.tw>
 * MIT Licensed
 */

var path     = require('path')
  , rootPath = path.normalize(__dirname + '..')
  , env      = process.env.NODE_ENV || 'development';

var config = {

  development: {
    root: rootPath,
    port: 3000,
    db: {
      url: 'mongodb://localhost:27017/webtools-development',
      options: {}
    },
    secret_token: '3a78a9efe2829c9cfc7284efb18ac4985478942cd9168e325e2175b9153c9573',
    admin: []
  },

  test: {
    root: rootPath,
    port: 3000,
    db: {
      url: 'mongodb://localhost:27017/webtools-test',
      options: {}
    },
    secret_token: '3a78a9efe2829c9cfc7284efb18ac4985478942cd9168e325e2175b9153c9573',
    admin: []
  },

  production: {
    root: rootPath,
    port: 3000,
    db: {
      url: 'mongodb://localhost:27017/webtools-production',
      options: {
        user: '',
        pass: ''
      }
    },
    secret_token: '3a78a9efe2829c9cfc7284efb18ac4985478942cd9168e325e2175b9153c9573',
    admin: []
  }

}

module.exports = config[env];
