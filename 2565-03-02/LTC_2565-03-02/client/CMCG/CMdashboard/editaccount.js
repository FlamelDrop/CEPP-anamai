import { UploadFS } from 'meteor/jalik:ufs';
import { GridFSStore } from 'meteor/jalik:ufs-gridfs';
// const photosg = new Mongo.Collection('photosg');
Photos = new Mongo.Collection('photos');
const editPhotocm = new GridFSStore({
    collection: Photos,
    name: 'editPhotocm',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png']
    }),
    path: '/uploads/photos'
});
Template.editaccount.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.editaccount.onRendered(function helloOnCreated() {
    Session.set('getDLA_Detail', null)
    Session.set('getEditedZoneCMbyHOSPCODE', null)
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
    Session.set('districtNameWorkEditedCM', null)
    Meteor.call('getUserCM', Session.get('cmid'), function (error, result) {
        Session.set('getProfileCM', result)

        if (result[0].HOSPCODE) {
            Meteor.call('getAllServiceCenterDistrict', result[0].HOSPCODE.CODE, function (error, result) {

                Session.set('Namehos', "[" + result.hospcode + "] " + result.name)


            });

            Meteor.call('getDistrictName', result[0].TAMBON.CODE, function (error, result) {
                Session.set('districtNameWorkEditedCM', result)
            });
            Meteor.call('getRegProvince_name', function (error, result) {
                $('#province_name')[0].selectize.destroy()
                $('#province_name').selectize({ options: result, create: false });
                if (Session.get('districtNameWorkEditedCM')) {
                    var $select = $("#province_name").selectize();
                    var selectize = $select[0].selectize;
                    selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCM').province_code + "-" + Session.get('districtNameWorkEditedCM').province_name).query);
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                } else {
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }

            });

            Meteor.call('getAllServiceCenterDistrict', result[0].HOSPCODE.CODE, function (error, result) {
                Session.set('getEditedZoneCMbyHOSPCODE', result)
                Session.set('hospAdd', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
            });
        } else {
            Meteor.call('getDLA_NAME', result[0].DLACODE.CODE, function (error, result) {
                if (result) {
                    Session.set('Namehos', "[" + result.DLA_CODE + "] " + result.DLA_NAME);
                    Session.set('hospAdd', " ต." + result.TAMBON + result.DISTRICT + " จ." + result.PROVINCE)

                }

            });
            Meteor.call('getDistrictName', result[0].TAMBON.CODE, function (error, result) {
                Session.set('districtNameWorkEditedCM', result)
            });
            Meteor.call('getRegProvince_name', function (error, result) {
                $('#province_name')[0].selectize.destroy()
                $('#province_name').selectize({ options: result, create: false });
                if (Session.get('districtNameWorkEditedCM')) {
                    var $select = $("#province_name").selectize();
                    var selectize = $select[0].selectize;
                    selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCM').province_code + "-" + Session.get('districtNameWorkEditedCM').province_name).query);
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                } else {
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }
            });
        }

    });


    $('#district_name').selectize();
    $('#subdistrict_name').selectize();
    $('#province_name').selectize();




    var tarindate = new Date(Session.get('getProfileCM')[0].TRAINING_DATE);
    Session.set('EXPIREDATE', new Date(tarindate.getFullYear() + 2, tarindate.getMonth(), tarindate.getDate()))
    Session.set("showingEditedCMImg", Session.get('getProfileCM')[0].IMG)
});

Template.editaccount.helpers({
    showname() {
        return Session.get("cmname");
    },
    profile() {
        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }

    },
    hosp() {

        if (Session.get('hospAdd')) {
            return Session.get('hospAdd');
        }
    },
    Namehos() {
        return Session.get('Namehos')
    },
    showimg() {
        return Session.get('showingEditedCMImg');
    },
    EXPIREDATE() {
        return Session.get('EXPIREDATE')
    },
    OldNameWork() {
        if (Session.get('districtNameWorkEditedCM')) {
            var data = Session.get('districtNameWorkEditedCM');
            return data.fullcode + " ต." + data.subdistrict_name + " อ." + data.district_name + " จ." + data.province_name
        }
    },
    NewDistricName() {
        if (Session.get('NewdistrictNameWorkEditedCM')) {
            return Session.get('NewdistrictNameWorkEditedCM')
        }
    }
})

