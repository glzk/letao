(function () {
  //进入页面发送ajax
  var currentPage = 1;
  var pageSize = 5;
  var currentId;
  var isDelete;
  function render() {
    $.ajax({
      type: 'get',
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {        
        var htmlStr = template('tpl', info);
        $('table tbody').html(htmlStr);
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          size: "small",//设置控件的大小，mini, small, normal,large
          onPageClicked: function (a, b, c, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render()
          }
        });
      }

    })
  }
  render();
  //给所有启用禁用按钮添加点击事件
  $('tbody').on('click','.btn',function () {
    $('#userModal').modal('show')
    currentId = $(this).parent().data('id');
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
  })
  //点击确定按钮发送ajax请求
  $('#btn').click(function () {
    $.ajax({
      type: 'post',
      url: '/user/updateUser',
      data: {
        id:currentId,
        isDelete: isDelete
      },
      dataType: 'json',
      success: function (info) {
        if (info.success) {
          render();
          $('#userModal').modal('hide');
        }
        
      }
    })
  })
})()