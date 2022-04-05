import { UploadFS } from 'meteor/jalik:ufs';
import { GridFSStore } from 'meteor/jalik:ufs-gridfs';
// Photos = new Mongo.Collection('photos');
const PhotoCG = new GridFSStore({
    collection: Photos,
    name: 'photoCG',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png']
    }),

});
Template.formregcg.onRendered(function helloOnCreated() {
    Object.keys(Session.keys).forEach(function (key) {
        Session.set(key, undefined);
    });
    Session.keys = {};
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
        onShow: thaiYear,
        yearStart: 1800,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });
    $("#trainingDate").datetimepicker({
        timepicker: false,
        format: 'd/m/Y', // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000
        lang: 'th', // แสดงภาษาไทย
        mask: true,
        onChangeMonth: thaiYear,
        onShow: thaiYear,
        yearStart: 1800,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });
    $('#district_name').selectize();
    $('#subdistrict_name').selectize();
    //$('#companyName').selectize();
    $('#province_name').selectize();
    Session.set("removephoto", null);
    // Meteor.call('getAllServiceCenter', function (error, result) {
    //     $('#companyName')[0].selectize.destroy()
    //     $('#companyName').selectize({ options: result, create: false });
    // });
    Meteor.call('getRegProvince_name', function (error, result) {
        $('#province_name')[0].selectize.destroy()
        $('#province_name').selectize({ options: result, create: false });
    });
    $("#radio_company").prop("checked", true);
    Session.set('switchCompany', true)
});


Template.formregcg.onRendered(function helloOnCreated() {
    Object.keys(Session.keys).forEach(function (key) {
        Session.set(key, undefined);
    });
    Session.keys = {};
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
        onShow: thaiYear,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });
    $("#trainingDate").datetimepicker({
        timepicker: false,
        format: 'd/m/Y', // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000            
        lang: 'th', // แสดงภาษาไทย
        mask: true,
        onChangeMonth: thaiYear,
        onShow: thaiYear,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });
    $('#district_name').selectize();
    $('#subdistrict_name').selectize();
    //$('#companyName').selectize();
    $('#province_name').selectize();
    Session.set("removephoto", null);
    // Meteor.call('getAllServiceCenter', function (error, result) {
    //     $('#companyName')[0].selectize.destroy()
    //     $('#companyName').selectize({ options: result, create: false });
    // });
    Meteor.call('getRegProvince_name', function (error, result) {
        $('#province_name')[0].selectize.destroy()
        $('#province_name').selectize({ options: result, create: false });
    });
    $("#radio_company").prop("checked", true);
    Session.set('switchCompany', true)
});


Template.select_company_cg.onRendered(function init() {
    $('#companyName').selectize();
    Meteor.call('getAllServiceCenter', function (error, result) {
        $('#companyName')[0].selectize.destroy()
        $('#companyName').selectize({ options: result, create: false });
    });
});

Template.select_dla_cg.onRendered(function init() {
    $('#dla').selectize();
    Meteor.call('getAllDLA_CODE', function (error, result) {
        $('#dla')[0].selectize.destroy()
        $('#dla').selectize({ options: result, create: false });
    });
});

Template.formregcg.helpers({
    showimg() {
        return Session.get('showImageRegCG');
    },
    showaddress() {
        try {
            if (Session.get('switchCompany')) {
                var data = Session.get('districtName');
                return data.address + " หมู่ " + data.moo + " ต." + data.district.split('-')[1] + " อ." + data.amphoe.split('-')[1] + " จ." + data.province.split('-')[1] + " เขต " + data.zone;
            } else {
                return data
            }
        } catch (e) {

        }
    },
    switchCompany() {
        if (Session.get('switchCompany')) {
            return true
        } else {
            return false
        }
    },
    EXPIREDATE() {
        return Session.get('EXPIREDATE')
    },
    districtNameWork() {
        if (Session.get('districtNameWork')) {
            return Session.get('districtNameWork')[0]
        }
    }
})

