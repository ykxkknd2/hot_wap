(function(window){
	var paras = uigs_para, $d = document;
	var firstCl = true;//是否首次点击
	function getNowTime(){
		return (new Date()).getTime();
	}
	function getRandom(){
		return (getNowTime())*1000+Math.round(Math.random()*1000)
	}

	//init global config
	if(typeof(uigs_para)=="undefined" || !uigs_para.uigs_productid){
		window.uigs2PB = function(){}
		return;
	}

	function getFromPara(pname, defaultV, isNum){
		if (typeof paras[pname] == "undefined"){
			return defaultV;
		}
		if (isNum){
			return parseInt(paras[pname]);
		}
		return paras[pname];

	}
	
	//defined variables
	var UIGS_HEAD="http://pb.sogou.com/", UIGS_CL="cl.gif", UIGS_PV="pv.gif", UIGS_VER="v2.0",
	START_TIME=getNowTime(),
	visitTime = window.nowjs||START_TIME,
	uigs_pvlink = getFromPara("uigs_pvpingbackurl", UIGS_HEAD+UIGS_PV), //pv pingback address
	uigs_cllink = getFromPara("uigs_clpingbackurl", UIGS_HEAD+UIGS_CL), //cl pingback address
	uigs_uuid   = getFromPara("uigs_uuid", getRandom()),
	uigs_cookie = getFromPara("uigs_cookie", "").split(","),
	uigs_pbtag  = getFromPara("uigs_pbtag", "A"),
	uigs_head = null, i,
	empty_func = function(){},
	oldclick = $d.onclick||empty_func,pingbackarray={}, pingbackarrayidx=0;

	//lib
	function getCookie(name) {
		var dc = $d.cookie, prefix = name + "=", begin = dc.indexOf("; " + prefix);
		if(begin == -1){
			begin = dc.indexOf(prefix);
			if (begin != 0) return null;
		}
		else{
			begin += 2;
		}
		var end = $d.cookie.indexOf(";", begin);
		if (end == -1) {
			end = dc.length;
		}
		return dc.substring(begin + prefix.length, end);
	}

	function uigs_encode(a){
		return (typeof(encodeURIComponent)=='function')?encodeURIComponent(a):escape(a);
	}

	function getAttr(elem, attr){
		var ret;
		if (elem){
			ret = elem[attr];
			if (elem.getAttribute){
				ret = ret||elem.getAttribute(attr);
			}
		}
		return ret||"";
	}
	//get uigs header
	function build_header(){
		if (!uigs_head){
			uigs_head = ["uigs_productid="+paras.uigs_productid];//["uigs_productid=webapp&type=nuigs"];//
			uigs_head.push("uigs_uuid="+uigs_uuid);
			//uigs_head.push("uigs_version="+UIGS_VER);
			uigs_head.push("uigs_refer="+uigs_encode($d.referrer||""));

			var tmp = [], cookieV;
			for (i = 0; i < uigs_cookie.length; i++){
				if (uigs_cookie[i] && uigs_cookie[i] != "SUV"){
					cookieV = getCookie(uigs_cookie[i]);
					if (cookieV != null){
						tmp.push(uigs_cookie[i]+"="+cookieV);
					}
				}
			}
			uigs_head.push("uigs_cookie="+uigs_encode(tmp.join("&")));
			uigs_head = uigs_head.join("&");
		}
		var all_paras=[];
		for (i in paras){
			if (typeof paras[i] != "function" && i != "uigs_productid" && i != "uigs_uuid" && i != "uigs_cookie"){
				all_paras.push(uigs_encode(i)+"="+uigs_encode(paras[i]));
			}
		}

		return ["?",uigs_head,"&",all_paras.join("&"),"&uigs_t=",getRandom()].join("");
	}


	//send pingback
	function uigs_pingback(pbStr, isPv){
		//phoneStr:机型、屏幕分辨率、浏览器名称、网络状态
		var phoneStr=["","phoneos="+getOS(),"screensize="+getScreenResolution(),"browsername="+getBrowserName(),"netstate="+getNetStatus()].join("&");
		var pbsrc = [(isPv?uigs_pvlink:uigs_cllink),build_header(),phoneStr,pbStr||""].join(""), tmp = new Image(), idx = pingbackarrayidx;
		pingbackarray[idx] = tmp;
		pingbackarrayidx++;
		tmp.onload=tmp.onerror=tmp.onabout=function(){try{delete pingbackarray[idx]}catch(E){}};
		tmp.src = pbsrc;
	}

	//uigs pv
	function uigs_pv(otherArgStr,pvtime){
		console.log("otherArgStr="+otherArgStr);
		//send pv pingback
		if(typeof(uigs2_pv)=="undefined"){
			window.uigs2_pv = 1;
			var otherArgStr = otherArgStr||'';
			uigs_pingback(otherArgStr, true);
			if(pvtime){
				firstCl = true;//是否首次点击
				visitTime = pvtime;
			}
		}
	}
	
	//uigs click
	function uigs_click(evt,otherArgStr){
		if ((evt&&(evt.button != 0))||((!evt)&&(window.event.button != 0))){
			return;  // not left click
		}

		try{
			evt=evt||window.event;
			var srcElem=((evt.target)?evt.target:evt.srcElement), uigsflag, tag, dHref, dTxt, tmp,site,other=[];

			while(srcElem && srcElem.tagName){
				//get tagname
				tag = srcElem.tagName.toUpperCase();

				//there is some element you dont want to send click pingback, then add attribute uigs="nouigs"
				uigsflag = getAttr(srcElem, "uigs")||uigsflag||"";

				if(uigsflag=='nouigs'){
					//dont send
					return;
				}

				dHref = dHref||srcElem.href||"";
				tmp = getAttr(srcElem, "uigs_txt"); //txt can be a's innerHTML or any elemnt's uigs_txt
				if (tag == "A" || tmp){
					dTxt = tmp||dTxt||srcElem.innerHTML;
				}

				if (uigsflag && uigsflag != 'id'){ //uigs=="id" means use id
					break;
				}

				if(tag==uigs_pbtag){
					uigsflag = 'id'; //means use id
				}
				
				if (uigsflag == "id" && getAttr(srcElem, "id")){
					uigsflag = getAttr(srcElem, "id"); // try to get id from it or its parent node
					break;
				}

				srcElem = srcElem.parentNode;
			}
			
			if (uigsflag && uigsflag != "id"){
				if(dHref&&dHref.indexOf("http://")==0){
					var patt = /^http:\/\/([^\/]*).*$/g;
					var result = patt.exec(dHref);
					if(result&&result[1]){
						site = result[1];
						other.push("&uigs_site="+encodeURIComponent(site));
					}
				}
				if(otherArgStr)other.push(otherArgStr);
				uigs2PB(uigsflag+"&href="+dHref, (dTxt||"").replace(/<.*?>/g, ""),uigsflag,other?other.join(''):"");
			}
		}
		catch(E){
			alert(E);
		}
	}

	//uigs pb
	window.uigs2PB = function(uigs_cl, txt,id,other){
		if(!other)other="";
		var cl_pbstr = ["",
						"uigs_st="+parseInt((getNowTime()-START_TIME)/1000),
						"uigs_cl="+uigs_encode(uigs_cl),
						"uigs_id="+id];
		if (txt){
			cl_pbstr.push("txt="+uigs_encode(txt));
		}
		if(firstCl){//如果是第一次点击，添加首次点击与访问时间差
			cl_pbstr.push("first_cl="+(getNowTime()-visitTime)/1000);
			firstCl=false;
		}
		uigs_pingback(other+cl_pbstr.join("&"));
	}
	
	//对外统计接口
	window.addEventListener('message',function(e) {
		
		if(e&&e.data&&e.data.type=="pd"){
			
			var data=e.data.pd;
			
			uigs2PB(data.uigsflag+"&href="+data.dHref, (data.dTxt||"").replace(/<.*?>/g, ""),data.uigsflag,data.other?data.other.join(''):"");
		}
	}, false);

	//获取客户端机型操作系统
	function getOS() {
		var ua = navigator.userAgent;
		if (ua.indexOf("Windows NT 5.1") != -1) return "Windows XP";
		if (ua.indexOf("Windows NT 6.0") != -1) return "Windows Vista";
		if (ua.indexOf("Windows NT 6.1") != -1) return "Windows 7";
		if (ua.indexOf("iPhone") != -1) return "iPhone";
		if (ua.indexOf("iPad") != -1) return "iPad";
		if (ua.indexOf("Linux") != -1) {
			var index = ua.indexOf("Android");
			if (index != -1) {
				var index2 = ua.indexOf("Build");
				var index1 = ua.lastIndexOf(";",index2);
				var type = ua.slice(index1 + 1, index2);
				return type||"unknown";
			} else {
				return "Linux";
			}
		}
		return "unknown";
	}
	//获取客户端屏幕分辨率
	function getScreenResolution() {
		var screenW = window.screen.width,
			screenH = window.screen.height,
			dpr = window.devicePixelRatio,
			ua = navigator.userAgent;
		if(/(iphone)|(ipad)/ig.test(ua)){
			return screenW*dpr+"*"+screenH*dpr;
		}else{
			return screenW+"*"+screenH;
		}
	}
	//获取浏览器名称
	function getBrowserName(){
		var browser = [
		               "Sogousearch",//app
		               "MQQBrowser",//qq浏览器
		               "SogouMobileBrowser",//搜狗浏览器
		               "UCBrowser",//UC浏览器
		               "Firefox",//火狐浏览器
		               "baidubrowser",//百度浏览器
		               "LieBaoFast",//猎豹浏览器
		               "Mb2345Browser",//2345浏览器
		               "LeBrowser",//绿茶浏览器
		               "(opera)|(OPR)",//欧朋浏览器
		               "(chrome)|(CriOS)",//chrome浏览器
		               "Safari"//safari浏览器
			
		],
		ua = navigator.userAgent;
		for(var i=0,ln=browser.length;i<ln;i++){
			var reg = new RegExp(browser[i],"ig");
			if(reg.test(ua)){
				if(/(opera)|(OPR)/ig.test(ua)){
					return "opera";
				}else if(/(chrome)|(CriOS)/ig.test(ua)){
					return "chrome";
				}
				return browser[i];
			}
		}
		return 'unknown';
	}
	//获取网络环境
	function getNetStatus(){
		var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection||null,
			type = connection?connection.type:'nosupport',
			states = {};
		if(connection){
	        states[connection.UNKNOWN]  = 'unknown';  
	        states[connection.ETHERNET] = 'ethernet';  
	        states[connection.WIFI]     = 'wifi';  
	        states[connection.CELL_2G]  = '2G';  
	        states[connection.CELL_3G]  = '3G';  
	        states[connection.CELL_4G]  = '4G';  
	        states[connection.NONE]     = 'none';
			return states[type];
		}
		return 'nosupport';
	}
	
//	//send pv pingback
//	if(typeof(uigs2_pv)=="undefined"){
//		window.uigs2_pv = 1;
//		uigs_pv();
//	}

	//bind click
	$d.onclick = function(evt){
		var ret = oldclick(evt);
		uigs_click(evt);
		uigs_para.query = '';
		return ret;
	}
	//s
	window.sogou = window.sogou || {};
	window.sogou.pb = window.sogou.pb || {};
	window.sogou.pb.pv = uigs_pv;
	//window.sogou.pb.cl = uigs_click;
	//e
})(window)