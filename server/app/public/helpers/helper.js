
let hbs = require('express-hbs');

//根据 频道id 专题id 包id 视频/专辑id 获取跳转地址
hbs.registerHelper('test',(a,b)=>{
    return 'aaa';
});