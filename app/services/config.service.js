'use strict';

const { remote } = require('electron');
const fs = require('fs');

/**
 * https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname
 *
 * appData Per-user application data directory, which by default points to:
 *  - %APPDATA% on Windows
 *  - $XDG_CONFIG_HOME or ~/.config on Linux
 *  - ~/Library/Application Support on macOS
 * userData The directory for storing your app's configuration files,
 * which by default it is the appData directory appended with your app's name.
 */

const ConfigService = function(configPath) {
  if (!configPath) throw new Error('ConfigService must supplied a path to the configuration');
  this.configPath = configPath;
  this.configFileName = 'config.json';
  this.fullConfigPath = this.configPath + '/' + this.configFileName;
};

const defaultConfig = {
  connections: []
};

ConfigService.prototype.readConfigFile = function() {
  return new Promise((resolve, reject) => {
    fs.readFile(this.fullConfigPath, {
      encoding: 'utf-8'
    }, (err, data) => {
      // console.log(" ***readConfigFile", data)
      if (err) {

        resolve(this.writeConfigFile(defaultConfig));

        // TODO: Research File not found errors
        // This works on mac, but not windows
        if (err && err.errno === -2) {
        }
      } else if (!data) {
        resolve(this.writeConfigFile(defaultConfig));
      } else {

        const config = JSON.parse(data);

        // Looks for "favorites" field from versions 0.0.3 and prior and replaces it
        if (config.favorites) {
          config.connections = config.favorites;
          delete config.favorites;
          resolve(this.writeConfigFile(config));
        } else {
          resolve(config);
        }
      }
    });
  });
};

ConfigService.prototype.writeConfigFile = function(data) {
  return new Promise((resolve, reject) => {

    let wipedConnections;
    if (data.connections) {
      wipedConnections = data.connections.map(c => {
        return Object.assign({}, c, { pass: void 0, ca: void 0 });
      });
    }
    const wipedData = Object.assign({}, data, { connections: wipedConnections });
    // console.log(' ***      wipedData', wipedData); // eslint-disable-line no-console

    fs.writeFile(this.fullConfigPath, JSON.stringify(wipedData), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(wipedData);
      }
    });
  });
};

const service = configPath => {

  if (global.configPath) {
    return new ConfigService(global.configPath)
  } else {
    return new ConfigService(remote.getGlobal('configPath'));
  }

};

module.exports = service();
