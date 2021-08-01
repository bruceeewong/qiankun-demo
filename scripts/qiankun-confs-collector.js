const shell = require('shelljs');
const path = require('path');

const ROOT_PATH = path.resolve(__dirname, '..')
const APPS_PATH = path.join(ROOT_PATH, 'apps')
const QIANKUN_FILENAME = 'qiankun.config.js';

class QiankunCollectorError extends Error {}

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}
function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function getDirs(path) {
  const pwd = shell.pwd();
  shell.cd(path);
  const dirs = shell.ls('-d', '*/');
  shell.cd(pwd);
  return [...dirs];
}

function getAllQiankunConfigs(dirs) {
  if (!isNonEmptyArray(dirs)) return [];

  const result = [];
  dirs.forEach(dir => {
    const configFilepath = path.join(APPS_PATH, dir, QIANKUN_FILENAME);
    if (!shell.test('-f', configFilepath)) return;  // ignore
    
    const config = require(configFilepath);
    const defaultConfig = config.default;
    if (!isObject(defaultConfig)) return;  // ignore

    result.push(defaultConfig);
  });

  return result;
}

function validateConfigs(configs) {
  if (!isNonEmptyArray(configs)) {
    throw new Error('qiankun subapp configs is empty')
  }

  const checkConflict = (configs, key) => {
    const valueMap = new Map();
    configs.forEach(conf => {
      const value = conf[key];
      if (valueMap.has(value)) {
        throw new Error(`${key} conflict: ${value} | subapp name: ${conf.name}, existed in: ${valueMap.get(value)}`)
      } else {
        valueMap.set(value, conf.name)
      }
    })
  }

  const conflictKeys = ['name', 'activeRule', 'entry'];
  conflictKeys.forEach(key => checkConflict(configs, key));
}

/**
 * collect all the qiankun config of sub app under apps dir
 * @returns {Record<string, any>[]}
 */
function collector(appsDir = APPS_PATH) {
  try {
    const subAppDirs = getDirs(appsDir);
    const configs = getAllQiankunConfigs(subAppDirs);
    validateConfigs(configs);
    return configs;
  } catch(e) {
    throw new QiankunCollectorError(e.message);
  }
}

module.exports = collector;