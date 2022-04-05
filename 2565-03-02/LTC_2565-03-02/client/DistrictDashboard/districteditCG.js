import { UploadFS } from 'meteor/jalik:ufs';
// import { GridFSStore } from 'meteor/jalik:ufs-gridfs';
// const photosg = new Mongo.Collection('photosg');
// Photos = new Mongo.Collection('photos');

// const hpcEditCm = new GridFSStore({
//     collection: Photos,
//     name: 'hpcEditCm',
//     chunkSize: 1024 * 255,
//     filter: new UploadFS.Filter({
//         contentTypes: ['image/*'],
//         extensions: ['jpg', 'png']
//     }),
//     path: '/uploads/photos'
// });
Template.districteditcg.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.districteditcg.onRendered(function () {
    Session.set('getDLA_Detail', null)
    Session.set('getEditedZoneCMbyHOSPCODE', null)
    Session.set('districtNameWorkEditedCM',null)
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
    //console.log(Session.get('hpcEditCmDetail2'));
    
    Meteor.call('getUserCG', Session.get('hpcEditCmDetail2'), function (error, result) {
        Session.set('HpcGetProfileCM', result)
        console.log(result[0]);
        Session.set('HOSPCODE', result[0].HOSPCODE.CODE)

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

Template.districteditcg.helpers({
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
            // console.log(Session.get('switchCompany'));
            // console.log(Session.get('HOSPCODE'));
            var AMPHOE = Session.get('HpcGetProfileCM')[0].HOSPCODE.AMPHOE
            var AMPHOE_DLA = Session.get('HpcGetProfileCM')[0].HOSPCODE.AMPHOE.split('-')[1]
            // console.log(AMPHOE);
            
            if (Session.get('switchCompany')) {
                if (Session.get('HOSPCODE').length == 5) {
                    Meteor.call('AllServiceCenter', AMPHOE, function (error, result) {
                        // console.log(result);
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                        var $select = $("#companyName").selectize();
                        var selectize = $select[0].selectize;
                        selectize.setValue(selectize.search(Session.get('HOSPCODE')).query);
                        Meteor.call('getAllServiceCenterDistrict', Session.get('HOSPCODE'), function (error, result) {
                            Session.set('getEditedZoneCMbyHOSPCODE', result)
                            // console.log(result);
                            $('.circle_companyName').css('display' , 'none');
                            $('.admin_companyName').removeClass('admin_companyName');
                        });
                    });
                    return true
                } else {
                    Meteor.call('AllServiceCenter', AMPHOE, function (error, result) {
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                        $('.circle_companyName').css('display' , 'none');
                        $('.admin_companyName').removeClass('admin_companyName');
                    });
                    return true
                }
            } else {
                Session.set('hospAdd', null);
                
                if (Session.get('HOSPCODE').length == 7) {
                    Meteor.call('getDLA_NAME', Session.get('HOSPCODE'), function (error, result) {
                        // console.log(result);

                        if (result) {
                            Session.set('getDLA_Detail', result);
                            Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                                // console.log(result);
                                Session.set('getZoneByDLA', result);
                                Meteor.call('AllDLA_CODE', AMPHOE_DLA, function (error, result) {
                                    $('#dla')[0].selectize.destroy()
                                    $('#dla').selectize({ options: result, create: false });
                                    var $select = $("#dla").selectize();
                                    var selectize = $select[0].selectize;
                                    selectize.setValue(selectize.search(Session.get('HOSPCODE')).query);
                                    $('.circle_dla').css('display' , 'none');
                                    $('.admin_dla').removeClass('admin_dla');
                                });
                            })
                        }

                    });
        
                    return false
                } else {
                    //console.log('B');
                    
                    Meteor.call('AllDLA_CODE', AMPHOE_DLA, function (error, result) {
                        // console.log(result);
                        
                        $('#dla')[0].selectize.destroy()
                        $('#dla').selectize({ options: result, create: false });
                        $('.circle_dla').css('display' , 'none');
                        $('.admin_dla').removeClass('admin_dla');
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
        console.log(Session.get('NewdistrictNameWorkEditedCG'));
        if (Session.get('NewdistrictNameWorkEditedCG')) {
            return Session.get('NewdistrictNameWorkEditedCG')
        }
    }
})

Template.districteditcg.events({
    "change #companyName"() {
        Session.set('HOSPCODE', $('#companyName').val())
        console.log($('#companyName').val())
        
        Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (error, result) {
            if (result) {
                Session.set('getEditedZoneCMbyHOSPCODE', result)
                Session.set('hospAdd', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
            }
        });
    },
    "change #dla"(event) {
        Session.set('hospAdd', null);
        console.log($('#dla').val())

        Session.set('HOSPCODE', $('#dla').val())
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
            Session.set('Fe_POSITIONCODE', $("#POSITIONCODE").val())
            console.log(data);
            console.log(Session.get('HpcGetProfileCM'));

            console.log(Session.get('Fe_titleName'));
            console.log(Session.get('Fe_FName'));
            console.log(Session.get('Fe_LName'));
            console.log(Session.get('Fe_sex'));
            console.log(Session.get('Fe_tel'));
            console.log(Session.get('Fe_email'));
            console.log(Session.get('Fe_companyName'));
            console.log(Session.get('Fe_DLA'));
            console.log(Session.get('Fe_trainingBy'));
            console.log(Session.get('Fe_stateActive'));
            console.log(Session.get('Fe_address'));
            console.log(Session.get('Fe_subdistrict_name'));
            console.log(Session.get('Fe_district_name'));
            console.log(Session.get('Fe_province_name'));
            console.log(Session.get('Fe_POSITIONCODE'));

            if (data) {
                Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (err, res) {
                    CG_REGISTER.update({
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
                                TRAININGHOUR: $("#TRAININGHOURS").val(),
                                POSITIONCODE: $("#POSITIONCODE").val(),
                                EDUCATION: $('#education').val(),
                                zone: data.zone,
                                D_UPDATE: new Date()
                            }
                        });
                        toastr.success("อัพเดทข้อมูลส่วนตัวเรียบร้อย", "สำเร็จ");
                        Router.go("/districtViewCG")
                });
            } else {
                Meteor.call('getDLA_NAME', $('#dla').val(), function (err, res) {
                    CG_REGISTER.update({
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
                                TRAININGHOUR: $("#TRAININGHOURS").val(),
                                POSITIONCODE: $("#POSITIONCODE").val(),
                                EDUCATION: $('#education').val(),
                                zone: Session.get('getZoneByDLA'),
                                D_UPDATE: new Date()
                            }
                        });
                    toastr.success("อัพเดทข้อมูลส่วนตัวเรียบร้อย", "สำเร็จ");
                    Router.go("/districtViewCG")
                });
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
                        //console.log(err)
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
    },

});

