/**
 *  Created by ZY on 2016/03/03
 */
var _ = require('lodash'),
    http = require('http'),
    url = require('url');

/**
 * 进行http请求
 */
var keepAliveAgent = new http.Agent({
    keepAlive: true
});

function Adapter(options) {}

Adapter.prototype.client = function() {

    var client = http,
        self,
        method,
        params,
        interface_url,
        callback,
        begin = new Date(),
        send = false,
        timeout = 3000;
    //判断参数
    if (arguments.length < 3) {
        self.emit('error', 'params is null');
        return;
    }

    method = arguments[0], interface_url = arguments[1], op = arguments[2], params = [], callback = arguments[arguments.length - 1];

    // if (config.outconsole.adapter) {
    //     Log.logger('client http begin ' + method + " url:" + interface_url + " connection...");
    // }

    var options = url.parse(interface_url);
    options = Object.assign(options, op);
    options.agent = keepAliveAgent;
    params.push(options);

    //params 存放http 请求参数
    if (arguments.length > 4) {
        //params.push([].slice.call(arguments,3,arguments.length-1));
        timeout = arguments[3] || timeout;
    }


    params.push(function(response) {
        var resText = [];
        var size = 0;
        if (response.statusCode && response.statusCode != 200) {

            console.error("error", 'http:' + method + ":::::" + interface_url + " error:net occur error:statusCode is not 200 ...,it is " + response.statusCode);
            if (!send) {
                send = true;
                return callback(new Error("状态码异常"));
            }
        }
        response.on('data', function(data) {
            resText.push(data);
            size += data.length;
        });
        response.on('end', function() {
            var overTime = Date.now() - begin.getTime();
            console.log('http:' + method + ":::::"+ interface_url + " is ok... -----", overTime + "ms");
            if (!send) {
                send = true;
                resText = Buffer.concat(resText, size);

                resText = _.isBuffer(resText) ? resText.toString() : resText;
                callback(null, resText);
            }
        });
    });

    var req = client[method] && client[method].apply(client, params);
    req.on('error', (err) => {
        console.error('error', 'http:' + interface_url + ":::" + " error" + err);
        if (!send) {
            send = true;
            callback(err);
        }
        return;
    });
    req.setTimeout(timeout, function(err) {
        if (!send) {
            send = true;
            console.error('error', 'http:timeout:::' + req.path);
            req.abort();
            return callback('timeout');
        }
    })
};

module.exports = new Adapter();