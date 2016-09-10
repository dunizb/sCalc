/**
 * Author： www.mybry.com:dunizb
 * Date：2016/7/14 0014.
 */

/**
 * APP配置信息
 */
var appConfig = {
	version: "3.1.0",
	buildId: ".1510",
	appUrl:"http://dunizb.b0.upaiyun.com/demo/app/myCalc-3.1.0.apk",
};

window.onload = function(){
    //点击功能
    clickFunc();
    //移动端滑动功能,历史记录
    //swiperHistory();
};

function clickFunc(){
	var container = document.getElementById("container");
    var calc = document.getElementById("calc"),
        spans = document.getElementById("win-tool").getElementsByTagName("span"),
        equals = document.getElementById("equals"),     //等于号
        remove = document.getElementById("remove");     //删除符号

    /*** 三个小按钮 ***/
    var close = document.getElementById("close"),       //关闭按钮
        max = document.getElementById("max"),           //最大化按钮
        resize = document.getElementById("resize");         //最小化按钮

    var resultDiv = document.getElementById("result");  //结果区域

    /*** 历史记录 ***/
    var historyBox = document.getElementById("historyBox"),
        delBtn = historyBox.querySelector(".remove a");
    var historyUl = historyBox.querySelector("ul");

    /***********鼠标划过三个小按钮显示功能图标***********/
    max.onmouseover = close.onmouseover = function(){
    	this.innerHTML = this.dataset.ico;
    };
    max.onmouseout = close.onmouseout = function(){
    	this.innerHTML = "&nbsp;";
    };

    /***********关闭按钮***********/
    close.onclick = function(e){
        var h = calc.offsetHeight + 15;
        calc.style.webkitTransform = "translateY("+ h+"px)";
        calc.style.transform = "translateY("+ h+"px)";
        e.stopPropagation();
    };
    /***********切换大小***********/
    resize.onclick = function(e){
    	e = e || window.event;
    	movePosition("left");
        e.stopPropagation();
    };
    
    /***********最大化按钮***********/
    max.onclick = function(){
        maxCalc();
    };
    function maxCalc(){
    	var that = this;
    	var spans = document.querySelectorAll("#bottom .row");
        if(container.classList.contains("flexbox")){        //缩小
            container.classList.remove("flexbox");
            calc.classList.remove("maxCalc");
            for(var i=0; i<spans.length; i++){
            	spans[i].classList.remove("mb");
            }
            document.getElementsByTagName("html")[0].classList.remove("maxhtml");
            that.dataset["ico"] = "口";
            that.title = "最大化";
        }else{          //放大
            container.classList.add("flexbox");
            calc.classList.add("maxCalc");
            for(var i=0; i<spans.length; i++){
            	spans[i].classList.add("mb");
            }
            document.getElementsByTagName("html")[0].classList.add("maxhtml");
            that.dataset["ico"] = "※";
            that.title = "恢复大小";
        }
        isResOverflow("max");
    }

    /***********点击键盘***********/
    var keyBorders = document.querySelectorAll("#bottom span"),
        express = document.getElementById("express"),//计算表达式
        res =  document.getElementById("res"),  //输出结果
        keyBorde = null;        //键盘
    var preKey = "",            //上一次按的键盘
        isFromHistory = false;  //是否来自历史记录
    //符号
    var symbol = {"+":"+","-":"-","×":"*","÷":"/","%":"%","=":"="};

    /***********键盘按钮***********/
    for(var j=0; j <keyBorders.length; j++){
        keyBorde = keyBorders[j];

        keyBorde.onclick = function() {
            var number = this.dataset["number"];
            clickNumber(number);
        };
    }
    
    /**
     * 点击键盘进行输入
     * @param {string} number 输入的内容
     * */
    function clickNumber(number){
    	var resVal = res.innerHTML;		//结果
        var exp = express.innerHTML;	//表达式
        //表达式最后一位的符号
        var expressEndSymbol = exp.substring(exp.length-1,exp.length);
        //点击的不是删除键和复位键时才能进行输入
        if(number !== "←" || number !== "C"){
        	//是否已经存在点了，如果存在那么不能接着输入点号了,且上一个字符不是符号字符
        	var hasPoint = (resVal.indexOf('.') !== -1)?true:false;
        	if(hasPoint && number === '.'){
        		//上一个字符如果是符号，变成0.xxx形式
        		if(symbol[preKey]){
        			res.innerHTML = "0";
        		}else{
        			return false;
        		}
        	}
            //转换显示符号
            if(isNaN(number)){
                number = number.replace(/\*/g,"×").replace(/\//g,"÷");
            }
            //如果输入的都是数字，那么当输入达到固定长度时不能再输入了
            if(!symbol[number] && isResOverflow(resVal.length+1)){
                return false;
            }
            //点击的是符号
            //计算上一次的结果
            if(symbol[number]){
            	//上一次点击的是不是符号键
                if(preKey !== "=" && symbol[preKey]){
                    express.innerHTML = exp.slice(0,-1) + number;
                }else{
                    if(exp == ""){
                        express.innerHTML = resVal + number;
                    }else{
                        express.innerHTML += resVal + number;
                    }
                    if(symbol[expressEndSymbol]){
                        exp = express.innerHTML.replace(/×/g,"*").replace(/÷/,"/");
                        res.innerHTML = eval(exp.slice(0,-1));
                    }
                }                  
            }else{
                //如果首位是符号，0
                if((symbol[number] || symbol[preKey] || resVal=="0") && number !== '.'){
                    res.innerHTML = "";
                }
                res.innerHTML += number;
            }
            preKey = number;
        }
    }

    /***********相等，计算结果***********/
    equals.onclick = function(){
        calcEques();
    };
    
    function calcEques(){
    	var expVal = express.innerHTML, val = "";
        var resVal = res.innerHTML;
        //表达式最后一位的符号
        if(expVal){
            var expressEndSymbol = expVal.substring(expVal.length-1,expVal.length);
            try{
                if(!isFromHistory){
                    var temp = "";
                    if(symbol[expressEndSymbol] && resVal){
                        temp = expVal.replace(/×/g,"*").replace(/÷/,"/");
                        temp = eval(temp.slice(0,-1)) + symbol[expressEndSymbol] + resVal;
                    }else{
                        temp = expVal.replace(/×/g,"*").replace(/÷/,"/");
                    }
                    val = eval(temp);
                }else{
                    val = resVal;
                }
            }catch(error){
                val = "<span style='font-size:1em;color:red'>Erro：计算出错！</span>";
            }finally{
                express.innerHTML = "";
                res.innerHTML = val;
                preKey = "=";
                saveCalcHistory(expVal+resVal+"="+val);
                isResOverflow(resVal.length);
                isFromHistory = false;
            }
        }
    }
	
	
    /***********移动端拨号功能***********/
    //移动端长按事件
    $(equals).on("longTap",function(){
    	//console.log("sdsdsd");
    	var num = res.innerHTML;
        if(num && num !== "0"){
			var regx = /^1[0-9]{2}[0-9]{8}$/;
			if(regx.test(num)){
				//console.log("是手机号码");
				var telPhone = document.getElementById("telPhone");
	            telPhone.href = "tel:"+num;
	            telPhone.target = "_blank";
	            telPhone.click();
			}
        }
    });
    


    /***********复位操作***********/
   	var resetBtn = document.getElementById("reset");       //复位按钮
    resetBtn.onclick = function(){
        res.innerHTML = "0";
        express.innerHTML = "";
    };

    /***********减位操作***********/
    remove.onclick = function(){
        var tempRes = res.innerHTML;
        if(tempRes.length>1){
            tempRes = tempRes.slice(0,-1);
            res.innerHTML = tempRes;
        }else{
            res.innerHTML = 0;
        }
    };

    /***********历史功能***********/
    var history = document.getElementById("history"),
        historyBox = document.getElementById("historyBox");
    var about = document.getElementById("about");
    about.onclick = history.onclick = function(e){
        e = e || window.event;
        var target = e.target.id || window.event.srcElement.id;

        historyBox.style.webkitTransform = "none";
        historyBox.style.transform = "none";
        e.stopPropagation();
        //点击的是历史
        if(target == "h"){
        	//恢复显示删除按钮
        	delBtn.style.display = "inline-block";
        	
            var keyArray = Mybry.wdb.getKeyArray();
            var separate = Mybry.wdb.constant.SEPARATE;
            keyArray.sort(function(a,b){
                var n = a.split(separate)[1];
                var m = b.split(separate)[1];
                return m - n;
            });
            var html = [],val = "";
            for(var i=0; i<keyArray.length; i++){
                val = Mybry.wdb.getItem(keyArray[i]);
                html.push("<li>"+val+"</li>");
            }
            if(html.length>0){
                historyUl.innerHTML = html.join("");
            }else{
                historyUl.innerHTML = "尚无历史记录";
            }

            //把历史记录一条数据添加到计算器
            var hLis = historyUl.querySelectorAll("li");
            for(var i=0; i<hLis.length; i++){
                hLis[i].onclick = function(){
                    var express = this.innerHTML;
                    var exp = express.split("=")[0],
                        res = express.split("=")[1];
                    resultDiv.querySelector("#express").innerHTML = exp;
                    resultDiv.querySelector("#res").innerHTML = res;
                    isFromHistory = true;
                };
            }
        }
        //点击的是关于
        if(target == "au"){
        	// 取消删除按钮显示
        	delBtn.style.display = "none";
            historyBox.children[0].children[0].innerHTML = "<div style='padding:5px;color:#000;'>"
            	+ "<p><i class='iconfont'>&#xe608;</i> 纯HTML、CSS、JS编写</p>"
            	+ "<p><i class='iconfont'>&#xe608;</i> 该计算器布局使用CSS3 FlexBox布局</p>"
                + "<p><i class='iconfont'>&#xe608;</i> 移动APP使用HBuild构建</p>"
                + "<p><i class='iconfont'>&#xe608;</i> 在APP上，当输入手机号码后长按等于号可以拨打手机号码</p>"
                + "<p><i class='iconfont'>&#xe608;</i> 在APP上，左滑右滑可以切换单手模式</p>"
				+ "<p><i class='iconfont'>&#xe601;</i> 作者/网络ID：dunizb</p>"
                + "<p><i class='iconfont'>&#xe605;</i> QQ：1438010826，Email：dunizb@foxmail.com</p>"
                + "<p id='updateApp'><i class='iconfont updateAppIcon'>&#xe604;</i> 检查新版本</p>"
                + "<p id='downloadApp'><a href='"+ appConfig.appUrl +"' target='_blank'>点击下载安卓APP</a></p>"
                + "<p><i class='iconfont build'>&#xe60f;</i> Build "+ appConfig.buildId +". Version："+ appConfig.version +"</p>"
                + "</div>";
            
            //检查新版本
            updateApp();    
        }
    };

    window.onclick = function(e){
        var e = e || window.event;
        var target = e.target.className || e.target.nodeName;
        //如果点击的是历史记录DIV和删除按钮DIV就不隐藏
        var notTarget =  {"con":"con","remove":"remove","UL":"UL","P":"P"};
        if(!notTarget[target]){
            //如果设置了最小化
            var ts = historyBox.style.transform || historyBox.style.webkitTransform;
            if(ts && ts == "none"){
                historyBox.style.webkitTransform = "translateY(102%)";
                historyBox.style.transform = "translateY(102%)";
            }
        }
        //恢复显示删除按钮
        //historyBox.children[1].children[0].className = "icon_del";
    };

    //点击头部恢复大小
//  var topDiv = document.getElementById("top");
//  topDiv.onclick = function(){
//      resetMini();
//  };
    //移动端Tap事件
//  $(topDiv).on("tap",function(){
//  	console.log("tap事件");
//  	resetMini();
//  });
//  function resetMini(){
//  	var ts = calc.style.transform || calc.style.webkitTransform;
//      if(ts && ts != "none"){
//          calc.style.transform = 'none';
//      }
//  }

    /***********清空历史记录***********/
    delBtn.onclick = function(e){
        var e = e || window.event;
        e.stopPropagation();
        if(Mybry.wdb.deleteItem("*")){
            historyUl.innerHTML = "尚无历史记录";
        }
    };

    /**
     * 保存计算历史记录
     * @param val 要记录的表达式
     */
    function saveCalcHistory(val){
        var key = Mybry.wdb.constant.TABLE_NAME + Mybry.wdb.constant.SEPARATE + Mybry.wdb.getId();
        window.localStorage.setItem(key,val);
    }

    /**********自动设置文字大小************/
    function isResOverflow(leng){
        var calc = document.getElementById("calc");
        var w = calc.style.width || getComputedStyle(calc).width || calc.currentStyle.width;
            w = parseInt(w);

        //判断是否是移动端
        if((Mybry.browser.versions.android || Mybry.browser.versions.iPhone || Mybry.browser.versions.iPad) && !symbol[preKey]) {
            if(leng > 15){
                return true;
            }
        }else{
            if(leng > 10){
                if(w == 300) {
                    maxCalc();
                }else{
                    if(leng > 16){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    //单手模式
    singleModel();
}

function updateApp(){
	//检查新版本
    var updateApp = document.getElementById("updateApp");
    updateApp.onclick = function(){
    	var _this = this;
    	$.ajax({
			type:'get',
			url:'http://duni.sinaapp.com/demo/app.php?jsoncallback=?',
			dataType:'jsonp',
			beforeSend : function(){
				_this.innerHTML = "<i class='iconfont updateAppIcon updateAppIconRotate'>&#xe604;</i> 正在检查新版本...";
			},
			success:function(data){
				var newVer = data[0].version;
				if(newVer > appConfig.version){
					var log = data[0].log;
					var downloadUrl = data[0].downloadUrl;
					if(confirm("检查到新版本【"+newVer+"】，是否立即下载？\n 更新日志：\n " + log)){
						var a = document.getElementById("telPhone");
						a.href = downloadUrl;
						a.target = "_blank";
						a.click();
					}
				}else{
					alert("你很潮哦，当前已经是最新版本！");
				}
				_this.innerHTML = "<i class='iconfont updateAppIcon'>&#xe604;</i> 检查新版本";
			},
			error:function(msg){
				_this.innerHTML = "<i class='iconfont updateAppIcon'>&#xe604;</i> 检查新版本";
				alert("检查失败："+msg.message);
			}
		});
    }
}

/** 单手模式 */
function singleModel(){
	var calc = document.getElementById("calc");
	var startX = 0,moveX = 0,distanceX = 0;
    var distance = 100;   
    var width = calc.offsetWidth;
    //滑动事件
    calc.addEventListener("touchstart",function(e){
        startX = e.touches[0].clientX;
    });
    calc.addEventListener("touchmove",function(e){
        moveX = e.touches[0].clientX;
        distanceX = moveX - startX;
        isMove = true;
    });
    window.addEventListener("touchend",function(e){
        if(Math.abs(distanceX) > width/3 && isMove){
        	if( distanceX > 0 ){
        		positionFun("right");
        	}else{
        		positionFun("left");
        	}
        }
        startY = moveY = 0;
        isMove = false;
    });    
}

/**
 * 切换单手模式
 * @param {String} postion 左滑还是右滑，取值：left,right
 */
function movePosition( posi ){
	var telPhone = document.getElementById("telPhone");
	var flag = telPhone.dataset.flag;
	var styles = calc.getAttribute("style");
	
	if(flag){
		if(styles){
			var w = styles.split(";")[0].split(":")[1];
			if(w == "80%"){
				calc.setAttribute("style","width: 100%; height: 100%; position: absolute;left: 0px; bottom: 0px;");
			}
		}
		if(posi === "left"){
			calc.setAttribute("style","width: 100%; height: 100%; position: absolute;left: 0px; bottom: 0px;");
		}else{
			calc.setAttribute("style","width: 80%; height: 70%; position: absolute;right: 0px; bottom: 0px;");
		}
		//计算表达式区域高度
    	document.getElementById("result").style.minHeight = "90px";
    	//计算表达式字体大小
    	document.getElementById("res").style.fontSize = "4.5rem";
        telPhone.dataset.flag = "";
	}else{
		positionFun(posi);
	}
}

function positionFun(postion){
	if(postion === "left"){
		calc.setAttribute("style","width: 80%; height: 70%; position: absolute;left: 0px; bottom: 0px;");
	}else{
		calc.setAttribute("style","width: 80%; height: 70%; position: absolute;right: 0px; bottom: 0px;");
	}
	//计算表达式区域高度
	document.getElementById("result").style.minHeight = "0";
	//计算表达式字体大小
	document.getElementById("res").style.fontSize = "3.5rem";
	telPhone.dataset.flag = "yes";
}


//function swiperHistory(){
//  /**
//   * 1.历史记录向下滑动
//   * 2.滑动到一定距离隐藏历史记录
//   * 3.滑动少于某个距离吸附回去
//   */
//  var historyBox = document.getElementById("historyBox");
//  var startY = 0,
//      moveY = 0,
//      distanceY = 0,
//      isMove = false;
//  //缓冲的距离
//  var distance = 100;
//  //加过渡
//  var addTransition = function(){
//      historyBox.style.webkitTransition = 'all 0.3s';/*兼容性*/
//      historyBox.style.transition = 'all 0.3s';
//  }
//  //清除过渡
//  var removeTransition = function(){
//      historyBox.style.webkitTransition = 'none';
//      historyBox.style.transition = 'none';
//  };
//  //定位
//  var setTranslateY = function(translateY){
//      historyBox.style.webkitTransform = 'translateY('+translateY+')';
//      historyBox.style.transform = 'translateY('+translateY+')';
//  }
//
//  //滑动事件
//  historyBox.addEventListener("touchstart",function(e){
//      startY = e.touches[0].clientY;
//  });
//  historyBox.addEventListener("touchmove",function(e){
//      moveY = e.touches[0].clientY;
//      distanceY = moveY - startY;
//      removeTransition();
//      setTranslateY(distanceY+"px");
//      isMove = true;
//  });
//  historyBox.addEventListener("touchend",function(e){
//      if(distanceY > distance){
//          addTransition();
//          setTranslateY("102%");
//      }else{
//          addTransition();
//          historyBox.style.webkitTransform = 'none';
//          historyBox.style.transform = 'none';
//      }
//      startY = moveY = distanceY = 0;
//      isMove = false;
//  });
//
//}