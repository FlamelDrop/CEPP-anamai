import { UploadFS } from 'meteor/jalik:ufs';
import { GridFSStore } from 'meteor/jalik:ufs-gridfs';
// const photosg = new Mongo.Collection('photosg');
// Photos = new Mongo.Collection('photos');

const hpcEditCm = new GridFSStore({
    collection: Photos,
    name: 'hpcEditCm',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png']
    }),
    path: '/uploads/photos'
});
Template.hpceditcm.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.hpceditcm.onRendered(function () {
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
        yearStart: 1800,
        onChangeMonth: thaiYear,
        onShow: thaiYear,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });
    Session.set('districtNameWorkEditedCM',null)
    $('#companyName').selectize();
    $('#district_name').selectize();
    $('#subdistrict_name').selectize();
    $('#province_name').selectize();
    Meteor.call('getUserCM', Session.get('hpcEditCmDetail2'), function (error, result) {
        Session.set('HpcGetProfileCM', result)

        Meteor.call('getDistrictName', Session.get('HpcGetProfileCM')[0].TAMBON.CODE, function (error, result) {
            Session.set('districtNameWorkEditedCM', result)
        });
        Meteor.call('getRegProvince_name', function (error, result) {
            $('#province_name')[0].selectize.destroy()
            $('#province_name').selectize({ options: result, create: false });
            if(Session.get('districtNameWorkEditedCM')){
                var $select = $("#province_name").selectize();
                var selectize = $select[0].selectize;
                selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCM').province_code + "-" + Session.get('districtNameWorkEditedCM').province_name).query);
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            }else{
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            }
          
        });

    });



});

Template.hpceditcm.helpers({
    showname() {
        return Session.get("cmname");
    },
    profile() {
        if (Session.get('HpcGetProfileCM')) {
            return Session.get('HpcGetProfileCM')[0];
        }

    },
    hosp() {

        if (Session.get('hospAdd')) {
            return Session.get('hospAdd');
        }
    },
    hospAdd() {
        if (Session.get('hospAdd')) {
            return Session.get('hospAdd');
        }
    },
    Namehos() {
        if (Session.get('HpcGetProfileCM')) {
            var tarindate = new Date(Session.get('HpcGetProfileCM')[0].TRAINING_DATE);
            Session.set('EXPIREDATE', new Date(tarindate.getFullYear() + 2, tarindate.getMonth(), tarindate.getDate()))
            Session.set("showingEditedCMImg", Session.get('HpcGetProfileCM')[0].IMG)
            var tarindate = new Date(Session.get('HpcGetProfileCM')[0].TRAINING_DATE);
            Session.set('EXPIREDATEEDITEDCG', new Date(tarindate.getFullYear() + 2, tarindate.getMonth(), tarindate.getDate()))

        }
    },
    showimg() {
        return Session.get('showingEditedCMImg');
    },
    radioStatus() {
        if (Session.get('HpcGetProfileCM')) {
            if (Session.get('HpcGetProfileCM')[0].HOSPCODE) {
                Session.set('switchCompany', true)
                return { comp: true, dla: false }
            } else {

                Session.set('switchCompany', false)
                return { comp: false, dla: true }
            }

        }
    },
    switchCompany() {
        if (Session.get('HpcGetProfileCM')) {
            if (Session.get('switchCompany')) {
                if (Session.get('HpcGetProfileCM')[0].HOSPCODE) {
                    Meteor.call('getAllServiceCenter', function (error, result) {
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                        var $select = $("#companyName").selectize();
                        var selectize = $select[0].selectize;
                        selectize.setValue(selectize.search(Session.get('HpcGetProfileCM')[0].HOSPCODE.CODE).query);
                    });
                    Meteor.call('getAllServiceCenterDistrict', Session.get('HpcGetProfileCM')[0].HOSPCODE.CODE, function (error, result) {
                        Session.set('districtName', result)
                        Meteor.call('getAllServiceCenter', function (error, result2) {
                            Session.set('Namehos', "[" + result.hospcode + "] " + result.name)
                            // Session.set('HOSPCODE', result.hospcode)
                        });

                    });
                    Meteor.call('getAllServiceCenterDistrict', Session.get('HpcGetProfileCM')[0].HOSPCODE.CODE, function (error, result) {
                        Session.set('getEditedZoneCMbyHOSPCODE', result)
                        Session.set('hospAdd', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
                    });

                    return true
                } else {
                    Meteor.call('getAllServiceCenter', function (error, result) {
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                    });
                    return true
                }
            } else {
                Session.set('hospAdd', null);
                if (Session.get('HpcGetProfileCM')[0].DLACODE) {
                    Meteor.call('getDLA_NAME', Session.get('HpcGetProfileCM')[0].DLACODE.CODE, function (error, result) {
                        if (result) {
                            Session.set('getDLA_Detail', result);
                            Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                                Session.set('getZoneByDLA', result);
                            })
                        }

                    });
                    Meteor.call('getAllDLA_CODE', function (error, result) {
                        $('#dla')[0].selectize.destroy()
                        $('#dla').selectize({ options: result, create: false });
                        var $select = $("#dla").selectize();
                        var selectize = $select[0].selectize;
                        selectize.setValue(selectize.search(Session.get('HpcGetProfileCM')[0].DLACODE.CODE).query);
                    });

                    return false
                } else {
                    Meteor.call('getAllDLA_CODE', function (error, result) {
                        $('#dla')[0].selectize.destroy()
                        $('#dla').selectize({ options: result, create: false });
                    });
                    return false
                }
            }
        }
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
        if (Session.get('NewdistrictNameWorkEditedCG')) {
            return Session.get('NewdistrictNameWorkEditedCG')
        }
    }
})

