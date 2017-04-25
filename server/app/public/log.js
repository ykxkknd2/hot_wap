var path = require('path');
var fs = require('fs');
var log4js = require('log4js');
var execSync = require('child_process').execSync;
var isProduction = process.env['NODE_ENV'] == 'production';
var logsDir = process.env['logs_dir'] || path.join(__dirname,'../../logs');

var filenamePath = path.join(logsDir,"./log_file"),
    dateFileNamePath = path.join(logsDir,"./log_data");

// if(!fs.existsSync(filenamePath))  execSync('mkdir ' + filenamePath) || execSync('mkdir -p ' + filenamePath);
if(!fs.existsSync(dateFileNamePath)) execSync('mkdir ' + dateFileNamePath) || execSync('mkdir -p ' + dateFileNamePath);

var config = {
    "appenders":
    [
        // {
        //     // "category":"log_file",
        //     "type": "file",
        //     "filename": filenamePath + "/file.log",
        //     "maxLogSize": 104800,
        //     "backups": 50
        // }
    ],
    "replaceConsole": true,
    "levels":
    {
        "console":"ALL",
        // "log_file":"ALL",
        "log_date":"ALL"
    }
};

var productionConfig = {
    "category":"log_date",
    "type": "dateFile",
    "filename": dateFileNamePath + "/log",
    "alwaysIncludePattern": true,
    "pattern": "-yyyy-MM-dd-hh.log"
};

var devConfig = {
    "type":"console",
    "category":"console"
};

config.appenders.push(isProduction? productionConfig : devConfig);

log4js.configure(config);

module.exports = log4js.getLogger(isProduction? 'log_date' : 'console');