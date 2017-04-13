"use strict"

let adapter = require('./adapter');

exports.get = (url,callback)=>{
    adapter.client('get',url,(err,_rel)=>{

        if(err){
            return callback(err);
        }

        return callback(null,JSON.parse(_rel));

    });
};