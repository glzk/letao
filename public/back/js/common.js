$(function () {
  //进度条
  $(document).ajaxStart(function () {
    NProgress.start();
  })
  $(document).ajaxStop(function () {
    setImmediate(function () {
      NProgress.done();
    },1000)
  })
  //登录拦截
  // if (location.href.indexOf('login.html') ===- 1) {
  //     $.ajax({
  //       type: 'get',
  //       url: '/employee/checkRootLogin',
  //       dataType: 'json',
  //       success: function (info) {
  //         console.log(info);
          
  //       }
  //     })
  // }


})