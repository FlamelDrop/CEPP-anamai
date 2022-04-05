Template.newlogin.onRendered(function() {
    
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
Template.newlogin.helpers({
    username() {
        return Session.get('user').USERNAME
    }
});

Template.newlogin.events({
    "click #save" () {
        var provinceid = Session.get('provinceid')
        if ($("#password").val() != "") {
            if ($("#password").val() == $("#passwordq").val()) {
                Meteor.call('encrypted', $("#password").val(), function(error, result) {
                  
                    USER_LOGIN.upsert({
                        "_id": provinceid
                    }, {
                        $set: {
                            "PASSWORD": result
                        }
                    });
                });
                toastr.success("อัพเดทข้อมูลส่วนตัวเรียบร้อย เข้าสู่ระบบอีกครั้ง", "สำเร็จ");
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
});
