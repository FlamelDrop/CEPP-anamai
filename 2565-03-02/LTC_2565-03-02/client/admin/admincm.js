import datatables from 'datatables.net';
import datatables_bs from 'datatables.net-bs';
import jszip from 'jszip'
import datatables_buttons from 'datatables.net-buttons';
import dt_html5 from 'datatables.net-buttons/js/buttons.html5.min.js';
import dt_boostrap from 'datatables.net-buttons/js/buttons.boostrap.min.js';
import pdfmake from 'datatables.net-buttons/js/pdfmake.min.js';
import vfonts from 'datatables.net-buttons/js/vfs_fonts.js';
import dt_print from 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-bs/css/dataTables.bootstrap.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'

Template.admincm.onRendered(function () {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
    
    if (Session.get('list_admincm')) {
        Session.get('list_admincm')
    } else {
        Session.set('list_admincm', null)
    }

    // Session.set('zoneViewProfileCM', null)
    Session.set('HPCSEARCH', false)
    Session.set('skip', 0);
    Session.set('find', null);
    if (window.history && window.history.pushState) {
        $('#cmprofile').on('show.bs.modal', function (e) {
            window.history.pushState('forward', null, './#modal');
        });

        $(window).on('popstate', function () {
            $('#cmprofile').modal('hide');
        });
    }

    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts);
    dt_print(window, $);
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "300",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    $('#companyName_cm').selectize();
    $('body.waitMe_body').addClass('hideMe');
    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
    $('body.waitMe_body').removeClass('waitMe_body hideMe');

});

