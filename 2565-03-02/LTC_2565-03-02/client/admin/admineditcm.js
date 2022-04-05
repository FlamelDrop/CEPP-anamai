import { UploadFS } from 'meteor/jalik:ufs';
import { GridFSStore } from 'meteor/jalik:ufs-gridfs';
// const photosg = new Mongo.Collection('photosg');


Template.admineditcm.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.admineditcm.onRendered(function helloOnCreated() {
    Session.set('switchCompany', null)
    Session.set('HOSPCODE', null)
    Session.set('getProfileCM', null)
    Session.set('districtNameWorkEditedCM', null)

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
    console.log(Session.get('cmid'));
    console.log('A');

    $('#district_name').selectize();
    $('#subdistrict_name').selectize();
    $('#province_name').selectize();
    if (Session.get('cmid')) {

        Meteor.call('getUserAdminCM', Session.get('cmid'), function (error, result) {
            // console.log(result);
            if(result[0].HOSPCODE != null ){
                Session.set('HOSPCODE', result[0].HOSPCODE.CODE);
            }else{
                Session.set('HOSPCODE', result[0].DLACODE.CODE);
            }
            console.log(Session.get('HOSPCODE',));
            
            Session.set('getProfileCM', result)

            if (Session.get('HOSPCODE').length == 5) {
                console.log('AAAA');
                $("#radio_company").attr('checked', 'checked');
                Session.set('switchCompany', true)
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            } else {
                Session.set('switchCompany', false)
                $("#radio_dla").attr('checked', 'checked');
                console.log('B');
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            }

            Meteor.call('getDistrictName', Session.get('getProfileCM')[0].TAMBON.CODE, function (error, result) {
                Session.set('districtNameWorkEditedCM', result)
                Meteor.call('getRegProvince_name', function (error, result) {
                    console.log(result);
                    
                    $('#district_name')[0].selectize.destroy()
                    $('#subdistrict_name')[0].selectize.destroy()
                    $('#province_name')[0].selectize.destroy()
                    $('#district_name').selectize({ options: result, create: false });
                    $('#subdistrict_name').selectize({ options: result, create: false });
                    $('#province_name').selectize({ options: result, create: false });
                    if (Session.get('districtNameWorkEditedCM')) {
                        var $select = $("#province_name").selectize();
                        var selectize = $select[0].selectize;
                        console.log(Session.get('districtNameWorkEditedCM'));
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
            });
        })

    } else {
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    }

    // Meteor.call('getUserAdminCM', Session.get('cmid'), function(error, result) {
    //     Session.set('getProfileCM', result)
    //     Meteor.call('getAllServiceCenterDistrict', Session.get('getProfileCM')[0].HOSPCODE, function(error, result) {
    //         Session.set('districtName', result)
    //         Meteor.call('getAllServiceCenter', function(error, result2) {
    //             Session.set('Namehos', "[" + result.hospcode + "] " + result.name)
    //                 // Session.set('HOSPCODE', result.hospcode)
    //         });

    //     });


        // Meteor.call('getRegProvince_name', function(error, result) {
        //     $('#province_name')[0].selectize.destroy()
        //     $('#province_name').selectize({ options: result, create: false });
        //     var $select = $("#province_name").selectize();
        //     var selectize = $select[0].selectize;
        //     selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCM').province_code).query);
        //     $('body.waitMe_body').addClass('hideMe');
        //     $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        //     $('body.waitMe_body').removeClass('waitMe_body hideMe');
        // });




    // });


    // $('#district_name').selectize();
    // $('#subdistrict_name').selectize();
    // $('#province_name').selectize();

    var tarindate = new Date(Session.get('getProfileCM')[0].TRAINING_DATE);
    Session.set('EXPIREDATE', new Date(tarindate.getFullYear() + 2, tarindate.getMonth(), tarindate.getDate()))
    // Session.set("showingEditedCMImg", Session.get('getProfileCM')[0].IMG)
});

Template.admineditcm.helpers({
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
    hospAdd() {
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
    },
    switchCompany() {

            console.log(Session.get('switchCompany'));
            console.log(Session.get('HOSPCODE'));
            console.log(Session.get('HOSPCODE').length);

            if (Session.get('switchCompany')) {
                console.log('A');

                if (Session.get('HOSPCODE').length == 5) {
                    console.log('A if');

                    Meteor.call('getAllServiceCenter', function (error, result) {
                        console.log(result);
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                        var $select = $("#companyName").selectize();
                        var selectize = $select[0].selectize;
                        selectize.setValue(selectize.search(Session.get('HOSPCODE')).query);
                        Meteor.call('getAllServiceCenterDistrict', Session.get('HOSPCODE'), function (error, result) {
                            Session.set('getEditedZoneCMbyHOSPCODE', result)
                            console.log(result);
                            $('.circle_companyName').css('display', 'none');
                            $('.admin_companyName').removeClass('admin_companyName');

                            $('body.waitMe_body').addClass('hideMe');
                            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                            $('body.waitMe_body').removeClass('waitMe_body hideMe');
                        });
                    });
                    return true
                } else {
                    console.log('A else');

                    Meteor.call('getAllServiceCenter', function (error, result) {
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                        $('.circle_companyName').css('display', 'none');
                        $('.admin_companyName').removeClass('admin_companyName');

                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    });
                    return true
                }
            } else {
                console.log(Session.get('HOSPCODE'));
                console.log('B');

                if (Session.get('HOSPCODE').length == 7) {
                    console.log('B if');

                    Meteor.call('getDLA_NAME', Session.get('HOSPCODE'), function (error, result) {
                        console.log(result);

                        if (result) {
                            Session.set('getDLA_Detail', result);
                            Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                                console.log(result);
                                Session.set('getZoneByDLA', result);
                                Meteor.call('getAllDLA_CODE', function (error, result) {
                                    $('#dla')[0].selectize.destroy()
                                    $('#dla').selectize({ options: result, create: false });
                                    var $select = $("#dla").selectize();
                                    var selectize = $select[0].selectize;
                                    selectize.setValue(selectize.search(Session.get('HOSPCODE')).query);
                                    $('.circle_dla').css('display', 'none');
                                    $('.admin_dla').removeClass('admin_dla');

                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                                });
                            })
                        }
                    });

                    return false
                } else {
                    console.log('B else');

                    Meteor.call('getAllDLA_CODE', function (error, result) {
                        $('#dla')[0].selectize.destroy()
                        $('#dla').selectize({ options: result, create: false });
                        $('.circle_dla').css('display', 'none');
                        $('.admin_dla').removeClass('admin_dla');

                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    });
                    return false
                }
            }
    },
})

Template.admineditcm.events({
    "change #companyName"() {
        Session.set('HOSPCODE', $('#companyName').val())
        console.log($('#companyName').val());
    },
    "change #dla"(event) {
        Session.set('HOSPCODE', $('#dla').val())
        console.log($('#dla').val());

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
    },
    "change #trainingDate"() {
        var tdateString = $("#trainingDate").val().split("/");
        var tdate = new Date(parseInt(tdateString[2] - 539), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
        Session.set('EXPIREDATE', tdate)
    },
    "change #subdistrict_name"() {
        var res = $('#subdistrict_name').val().split('-')
        console.log($('#subdistrict_name').val());
        console.log(res);
        
        Meteor.call('getDistrictName', res[0], function (error, data) {
            Session.set('NewdistrictNameWorkEditedCM', data.fullcode + " ต." + data.subdistrict_name + " อ." + data.district_name + " จ." + data.province_name)
        });
    },
    "change #district_name"() {
        var res = $('#district_name').val().split('-')
        console.log(Session.get('districtNameWorkEditedCM'));

        console.log($('#district_name').val());
        console.log(res);
        Meteor.call('getRegSubsistrict_name', res[0], function (error, result) {
            console.log(result);
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
    "click #return"() {
        Session.set('active', "2");
        Router.go('/admin')
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
                console.log('save data');
                
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
                console.log('save no data');

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
                            Meteor.call('admincm_multicid', Session.get('arr_cm'), function (error, result) {
                                Session.set('list_admincm', result)
                                Session.set('cmname', $("#FName").val() + " " + $("#LName").val());
                                toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                                Session.set('active', "2");
                                Router.go("/admin")
                            });
                    });
                } else {
                    toastr.error("รหัสผ่านไม่ตรงกัน ทำรายการใหม่อีกครั้ง", "พบข้อผิดพลาด");
                    $("#password").val("");
                    $("#passwordq").val("");
                }
            } else {
                Meteor.call('admincm_multicid', Session.get('arr_cm'), function (error, result) {
                    Session.set('list_admincm', result)
                    Session.set('cmname', $("#FName").val() + " " + $("#LName").val());
                    toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                    Session.set('active', "2");
                    Router.go("/admin")
                });
            }

        } else {
            toastr.error("กรอกข้อมูลไม่ครบ ตรวจสอบใหม่อีกครั้ง", "พบข้อผิดพลาด");
        }

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
Template.select_company_hpc_admin.onRendered(function init() {
    $('#companyName').selectize();
    Meteor.call('getAllServiceCenter', function (error, result) {
        // $('#companyName')[0].selectize.destroy()
        $('#companyName').selectize({ options: result, create: false });
    });
});

Template.select_dla_hpc_admin.onRendered(function init() {
    $('#dla').selectize();
    Meteor.call('getAllDLA_CODE', function (error, result) {
        //$('#dla')[0].selectize.destroy()
        $('#dla').selectize({ options: result, create: false });
    });
});

//sss