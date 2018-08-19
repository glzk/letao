(function () {
  var currentPage = 1;
  var pageSize = 5;
  render();
  //一进入页面发送ajax请求，进行页面渲染
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        var htmlStr =  template('firstTpl',info);
        $('.lt-content tbody').html(htmlStr);
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total/info.size),
          onPageClicked:function (a,b,c,page) {
            console.log(page);
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  //添加分类
  $('.addBtn').click(function () {
    $('#fristModal').modal('show');
  })
  //添加表单校验功能
  $('#form').bootstrapValidator({
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },
    //字段列表
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
    
  })
  //添加表单添加成功事件，阻止默认的表单提交事件，通过ajax提交
  $('#form').on('success.form.bv',function (e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data: $('#form').serialize(),
      success: function (info) {
        if (info.success) {
          $('#fristModal').modal('hide');
          currentPage = 1;
          render();
          //重置表单内容和状态
          $('#form').data('bootstrapValidator').resetForm(ture);
        }
      }
    })
  })
})()