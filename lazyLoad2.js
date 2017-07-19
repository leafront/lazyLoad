function LazyLoad (options) {

  this.ele = options.el;

}

LazyLoad.prototype = {
  constructor: LazyLoad,
  start (){

    this.loadImg();
  },
  loadImg() { //加载图片

    var ele = this.ele;

    var list = Array.prototype.slice.apply(ele.querySelectorAll('.img-load'));

    var docHeight = document.documentElement.clientHeight;

    var observer = new IntersectionObserver(function(items) {

        items.forEach(function(item) {

          var target = item.target;

          if(item.boundingClientRect.top < docHeight && target.getAttribute('src') == './images/default.png') {

        		target.src = target.getAttribute('data-src');

            observer.unobserve(target);
        	}
        })
    })

    list.forEach(function (item) {

      observer.observe(item);

    })
  }

}
