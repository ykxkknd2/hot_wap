var http = require('../../public/http'),
    xml2js = new require('xml2js'),
    builder = new xml2js.Builder({rootName: 'DOCUMENT',cdata :true,xmldec:{'version': '1.0', 'encoding': 'gbk'}});

const TPLID = 'tplid';
const CLASSID = 'classid';
const CLASSTAG = 'classtag';

var getName = function(req,res,next){
    // if(!req.query.keyword) return res.end('need keyword');

    var dataType = req.query.type;
    http.get('http://rec.letv.com/pcc?uid=0&lc=0&pt=0002&pageid=page_cms1003337254&history=&random=1491818976064&_=1491818976067',function(err,data){
        if(err) return next(err);

        if(dataType == 'xml'){
            var _data = {item:[]};

            var list = [{url: 'http://www.baidu.com','title':'周杰伦'},{url: 'http://www.baidu.com','title':'周杰伦2'}];

            for(var i=0,len=list.length;i<len;i++){
                _data.item.push({
                    key : 'key',
                    tplid : TPLID,
                    classid : CLASSID,
                    classtag : CLASSTAG,
                    display: list[i]
                })
            }

            var xml = builder.buildObject(_data);

            res.setHeader('Content-Type','text/xml; charset=UTF-8');
            res.end(xml);
        }else{
            res.setHeader('Content-Type','application/json; charset=UTF-8');
            res.json(data);
        }
    });
};

module.exports = getName;