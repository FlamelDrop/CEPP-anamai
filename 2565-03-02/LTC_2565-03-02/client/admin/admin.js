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
Template.admin.onCreated(function init() {

    // $('body').addClass('waitMe_body');
    // var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    // $('body').prepend(elem);
})
Template.admin.onRendered(function init() {
    // Session.set('list_admincm', null)
    // Session.set('list_admincg', null)
    // Session.set('list_adminelder', null)
    console.log(Session.get('active'));

    if(Session.get('active') == 4){
        $(".nav-user").removeClass("active");
        $("#tab1primary").removeClass("active")

        $(".nav-cm").removeClass("active");
        $("#tab2primary").removeClass("active");

        $(".nav-elder").addClass("active");
        $("#tab4primary").addClass("active");
        
    }else if(Session.get('active') == 3){
        $(".nav-user").removeClass("active");
        $("#tab1primary").removeClass("active")

        $(".nav-cm").removeClass("active");
        $("#tab2primary").removeClass("active");

        $(".nav-elder").removeClass("active");
        $("#tab4primary").removeClass("active");

        $(".nav-cg").addClass("active");
        $("#tab3primary").addClass("active");
    }else if(Session.get('active') == 2){
        $(".nav-user").removeClass("active");
        $("#tab1primary").removeClass("active")

        $(".nav-cm").removeClass("active");
        $("#tab3primary").removeClass("active");

        $(".nav-elder").removeClass("active");
        $("#tab4primary").removeClass("active");

        $(".nav-cm").addClass("active");
        $("#tab2primary").addClass("active");
        
    }else{
        $(".nav-user").addClass("active");
        $("#tab1primary").addClass("active");

        $(".nav-cm").removeClass("active");
        $("#tab2primary").removeClass("active");

        $(".nav-cg").removeClass("active");
        $("#tab3primary").removeClass("active");

        $(".nav-elder").removeClass("active");
        $("#tab4primary").removeClass("active");

    }
    

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
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts);
    dt_print(window, $);
    Session.set('skip_pass', 0);
    Session.set('find', null);
    Meteor.call('getlistUsername', Session.get('skip_pass'), 10, function (error, result) {
        Session.set('getlistUsername', result)
        // setTimeout(function () {
        //     $('#mytable').DataTable({
        //         "ordering": false,
        //         "language": {
        //             "lengthMenu": "แสดง _MENU_ ชุดต่อหน้า",
        //             "zeroRecords": "ไม่พบผลลัพธ์",
        //             "info": "หน้าที่ _PAGE_ จาก _PAGES_ หน้า",
        //             "infoEmpty": "ไม่พบข้อมูล",
        //             "loadingRecords": "กำลังโหลด...",
        //             "processing": "กำลังประมวลผล...",
        //             "search": "ค้นหา : ",
        //             "paginate": {
        //                 "next": "ถัดไป",
        //                 "previous": "ก่อนหน้า"
        //             }
        //         }
        //     });
        //     $('body.waitMe_body').addClass('hideMe');
        //     $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        //     $('body.waitMe_body').removeClass('waitMe_body hideMe');
        // }, 500)

        Meteor.call('getCountUsername', function (error, result) {
            Session.set('getUSERNAME_COUNT', result)
        });


    });

    // Meteor.call('getAllDISTRICT', function(error, result) {
    //     var all_objs = [];
    //     var province_objs = [];
    //     var test = null;
    //     for(i = 0 ; i < result.length ; i++){
    //         all_objs.push({
    //             "_id": result[i]._id,
    //             "fullcode": result[i].fullcode,
    //             "subdistrict_name": result[i].subdistrict_name,
    //             "district_code": result[i].district_code,
    //             "district_name": result[i].district_name,
    //             "province_name": result[i].province_name
    //         }); 
    //         if(test == null || test != result[i].province_name){
    //             test = result[i].province_name;
    //             province_objs.push({
    //                 "_id": result[i]._id,
    //                 "province_name": result[i].province_name
    //             });
    //         }
    //     }
    //     Session.set('AllList', all_objs)
    //     Session.set('provinceList', province_objs)
    //     Session.set('districtList', null)
    //     Session.set('subdistrictList', null)
    //     Session.set('CG_provinceList', province_objs)
    //     Session.set('CG_districtList', null)
    //     Session.set('CG_subdistrictList', null)
    //     Session.set('elder_provinceList', province_objs)
    //     Session.set('elder_districtList', null)
    //     Session.set('elder_subdistrictList', null)

    // });

    // Meteor.call('getAllOfService', function (error, result) {
    //     Session.set('AllOfService', result);
    // })

    // Meteor.call('getSearchCMByAdmin',"","all","all","all","",10,0, function(error, result) {
    //     Session.set('DistData', result);
    //     Meteor.call('Count_SearchCMByAdmin','','all','all','all','',10,0, function(error, result1) {
    //         Session.set('getDISTRICT_COUNT', result1.length)
    //         Session.set('skip_pro', 0);
    //     });
    // });

    // Meteor.call('getSearchCGByAdmin','','all','all','all','',10,0, function(error, result) {
    //     Session.set('CG_DistData', result);
    //     Meteor.call('Count_SearchCGByAdmin','','all','all','all','',10,0, function(error, result1) {
    //         Session.set('CG_getDISTRICT_COUNT', result1.length)
    //         Session.set('CG_skip_pro', 0);
    //     });
    // });

    // Meteor.call('getServiceAllDATA',10,0, function(error, result) {
    //     Session.set('ED_DistData', result)
    //     Meteor.call('Count_getServiceAllDATA', function(error, result1) {
    //         Session.set('ED_getDISTRICT_COUNT', result1.length)
    //         Session.set('ED_skip_pro', 0);
    //     });
    // });
});

