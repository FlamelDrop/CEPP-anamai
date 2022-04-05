Template.adminamp.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})

Template.adminamp.onRendered(function init() {

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
    $("#birthDate").datetimepicker({
        timepicker: false,
        format: 'd/m/Y', // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000
        lang: 'th', // แสดงภาษาไทย
        mask: true,
        onChangeMonth: thaiYear,
        yearStart: 1800,
        onShow: thaiYear,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });

    Session.set('districtName', null)
    Session.set('checkpid', null);
    Session.set('HOSPCODE', null);

    $('#companyName').selectize();

    Meteor.call('getAllDISTRICT_USER_DATA', function (error, result) {
        $('#companyName')[0].selectize.destroy()
        $('#companyName').selectize({ options: result, create: false });
        //console.log(result);
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    });
   
})

Template.adminamp.events({
    "change #pid"() {
        if (checkID($('#pid').val())) {
            Meteor.call('getUserCM', $('#pid').val(), function (error, result) {
                if (result.length == 0) {
                    $("#ckeckpid").removeClass("has-error");
                    $("#ckeckpid").addClass("has-success");
                    $("#symbolckeckpid").html("<span class='glyphicon glyphicon-ok' style='color:green'></span>");
                    Session.set('checkpid', true);
                } else {
                    $("#ckeckpid").removeClass("has-success");
                    $("#ckeckpid").addClass("has-error");
                    $("#symbolckeckpid").removeClass("glyphicon glyphicon-ok");
                    $("#symbolckeckpid").html("<b style='color:red'>รหัสบัตรประชาชนนี้ถูกใช้ลงทะเบียนแล้ว</b>");
                    Session.set('checkpid', false);
                }
            });
        } else {
            $("#ckeckpid").removeClass("has-success");
            $("#ckeckpid").addClass("has-error");
            $("#symbolckeckpid").html("<span class='glyphicon glyphicon-remove' style='color:red'></span>");
            Session.set('checkpid', false);
        }
    },
    "click #save"() {
        var insert_data1 = {};
        var checkcompany = Session.get('HOSPCODE')
        if (!$("#pid").val()) {
            toastr.warning("กรุณากรอกหมายเลขบัตรประชาชน", "ไม่สำเร็จ");
        } else if (!Session.get('checkpid')) {
            toastr.warning("กรุณาตรวจสอบความถูกต้องของบัตรประชาชน", "ไม่สำเร็จ");
        } else if (!$("#FName").val()) {
            toastr.warning("กรุณากรอกชื่อ", "ไม่สำเร็จ");
        } else if (!$("#LName").val()) {
            toastr.warning("กรุณากรอกนามสกุล", "ไม่สำเร็จ");
        } else if (!$("#titleName").val()) {
            toastr.warning("กรุณากรอกคำนำหน้าชื่อ", "ไม่สำเร็จ");
        } else if (!$("#sex").val()) {
            toastr.warning("กรุณากรอกข้อมูลเพศ", "ไม่สำเร็จ");
        } else if ($("#birthDate").val() == "__/__/____") {
            toastr.warning("กรุณากรอกข้อมูลวัน/เดือน/ปีเกิด", "ไม่สำเร็จ");
        } else if (!$("#tel").val()) {
            toastr.warning("กรุณากรอกข้อมูลเบอร์โทรติดต่อ", "ไม่สำเร็จ");
        } else if (!ValiddateNumber($("#tel").val())) {
            toastr.warning("กรุณากรอกเบอร์โทรติดต่อเป็นตัวเลขเท่านั้น", "ไม่สำเร็จ");
        } else if (!$("#email").val()) {
            toastr.warning("กรุณากรอกข้อมูลอีเมลล์ถ้าไม่มีให้ใส่ -", "ไม่สำเร็จ");
        } else if (!checkcompany) {
            toastr.warning("กรุณากรอกข้อมูลหน่วยงาน", "ไม่สำเร็จ");
        } else if (!$("#password").val() && !$("#passwordq").val()) {
            toastr.warning("กรุณาตั้งรหัสผ่านเข้าใช้งาน", "ไม่สำเร็จ");
        } else {
            if ($("#password").val() == $("#passwordq").val()) {
                if (/^([a-zA-Z0-9 _-]+)$/.test($("#password").val())) {
                    $('body').addClass('waitMe_body');
                    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
                    $('body').prepend(elem);
                    NProgress.start();
                    var bdateString = $("#birthDate").val().split("/");
                    var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
                    var data = Session.get('districtName')[0];
                    
                    //console.log(bdate);
                    //console.log(data);
                    //console.log('-------');
                    //console.log($("#pid").val());
                    //console.log($("#titleName").val());
                    //console.log($("#FName").val());
                    //console.log($("#LName").val());
                    //console.log($("#sex").val());
                    //console.log($("#tel").val());
                    //console.log($("#email").val().replace(/\s/g, ''));
                    //console.log($("#persontype").val());
                    //console.log($("#username").val());
                    //console.log($("#password").val());
                    //console.log($("#passwordq").val());
                    //console.log(checkcompany);
                    
                    var insert_company = {
                        CID: $("#pid").val(),
                        PRENAME: $("#titleName").val(),
                        NAME: $("#FName").val(),
                        LNAME: $("#LName").val(),
                        SEX: $("#sex").val(),
                        BIRTH: bdate,
                        MOBILE: $("#tel").val(),
                        EMAIL: $("#email").val().replace(/\s/g, ''),
                        DISTRICT_DETAIL: {
                            CODE: checkcompany,
                            NAME: data.D_NAME,
                            DISTRICT: data.DISTRICT,
                            AMPHOE: data.SUBDISTRICT,
                            PROVINCE: data.PROVINCE
                        },
                        PROVIDERTYPE: $("#persontype").val(),
                        CREATEDATE: new Date(),
                        zone: data.ZONE,
                        confirm: false
                    }


                        if (navigator.onLine && !_.isEmpty(insert_company)) {

                            Meteor.call('INSERT_USER_DISTRICT', $("#username").val(), function (error, result) {
                                //console.log(result);
                                if(result.length > 0){
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                                    NProgress.done();
                                    toastr.error('บันทึกข้อมูลไม่สำเร็จ ผู้ใช้งานนี้ได้ลงทะเบียนในระบบแลัว')
                                }else{
                                    Meteor.call('INSERT_DISTRICT_USER_DATA', insert_company, function (error, result) {
                                        Meteor.call('encrypted', $("#password").val(), function (error, result) {
                                            //console.log(result);
        
                                            if (result) {
                                                var login_detail = {
                                                    CID: $("#pid").val(),
                                                    USERNAME: $("#username").val(),
                                                    PASSWORD: result,
                                                    NAME: data.D_NAME,
                                                    ZONE: data.ZONE,
                                                    DISTRICT: data.DISTRICT,
                                                    SUBDISTRICT: data.SUBDISTRICT,
                                                    PROVINCE: data.PROVINCE,
                                                    RULE: "DISTRICT",
                                                    CREATEDATE: new Date(),
                                                    LAST_VISIT: new Date()
                                                }
                                                Meteor.call('INSERT_USER_LOGIN', $("#pid").val(), login_detail, function () {
                                                    $('body.waitMe_body').addClass('hideMe');
                                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                                                    NProgress.done();
                                                    Router.go("/")
                                                    toastr.success("บันทึกเรียบร้อย ท่านจะเข้าสู่ระบบได้เมื่อศุนย์อนามัยอนุมัติใช้งาน");
                                                    insert_company = {}
        
                                                });
                                            }
        
                                        });
                                    })
                                }
                            })

                            

                        } else {
                            $('body.waitMe_body').addClass('hideMe');
                            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                            $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            NProgress.done();
                            toastr.error('บันทึกข้อมูลไม่สำเร็จกรุณาเช็คการเชื่อมต่อกับอินเทอร์เน็ตหรือทำรายการใหม่อีกครั้ง')
                        }

                } else {
                    toastr.warning("กรุณาใส่รหัสผ่านเป็นตัวเลขหรือตัวอักษรภาษาอังกฤษเท่านั้น", "ไม่สำเร็จ");
                    $("#password").val("");
                    $("#passwordq").val("");
                }
            } else {
                toastr.warning("รหัสผ่านไม่ตรงกัน ลองอีกครั้ง", "ไม่สำเร็จ");
                $("#password").val("");
                $("#passwordq").val("");
            }
        }

    },
    "change #companyName"() {
        $('#username').val($('#companyName').val())
        Session.set('HOSPCODE', $('#companyName').val())
        //console.log($('#companyName').val());
        Meteor.call('getDISTRICT_USER_DATA', $('#companyName').val(), function (error, result) {
            //console.log(result);
            if(result.length > 0){
                Session.set('districtName', result)
            }else{
                var myArr = []
                Session.set('districtName', myArr)
            }
        });
    },
})

Template.adminamp.helpers({
    user() {
        return Session.get('user').RULE
    },
    showaddress() {
        //console.log(Session.get('districtName'));
        try {
            if (Session.get('districtName')) {
                var data = Session.get('districtName')[0];
                //console.log(data);
                return "จังหวัด: " + data.PROVINCE.split('-')[1] + " อำเภอ: " + data.SUBDISTRICT.split('-')[1] + " ตำบล: " + data.DISTRICT.split('-')[1]
            } else {
                return data
            }
        } catch (e) {

        }
    },
})

function checkID(id) {
    if (id.length != 13) return false;
    for (i = 0, sum = 0; i < 12; i++)
        sum += parseFloat(id.charAt(i)) * (13 - i);
    if ((11 - sum % 11) % 10 != parseFloat(id.charAt(12)))
        return false;
    return true;
}

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true
    } else {
        return false
    }
}

function ValiddateNumber(num) {
    return num.match(/^-{0,1}\d+$/)
}