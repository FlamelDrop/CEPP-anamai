Template.cmchangepwd.onRendered(function () {
    
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
Template.cmchangepwd.helpers({
    user() {
        if (Session.get('user')) {

            if (Session.get('user').RULE == "HPC") {
                return Session.get('user').NAME
            } else if (Session.get('user').RULE == "PROVINCE") {
                return "จังหวัด" + Session.get('user').PROVINCENAME
            } else if (Session.get('user').RULE == "CM") {
                return Session.get('cmname');
            }

        }
    },
    username() {
        return Session.get('user').USERNAME
    }
});

Template.cmchangepwd.events({
    "click #save"() {
        if ($("#password").val() != "") {
            if ($("#password").val() == $("#passwordq").val()) {
                if (/^([a-zA-Z0-9 _-]+)$/.test($("#password").val())) {
                    if(typeof Session.get('user')._id != 'object'){
                        Meteor.call('encrypted', $("#password").val(), function (error, result) {
                            USER_LOGIN.update({
                                "_id": Session.get('user')._id
                            }, {
                                    $set: {
                                        PASSWORD: result
                                    }
                                }, function (err, result) {
                                    Router.go("/login")
                                    setTimeout(() => {
                                        Session.set('user', null);
                                    }, 1000);
                                });
                        });
                    }else{
                        Meteor.call('encrypted', $("#password").val(), function (error, result) {
                            USER_LOGIN.update({
                                "_id": new Mongo.ObjectID(Session.get('user')._id._str)
                            }, {
                                    $set: {
                                        PASSWORD: result
                                    }
                                }, function (err, result) {
                                    Router.go("/login")
                                    setTimeout(() => {
                                        Session.set('user', null);
                                    }, 1000);
                                });
                        });
                    }   
                  
                    toastr.success("อัพเดทข้อมูลส่วนตัวเรียบร้อย", "สำเร็จ");
                } else {
                    toastr.warning("กรุณาใส่รหัสผ่านเป็นตัวเลขหรือตัวอักษรภาษาอังกฤษเท่านั้น", "ไม่สำเร็จ");
                    $("#password").val("");
                    $("#passwordq").val("");
                }

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
    },
    "click #back"() {
        window.history.back();
    }
});