Template.admin.helpers({
    user() {
        return Session.get('user').RULE
    },
    list() {
        return Session.get('getlistUsername');
    },
    elder_province_list() {
        return Session.get('elder_provinceList');
    },
    province_list() {
        return Session.get('provinceList');
    },
    elder_district_list() {
        return Session.get('elder_districtList');
    },
    district_list() {
        return Session.get('districtList');
    },
    elder_subdistrict_list() {
        return Session.get('elder_subdistrictList');
    },
    subdistrict_list() {
        return Session.get('subdistrictList');
    },
    CG_province_list() {
        return Session.get('CG_provinceList');
    },
    CG_district_list() {
        return Session.get('CG_districtList');
    },
    CG_subdistrict_list() {
        return Session.get('CG_subdistrictList');
    },
    pageuser() {
        return parseInt(Session.get('skip_pass') / 10) + 1
    },
    pagecountuser() {
        return Math.ceil(parseFloat(Session.get('getUSERNAME_COUNT') / 10))
    },
    page() {
        return parseInt(Session.get('skip_pro') / 10) + 1
    },
    pagecount() {
        return Math.ceil(parseFloat(Session.get('getDISTRICT_COUNT') / 10))
    },
    CG_page() {
        return parseInt(Session.get('CG_skip_pro') / 10) + 1
    },
    CG_pagecount() {
        return Math.ceil(parseFloat(Session.get('CG_getDISTRICT_COUNT') / 10))
    },
    elder_service_list() {
        return Session.get('elder_serviceList');
    },
    ED_page() {
        return parseInt(Session.get('ED_skip_pro') / 10) + 1
    },
    ED_pagecount() {
        return Math.ceil(parseFloat(Session.get('ED_getDISTRICT_COUNT') / 10))
    },
    "getDistDetail"() {
        if (Session.get('DistData'))
            return Session.get('DistData');
    },
    "CG_getDistDetail"() {
        if (Session.get('CG_DistData'))
            return Session.get('CG_DistData');
    },
    "ED_getDistDetail"() {
        if (Session.get('ED_DistData'))
            return Session.get('ED_DistData');
    },
})