Template.editaccount.events({
    'click #viewProfile'() {
        Session.set('viewProfile', true)
        Session.set('viewCG', false)
        Session.set('viewElder', false)
        Session.set('viewBetterElder', false)
        Session.set('viewDeathElder', false)
        Session.set('viewCmEvaluate', false)
    },
    "change #companyName"() {
        Session.set('HOSPCODE', $('#companyName').val())
        Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (error, result) {
            if (result) {
                Session.set('getEditedZoneCMbyHOSPCODE', result)
                Session.set('hospAdd', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
            }
        });
    },
    "change #trainingDate"() {
        var tdateString = $("#trainingDate").val().split("/");
        var tdate = new Date(parseInt(tdateString[2] - 539), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
        Session.set('EXPIREDATE', tdate)
    },
    "change #subdistrict_name"() {
        var res = $('#subdistrict_name').val().split("-")
        Meteor.call('getDistrictName', res[0], function (error, data) {
            Session.set('NewdistrictNameWorkEditedCM', data.fullcode + " ต." + data.subdistrict_name + " อ." + data.district_name + " จ." + data.province_name)
        });
    },
    "change #district_name"() {
        var res = $('#district_name').val().split('-')
        Meteor.call('getRegSubsistrict_name', res[0], function (error, result) {
            $('#subdistrict_name')[0].selectize.destroy()
            $('#subdistrict_name').selectize({ options: result, create: false });
            var $select = $("#subdistrict_name").selectize();
            var selectize = $select[0].selectize;
            selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCM').fullcode + "-" + Session.get('districtNameWorkEditedCM').subdistrict_name).query);

        });
    },
    "change #province_name"() {
        var res = $('#province_name').val().split('-')
        Meteor.call('getRegDistrict_name', res[0], function (error, result) {
            $('#district_name')[0].selectize.destroy()
            $('#district_name').selectize({ options: result, create: false });
            var $select1 = $("#district_name").selectize();
            var selectize1 = $select1[0].selectize;
            selectize1.setValue(selectize1.search(Session.get('districtNameWorkEditedCM').district_code + "-" + Session.get('districtNameWorkEditedCM').district_name).query);
        });
    },
    "change #pid"() {
        $('#username').val($('#pid').val())
        Meteor.subscribe("getCM", {
            onReady: function () {
                var data = CM_REGISTER.find({
                    pid: $('#pid').val()
                });
                if (data.count() == 0 && $('#pid').val().length == 13) {
                    $("#ckeckpid").removeClass("has-error");
                    $("#ckeckpid").addClass("has-success");
                    $("#symbolckeckpid").removeClass("glyphicon glyphicon-remove");
                    $("#symbolckeckpid").addClass("glyphicon glyphicon-ok");
                    Session.set('checkpid', true);
                } else {
                    $("#ckeckpid").removeClass("has-success");
                    $("#ckeckpid").addClass("has-error");
                    $("#symbolckeckpid").removeClass("glyphicon glyphicon-ok");
                    $("#symbolckeckpid").addClass("glyphicon glyphicon-remove");
                    Session.set('checkpid', false);
                }
            }
        });
    },
    "click #save"() {
        if (!$("#FName").val()) {
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
        } else if (!$('#LICENCE_NUMBER').val()) {
            toastr.warning("กรุณากรอกข้อมูลรหัสใบประกอบวิชาชีพถ้าไม่มีให้ใส่ -", "ไม่สำเร็จ");
        } else if (!$('#POSITIONCODE').val()) {
            toastr.warning("กรุณากรอกข้อมูลตําแหน่งที่ปฏิบัติงานปัจจุบันถ้าไม่มีให้ใส่ -", "ไม่สำเร็จ");
        } else if ($("#trainingDate").val() == "__/__/____") {
            toastr.warning("กรุณากรอกข้อมูลวันที่ผ่านการอบรม", "ไม่สำเร็จ");
        } else if (!$("#trainingBy").val()) {
            toastr.warning("กรุณากรอกข้อมูลหน่วยงานที่จัดอบรม", "ไม่สำเร็จ");
        } else {
            var bdateString = $("#birthDate").val().split("/");
            var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
            var tdateString = $("#trainingDate").val().split("/");
            var tdate = new Date(parseInt(tdateString[2] - 543), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
            var data = Session.get('getEditedZoneCMbyHOSPCODE') || Session.get('getZoneByDLA');

            CM_REGISTER.update({
                "_id": Session.get('getProfileCM')[0]._id
            }, {
                    $set: {
                        PRENAME: $("#titleName").val(),
                        NAME: $("#FName").val(),
                        LNAME: $("#LName").val(),
                        SEX: $("#sex").val(),
                        BIRTH: bdate,
                        MOBILE: $("#tel").val(),
                        EMAIL: $("#email").val(),
                        //HOSPCODE: Session.get('HOSPCODE'),
                        TRAINING_DATE: tdate,
                        EXPIREDATE: Session.get('EXPIREDATE'),
                        TRAINING_CENTER_ID: $("#trainingBy").val(),
                        IMG: Session.get('showingEditedCMImg'),
                        STATE_ACTIVE: $("#stateActive").val(),
                        ADDRESS: $("#address").val(),
                        TAMBON: {
                            CODE: $("#subdistrict_name").val().split('-')[0],
                            DISTRICT: $("#subdistrict_name").val().split('-')[1],
                            AMPHOE_CODE: $('#district_name').val().split('-')[0],
                            AMPHOE: $('#district_name').val().split('-')[1],
                            PROVINCE_CODE: $('#province_name').val().split('-')[0],
                            PROVINCE: $('#province_name').val().split('-')[1]
                        },
                        PROVIDERTYPE: $("#persontype").val(),
                        LICENCE_NUMBER: $("#LICENCE_NUMBER").val(),
                        POSITIONCODE: $("#POSITIONCODE").val(),
                        zone: data.zone,
                        D_UPDATE: new Date()
                    }
                });
            if ($("#password").val() != "") {
                if ($("#password").val() == $("#passwordq").val()) {
                    if (/^([a-zA-Z0-9 _-]+)$/.test($("#password").val())) {
                        Meteor.call('encrypted', $("#password").val(), function (error, result) {

                            USER_LOGIN.update({
                                "_id": Session.get('_idLoginCM')
                            }, {
                                    $set: {
                                        PASSWORD: result
                                    }
                                });
                        });
                        Session.set('cmname', $("#FName").val() + " " + $("#LName").val());
                        toastr.success("อัพเดทข้อมูลส่วนตัวเรียบร้อย", "สำเร็จ");
                        Router.go("/CMdashboard")
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
                Session.set('cmname', $("#FName").val() + " " + $("#LName").val());
                toastr.success("อัพเดทข้อมูลส่วนตัวเรียบร้อย", "สำเร็จ");
                Router.go("/CMdashboard")
            }

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
                store: editPhotocm || 'editPhotocm',
                adaptive: true,
                capacity: 0.8,
                chunkSize: 8 * 1024,
                maxChunkSize: 128 * 1024,
                maxTries: 5,
                data: file,
                file: photo,
                onError(err, file) {
                    if (err) {
                        console.log(err)
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
                    var urlpic = "http://ltc.anamai.moph.go.th" + (file.url).split('http://10.100.1.26:80')[1]
                    Session.set("showingEditedCMImg", file.url)
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
                    Session.set("showingEditedCMImg", "InternetSlowdown_Day.gif")
                },
                onStop(file) {
                    // console.log(file.name + ' stopped');
                },
            });
            uploader.start();
        });
    }
});

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
