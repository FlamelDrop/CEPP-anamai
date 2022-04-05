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

Template.adminelderly.onRendered(function () {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
    
    if (Session.get('list_adminelder')) {
        // console.log('-');
        Session.get('list_adminelder')
    } else {
        Session.set('list_adminelder', null)
        // console.log('--');
    }

    Session.set('zoneViewProfileED', null)
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

    $('#companyName_elder').selectize();
    $('body.waitMe_body').addClass('hideMe');
    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
    $('body.waitMe_body').removeClass('waitMe_body hideMe');

});

Template.adminelderly.helpers({
    status() {
        return Session.get('listZoneViewEDName') == "ทั้งหมด"
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
        if (Session.get('zoneViewProfileED')) {

            return Session.get('zoneViewProfileED')[0];

        }
    },
    listViewCMName() {
        return Session.get('listZoneViewEDName')
    },
    hosp() {
        if (Session.get('zoneViewProfileED')) {
            Meteor.call('getAllServiceCenterDistrict', Session.get('zoneViewProfileED')[0].HOSPCODE, function (error, result) {
                Session.set('zoneViewhospED', result)
                Session.set('zoneViewhospAddED', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
            });
            if (Session.get('zoneViewhospED')) {
                return Session.get('zoneViewhospED');
            }
        }
    },
    hospAdd() {
        if (Session.get('zoneViewhospAddED')) {
            return Session.get('zoneViewhospAddED');
        }
    },
    workplace() {
        if (Session.get('zoneViewProfileED')) {
            Meteor.call('getDistrictName', Session.get('zoneViewProfileED')[0].TAMBON, function (error, result) {
                try {
                    Session.set('zonegetDistrictCM', "[" + result.fullcode + "] ต." + result.subdistrict_name + " อ." + result.district_name + " จ." + result.province_name)
                } catch (e) { }
            });
            return Session.get('zonegetDistrictCM');
        }
    },
    dlaName() {
        Meteor.call('getDLA_NAME', Session.get('zoneViewProfileED')[0].DLACODE, function (error, result) {
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
        if (Session.get('zoneViewProfileED')) {
            return Session.get('zoneViewProfileED')[0];
        }
    },
    ED_getDistDetailElderly() {
        if (Session.get('list_adminelder'))
            return Session.get('list_adminelder');
    },
    specialisationcount() {
        if (Session.get('specialisationED')) {
            return Session.get('specialisationED').length;
        }
    },
    switchCompanyED() {

        //console.log('AAA');
        
            //console.log(Session.get('switchCompany'));

            if (Session.get('switchCompanyED')) {

                return true
            } else {

                return false
                
            }
    },
});

Template.adminelderly.events({
    "click #confirmallED" () {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        
        var specialisation = Session.get('specialisationED');
        var hospcode = Session.get('HOSPCODE')
        //console.log(specialisation);
        //console.log(hospcode);
        
        if (specialisation && hospcode) {
            if(Session.get('switchCompanyED')){

                Meteor.call('getAllServiceCenterDistrict', hospcode, function (error, data) {
                    //console.log(data);

                    var hospcode = data.hospcode
                    var name = data.name
                    var code = data.hospcode
                    var province = data.province.slice(3);
                    var amphoe = data.amphoe.slice(3);
                    var district = data.district.slice(3);
                    var zone = data.zone;
                    //console.log(zone);
    
                    for (let i = 0; i <= specialisation.length-1; i++) {
                        const res = specialisation[i];
                        Meteor.call('upDateELDERLYMUIT', res, hospcode, name, code, province, amphoe, district, zone, function (error, result) {
                            //console.log(result);
                            $('#myModalallconfirmED').modal('hide');
                            Meteor.call('elderby_multiid', specialisation, function (error, result) {
                                //console.log(result);
                                $('input[name="slectallED"]:checkbox').prop('checked', false);
                                $('input[name="specialisationED"]:checkbox').prop('checked', false);
                                Session.set("specialisationED", null);
                                Session.set('list_adminelder', result)
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
                //console.log(data);

                var hospcode = data.DLA_CODE
                var name = data.DLA_NAME
                var code = data.DLA_CODE
                var province = data.PROVINCE;
                var amphoe = data.TAMBON;
                var district = data.DISTRICT;
                var zone = Session.get('getZoneByDLA');

                for (let i = 0; i <= specialisation.length-1; i++) {
                    const res = specialisation[i];
                    Meteor.call('upDateELDERLYMUIT', res, hospcode, name, code, province, amphoe, district, zone, function (error, result) {
                        //console.log(result);
                        $('#myModalallconfirmED').modal('hide');
                        Meteor.call('elderby_multiid', specialisation, function (error, result) {
                            //console.log(result);
                            $('input[name="slectallED"]:checkbox').prop('checked', false);
                            $('input[name="specialisationED"]:checkbox').prop('checked', false);
                            Session.set("specialisationED", null);
                            Session.set('list_adminelder', result)
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
    "change #companyName_elder"() {
        Session.set('HOSPCODE', $('#companyName_elder').val())
        //console.log($('#companyName_elder').val());

    },
    "change #dla_elder"() {
        Session.set('HOSPCODE', $('#dla_elder').val())
        //console.log($('#dla_elder').val());
        
        Meteor.call('getDLA_NAME', $('#dla_elder').val(), function (error, result) {
            if (result) {
                Session.set('getDLA_Detail', result);
                Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                    Session.set('getZoneByDLA', result);
                    //console.log(result);
                })
            }
        });
    },
    'change [name="specialisationED"]': function(event, template) {
        let specialisation = $('input[name="specialisationED"]:checked').map(function() {
            return $(this).val();
        }).get();
        Session.set("specialisationED", specialisation);
        //console.log(specialisation);
    },
    'change [name="slectallED"]': function(event, template) {
        var check = $('input[name="slectallED"]').prop("checked");
        if (check) {
            $('input[name="specialisationED"]').prop('checked', true);
            let specialisation = $('input[name="specialisationED"]:checked').map(function() {
                return $(this).val();
            }).get();
            Session.set("specialisationED", specialisation);
            //console.log(specialisation);
        } else {
            $('input[name="specialisationED"]').prop('checked', false);
            Session.set("specialisationED", null);
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
    'click #editelder'() {

        Session.set('idElder', this._id);
        setTimeout(() => {
            Router.go('/admineditelder')
        }, 500);
    },
    // "click #viewcm"() {
    //     var cid = this._id

    //     Meteor.call('getLoginUserCM', cid, function (error, result) {
    //         Session.set('zoneViewProfileED', result);
    //     });
    // },
    "click #removeED"() {
        var cid = this.CID
        var arr = Session.get('list_adminelder')
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
                    Meteor.call('elderbyRemove', this.CID, function (err, result) {
                    });
                }else{
                    //console.log('B');
                }
            }
            Session.set('list_adminelder', arr)
            //console.log(arr);

            toastr.success("ลบข้อมูลเรียบร้อย", "สำเร็จ");



        }
    },
    'click #ED_find'() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);

        Session.set("specialisationCM", null);
        Session.set("specialisationCG", null);

        Session.set('list_admincm', null)
        Session.set('list_admincg', null)
        $('#searchCM').val('');
        $('#searchCG').val('');
        $('input[name="slectallCM"]:checkbox').prop('checked', false);
        $('input[name="slectallCG"]:checkbox').prop('checked', false);
        
        var strcid = $('#searchED').val();
        // console.log(strcid);
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

        // console.log(strAlert);
        if (strAlert == true) {
            toastr.warning("กรอกเลข 13 หลักให้ถูกต้อง", "ลองใหม่อีกครั้ง");
            $('#searchED').val('');
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        } else {
            console.log(arr)
            Session.set('arr_elder', arr)
            // console.log('insert')
            Meteor.call('elderby_multicid', arr, function (error, result) {
                //console.log(result);
                Session.set('list_adminelder', result)
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            });
        }

    },
    "click #radio_company_elder"() {
        Session.set('switchCompanyED', true)
        console.log('true');
        $(".showSwitchED").css("display", "block");

        Meteor.call('getAllServiceCenter', function (error, result) {
            console.log(result);
            $('#companyName_elder')[0].selectize.destroy()
            $('#companyName_elder').selectize({ options: result, create: false });
    
            $('.circle_companyName_elder').css('display' , 'none');
            $('.admin_companyName_elder').removeClass('admin_companyName_elder');

        });
    },
    "click #radio_dla_elder"() {
        Session.set('switchCompanyED', false)
        console.log('false');
        $(".showSwitchED").css("display", "block");

        Meteor.call('getAllDLA_CODE', function (error, result) {
            console.log(result);
            
            $('#dla_elder')[0].selectize.destroy()
            $('#dla_elder').selectize({ options: result, create: false });

            $('.circle_dla_elder').css('display' , 'none');
            $('.admin_dla_elder').removeClass('admin_dla_elder');
        });
    },
});

Template.select_company_hpc_admin_elder.onRendered(function init() {
    $('#companyName_elder').selectize();
    //console.log('select_company_hpc_admin');
    Meteor.call('getAllServiceCenter', function (error, result) {
        // $('#companyName_elder')[0].selectize.destroy()
        $('#companyName_elder').selectize({ options: result, create: false });
    });
});

Template.select_dla_hpc_admin_elder.onRendered(function init() {
    $('#dla_elder').selectize();
    //console.log('select_dla_hpc_admin');
    Meteor.call('getAllDLA_CODE', function (error, result) {
        // $('#dla_elder')[0].selectize.destroy()
        $('#dla_elder').selectize({ options: result, create: false });
    });
});