Template.formregcg.events({
    "click  #radio_company"() {
        Session.set('switchCompany', true)
        Session.set('getDLA_CODEbySelected', "");
    },
    "click  #radio_dla"() {
        Session.set('switchCompany', false)
        Session.set('districtName', "");
        Session.set('HOSPCODE', "")

    },
    "change #subdistrict_name"() {
        var res = $('#subdistrict_name').val().split("-")
        Session.set('districtNameWork', res)
    },
    "change #district_name"() {
        var res = $('#district_name').val().split('-')
        Meteor.call('getRegSubsistrict_name', res[0], function (error, result) {
            $('#subdistrict_name')[0].selectize.destroy()
            $('#subdistrict_name').selectize({ options: result, create: false });

        });
    },
    "change #province_name"() {
        var res = $('#province_name').val().split('-')
        Meteor.call('getRegDistrict_name', res[0], function (error, result) {
            $('#district_name')[0].selectize.destroy()
            $('#district_name').selectize({ options: result, create: false });

        });
    },
    "change #dla"() {
        Session.set('getDLA_CODEbySelected', $('#dla').val())
        Meteor.call('getDLA_NAME', $('#dla').val(), function (error, result) {
            Session.set('districtName', result)
            Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                Session.set('getZoneByDLA', result);
            })
        });
    },
    "change #companyName"() {
        Session.set('HOSPCODE', $('#companyName').val())
        Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (error, result) {
            Session.set('districtName', result)
        });
    },
    "change #trainingDate"() {
        var tdateString = $("#trainingDate").val().split("/");
        var tdate = new Date(parseInt(tdateString[2] - 539), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
        Session.set('EXPIREDATE', tdate)
    },
    "change #pid"() {
        $('#username').val($('#pid').val())
        if (checkID($('#pid').val())) {
            Meteor.call('getUserCG', $('#pid').val(), function (error, result) {

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
        // var insert_data = {};
        var checkcompany = Session.get('HOSPCODE') || Session.get('getDLA_CODEbySelected')
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
        } else if (!$('#address').val()) {
            toastr.warning("กรุณากรอกข้อมูลที่อยู่ปัจจุบัน", "ไม่สำเร็จ");
        } else if (!$('#subdistrict_name').val()) {
            toastr.warning("กรุณากรอกข้อมูลตำบลที่ปฏิบัติงาน", "ไม่สำเร็จ");
        } else if (!$("#email").val()) {
            toastr.warning("กรุณากรอกข้อมูลอีเมลล์ถ้าไม่มีให้ใส่ -", "ไม่สำเร็จ");
            // } else if (!ValidateEmail($("#email").val())) {
            //     toastr.warning("กรุณาตรวจสอบความถูกต้องของอีเมลล์", "ไม่สำเร็จ");
        } else if (!$("#education").val()) {
            toastr.warning("กรุณากรอกข้อมูลระดับการศึกษา", "ไม่สำเร็จ");
        } else if (!checkcompany) {
            toastr.warning("กรุณากรอกข้อมูลหน่วยงาน", "ไม่สำเร็จ");
        } else if (!$('#POSITIONCODE').val()) {
            toastr.warning("กรุณากรอกข้อมูลตําแหน่งที่ปฏิบัติงานปัจจุบันถ้าไม่มีให้ใส่ -", "ไม่สำเร็จ");
        } else if ($("#trainingDate").val() == "__/__/____") {
            toastr.warning("กรุณากรอกข้อมูลวันที่ผ่านการอบรม", "ไม่สำเร็จ");
        } else if (!$("#trainingBy").val()) {
            toastr.warning("กรุณากรอกข้อมูลหน่วยงานที่จัดอบรม", "ไม่สำเร็จ");
        } else if (!$("#TRAININGHOURS").val()) {
            toastr.warning("กรุณากรอกข้อมูลชั่วโมงการอบรม", "ไม่สำเร็จ");
        } else {
            // if (Session.get('HOSPCODE') && $("#subdistrict_name").val() && $("#pid").val() && $("#titleName").val() && $("#FName").val() && $("#LName").val() && $("#sex").val() && $("#tel").val() && $("#email").val() && $("#companyName").val() && $("#trainingBy").val()  && $("#birthDate").val() && $("#trainingDate").val() && Session.get('checkpid') && $("#TRAININGHOURS").val() && $("#POSITIONCODE").val()) {
            $('body').addClass('waitMe_body');
            var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
            $('body').prepend(elem);
            NProgress.start();
            var bdateString = $("#birthDate").val().split("/");
            var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
            var tdateString = $("#trainingDate").val().split("/");
            var tdate = new Date(parseInt(tdateString[2] - 543), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
            var data = Session.get('districtName');

            if (Session.get('switchCompany')) {
                Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (err, res) {
                    if (res) {
                        var insert_company = {
                            CID: $("#pid").val(),
                            PRENAME: $("#titleName").val(),
                            NAME: $("#FName").val(),
                            LNAME: $("#LName").val(),
                            SEX: $("#sex").val(),
                            BIRTH: bdate,
                            MOBILE: $("#tel").val(),
                            EMAIL: $("#email").val(),
                            HOSPCODE: {
                                CODE: Session.get('HOSPCODE'),
                                NAME: res.name,
                                DISTRICT: res.district,
                                AMPHOE: res.amphoe,
                                PROVINCE: res.province
                            },
                            DLACODE: null,
                            TRAINING_DATE: tdate,
                            EXPIREDATE: Session.get('EXPIREDATE'),
                            TRAINING_CENTER_ID: $("#trainingBy").val(),
                            IMG: Session.get('showImageRegCG'),
                            STATE_ACTIVE: $("#stateActive").val(),
                            ADDRESS: $("#address").val(),
                            TAMBON: {
                                CODE: $("#subdistrict_name").val().split('-')[0],
                                DISTRICT: $('#subdistrict_name').val().split('-')[1],
                                AMPHOE_CODE: $('#district_name').val().split('-')[0],
                                AMPHOE: $('#district_name').val().split('-')[1],
                                PROVINCE_CODE: $('#province_name').val().split('-')[0],
                                PROVINCE: $('#province_name').val().split('-')[1]
                            },
                            TRAININGHOUR: $("#TRAININGHOURS").val(),
                            POSITIONCODE: $("#POSITIONCODE").val(),
                            EDUCATION: $("#education").val(),
                            LATITUDE: null,
                            LONGITUDE: null,
                            CREATEDATE: new Date(),
                            D_UPDATE: null,
                            confirm: false,
                            zone: data.zone,
                        }
                        if (navigator.onLine && !_.isEmpty(insert_company)) {
                            Meteor.call('INSERT_CG_REGISTER', insert_company, function (error, result) {

                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                                NProgress.done();
                                toastr.success("บึนทึกเรียบร้อย", "สำเร็จ");
                                Router.go("/")

                            })

                        } else {
                            $('body.waitMe_body').addClass('hideMe');
                            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                            $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            NProgress.done();
                            toastr.error('บันทึกข้อมูลไม่สำเร็จกรุณาเช็คการเชื่อมต่อกับอินเทอร์เน็ตหรือทำรายการใหม่อีกครั้ง')
                        }
                    }
                })

            } else {
                Meteor.call('getDLA_NAME', $('#dla').val(), function (err, res) {
                    if (res) {
                        var insert_dla = {
                            CID: $("#pid").val(),
                            PRENAME: $("#titleName").val(),
                            NAME: $("#FName").val(),
                            LNAME: $("#LName").val(),
                            SEX: $("#sex").val(),
                            BIRTH: bdate,
                            MOBILE: $("#tel").val(),
                            EMAIL: $("#email").val(),
                            HOSPCODE: null,
                            DLACODE: {
                                CODE: Session.get('getDLA_CODEbySelected'),
                                NAME: res.DLA_NAME,
                                DISTRICT: res.DISTRICT,
                                PROVINCE: res.PROVINCE,
                                TAMBON:res.TAMBON
                            },
                            TRAINING_DATE: tdate,
                            EXPIREDATE: Session.get('EXPIREDATE'),
                            TRAINING_CENTER_ID: $("#trainingBy").val(),
                            IMG: Session.get('showImageRegCG'),
                            STATE_ACTIVE: $("#stateActive").val(),
                            ADDRESS: $("#address").val(),
                            TAMBON: {
                                CODE: $("#subdistrict_name").val().split('-')[0],
                                DISTRICT: $('#subdistrict_name').val().split('-')[1],
                                AMPHOE_CODE: $('#district_name').val().split('-')[0],
                                AMPHOE: $('#district_name').val().split('-')[1],
                                PROVINCE_CODE: $('#province_name').val().split('-')[0],
                                PROVINCE: $('#province_name').val().split('-')[1]
                            },
                            TRAININGHOUR: $("#TRAININGHOURS").val(),
                            POSITIONCODE: $("#POSITIONCODE").val(),
                            EDUCATION: $("#education").val(),
                            LATITUDE: null,
                            LONGITUDE: null,
                            CREATEDATE: new Date(),
                            D_UPDATE: null,
                            confirm: false,
                            zone: Session.get('getZoneByDLA'),
                        }
                    }
                    if (navigator.onLine && !_.isEmpty(insert_dla)) {
                        Meteor.call('INSERT_CG_REGISTER', insert_dla, function (error, result) {

                            $('body.waitMe_body').addClass('hideMe');
                            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                            $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            NProgress.done();
                            toastr.success("บึนทึกเรียบร้อย", "สำเร็จ");
                            Router.go("/")

                        })

                    } else {
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                        NProgress.done();
                        toastr.error('บันทึกข้อมูลไม่สำเร็จกรุณาเช็คการเชื่อมต่อกับอินเทอร์เน็ตหรือทำรายการใหม่อีกครั้ง')
                    }
                });

                // } else {
                //     toastr.warning("ตรวจสอบใหม่ข้อมูลที่กรอกอีกครั้ง", "ไม่สำเร็จ");
            }
        }

    },
    'keypress #email'() {
        var key = window.event.keyCode;
        var allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 :;,.?!£$%^&*()_+-*{}@~<>&"\'';
        if (allowed.indexOf(String.fromCharCode(key)) != -1) {
            return allowed.indexOf(String.fromCharCode(key)) != -1
        } else {
            alert('กรุณาเปลี่ยนภาษาเครื่องคอมพิวเตอร์ของท่านให้เป็นภาษาอังกฤษก่อนกรอกข้อมูลอีเมลล์')
            return allowed.indexOf(String.fromCharCode(key)) != -1
        }
    },
    'click button[name=upload]'(ev) {
        Photos.remove({ _id: Session.get("removephoto") })
        UploadFS.selectFiles(function (file) {
            let photo = {
                name: file.name,
                size: file.size,
                type: file.type,
            };
            let uploader = new UploadFS.Uploader({
                store: PhotoCG || 'photoCG',
                adaptive: true,
                capacity: 0.8,
                chunkSize: 8 * 1024,
                maxChunkSize: 128 * 1024,
                maxTries: 5,
                data: file,
                file: photo,
                onError(err, file) {
                    if (err) {
                        alert("ไฟล์รูปเท่านั้น")
                    } else {
                        // console.log(file)
                    }
                },
                onAbort(file) {
                    // console.log(file.name + ' upload has been aborted');
                },
                onComplete(file) {
                    // console.log(file.name + ' has been uploaded ' + file.url);
                    //var urlpic = "http://ltc.anamai.moph.go.th"+(file.url).split('http://10.100.1.26:80')[1]
                    Session.set("showImageRegCG", file.url)
                },
                onCreate(file) {
                    // console.log(file.name + ' has been created with ID ' + file._id);
                    Session.set("removephoto", file._id);
                },
                onProgress(file, progress) {
                    // console.log(file.name + ' ' + (progress * 100) + '% uploaded');

                },
                onStart(file) {
                    // console.log(file.name + ' started');
                    Session.set("showImageRegCG", "InternetSlowdown_Day.gif")
                },
                onStop(file) {
                    // console.log(file.name + ' stopped');
                },
            });
            uploader.start();
        });
    }
});

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
