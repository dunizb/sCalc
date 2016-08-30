/**
 * 操作localStorage机公用方法
 * Author： www.mybry.com:dunizb
 * Date：2016/7/14 0014.
 */
window.Mybry = {};

Mybry.transitionEnd  = function(dom,callback){
    /*
     * 1.给谁加过渡结束事件
     * 2.过渡结束之后我们需要去干一件什么事情
     * */

    //基本的判断
    if(!dom || typeof dom != 'object' ) return false;

    dom.addEventListener('transitionEnd',function(){
        //处理业务
        callback && callback();
    });
    dom.addEventListener('webkitTransitionEnd',function(){
        //处理业务
        callback && callback();
    });
};
//移动端单击事件
Mybry.tap = function(dom,callback){
    //基本的判断
    if(!dom || typeof dom != 'object' ) return false;
    var startTime = 0,isMove = false;
    dom.addEventListener('touchstart',function(e){
        startTime = Date.now();
    });
    dom.addEventListener('touchmove',function(e){
        isMove = true;
    });
    dom.addEventListener('touchend',function(e){
        if((Date.now()-startTime) < 150 && !isMove){
            //处理业务
            callback && callback(e);
        }
        //重置参数
        startTime = 0,isMove = false;
    });
};

Mybry.wdb = {
    //自定义key的标识
    constant : {
        TABLE_NAME:"calc",     //表名称
        SEPARATE:"-"            //分隔符
    },
    //获取数据库最新的ID，递增
    getId : function(){
        var id = 0;  //key的索引
        var appDataKey = this.getKeyArray();
        var spearate = this.constant.SEPARATE;
        if(appDataKey.length>0){
            var indexArray = [];    //所有的索引值
            for(var i=0; i<appDataKey.length; i++){
                indexArray.push(parseInt(appDataKey[i].split(spearate)[1]));
            }
            id = this._maxId(indexArray) + 1;
        }
        return id;
    },
    //获取单个数据，索引或者key的名称
    getItem : function(value){
        if(!value) return false;
        if(isNaN(value)){
            return localStorage.getItem(value);
        }else{
            var key = localStorage.key(parseInt(value));
            return localStorage.getItem(key);
        }
    },
    deleteItem : function(value){
        if(!value) return false;
        if(isNaN(value)){
            //如果输入*号，删除所有数据
            if(value === "*"){
                var appDataKey = this.getKeyArray();
                for(var i=0; i<appDataKey.length; i++){
                    localStorage.removeItem(appDataKey[i]);
                }
            }else{
                localStorage.removeItem(value);
            }
        }else{
            var key = localStorage.key(parseInt(value));
            localStorage.removeItem(key);
        }
        return true;
    },
    _maxId : function(array){
        if(!array) return false;
        if(!Array.isArray(array)) return false;
        array.sort(function(a,b){
            return a - b;
        });
        return array[array.length-1];
    },
    getKeyArray : function(){
        var localStorage = window.localStorage;
        var storageLen = localStorage.length;
        var spearate = this.constant.SEPARATE,
            tableName = this.constant.TABLE_NAME;
        //计算器所有的数据
        var appDataKey = [];
        if(storageLen>0){
            var itemKey = "";
            for(var i=0; i<storageLen; i++){
                //calc-0
                itemKey = localStorage.key(i);
                //判断是否是该应用的数据
                var flagIndex = itemKey.indexOf(spearate);
                if(flagIndex != -1 ){
                    var startWord = itemKey.split(spearate)[0];
                    if(startWord == tableName){
                        appDataKey.push(itemKey);
                    }
                }
            }
        }
        return appDataKey;
    }
};

Mybry.browser = {
    versions: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return { //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
