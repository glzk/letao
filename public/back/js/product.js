(function () {
  var currentPage = 1;
  var pageSize = 5;
  var picArr = [];
  //进入页面发送ajax，进行页面渲染
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        var htmlStr = template('productTpl', info);
        $('.lt-content tbody').html(htmlStr);
        //分页功能
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),//总页数
          onPageClicked: function (event, originalEvent, type, page) {
            currentPage = page;
            render();
          },
          itemTexts: function (type, page, current) {
            switch (type) {
              case 'first':
                return "首页";
              case 'last':
                return "尾页";
              case 'prev':
                return "上一页";
              case 'next':
                return "下一页";
              case 'page':
                return page;
            }
          },
          //配置提示框
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case 'first':
                return "首页";
              case 'last':
                return "尾页";
              case 'prev':
                return "上一页";
              case 'next':
                return "下一页";
              case 'page':
                return "前往第" + page + "页";
            }
          },
          useBootstrapTooltip: true
        });
      }
    })
  }
  //添加分类功能
  $('.addBtn').click(function () {
    $('#productModal').modal('show');
    //下拉菜单进行动态渲染
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        var htmlStr = template('xTpl', info);
        $('.dropdown-menu').html(htmlStr);

      }
    })
  })
  //事件委托 给a注册点击事件
  $('.dropdown-menu').on('click', 'a', function () {
    var id = $(this).data('id');
    var txt = $(this).text();
    $('.s1').text(txt);
    $('[name="productId"]').val(id);
    $("#form").data('bootstrapValidator').updateStatus("brandId", "VALID",)
  })
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data);
      var picObj = data.result;
      var picAddr = picObj.picAddr;
      picArr.unshift(picObj);
      $('#addImg').prepend('<img src="' + picAddr + '" alt="" width="100">')
      if (picArr.length > 3) {
        picArr.pop();
        $('#addImg img:last-of-type').remove();
      }
      if (picArr.length == 3) {
        $("#form").data('bootstrapValidator').updateStatus("picStatus", "VALID",)
      }
    }
  });
  //配置表单校验
  $('#form').bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 32-40'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
      // 商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      // 标记图片是否上传满三张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }

    }
  })
  //注册校验成功事件
  $('#form').on('success.form.bv',function (e) {
    e.preventDefault();
    var params = $('#form').serialize();
    console.log(picArr);
    params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: params,
      success: function (info) {
        if (info.success) {
          $('#productModal').modal('hide');
          currentPage = 1;
          render();
          $('#form').data('bootstrapValidator').resetForm(true);
          $('.s1').text('请选择二级分类');
          $('#addImg img').remove();
          picArr=[];
        }
        
      }
    })
  })

})()
