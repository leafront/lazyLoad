function LazyLoad (options) {
  this.options = {
    ele: null, //选择的元素
    time: 300, // 设置一个检测时间间隔
    complete: true, //页面内所有数据图片加载完成后，是否自己销毁程序，true默认销毁，false不销毁
    position: { // 只要其中一个位置符合条件，都会触发加载机制
      top: 0, // 元素距离顶部
      right: 0, // 元素距离右边
      bottom: 0, // 元素距离下面
      left: 0 // 元素距离左边
    }
  }
  Object.assign(this.options, options)
}


LazyLoad.prototype = {
  constructor: LazyLoad,
  getClientRect (el,options) {
    var bcr = el.getBoundingClientRect() //取得元素在可视区的位置
    var mw = el.offsetWidth //元素自身宽度
    var mh = el.offsetHeight //元素自身的高度
    var w = window.innerWidth //视窗的宽度
    var h = window.innerHeight //视窗的高度


    var boolX = (!((bcr.right - options.left) <= 0 && ((bcr.left + mw) - options.left) <= 0) && !((bcr.left + options.right) >= w && (bcr.right + options.right) >= (mw + w))) //上下符合条件
    var boolY = (!((bcr.bottom - options.top) <= 0 && ((bcr.top + mh) - options.top) <= 0) && !((bcr.top + options.bottom) >= h && (bcr.bottom + options.bottom) >= (mh + h))) //上下符合条件

    return el.width != 0 && el.height != 0 && boolX && boolY
  },
  start (){
    var { options } = this;
    options.before();
    var This = this;

    var scrollLoad = function(){
      var list = Array.prototype.slice.apply(options.el.querySelectorAll('[data-src]'));
       if (!list.length && options.complete) {
        window.removeEventListener('scroll',scrollImg,false);
       } else {
         list.forEach((el) => {
           if (!el.dataset.LazyLoadImgState && This.getClientRect(el, options.position)) {
              This.loadImg(el);
           }
         })
       }
    }
    var scrollImg = this.throttle(() => {
      scrollLoad();
    },options.time,300)
    scrollLoad();
    window.addEventListener('scroll',scrollImg,false);

  },
  loadImg(el) { //加载图片
      var { options } = this
      el.dataset.LazyLoadImgState = 'start'

      var img = new Image()
      img.src = el.dataset.src

      img.addEventListener('load', () => {
          el.src = img.src
          delete el.dataset.src
          el.dataset.LazyLoadImgState = 'success'
          return options.success.call(this, el)
      }, false)

      img.addEventListener('error', () => {
          delete el.dataset.src
          el.dataset.LazyLoadImgState = 'error'
          options.error.call(this, el)
      }, false)
  },
  throttle (func, wait, mustRun) {
    var timeout,
      startTime = new Date();
      return function() {
        var context = this,
          args = arguments,
          curTime = new Date();

        clearTimeout(timeout);
        // 如果达到了规定的e触发时间间隔，触发 handler
        if(curTime - startTime >= mustRun){
          func.apply(context,args);
          startTime = curTime;
          // 没达到触发间隔，重新设定定时器
        }else{
          timeout = setTimeout(func, wait);
        }
    }
  }

}