Template.admin.events({
    'click #next': function () {

        var next = parseInt(Session.get('skip_pass') + 10);
        if (next < parseInt(Session.get('getUSERNAME_COUNT'))) {
            Meteor.call('getlistUsername', next, 10, function (error, result) {
                Session.set('skip_pass', next);
                Session.set('getlistUsername', result)
            })
        }

    },
    'click #prev': function () {

        if (parseInt(Session.get('skip_pass')) > 0) {
            var next = parseInt(Session.get('skip_pass') - 10);
            Meteor.call('getlistUsername', next, 10, function (error, result) {
                Session.set('skip_pass', next);
                Session.set('getlistUsername', result)
            })
        }


    },
    'click #first': function () {
        Meteor.call('getlistUsername', 0, 10, function (error, result) {
            Session.set('skip_pass', 0);
            Session.set('getlistUsername', result)
        })


    },
    'click #last': function () {

        var next = Math.ceil(parseFloat(Session.get('getUSERNAME_COUNT') - 10))
        Meteor.call('getlistUsername', next, 10, function (error, result) {
            Session.set('skip_pass', next);
            Session.set('getlistUsername', result)
        })


    },
    'change #find'() {
        Session.set('skip_pass', 0);
        var search = $('#find').val()
        Meteor.call('SearchListUsername',Session.get('skip_pass'), 10, search, function (err, result) {
            Session.set('getlistUsername', result);
            Session.set('skip_pass', 0)
        })
        Meteor.call('SearchListUsername_COUNT', search, function (err, result) {
            Session.set('getUSERNAME_COUNT', result)
        })
    },
    'click #viewpass'() {
        Session.set('viewpass', this)

        Meteor.call('showpassword', this.PASSWORD, function (error, result) {
            $('#password').val(result);
            $('#myModal').modal('show');
        });
    },
    'click #edit'() {
        Meteor.call('encrypted', $('#password').val(), function (error, result) {
            USER_LOGIN.update({
                "_id": Session.get('viewpass')._id
            }, {
                    $set: {
                        PASSWORD: result
                    }
                });
            Meteor.call('getlistUsername', function (error, result2) {
                Session.set('getlistUsername', result2)
                $('#myModal').modal('hide');
                toastr.success("กำหนดรหัสผ่านใหม่ เรียบร้อย", "สำเร็จ");
            });
        });

    },
    'change #provinceselect'() {
        var data = Session.get('AllList');
        var province = $('#provinceselect').val();
        var objs = [];
        var test = null;
        for (i = 0; i < data.length; i++) {
            if (data[i].province_name == province) {
                if (test == null || test != data[i].district_name) {
                    test = data[i].district_name;
                    objs.push({
                        "_id": data[i]._id,
                        "district_code": data[i].district_code,
                        "district_name": data[i].district_name,
                        "province_name": data[i].province_name
                    });
                }
            }
        }
        Session.set('districtList', objs)
        Session.set('subdistrictList', null)
    },
    'change #amphoeselect'() {
        var data = Session.get('AllList');
        var amphoe = $('#amphoeselect').val();
        var objs = [];
        var test = null;
        for (i = 0; i < data.length; i++) {
            if (data[i].district_name == amphoe) {
                objs.push({
                    "_id": data[i]._id,
                    "fullcode": data[i].fullcode,
                    "subdistrict_name": data[i].subdistrict_name,
                    "district_code": data[i].district_code,
                    "district_name": data[i].district_name,
                    "province_name": data[i].province_name
                });
            }
        }
        Session.set('subdistrictList', objs)
    },
    // 'click #CM_find'() {
    //     $('body').addClass('waitMe_body');
    //     var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    //     $('body').prepend(elem);
    //     var year = $('#yearselect').val();
    //     var province = $('#provinceselect').val();
    //     var amphoe = $('#amphoeselect').val();
    //     var district = $('#districtselect').val();
    //     var search = $('#searchCM').val();

    //     Session.set('skip_pro', 0)
    //     // Session.set('selectedProvinceEva', null)
    //     // Session.set('selectedDistrictEva', null)
    //     Meteor.call('getSearchCMByAdmin', year, province, amphoe, district, search, 10, Session.get('skip_pro'), function (error, result) {
    //         Session.set('DistData', result);
    //         Meteor.call('Count_SearchCMByAdmin', year, province, amphoe, district, search, function (error, result1) {
    //             Session.set('getDISTRICT_COUNT', result1.length)
    //             $('body.waitMe_body').addClass('hideMe');
    //             $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
    //             $('body.waitMe_body').removeClass('waitMe_body hideMe');
    //         });
    //     });
    // },
    'click #CM_next': function () {
        var year = $('#yearselect').val();
        var province = $('#provinceselect').val();
        var amphoe = $('#amphoeselect').val();
        var district = $('#districtselect').val();
        var search = $('#searchCM').val();
        var next = parseInt(Session.get('skip_pro') + 10);
        console.log(next + " : " + Session.get('getDISTRICT_COUNT'))
        if (next < parseInt(Session.get('getDISTRICT_COUNT'))) {
            Meteor.call('getSearchCMByAdmin', year, province, amphoe, district, search, 10, next, function (error, result) {
                Session.set('skip_pro', next);
                Session.set('DistData', result)
            })
        }

    },
    'click #CM_prev': function () {
        var year = $('#yearselect').val();
        var province = $('#provinceselect').val();
        var amphoe = $('#amphoeselect').val();
        var district = $('#districtselect').val();
        var search = $('#searchCM').val();
        if (parseInt(Session.get('skip_pro')) > 0) {
            var next = parseInt(Session.get('skip_pro') - 10);
            Meteor.call('getSearchCMByAdmin', year, province, amphoe, district, search, 10, next, function (error, result) {
                Session.set('skip_pro', next);
                Session.set('DistData', result)
            })
        }


    },
    'click #CM_first': function () {
        var year = $('#yearselect').val();
        var province = $('#provinceselect').val();
        var amphoe = $('#amphoeselect').val();
        var district = $('#districtselect').val();
        var search = $('#searchCM').val();
        Meteor.call('getSearchCMByAdmin', year, province, amphoe, district, search, 10, 0, function (error, result) {
            Session.set('skip_pro', 0);
            Session.set('DistData', result)
        })


    },
    'click #CM_last': function () {
        var year = $('#yearselect').val();
        var province = $('#provinceselect').val();
        var amphoe = $('#amphoeselect').val();
        var district = $('#districtselect').val();
        var search = $('#searchCM').val();
        if (parseInt(Session.get('getDISTRICT_COUNT')) % 10 == 0) {
            var next = Math.ceil(parseFloat(Session.get('getDISTRICT_COUNT') - 10))
            Meteor.call('getSearchCMByAdmin', year, province, amphoe, district, search, 10, next, function (error, result) {
                Session.set('skip_pro', next);
                Session.set('DistData', result)
            })
        } else {
            var next = Math.ceil(parseFloat(Session.get('getDISTRICT_COUNT')))
            var test = next % 10;
            next = (next - test);
            console.log(next)
            Meteor.call('getSearchCMByAdmin', year, province, amphoe, district, search, 10, next, function (error, result) {
                Session.set('skip_pro', next);
                Session.set('DistData', result)
            })
        }
    },
    'change #CG_provinceselect'() {
        var data = Session.get('AllList');
        var province = $('#CG_provinceselect').val();
        var objs = [];
        var test = null;
        for (i = 0; i < data.length; i++) {
            if (data[i].province_name == province) {
                if (test == null || test != data[i].district_name) {
                    test = data[i].district_name;
                    objs.push({
                        "_id": data[i]._id,
                        "district_code": data[i].district_code,
                        "district_name": data[i].district_name,
                        "province_name": data[i].province_name
                    });
                }
            }
        }
        Session.set('CG_districtList', objs)
        Session.set('CG_subdistrictList', null)
    },
    'change #CG_amphoeselect'() {
        var data = Session.get('AllList');
        var amphoe = $('#CG_amphoeselect').val();
        var objs = [];
        var test = null;
        for (i = 0; i < data.length; i++) {
            if (data[i].district_name == amphoe) {
                objs.push({
                    "_id": data[i]._id,
                    "fullcode": data[i].fullcode,
                    "subdistrict_name": data[i].subdistrict_name,
                    "district_code": data[i].district_code,
                    "district_name": data[i].district_name,
                    "province_name": data[i].province_name
                });
            }
        }
        Session.set('CG_subdistrictList', objs)
    },
    // 'click #CG_find'() {
    //     $('body').addClass('waitMe_body');
    //     var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    //     $('body').prepend(elem);
    //     var year = $('#CG_yearselect').val();
    //     var province = $('#CG_provinceselect').val();
    //     var amphoe = $('#CG_amphoeselect').val();
    //     var district = $('#CG_districtselect').val();
    //     var search = $('#searchCG').val();

    //     Session.set('CG_skip_pro', 0)
    //     // Session.set('selectedProvinceEva', null)
    //     // Session.set('selectedDistrictEva', null)
    //     Meteor.call('getSearchCGByAdmin', year, province, amphoe, district, search, 10, Session.get('CG_skip_pro'), function (error, result) {
    //         Session.set('CG_DistData', result);
    //         Meteor.call('Count_SearchCGByAdmin', year, province, amphoe, district, search, function (error, result1) {
    //             Session.set('CG_getDISTRICT_COUNT', result1.length)
    //             $('body.waitMe_body').addClass('hideMe');
    //             $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
    //             $('body.waitMe_body').removeClass('waitMe_body hideMe');
    //         });
    //     });
    // },
    'click #CG_next': function () {
        var year = $('#CG_yearselect').val();
        var province = $('#CG_provinceselect').val();
        var amphoe = $('#CG_amphoeselect').val();
        var district = $('#CG_districtselect').val();
        var search = $('#searchCG').val();
        var next = parseInt(Session.get('CG_skip_pro') + 10);
        if (next < parseInt(Session.get('CG_getDISTRICT_COUNT'))) {
            Meteor.call('getSearchCGByAdmin', year, province, amphoe, district, search, 10, next, function (error, result) {
                Session.set('CG_skip_pro', next);
                Session.set('CG_DistData', result)
            })
        }

    },
    'click #CG_prev': function () {
        var year = $('#CG_yearselect').val();
        var province = $('#CG_provinceselect').val();
        var amphoe = $('#CG_amphoeselect').val();
        var district = $('#CG_districtselect').val();
        var search = $('#searchCG').val();
        if (parseInt(Session.get('CG_skip_pro')) > 0) {
            var next = parseInt(Session.get('CG_skip_pro') - 10);
            Meteor.call('getSearchCGByAdmin', year, province, amphoe, district, search, 10, next, function (error, result) {
                Session.set('CG_skip_pro', next);
                Session.set('CG_DistData', result)
            })
        }


    },
    'click #CG_first': function () {
        var year = $('#CG_yearselect').val();
        var province = $('#CG_provinceselect').val();
        var amphoe = $('#CG_amphoeselect').val();
        var district = $('#CG_districtselect').val();
        var search = $('#searchCG').val();
        Meteor.call('getSearchCGByAdmin', year, province, amphoe, district, search, 10, 0, function (error, result) {
            Session.set('CG_skip_pro', 0);
            Session.set('CG_DistData', result)
        })


    },
    'click #CG_last': function () {
        var year = $('#CG_yearselect').val();
        var province = $('#CG_provinceselect').val();
        var amphoe = $('#CG_amphoeselect').val();
        var district = $('#CG_districtselect').val();
        var search = $('#searchCG').val();
        if (parseInt(Session.get('CG_getDISTRICT_COUNT')) % 10 == 0) {
            var next = Math.ceil(parseFloat(Session.get('CG_getDISTRICT_COUNT') - 10))
            Meteor.call('getSearchCGByAdmin', year, province, amphoe, district, search, 10, next, function (error, result) {
                Session.set('CG_skip_pro', next);
                Session.set('CG_DistData', result)
            })
        } else {
            var next = Math.ceil(parseFloat(Session.get('CG_getDISTRICT_COUNT')))
            var test = next % 10;
            next = (next - test);
            console.log(next)
            Meteor.call('getSearchCGByAdmin', year, province, amphoe, district, search, 10, next, function (error, result) {
                Session.set('CG_skip_pro', next);
                Session.set('CG_DistData', result)
            })
        }
    },
    'change #ED_provinceselect'() {
        var data = Session.get('AllList');
        var province = $('#ED_provinceselect').val();
        var objs = [];
        var test = null;
        for (i = 0; i < data.length; i++) {
            if (data[i].province_name == province) {
                if (test == null || test != data[i].district_name) {
                    test = data[i].district_name;
                    objs.push({
                        "_id": data[i]._id,
                        "district_code": data[i].district_code,
                        "district_name": data[i].district_name,
                        "province_name": data[i].province_name
                    });
                }
            }
        }
        //var province = $('#ED_provinceselect').val();
        var amphoe = $('#ED_amphoeselect').val();
        var district = $('#ED_districtselect').val();
        Meteor.call('getServiceDATA', province, "", "", function (error, result2) {
            Session.set('elder_serviceList', result2)
        });
        Session.set('elder_districtList', objs)
        Session.set('elder_subdistrictList', null)
    },
    'change #ED_amphoeselect'() {
        var data = Session.get('AllList');
        var amphoe = $('#ED_amphoeselect').val();
        var objs = [];
        var test = null;
        for (i = 0; i < data.length; i++) {
            if (data[i].district_name == amphoe) {
                objs.push({
                    "_id": data[i]._id,
                    "fullcode": data[i].fullcode,
                    "subdistrict_name": data[i].subdistrict_name,
                    "district_code": data[i].district_code,
                    "district_name": data[i].district_name,
                    "province_name": data[i].province_name
                });
            }
        }
        var province = $('#ED_provinceselect').val();
        //var amphoe = $('#ED_amphoeselect').val();
        var district = $('#ED_districtselect').val();
        Meteor.call('getServiceDATA', province, amphoe, "", function (error, result2) {
            Session.set('elder_serviceList', result2)
        });
        Session.set('elder_subdistrictList', objs)
    },
    'change #ED_districtselect'() {
        var province = $('#ED_provinceselect').val();
        var amphoe = $('#ED_amphoeselect').val();
        var district = $('#ED_districtselect').val();
        Meteor.call('getServiceDATA', province, amphoe, district, function (error, result2) {
            Session.set('elder_serviceList', result2)
        });

    },
    'click #ED_next': function () {
        if ($('#ED_provinceselect').val() != 'all') {
            var year = $('#ED_yearselect').val();
            var search = $('#searchED').val();
            var objs = [];
            var service = Session.get('elder_serviceList')
            for (i = 0; i < service.length; i++) {
                objs[i] = service[i].hospcode;
            }
            var next = parseInt(Session.get('ED_skip_pro') + 10);
            if (next < parseInt(Session.get('ED_getDISTRICT_COUNT'))) {
                Meteor.call('getElderFromHOSP', objs, search, 10, next, function (error, result) {
                    Session.set('ED_skip_pro', next);
                    Session.set('ED_DistData', result)
                })
            }
        } else {
            var next = parseInt(Session.get('ED_skip_pro') + 10);
            if (next < parseInt(Session.get('ED_getDISTRICT_COUNT'))) {
                Meteor.call('getServiceAllDATA', 10, next, function (error, result) {
                    Session.set('ED_skip_pro', next);
                    Session.set('ED_DistData', result)
                })
            }
        }

    },
    'click #ED_prev': function () {
        if ($('#ED_provinceselect').val() != 'all') {
            var year = $('#ED_yearselect').val();
            var search = $('#searchED').val();
            var objs = [];
            var service = Session.get('elder_serviceList')
            for (i = 0; i < service.length; i++) {
                objs[i] = service[i].hospcode;
            }
            if (parseInt(Session.get('ED_skip_pro')) > 0) {
                var next = parseInt(Session.get('ED_skip_pro') - 10);
                Meteor.call('getElderFromHOSP', objs, search, 10, next, function (error, result) {
                    Session.set('ED_skip_pro', next);
                    Session.set('ED_DistData', result)
                })
            }
        } else {
            var next = parseInt(Session.get('ED_skip_pro') + 10);
            if (parseInt(Session.get('ED_skip_pro')) > 0) {
                var next = parseInt(Session.get('ED_skip_pro') - 10);
                Meteor.call('getServiceAllDATA', 10, next, function (error, result) {
                    Session.set('ED_skip_pro', next);
                    Session.set('ED_DistData', result)
                })
            }
        }


    },
    'click #ED_first': function () {
        if ($('#ED_provinceselect').val() != 'all') {
            var year = $('#ED_yearselect').val();
            var search = $('#searchED').val();
            var objs = [];
            var service = Session.get('elder_serviceList')
            for (i = 0; i < service.length; i++) {
                objs[i] = service[i].hospcode;
            }
            Meteor.call('getElderFromHOSP', objs, search, 10, 0, function (error, result) {
                Session.set('ED_skip_pro', 0);
                Session.set('ED_DistData', result)
            })
        } else {
            Meteor.call('getServiceAllDATA', 10, 0, function (error, result) {
                Session.set('ED_skip_pro', 0);
                Session.set('ED_DistData', result)
            })
        }


    },
    'click #ED_last': function () {
        if ($('#ED_provinceselect').val() != 'all') {
            var year = $('#ED_yearselect').val();
            var search = $('#searchED').val();
            var objs = [];
            var service = Session.get('elder_serviceList')
            for (i = 0; i < service.length; i++) {
                objs[i] = service[i].hospcode;
            }
            if (parseInt(Session.get('ED_getDISTRICT_COUNT')) % 10 == 0) {
                var next = Math.ceil(parseFloat(Session.get('ED_getDISTRICT_COUNT') - 10))
                Meteor.call('getElderFromHOSP', objs, search, 10, next, function (error, result) {
                    Session.set('ED_skip_pro', next);
                    Session.set('ED_DistData', result)
                })
            } else {
                var next = Math.ceil(parseFloat(Session.get('ED_getDISTRICT_COUNT')))
                var test = next % 10;
                next = (next - test);
                console.log(next)
                Meteor.call('getElderFromHOSP', objs, search, 10, next, function (error, result) {
                    Session.set('ED_skip_pro', next);
                    Session.set('ED_DistData', result)
                })
            }
        } else {
            if (parseInt(Session.get('ED_getDISTRICT_COUNT')) % 10 == 0) {
                var next = Math.ceil(parseFloat(Session.get('ED_getDISTRICT_COUNT') - 10))
                Meteor.call('getServiceAllDATA', 10, next, function (error, result) {
                    Session.set('ED_skip_pro', next);
                    Session.set('ED_DistData', result)
                })
            } else {
                var next = Math.ceil(parseFloat(Session.get('ED_getDISTRICT_COUNT')))
                var test = next % 10;
                next = (next - test);
                Meteor.call('getServiceAllDATA', 10, next, function (error, result) {
                    Session.set('ED_skip_pro', next);
                    Session.set('ED_DistData', result)
                })
            }
        }
    },

    'click #editCM'() {
        Session.set('SET_EditCMData', this)
        Router.go('/admineditcm')
    },
    'click #editCG'() {
        Session.set('SET_EditCGData', this)
        Router.go('/admineditCG')
    }
});

Template.registerHelper('Check_null_value', function (data) {
    if (data == null) {
        return 'ไม่พบข้อมูล'
    } else {
        var result = data.split('-')
        if (result.length > 1) {
            return result[1]
        } else {
            return data
        }
    }
});

Template.registerHelper('Check_null_valueStyle', function (data) {
    if (data == null) {
        return 'text-align: center;color: red'
    } else {
        return ''
    }
});

