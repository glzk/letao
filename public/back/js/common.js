$(function () {
  //进度条
  $(document).ajaxStart(function () {
    NProgress.start();
  })
  $(document).ajaxStop(function () {
      NProgress.done();
  })
  //登录拦截
  if (location.href.indexOf('login.html') === -1) {
      $.ajax({
        type: 'get',
        url: '/employee/checkRootLogin',
        dataType: 'json',
        success: function (info) {
          console.log(info);
          if (info.success) {
            console.log('登录成功'); 
          }
          if (info.error) {
            location.href = "login.html";
          }
        }
      })
  }
  //分类切换功能
  $('.cate').click(function () {
    $('.nav .child').stop().slideToggle();
  })
  //左侧tab栏切换功能
  $('.icon_menu').click(function () {
    $('.lt-aside').toggleClass('hidemenu');
    $('.it-topbar').toggleClass('hidemenu');
    $('.lt-main').toggleClass('hidemenu');
  })
  //弹出模态框
  $('.icon_logout').click(function () {
    $('#Modal').modal('show')
  })
  //退出功能
  $('#icon_logout').click(function () {
    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      dataType: 'json',
      success: function (info) {
        if ( info.success ) {
          location.href = "login.html";
        }
      }
    })
  })

})