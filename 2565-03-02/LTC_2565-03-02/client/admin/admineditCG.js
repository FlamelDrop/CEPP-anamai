
import { UploadFS } from 'meteor/jalik:ufs';
// import { GridFSStore } from 'meteor/jalik:ufs-gridfs';

// editPhotocg = new GridFSStore({
//     collection: Photos,
//     name: 'editPhotocg',
//     chunkSize: 1024 * 255,
//     filter: new UploadFS.Filter({
//         contentTypes: ['image/*'],
//         extensions: ['jpg', 'png']
//     }),
//     path: '/uploads/photos'
// });

Template.admineditcg.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.admineditcg.onRendered(function () {

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

    $('#companyName').selectize();
    $('#district_name').selectize();
    $('#subdistrict_name').selectize();
    $('#province_name').selectize();

    console.log(Session.get('cgid'));

    if (Session.get('cgid')) {
        Meteor.call('getUserCG', Session.get('cgid').CID, function (error, result) {
            console.log(result);
            if (result[0].HOSPCODE != null) {
                Session.set('HOSPCODE', result[0].HOSPCODE.CODE);
            } else {
                Session.set('HOSPCODE', result[0].DLACODE.CODE);
            }
            console.log(Session.get('HOSPCODE'));

            Session.set('getEditProfileCG', result)

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

            Meteor.call('getDistrictName', Session.get('getEditProfileCG')[0].TAMBON.CODE, function (error, result) {
                Session.set('districtNameWorkEditedCG', result)
                Meteor.call('getRegProvince_name', function (error, result) {
                    console.log(result);

                    $('#district_name')[0].selectize.destroy()
                    $('#subdistrict_name')[0].selectize.destroy()
                    $('#province_name')[0].selectize.destroy()
                    $('#district_name').selectize({ options: result, create: false });
                    $('#subdistrict_name').selectize({ options: result, create: false });
                    $('#province_name').selectize({ options: result, create: false });
                    if (Session.get('districtNameWorkEditedCG')) {
                        var $select = $("#province_name").selectize();
                        var selectize = $select[0].selectize;
                        console.log(Session.get('districtNameWorkEditedCG'));
                        selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCG').province_code + "-" + Session.get('districtNameWorkEditedCG').province_name).query);
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
        });
    } else {
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    }
});

Template.admineditcg.helpers({
    user() {
        if (Session.get('getEditProfileCG')) {
            var tarindate = new Date(Session.get('getEditProfileCG')[0].EXPIREDATE);
            Session.set('EXPIREDATEEDITEDCG', new Date(tarindate.getFullYear(), tarindate.getMonth(), tarindate.getDate()))
            Meteor.call('getDistrictName', Session.get('getEditProfileCG')[0].TAMBON.CODE, function (error, result) {
                Session.set('districtNameWorkEditedCG', result)
            });
            Meteor.call('getRegProvince_name', function (error, result) {
                $('#province_name')[0].selectize.destroy()
                $('#province_name').selectize({ options: result, create: false });
                var $select = $("#province_name").selectize();
                var selectize = $select[0].selectize;
                selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCG').province_code + "-" + Session.get('districtNameWorkEditedCG').province_name).query);
            });
            return Session.get('user').ZONE
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
    hosp() {
        if (Session.get('hospAddCGEdited')) {
            return Session.get('hospAddCGEdited');
        }
    },
    profile() {
        if (Session.get('cgid')) {
            return Session.get('cgid')
        }
    },
    showimg() {
        return Session.get('showimgEditedCG');
    },
    EXPIREDATE() {

        return Session.get('EXPIREDATEEDITEDCG')

    },
    OldNameWork() {
        if (Session.get('districtNameWorkEditedCG')) {
            var data = Session.get('districtNameWorkEditedCG');
            return data.fullcode + " ต." + data.subdistrict_name + " อ." + data.district_name + " จ." + data.province_name
        }
    },
    NewDistricName() {
        if (Session.get('NewdistrictNameWorkEditedCG')) {
            return Session.get('NewdistrictNameWorkEditedCG')
        }
    }
});

Template.admineditcg.events({
    'click #back'() {
        setTimeout(() => {
            Session.set("showimgEditedCG", null)
        }, 500);
    },
    "click #radio_company"() {
        Session.set('switchCompany', true)
        Session.set('getZoneByDLA', "");

    },
    "click #radio_dla"() {
        Session.set('switchCompany', false)
        Session.set('getHOSPZoneHPC', "");
    },
    "change #trainingDate"() {
        var tdateString = $("#trainingDate").val().split("/");
        var tdate = new Date(parseInt(tdateString[2] - 539), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
        Session.set('EXPIREDATEEDITEDCG', tdate)
    },
    "change #subdistrict_name"() {
        var res = $('#subdistrict_name').val().split('-')
        console.log($('#subdistrict_name').val());
        console.log(res);

        Meteor.call('getDistrictName', res[0], function (error, data) {
            Session.set('NewdistrictNameWorkEditedCG', data.fullcode + " ต." + data.subdistrict_name + " อ." + data.district_name + " จ." + data.province_name)
        });
    },
    "change #district_name"() {
        var res = $('#district_name').val().split('-')
        console.log(Session.get('districtNameWorkEditedCG'));

        console.log($('#district_name').val());
        console.log(res);
        Meteor.call('getRegSubsistrict_name', res[0], function (error, result) {
            console.log(result);
            $('#subdistrict_name')[0].selectize.destroy()
            $('#subdistrict_name').selectize({ options: result, create: false });
            var $select = $("#subdistrict_name").selectize();
            var selectize = $select[0].selectize;
            selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCG').fullcode + "-" + Session.get('districtNameWorkEditedCG').subdistrict_name).query);

        });
    },
    "change #province_name"() {
        var res = $('#province_name').val().split('-')
        Meteor.call('getRegDistrict_name', res[0], function (error, result) {

            $('#district_name')[0].selectize.destroy()
            $('#district_name').selectize({ options: result, create: false });
            var $select1 = $("#district_name").selectize();
            var selectize1 = $select1[0].selectize;
            selectize1.setValue(selectize1.search(Session.get('districtNameWorkEditedCG').district_code + "-" + Session.get('districtNameWorkEditedCG').district_name).query);

        });
    },
    "change #companyName"() {
        Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (error, result) {
            if (result) {
                Session.set('getHOSPZoneHPC', result)
                Session.set('hospAddCGEdited', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
            }
        });
    },
    "change #dla"(event) {
        Session.set('getHOSPZoneHPC', "");
        Meteor.call('getDLA_NAME', $('#dla').val(), function (error, result) {
            if (result) {
                Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                    Session.set('getZoneByDLA', result);
                })
            }

        });

    },
    "click #save"() {
        var s_center = $("#companyName").val() || $("#dla").val()
        if ($("#subdistrict_name").val() && s_center && $("#TRAININGHOURS").val() && $('#province_name') && $('#district_name') && $('#subdistrict_name') && $("#pid").val() && $("#titleName").val() && $("#FName").val() && $("#LName").val() && $("#sex").val() && $("#tel").val() && $("#email").val() && $("#trainingBy").val() && $("#birthDate").val() && $("#trainingDate").val()) {
            var bdateString = $("#birthDate").val().split("/");
            var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
            var tdateString = $("#trainingDate").val().split("/");
            var tdate = new Date(parseInt(tdateString[2] - 543), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
            var data = Session.get('getHOSPZoneHPC');
            console.log(data)
            if (data) {
                Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (err, res) {
                    CG_REGISTER.update({
                        "_id": Session.get('cgid')._id
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
                                NAME: res.name,
                                DISTRICT: res.district,
                                AMPHOE: res.amphoe,
                                PROVINCE: res.province
                            },
                            DLACODE: null,
                            TRAINING_DATE: tdate,
                            EXPIREDATE: Session.get('EXPIREDATEEDITEDCG'),
                            TRAINING_CENTER_ID: $("#trainingBy").val(),
                            IMG: Session.get('showimgEditedCG'),
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
                            PROVIDERTYPE: $("#persontype").val(),
                            TRAININGHOUR: $("#TRAININGHOURS").val(),
                            POSITIONCODE: $("#POSITIONCODE").val(),
                            EDUCATION: $('#education').val(),
                            zone: data.zone,
                            D_UPDATE: new Date()
                        }
                    });

                    Meteor.call('admincg_multicid', Session.get('arr_cg'), function (error, result) {
                        console.log(result);
                        Session.set('list_admincg', result)
                        toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                        Session.set('active', "3");
                        Router.go("/admin")
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    });
                   
                });
            } else {
                Meteor.call('getDLA_NAME', $('#dla').val(), function (err, res) {
                    CG_REGISTER.update({
                        "_id": Session.get('cgid')._id
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
                                CODE: $('#dla').val(),
                                NAME: res.DLA_NAME,
                                DISTRICT: res.DISTRICT,
                                PROVINCE: res.PROVINCE
                            },
                            TRAINING_DATE: tdate,
                            EXPIREDATE: Session.get('EXPIREDATEEDITEDCG'),
                            TRAINING_CENTER_ID: $("#trainingBy").val(),
                            IMG: Session.get('showimgEditedCG'),
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
                            PROVIDERTYPE: $("#persontype").val(),
                            TRAININGHOUR: $("#TRAININGHOURS").val(),
                            POSITIONCODE: $("#POSITIONCODE").val(),
                            EDUCATION: $('#education').val(),
                            zone: Session.get('getZoneByDLA'),
                            D_UPDATE: new Date()
                        }
                    });
                    Meteor.call('admincg_multicid', Session.get('arr_cg'), function (error, result) {
                        console.log(result);
                        Session.set('list_admincg', result)
                        toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                        Session.set('active', "3");
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                        Router.go("/admin")
                    });
                });
            }
        } else {
            toastr.error("กรอกข้อมูลไม่ครบ ตรวจสอบใหม่อีกครั้ง", "พบข้อผิดพลาด");
        }

    },
    "click #return"() {
        Session.set('active', "3");
        Router.go('/admin')
    },
});

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
