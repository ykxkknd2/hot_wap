var _ = require('lodash');
var fs = require('fs');

var assets = JSON.parse(fs.readFileSync('assets.json'));

var assetsData = {
    manifest : assets.manifest.js,
    vendor : assets.vendor.js,
};

module.exports = {
    mergeAssets : function(name,options = {}){
        assetsData.page = !assets[name]? {} : assets[name];
        console.log(assetsData)
        return _.assign(options,{assetsData});
    }
};