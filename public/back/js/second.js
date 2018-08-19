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
        var htmlStr = template('secondTpl',info);
        $('.lt-content tbody').html(htmlStr);
        //分页功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total/info.size),
          onPageClicked: function (a,b,c,page) {
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
        var htmlStr = template('cateTpl',info);
        $('.dropdown ul').html(htmlStr);
      }
    })
  })
  //给下拉列表a添加点击事件
  $('.dropdown-menu').on('click','a',function () {
    var txt = $(this).text();
    $('#dropdownMenu1 .s1').text(txt);
  })
  //上传文件图片 实时预览
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      var imgUrl = data.result.picAddr;
      $('.form-group img').attr("src",imgUrl) ;
    }
});

})()