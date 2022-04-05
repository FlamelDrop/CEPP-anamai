Template.forget.onRendered(function() {
  
  Session.set('otp',null);
  Session.set('forgetOK',null);
  toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
  }
});

Template.forget.helpers({
  otp: function(){
    return Session.get('otp')
  },
  forgetOK(){
    return Session.get('forgetOK')
  }
});

Template.forget.events({
  "click #next" () {
    Session.set('forgetID',$('#cid').val());
    Session.set('forgetMAIL',$('#mail').val());
    if ($('#cid').val() && $('#mail').val()) {
      Meteor.call('ForgetCheckCID', $('#cid').val(), $('#mail').val(), function(error, result) {
        if (result.length != 0) {
            Meteor.call('ForgetSendEmail', $('#cid').val(), $('#mail').val(), function(error, result) {
              Session.set('otp',result)
            });
          toastr.success('กรุณาตรวจสอบอีเมลล์ของท่าน','เรียบร้อย')
        }else {
          toastr.error("เลขบัตรประชาชนและอีเมล์ไม่ตรงกัน", "ไม่พบข้อมูล");
          $('#cid').val("");
          $('#mail').val("");
        }
      });
    }else{
      toastr.error("กรุณาข้อมูลให้ครบถ้วน","พบข้อผิดพลาด")
    }

  },
  "click #otpcheck"(){
    if($('#otp').val() != ""){
      if(Session.get('otp') == $('#otp').val()){
        // console.log(Session.get('forgetID'));
        Session.set('forgetOK', Session.get('forgetID'))
        // toastr.success('-----','เรียบร้อย');
        // Router.go("/province");
        // Session.set('_idCM', result[0]._id)
      }else{
        toastr.error("กรุณาตรวจสอบที่อีเมลล์ของท่าน","พบข้อผิดพลาด รหัสไม่ตรงกัน")
      }
    }
  },
  "click #save" () {
      var idcm = Session.get('forgetOK');
      if ($("#password").val() != "") {
          if ($("#password").val() == $("#passwordq").val()) {
              Meteor.call('encrypted', $("#password").val(), function(error, result) {
                  // console.log(idcm);
                  Meteor.call('getUsernameID', idcm, function(error, result2) {
                    // console.log(result2._id);
                    USER_LOGIN.update({
                        "_id": result2._id
                    }, {
                        $set: {
                            PASSWORD: result
                        }
                    });
                  });
              });
              toastr.success("สร้างรหัสผ่านใหม่แล้ว เข้าสู่ระบบอีกครั้ง", "สำเร็จ");
              Router.go("/")

          } else {
              toastr.error("รหัสผ่านไม่ตรงกัน ทำรายการใหม่อีกครั้ง", "พบข้อผิดพลาด");
              $("#password").val("");
              $("#passwordq").val("");
          }
      } else {
          toastr.error("กรุณาระบุรหัสผ่าน", "พบข้อผิดพลาด");
          $("#password").val("");
          $("#passwordq").val("");
      }
  }
})
