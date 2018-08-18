/**
 * Created by Jepson on 2018/8/18.
 */

$(function () {
  /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
  // 配置的字段和 input 框中指定的 name 关联, 所以必须要给 input 加上 name
  $("#form").bootstrapValidator({

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    // 配置字段
    fields: {
      username: {
        // 配置校验规则
        validators: {
          // 非空
          notEmpty: {
            // 提示信息
            message: "用户名不能为空"
          },
          // 长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须在 2-6 位"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须是 6-12 位"
          },
          callback: {
            message: "密码不能为空"
          }
        }
      }
    }
  });
  //2.登录功能
  // 表单校验插件会在提交按钮进行校验
  // 1 校验成功 默认提交表单，会发生页面跳转
  //我们需要注册表单校验时间，阻止默认提交
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //通过ajax发生请求
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function (info) {
        console.log(info);
        
        if (info.success) {
          location.href = 'index.html'
        }
        if (info.error == 1001) {
          $('#form').data("bootstrapValidator").updateStatus('password','INVALID',"callback")
        }
        if (info.error == 1000) {
          $('#form').data("bootstrapValidator").updateStatus('username','INVALID',"callback")
        }
      }
    })
  });
  //重置功能
  $("button[type='reset']").on('click', function () {
    $("#form").data('bootstrapValidator').resetForm();
  })


});