Template.hpceditcm.events({
    "change #companyName"() {
        Session.set('HOSPCODE', $('#companyName').val())
        Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (error, result) {
            if (result) {
                Session.set('getEditedZoneCMbyHOSPCODE', result)
                Session.set('hospAdd', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
            }
        });
    },
    "change #dla"(event) {
        Meteor.call('getDLA_NAME', $('#dla').val(), function (error, result) {
            if (result) {
                Session.set('getDLA_Detail', result);
                Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                    Session.set('getZoneByDLA', result);
                })
            }

        });

    },
    "click  #radio_company"() {
        Session.set('switchCompany', true)
        Session.set('getZoneByDLA', "");

    },
    "click  #radio_dla"() {
        Session.set('switchCompany', false)
        Session.set('getEditedZoneCMbyHOSPCODE', "");
        Session.set('HOSPCODE', "")

    },
    "change #trainingDate"() {
        var tdateString = $("#trainingDate").val().split("/");
        var tdate = new Date(parseInt(tdateString[2] - 541), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
        Session.set('EXPIREDATE', tdate)
    },
    "change #subdistrict_name"() {
        var res = $('#subdistrict_name').val().split("-")
        Meteor.call('getDistrictName', res[0], function (error, data) {
            Session.set('NewdistrictNameWorkEditedCG', data.fullcode + " ต." + data.subdistrict_name + " อ." + data.district_name + " จ." + data.province_name)
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
        var check_service = Session.get('getDLA_Detail') || Session.get('getEditedZoneCMbyHOSPCODE')
        if (check_service && $("#subdistrict_name").val() && $('#subdistrict_name') && $("#pid").val() && $("#titleName").val() && $("#FName").val() && $("#LName").val() && $("#sex").val() && $("#tel").val() && $("#email").val() && $("#trainingBy").val() && $("#birthDate").val() && $("#trainingDate").val()) {
            var bdateString = $("#birthDate").val().split("/");
            var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
            var tdateString = $("#trainingDate").val().split("/");
            var tdate = new Date(parseInt(tdateString[2] - 543), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
            var data = Session.get('getEditedZoneCMbyHOSPCODE');
            Session.set('Fe_titleName', $("#titleName").val())
            Session.set('Fe_FName', $("#FName").val())
            Session.set('Fe_LName', $("#LName").val())
            Session.set('Fe_sex', $("#sex").val())
            Session.set('Fe_tel', $("#tel").val())
            Session.set('Fe_email', $("#email").val())
            Session.set('Fe_companyName', $("#companyName").val())
            Session.set('Fe_DLA', $("#dla").val())
            Session.set('Fe_trainingBy', $("#trainingBy").val())
            Session.set('Fe_stateActive', $("#stateActive").val())
            Session.set('Fe_address', $("#address").val())
            Session.set('Fe_subdistrict_name', $("#subdistrict_name").val())
            Session.set('Fe_district_name', $('#district_name').val())
            Session.set('Fe_province_name', $('#province_name').val())
            Session.set('Fe_persontype', $("#persontype").val())
            Session.set('Fe_LICENCE_NUMBER', $("#LICENCE_NUMBER").val())
            Session.set('Fe_POSITIONCODE', $("#POSITIONCODE").val())
            if (data) {
                CM_REGISTER.update({
                    "_id": Session.get('HpcGetProfileCM')[0]._id
                }, {
                    $set: {
                        PRENAME: $("#titleName").val(),
                        NAME: $("#FName").val(),
                        LNAME: $("#LName").val(),
                        SEX: $("#sex").val(),
                        BIRTH: bdate,
                        MOBILE: $("#tel").val(),
                        EMAIL: $("#email").val(),
                        HOSPCODE: {
                            CODE: $("#companyName").val(),
                            NAME: Session.get('getEditedZoneCMbyHOSPCODE').name,
                            DISTRICT: Session.get('getEditedZoneCMbyHOSPCODE').district,
                            AMPHOE: Session.get('getEditedZoneCMbyHOSPCODE').amphoe,
                            PROVINCE: Session.get('getEditedZoneCMbyHOSPCODE').province
                        },
                        DLACODE: null,
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
                        zone: Session.get('getEditedZoneCMbyHOSPCODE').zone,
                        D_UPDATE: new Date()
                    }
                });

            } else {
                CM_REGISTER.update({
                    "_id": Session.get('HpcGetProfileCM')[0]._id
                }, {
                        $set: {
                            PRENAME: $("#titleName").val(),
                            NAME: $("#FName").val(),
                            LNAME: $("#LName").val(),
                            SEX: $("#sex").val(),
                            BIRTH: bdate,
                            MOBILE: $("#tel").val(),
                            EMAIL: $("#email").val(),
                            HOSPCODE: null,
                            DLACODE: {
                                CODE: $("#dla").val(),
                                NAME: Session.get('getDLA_Detail').DLA_NAME,
                                DISTRICT: Session.get('getDLA_Detail').DISTRICT,
                                PROVINCE: Session.get('getDLA_Detail').PROVINCE
                            },
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
                            zone: Session.get('getZoneByDLA'),
                            D_UPDATE: new Date()
                        }
                });
            }
            if ($("#password").val() != "") {
                if ($("#password").val() == $("#passwordq").val()) {
                    Meteor.call('encrypted', $("#password").val(), function (error, result) {
                        USER_LOGIN.update({
                            "_id": Session.get('_idCM')
                        }, {
                                $set: {
                                    PASSWORD: result
                                }
                            });
                    });
                    Session.set('cmname', $("#FName").val() + " " + $("#LName").val());
                    toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                    Router.go("/hpcviewcm")

                } else {
                    toastr.error("รหัสผ่านไม่ตรงกัน ทำรายการใหม่อีกครั้ง", "พบข้อผิดพลาด");
                    $("#password").val("");
                    $("#passwordq").val("");
                }
            } else {
                Session.set('cmname', $("#FName").val() + " " + $("#LName").val());
                toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                Router.go("/hpcviewcm")
            }

        } else {
            toastr.error("กรอกข้อมูลไม่ครบ ตรวจสอบใหม่อีกครั้ง", "พบข้อผิดพลาด");
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
                store: hpcEditCm || 'hpcEditCm',
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


Template.select_company_hpc.onRendered(function init() {
    $('#companyName').selectize();
    Meteor.call('getAllServiceCenter', function (error, result) {
        // $('#companyName')[0].selectize.destroy()
        $('#companyName').selectize({ options: result, create: false });
    });
});

Template.select_dla_hpc.onRendered(function init() {
    $('#dla').selectize();
    Meteor.call('getAllDLA_CODE', function (error, result) {
        //$('#dla')[0].selectize.destroy()
        $('#dla').selectize({ options: result, create: false });
    });
});
