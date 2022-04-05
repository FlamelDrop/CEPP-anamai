Template.login.onRendered(function () {
    Session.set('user', null);
    Session.set('username', null);

    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
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

Template.login.helpers({
    captcha() {
        return Session.get('captcha')
    },
});

Template.login.events({
    'click #captcha'() {
        captcha();
    },
    'click .btncb'() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        var u = document.getElementById('username').value;
        var p = document.getElementById('password').value;
        var cookies = $.cookie();
        if (cookies) {
            for (var cookie in cookies) {
                $.removeCookie(cookie);
            }
        }
        Meteor.call('AuthenLogin', u, p, function (error, result) {
            if (result.length != 0) {
                Session.set('provinceid', result[0]._id)
                if (result[0].RULE == "CM") {
                    Session.set('_idLoginCM', result[0]._id);
                    Meteor.call('getUserCM', result[0].USERNAME, function (error, result2) {
                        var user = result2[0];
                        Session.set('user', user.zone);
                        Session.set('cmname', user.NAME + " " + user.LNAME);
                        Session.set('cmid', user.CID);
                        Session.set('cmznum', user.zone);
                        Session.set('_idCM', user._id);
                        var userlogin = {
                            user: user.zone,
                            cmname: user.NAME + " " + user.LNAME,
                            cmid: user.CID,
                            cmznum: user.zone,
                            _idCM: user._id,
                            provinceid: result[0]._id,
                            _idLoginCM: result[0]._id

                        }

                        if (user.confirm == true) {
                            Router.go("/CMdashboard");
                            Session.set('viewProfile', false)
                            Session.set('viewCG', false)
                            Session.set('viewElder', true)
                            Session.set('viewBetterElder', false)
                            Session.set('viewDeathElder', false)
                            Session.set('viewCmEvaluate', false)
                            $.cookie('userlogin', JSON.stringify(userlogin));
                            $.cookie('showDialog1', true);
                            $.cookie('showDialog2', true);
                        } else {
                            toastr.warning("ชื่อผู้เข้าใช้ " + u + " ยังไม่สามารถเข้าใช้งานได้รอการยืนยันสถานะจากศูนย์เขตอนามัย", "พบข้อผิดพลาด");
                        }

                    });
                } else if (result[0].PASSWORD == null) {
                    Session.set('user', result[0]);
                    var userlogin = {
                        user: result[0],
                        provinceid: result[0]._id,
                        _idLoginCM: result[0]._id
                    }
                    $.cookie('userlogin', JSON.stringify(userlogin));
                    Router.go("/newlogin");

                } else if (result[0].RULE == "PROVINCE") {
                    Session.set('user', result[0]);
                    var userlogin = {
                        user: result[0],
                        provinceid: result[0]._id,
                        _idLoginCM: result[0]._id
                    }
                    $.cookie('userlogin', JSON.stringify(userlogin));
                    Router.go("/province");
                } else if (result[0].RULE == "DISTRICT") {
                    Session.set('user', result[0]);
                    var userlogin = {
                        user: result[0],
                        provinceid: result[0]._id,
                        _idLoginCM: result[0]._id
                    }
                    $.cookie('userlogin', JSON.stringify(userlogin));
                    Router.go("/districtindex");
                } else if (result[0].RULE == "HPC") {
                    Session.set('user', result[0]);
                    var userlogin = {
                        user: result[0],
                        provinceid: result[0]._id,
                        _idLoginCM: result[0]._id
                    }
                    $.cookie('userlogin', JSON.stringify(userlogin));
                    Router.go("/hpcindex");
                } else if (result[0].RULE == "ADMIN") {
                    Session.set('user', result[0]);
                    var userlogin = {
                        user: result[0],
                        provinceid: result[0]._id,
                        _idLoginCM: result[0]._id
                    }
                    $.cookie('userlogin', JSON.stringify(userlogin));
                    Router.go("/admin");
                }

                USER_LOGIN.upsert({
                    "_id": result[0]._id
                }, {
                        $set: {
                            "LAST_VISIT": new Date()
                        }
                    });
                // console.log(result)
            } else {
                alert("ชื่อผู้ใช้ รหัสผ่านไม่ถูกต้อง")
                document.getElementById('username').value = null;
                document.getElementById('password').value = null;
            }
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        });
        document.getElementById('username').value = null;
        document.getElementById('password').value = null;
    }

});

Template.login.onRendered(function () {
    Session.set('selctD', undefined)
    Session.set('selctP', undefined)
    $('#showpic').css("height", $(document).height())
});