Template.admincm.helpers({
    status() {
        return Session.get('listZoneViewCMName') == "ทั้งหมด"
    },
    page() {
        return parseInt(Session.get('skip') / 10) + 1
    },
    pagecount() {
        if (Session.get('HPCFindCMbyStatus')) {
            return Math.ceil(parseFloat(Session.get('getCMlistState_COUNT') / 10))
        } else {
            return Math.ceil(parseFloat(Session.get('getCMlistStateAll_COUNT') / 10))
        }

    },
    profile() {
        if (Session.get('zoneViewProfileCM')) {

            return Session.get('zoneViewProfileCM')[0];

        }
    },
    listViewCMName() {
        return Session.get('listZoneViewCMName')
    },
    hosp() {
        if (Session.get('zoneViewProfileCM')) {
            Meteor.call('getAllServiceCenterDistrict', Session.get('zoneViewProfileCM')[0].HOSPCODE, function (error, result) {
                Session.set('zoneViewhospCM', result)
                Session.set('zoneViewhospAddCM', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
            });
            if (Session.get('zoneViewhospCM')) {
                return Session.get('zoneViewhospCM');
            }
        }
    },
    hospAdd() {
        if (Session.get('zoneViewhospAddCM')) {
            return Session.get('zoneViewhospAddCM');
        }
    },
    workplace() {
        if (Session.get('zoneViewProfileCM')) {
            Meteor.call('getDistrictName', Session.get('zoneViewProfileCM')[0].TAMBON, function (error, result) {
                try {
                    Session.set('zonegetDistrictCM', "[" + result.fullcode + "] ต." + result.subdistrict_name + " อ." + result.district_name + " จ." + result.province_name)
                } catch (e) { }
            });
            return Session.get('zonegetDistrictCM');
        }
    },
    dlaName() {
        Meteor.call('getDLA_NAME', Session.get('zoneViewProfileCM')[0].DLACODE, function (error, result) {
            if (result) {
                Session.set('dlaName', result)
            }

        });
        if (Session.get('dlaName')) {
            return Session.get('dlaName').DLA_NAME + " " + Session.get('dlaName').DISTRICT + " จ. " + Session.get('dlaName').PROVINCE
        }

    },
    user() {

        return Session.get('user').ZONE
    },
    list() {

        return Session.get('getCMlistStateByZone')
    },
    countType() {
        if (Session.get('HPCFindCMbyStatus')) {
            return Session.get('getCMlistState_COUNT')
        } else {
            return Session.get('getCMlistStateAll_COUNT')

        }
    },
    districtNameWork() {
        return Session.get('districtNameWorkCMByZone')
    },
    edittambon() {
        if (Session.get('zoneViewProfileCM')) {
            return Session.get('zoneViewProfileCM')[0];s
        }
    },
    getlist_admincm() {
        if (Session.get('list_admincm'))
            return Session.get('list_admincm');
    },
    specialisationcount() {
        if (Session.get('specialisationCM')) {
            return Session.get('specialisationCM').length;
        }
    },
    switchCompanyCM() {
        
            console.log(Session.get('switchCompanyCM'));

            if (Session.get('switchCompanyCM')) {
                return true
            } else {
                return false
            }
    },
    radioStatusCM() {
        if (Session.get('zoneViewProfileCM')) {
            if (Session.get('zoneViewProfileCM')[0].HOSPCODE) {
                Session.set('switchCompanyCM', true)
                return { comp: true, dla: false }
            } else {

                Session.set('switchCompanyCM', false)
                return { comp: false, dla: true }
            }

        }
    },
});

Template.admincm.events({
    "click #confirmallCM" () {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        
        var specialisation = Session.get('specialisationCM');
        var hospcode = Session.get('HOSPCODE')
        console.log(specialisation);
        console.log(hospcode);
        
        if (specialisation && hospcode) {
            if(Session.get('switchCompanyCM')){

                Meteor.call('getAllServiceCenterDistrict', hospcode, function (error, data) {
                    console.log(data);

                    var hospcode = data.hospcode
                    var name = data.name
                    var province = data.province.slice(3);
                    var amphoe = data.amphoe.slice(3);
                    var district = data.district.slice(3);
                    var zone = data.zone;
                    //console.log(zone);
    
                    for (let i = 0; i <= specialisation.length-1; i++) {
                        const res = specialisation[i];
                        Meteor.call('upDateCMserviceCenter', res, hospcode, name, district, amphoe, province, zone, function (error, result) {
                            //console.log(result);
                            $('#myModalallconfirmCM').modal('hide');
                            Meteor.call('admincm_multiid', specialisation, function (error, result) {
                                console.log(result);

                                $('input[name="slectallCM"]:checkbox').prop('checked', false);
                                $('input[name="specialisationCM"]:checkbox').prop('checked', false);
                                Session.set("specialisationCM", null);
                                Session.set('list_admincm', result)
                                toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                });


            }else{
                var data = Session.get('getDLA_Detail');
                console.log(data);

                var hospcode = data.DLA_CODE
                var name = data.DLA_NAME
                var province = data.PROVINCE;
                var amphoe = data.TAMBON;
                var district = data.DISTRICT;
                var zone = Session.get('getZoneByDLA');

                for (let i = 0; i <= specialisation.length-1; i++) {
                    const res = specialisation[i];
                    Meteor.call('upDateCM_DLA', res, hospcode, name, district, amphoe, province, zone, function (error, result) {
                        //console.log(result);
                        $('#myModalallconfirmCM').modal('hide');
                        Meteor.call('admincm_multiid', specialisation, function (error, result) {
                            console.log(result);
                            
                            $('input[name="slectallCM"]:checkbox').prop('checked', false);
                            $('input[name="specialisationCM"]:checkbox').prop('checked', false);
                            Session.set("specialisationCM", null);
                            Session.set('list_admincm', result)
                            toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                            $('body.waitMe_body').addClass('hideMe');
                            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                            $('body.waitMe_body').removeClass('waitMe_body hideMe');
                        });
                    });
                }
            }

        }else{
            toastr.warning("กรุณาทำรายการใหม่อีกครั้ง", "ไม่สำเร็จ");
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        }
    },
    "change #companyName_cm"() {
        Session.set('HOSPCODE', $('#companyName_cm').val())
        //console.log($('#companyName_cm').val());
    },
    "change #dla_cm"() {
        Session.set('HOSPCODE', $('#dla_cm').val())
        // console.log($('#dla_cm').val());
        
        Meteor.call('getDLA_NAME', $('#dla_cm').val(), function (error, result) {
            // console.log(result);
            if (result) {
                Session.set('getDLA_Detail', result);
                Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                    Session.set('getZoneByDLA', result);
                })
            }
        });
    },
    'change [name="specialisationCM"]': function(event, template) {
        let specialisation = $('input[name="specialisationCM"]:checked').map(function() {
            return $(this).val();
        }).get();
        Session.set("specialisationCM", specialisation);
        //console.log(specialisation);
    },
    'change [name="slectallCM"]': function(event, template) {
        var check = $('input[name="slectallCM"]').prop("checked");
        if (check) {
            $('input[name="specialisationCM"]').prop('checked', true);
            let specialisation = $('input[name="specialisationCM"]:checked').map(function() {
                return $(this).val();
            }).get();
            Session.set("specialisationCM", specialisation);
            //console.log(specialisation);
        } else {
            $('input[name="specialisationCM"]').prop('checked', false);
            Session.set("specialisationCM", null);
        }
    },
    'click #next': function () {
        if (Session.get('HPCFindCMbyStatus')) {
            if (!Session.get('HPCSEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getCMlistState_COUNT'))) {
                    Meteor.call('getCMlistState', Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), next, 10, Session.get('find'), function (error, result) {
                        Session.set('skip', next);
                        Session.set('getCMlistStateByZone', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getCMlistState_COUNT'))) {
                    Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getCMlistStateByZone', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('HPCSEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getCMlistStateAll_COUNT'))) {
                    Meteor.call('getCMlistStateAll', Session.get('user').ZONE, next, 10, Session.get('find'), function (error, result) {
                        Session.set('skip', next);
                        Session.set('getCMlistStateByZone', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getCMlistStateAll_COUNT'))) {
                    Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getCMlistStateByZone', res)
                        }
                    })
                }
            }
        }
    },
    'click #prev': function () {
        if (Session.get('HPCFindCMbyStatus')) {
            if (!Session.get('HPCSEARCH')) {
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('getCMlistState', Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), next, 10, Session.get('find'), function (error, result) {
                        Session.set('skip', next);
                        Session.set('getCMlistStateByZone', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getCMlistStateByZone', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('HPCSEARCH')) {
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('getCMlistStateAll', Session.get('user').ZONE, next, 10, Session.get('find'), function (error, result) {
                        Session.set('skip', next);
                        Session.set('getCMlistStateByZone', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getCMlistStateByZone', res)
                        }
                    })
                }
            }
        }
    },
    'click #first': function () {
        if (Session.get('HPCFindCMbyStatus')) {
            if (!Session.get('HPCSEARCH')) {
                Meteor.call('getCMlistState', Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), 0, 10, Session.get('find'), function (error, result) {
                    Session.set('skip', 0);
                    Session.set('getCMlistStateByZone', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), 0, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('getCMlistStateByZone', res)
                    }
                })

            }
        } else {
            if (!Session.get('HPCSEARCH')) {
                Meteor.call('getCMlistStateAll', Session.get('user').ZONE, 0, 10, Session.get('find'), function (error, result) {
                    Session.set('skip', 0);
                    Session.set('getCMlistStateByZone', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""

                Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), 0, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('getCMlistStateByZone', res)
                    }
                })

            }
        }
    },
    'click #last': function () {
        if (Session.get('HPCFindCMbyStatus')) {
            if (!Session.get('HPCSEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('getCMlistState_COUNT') - 10))
                Meteor.call('getCMlistState', Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), next, 10, Session.get('find'), function (error, result) {
                    Session.set('skip', next);
                    Session.set('getCMlistStateByZone', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = Math.ceil(parseFloat(Session.get('getCMlistState_COUNT') - 10))
                Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), next, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('getCMlistStateByZone', res)
                    }
                })

            }
        } else {
            if (!Session.get('HPCSEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('getCMlistStateAll_COUNT') - 10))
                Meteor.call('getCMlistStateAll', Session.get('user').ZONE, next, 10, Session.get('find'), function (error, result) {
                    Session.set('skip', next);
                    Session.set('getCMlistStateByZone', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = Math.ceil(parseFloat(Session.get('getCMlistStateAll_COUNT') - 10))
                Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), next, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('getCMlistStateByZone', res)
                    }
                })

            }
        }
    },
    'change #find': function () {
        if (Session.get('HPCFindCMbyStatus')) {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('getCMlistState', Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), 0, 10, Session.get('find'), function (error, result) {
                Session.set('getCMlistStateByZone', result)
            })
            Meteor.call('getCMlistState_COUNT', Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), Session.get('find'), function (error, result) {
                Session.set('getCMlistState_COUNT', result)
            })
        } else {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('getCMlistStateAll', Session.get('user').ZONE, 0, 10, Session.get('find'), function (error, result) {
                Session.set('getCMlistStateByZone', result)
            })
            Meteor.call('getCMlistStateAll_COUNT', Session.get('user').ZONE, Session.get('find'), function (error, result) {
                Session.set('getCMlistStateAll_COUNT', result)
            })
        }
    },
    'click #editcm'() {

        Session.set('cmid', this._id);
        setTimeout(() => {
            Router.go('/admineditcm')
        }, 500);
    },
    "click #viewcm"() {
        var cid = this._id

        Meteor.call('getLoginUserCM', cid, function (error, result) {
            Session.set('zoneViewProfileCM', result);

        });
    },
    "click #removeCM"() {
        var cid = this.CID
        var arr = Session.get('list_admincm')
        //console.log(cid);
        //console.log(arr);

        if (confirm("ต้องการลบข้อมูลหรือไม่")) {

            Array.prototype.remove = function() {
                var what, a = arguments, L = a.length, ax;
                while (L && this.length) {
                    what = a[--L];
                    while ((ax = this.indexOf(what)) !== -1) {
                        this.splice(ax, 1);
                    }
                }
                return this;
            };

            for (let i = 0; i <= arr.length-1; i++) {
                const element = arr[i];
                //console.log(element);
                //console.log(element.CID == cid);
                if(element.CID == cid){
                    arr.remove(element);
                    //console.log(arr);
                    Meteor.call('cmRemove', this.CID, function (err, result) {
                    });
                }else{
                    //console.log('B');
                }
            }
            Session.set('list_admincm', arr)
            //console.log(arr);

            toastr.success("ลบข้อมูลเรียบร้อย", "สำเร็จ");



        }
    },
    'click #CM_find'() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        
        Session.set("specialisationCG", null);
        Session.set("specialisationED", null);

        Session.set('list_adminelder', null)
        Session.set('list_admincg', null)
        $('#searchCG').val('');
        $('#searchED').val('');
        $('input[name="slectallCG"]:checkbox').prop('checked', false);
        $('input[name="slectallED"]:checkbox').prop('checked', false);

        var strcid = $('#searchCM').val();
        console.log(strcid);
        var arr = strcid.split(/[^0-9]+/);
        // console.log(arr);
        var strAlert = false
        for (let i = 0; i < arr.length; i++) {
            // const element = arr[i];
            if (arr[i].length == 13) {
            } else {
                strAlert = true
            }
        }

        console.log(strAlert);
        if (strAlert == true) {
            // console.log('strAlert');
            toastr.warning("กรอกเลข 13 หลักให้ถูกต้อง", "ลองใหม่อีกครั้ง");
            $('#searchCM').val('');
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        } else {
            console.log(arr)
            Session.set('arr_cm', arr)
            Meteor.call('admincm_multicid', arr, function (error, result) {
                console.log(result);
                Session.set('list_admincm', result)
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            });
        }
        
    },
    "click #radio_company_cm"() {
        Session.set('switchCompanyCM', true)
        //console.log('true');
        $(".showSwitchCM").css("display", "block");

        Meteor.call('getAllServiceCenter', function (error, result) {
            console.log(result);
            $('#companyName_cm')[0].selectize.destroy()
            $('#companyName_cm').selectize({ options: result, create: false });
    
            $('.circle_companyName_cm').css('display' , 'none');
            $('.admin_companyName_cm').removeClass('admin_companyName_cm');

        });
    },
    "click #radio_dla_cm"() {
        Session.set('switchCompanyCM', false)
        // console.log('false');
        $(".showSwitchCM").css("display", "block");

        Meteor.call('getAllDLA_CODE', function (error, result) {
            // console.log(result);
            
            $('#dla_cm')[0].selectize.destroy()
            $('#dla_cm').selectize({ options: result, create: false });

            $('.circle_dla_cm').css('display' , 'none');
            $('.admin_dla_cm').removeClass('admin_dla_cm');
        });
    },
});

Template.select_company_hpc_admin_cm.onRendered(function init() {
    $('#companyName_cm').selectize();
    //console.log('select_company_hpc_admin');
    Meteor.call('getAllServiceCenter', function (error, result) {
        // $('#companyName_cm')[0].selectize.destroy()
        $('#companyName_cm').selectize({ options: result, create: false });
    });
});

Template.select_dla_hpc_admin_cm.onRendered(function init() {
    $('#dla_cm').selectize();
    //console.log('select_dla_hpc_admin');
    Meteor.call('getAllDLA_CODE', function (error, result) {
        // $('#dla_cm')[0].selectize.destroy()
        $('#dla_cm').selectize({ options: result, create: false });
    });
});
