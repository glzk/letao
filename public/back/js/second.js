(function () {
  var currentPage = 1;
  var pageSize = 5;
  render();
  //进入页面发送ajax，进行页面渲染
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        var htmlStr = template('secondTpl', info);
        $('.lt-content tbody').html(htmlStr);
        //分页功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            console.log(page);
            render()
          }
        })
      }
    })
  }
  //添加分页
  $('.addBtn').click(function () {
    $('#secondModal').modal('show');
    //发送ajax，进行下拉框渲染
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
        var htmlStr = template('cateTpl', info);
        $('.dropdown ul').html(htmlStr);
      }
    })
  })
  //给下拉列表a添加点击事件
  $('.dropdown-menu').on('click', 'a', function () {
    var txt = $(this).text();
    $('#dropdownMenu1 .s1').text(txt);
    var id = $(this).data('id');
    $('input[name="categoryId"]').val(id);
    $('#form').data('bootstrapValidator').updateStatus("categoryId", "VALID")
  })
  //上传文件图片 实时预览
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data);
      var imgUrl = data.result.picAddr;
      $('.form-group img').attr("src", imgUrl);
      $('[name="brandLogo"]').val(imgUrl);
      $('#form').data('bootstrapValidator').updateStatus("brandLogo", "VALID")
    }
  });
  //配置表单校验
  $('#form').bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  })
  //注册校验成功事件
  $('#form').on('success.form.bv',function (e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: $('#form').serialize(),
      success: function (info) {
        console.log(info);
        if (info.success) {
          currentPage = 1;
          render()
          $('#secondModal').modal('hide');
          $('#form').data("bootstrapValidator").resetForm(true);
          $('.s1').text('请选择一级分类');
          $('#img').attr('src','./images/none.png');
        }
      }
    })
  })
})()