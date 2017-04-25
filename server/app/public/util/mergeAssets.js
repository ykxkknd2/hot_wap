var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var log = require('../log');
var schedule = require('node-schedule');

var assets = getAssets();

function getAssets(){
    return JSON.parse(fs.readFileSync(path.join(__dirname,'../../../conf/assets.json')));
}

log.info('启动定时更新 assets.json');
schedule.scheduleJob('*/5 * * * *', function(){
    assets = getAssets();
    log.info("更新 assets.json",assets);
});

var assetsData = {
    manifest : assets.manifest.js,
    vendor : assets.vendor.js,
    pb_args : assets.pb_args.js
};


module.exports = function(name,options = {}){
    assetsData.page = !assets[name]? {} : assets[name];
    return _.assign(options,{assetsData});
};