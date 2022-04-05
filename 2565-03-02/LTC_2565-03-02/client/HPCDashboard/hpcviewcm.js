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
Template.hpcviewcm.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.hpcviewcm.onRendered(function () {
    Session.set('zoneViewProfileCM', null)
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
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    var find = "";
    if (Session.get('IsHpcSearch')) {
        if (Session.get('listZoneViewCMName') == "ทั้งหมด") {
            Session.set('listZoneViewCMStateCode', "-");
            find = "-";
        } else if (Session.get('listZoneViewCMName') == "CM ปฏิบัติการ") {
            Session.set('listZoneViewCMStateCode', "01");
            find = "01";
        } else if (Session.get('listZoneViewCMName') == "CM บริหาร") {
            Session.set('listZoneViewCMStateCode', "02");
            find = "02";
        } else if (Session.get('listZoneViewCMName') == "ต้องได้รับการฟื้นฟูศักยภาพ") {
            Session.set('listZoneViewCMStateCode', "03");
            find = "03";
        } else if (Session.get('listZoneViewCMName') == "เกษียณอายุการทำงาน") {
            Session.set('listZoneViewCMStateCode', "04");
            find = "04";
        } else if (Session.get('listZoneViewCMName') == "ลาออก") {
            Session.set('listZoneViewCMStateCode', "05");
            find = "05";
        } else if (Session.get('listZoneViewCMName') == "เสียชีวิต") {
            Session.set('listZoneViewCMStateCode', "06");
            find = "06";
        } else if (Session.get('listZoneViewCMName') == "เปลี่ยนงาน / ย้ายงาน") {
            Session.set('listZoneViewCMStateCode', "07");
            find = "07";
        } if (find == "-") {
            //Session.get('user').ZONE
            Session.set('HPCFindCMbyStatus', null)
            Meteor.call('getCMlistStateAll', Session.get('user').ZONE, Session.get('skip'), 10, Session.get('find'), function (error, result) {
                //console.log(result)
                Session.set('getCMlistStateByZone', result)
                $('#district_name').selectize();
                $('#subdistrict_name').selectize();
                $('#province_name').selectize();
                Session.set("removephoto", null);
                Meteor.call('getRegProvince_name', function (error, result) {
                    $('#province_name')[0].selectize.destroy()
                    $('#province_name').selectize({ options: result, create: false });
                });
                setTimeout(function () {
                    $('#mytable').DataTable({
                        "ordering": false,
                        dom: '<"html5buttons"B>lTfgitp',
                        lengthChange: false,
                        "info": false,
                        columnDefs: [
                            {
                                "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 14, 18, 19, 20, 21, 22, 23],
                                "visible": false,
                            },
                            {
                                "targets": [7, 18], "searchable": false
                            }
                        ],
                        buttons: [
                            {
                                className: 'fa fa-file-excel-o',
                                extend: 'excel',
                                text: " ดาวน์โหลด",
                                title: "รายชื่อ CM ทั้งหมดในเขต " + Session.get('user').ZONE + "_" + moment().format('DD-MM-YY') + "",
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                },
                                messageTop: null
                            },
                            {
                                extend: 'print', exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                },
                                className: 'fa fa-print',
                                text: " พิมพ์",
                                title: "",
                                customize: function (win) {
                                    $(win.document.body)
                                        .css('font-size', '10pt');


                                    $(win.document.body).find('table')
                                        .addClass('table')
                                        .css('font-size', 'inherit')
                                },
                            },
                        ],
                        "language": {
                            "lengthMenu": "แสดง _MENU_ ชุดต่อหน้า",
                            "zeroRecords": "ไม่พบผลลัพธ์",
                            "info": "หน้าที่ _PAGE_ จาก _PAGES_ หน้า",
                            "infoEmpty": "ไม่พบข้อมูล",
                            "loadingRecords": "กำลังโหลด...",
                            "processing": "กำลังประมวลผล...",
                            "search": "ค้นหา : ",
                            "paginate": {
                                "next": "ถัดไป",
                                "previous": "ก่อนหน้า"
                            }
                        },

                    });
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }, 500)
            });
            Meteor.call('getCMlistStateAll_COUNT', Session.get('user').ZONE, Session.get('find'), function (error, result) {
                //console.log(result)
                Session.set('getCMlistStateAll_COUNT', result)
            });
        } else {
            Session.set('HPCFindCMbyStatus', find)
            Meteor.call('getCMlistState', Session.get('user').ZONE, find, Session.get('skip'), 10, Session.get('find'), function (error, result) {

                Session.set('getCMlistStateByZone', result)
                $('#district_name').selectize();
                $('#subdistrict_name').selectize();
                $('#province_name').selectize();
                Session.set("removephoto", null);
                Meteor.call('getRegProvince_name', function (error, result) {
                    $('#province_name')[0].selectize.destroy()
                    $('#province_name').selectize({ options: result, create: false });
                });
                setTimeout(function () {
                    $('#mytable').DataTable({
                        "ordering": false,
                        dom: '<"html5buttons"B>lTfgitp',
                        lengthChange: false,
                        "info": false,
                        columnDefs: [
                            {
                                "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 14, 18, 19, 20, 21, 22, 23],
                                "visible": false,
                            },
                            {
                                "targets": [7, 18], "searchable": false
                            }
                        ],
                        buttons: [
                            {
                                className: 'fa fa-file-excel-o',
                                extend: 'excel',
                                text: " ดาวน์โหลด",
                                title: "รายชื่อ CM ที่มีลักษณะปฎิบัติงานเป็น" + Session.get('listZoneViewCMName') + "เขต" + Session.get('user').ZONE + "_" + moment().format('DD-MM-YY') + "",
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                },
                                messageTop: null
                            },
                            {
                                extend: 'print', exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                },
                                className: 'fa fa-print',
                                text: " พิมพ์",
                                title: "",
                                customize: function (win) {
                                    $(win.document.body)
                                        .css('font-size', '10pt');


                                    $(win.document.body).find('table')
                                        .addClass('table')
                                        .css('font-size', 'inherit')
                                },
                            },
                        ],
                        "language": {
                            "lengthMenu": "แสดง _MENU_ ชุดต่อหน้า",
                            "zeroRecords": "ไม่พบผลลัพธ์",
                            "info": "หน้าที่ _PAGE_ จาก _PAGES_ หน้า",
                            "infoEmpty": "ไม่พบข้อมูล",
                            "loadingRecords": "กำลังโหลด...",
                            "processing": "กำลังประมวลผล...",
                            "search": "ค้นหา : ",
                            "paginate": {
                                "next": "ถัดไป",
                                "previous": "ก่อนหน้า"
                            }
                        }
                    });
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }, 500)
            });
            Meteor.call('getCMlistState_COUNT', Session.get('user').ZONE, find, Session.get('find'), function (error, result) {
                Session.set('getCMlistState_COUNT', result)
            })
        }
    } else {
        $('#district_name').selectize();
        $('#subdistrict_name').selectize();
        $('#province_name').selectize();
        Session.set("removephoto", null);
        Meteor.call('getRegProvince_name', function (error, result) {
            $('#province_name')[0].selectize.destroy()
            $('#province_name').selectize({ options: result, create: false });
            setTimeout(function () {
                $('#mytable').DataTable({
                    "ordering": false,
                    dom: '<"html5buttons"B>lTfgitp',
                    lengthChange: false,
                    "info": false,
                    columnDefs: [
                        {
                            "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 14, 18, 19, 20, 21, 22, 23],
                            "visible": false,
                        },
                        {
                            "targets": [7, 18], "searchable": false
                        }
                    ],
                    buttons: [
                        {
                            className: 'fa fa-file-excel-o',
                            extend: 'excel',
                            text: " ดาวน์โหลด",
                            title: "รายชื่อ CM ทั้งหมดในเขต " + "Session.get('user').ZONE" + "_" + moment().format('DD-MM-YY') + "",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                            },
                            messageTop: null
                        },
                        {
                            extend: 'print', exportOptions: {
                                columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                            },
                            className: 'fa fa-print',
                            text: " พิมพ์",
                            title: "",
                            customize: function (win) {
                                $(win.document.body)
                                    .css('font-size', '10pt');


                                $(win.document.body).find('table')
                                    .addClass('table')
                                    .css('font-size', 'inherit')
                            },
                        },
                    ],
                    "language": {
                        "lengthMenu": "แสดง _MENU_ ชุดต่อหน้า",
                        "zeroRecords": "ไม่พบผลลัพธ์",
                        "info": "หน้าที่ _PAGE_ จาก _PAGES_ หน้า",
                        "infoEmpty": "ไม่พบข้อมูล",
                        "loadingRecords": "กำลังโหลด...",
                        "processing": "กำลังประมวลผล...",
                        "search": "ค้นหา : ",
                        "paginate": {
                            "next": "ถัดไป",
                            "previous": "ก่อนหน้า"
                        }
                    },

                });
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            }, 500)
        });

    }
    $('#companyName').selectize();
});
Template.hpcviewcm.helpers({
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
            return Session.get('zoneViewProfileCM')[0];
        }
    }
});
Template.hpcviewcm.events({
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
    'click #download': function () {
        if (Session.get('find')) {
            window.location.assign('http://ltc.anamai.moph.go.th/download/' + Session.get('find'));
        } else {
            window.location.assign('http://ltc.anamai.moph.go.th/download/-');
        }
    },
    "click #search_cm"() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
        var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
        var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
        $('#mytable').DataTable().destroy();
        Session.set('IsHpcSearch', false)
        if (Session.get('HPCFindCMbyStatus')) {
            Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('HPCSEARCH', true)
                    Session.set('getCMlistStateByZone', res)
                    setTimeout(function () {
                        $('#mytable').DataTable({
                            "ordering": false,
                            dom: '<"html5buttons"B>lTfgitp',
                            lengthChange: false,
                            "info": false,
                            columnDefs: [
                                {
                                    "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 14, 18, 19, 20, 21, 22, 23],
                                    "visible": false,
                                },
                                {
                                    "targets": [7, 18], "searchable": false
                                }
                            ],
                            buttons: [
                                {
                                    className: 'fa fa-file-excel-o',
                                    extend: 'excel',
                                    text: " ดาวน์โหลด",
                                    title: "รายชื่อ CM ทั้งหมดในเขต " + Session.get('user').ZONE + "_" + moment().format('DD-MM-YY') + "",
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                    },
                                    messageTop: null
                                },
                                {
                                    extend: 'print', exportOptions: {
                                        columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                    },
                                    className: 'fa fa-print',
                                    text: " พิมพ์",
                                    title: "",
                                    customize: function (win) {
                                        $(win.document.body)
                                            .css('font-size', '10pt');


                                        $(win.document.body).find('table')
                                            .addClass('table')
                                            .css('font-size', 'inherit')
                                    },
                                },
                            ],
                            "language": {
                                "lengthMenu": "แสดง _MENU_ ชุดต่อหน้า",
                                "zeroRecords": "ไม่พบผลลัพธ์",
                                "info": "หน้าที่ _PAGE_ จาก _PAGES_ หน้า",
                                "infoEmpty": "ไม่พบข้อมูล",
                                "loadingRecords": "กำลังโหลด...",
                                "processing": "กำลังประมวลผล...",
                                "search": "ค้นหา : ",
                                "paginate": {
                                    "next": "ถัดไป",
                                    "previous": "ก่อนหน้า"
                                }
                            },

                        });
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    }, 500)
                }
            })
            Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), function (err, res) {
                if (res) {
                    Session.set('getCMlistState_COUNT', res.length)
                }
            })
        } else {
            Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('HPCSEARCH', true)
                    Session.set('getCMlistStateByZone', res)
                    setTimeout(function () {
                        $('#mytable').DataTable({
                            "ordering": false,
                            dom: '<"html5buttons"B>lTfgitp',
                            lengthChange: false,
                            "info": false,
                            columnDefs: [
                                {
                                    "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 14, 18, 19, 20, 21, 22, 23],
                                    "visible": false,
                                },
                                {
                                    "targets": [7, 18], "searchable": false
                                }
                            ],
                            buttons: [
                                {
                                    className: 'fa fa-file-excel-o',
                                    extend: 'excel',
                                    text: " ดาวน์โหลด",
                                    title: "รายชื่อ CM ทั้งหมดในเขต " + Session.get('user').ZONE + "_" + moment().format('DD-MM-YY') + "",
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                    },
                                    messageTop: null
                                },
                                {
                                    extend: 'print', exportOptions: {
                                        columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                    },
                                    className: 'fa fa-print',
                                    text: " พิมพ์",
                                    title: "",
                                    customize: function (win) {
                                        $(win.document.body)
                                            .css('font-size', '10pt');


                                        $(win.document.body).find('table')
                                            .addClass('table')
                                            .css('font-size', 'inherit')
                                    },
                                },
                            ],
                            "language": {
                                "lengthMenu": "แสดง _MENU_ ชุดต่อหน้า",
                                "zeroRecords": "ไม่พบผลลัพธ์",
                                "info": "หน้าที่ _PAGE_ จาก _PAGES_ หน้า",
                                "infoEmpty": "ไม่พบข้อมูล",
                                "loadingRecords": "กำลังโหลด...",
                                "processing": "กำลังประมวลผล...",
                                "search": "ค้นหา : ",
                                "paginate": {
                                    "next": "ถัดไป",
                                    "previous": "ก่อนหน้า"
                                }
                            },

                        });
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    }, 500)
                }
            })
            Meteor.call('HPC_SEARCH_CM', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCMbyStatus'), function (err, res) {
                if (res) {
                    Session.set('getCMlistStateAll_COUNT', res.length)
                }
            })
        }

    },
    "change #province_name"() {
        var res = $('#province_name').val().split('-')
        Meteor.call('getRegDistrict_name', res[0], function (error, result) {
            $('#district_name')[0].selectize.destroy()
            $('#district_name').selectize({ options: result, create: false });
            $('#subdistrict_name')[0].selectize.destroy()
            $('#subdistrict_name').selectize();

        });
    },
    "change #subdistrict_name"() {
        var res = $('#subdistrict_name').val().split("-")
        Session.set('districtNameWork', res[0])
    },
    "change #district_name"() {
        var res = $('#district_name').val().split('-')
        Meteor.call('getRegSubsistrict_name', res[0], function (error, result) {
            $('#subdistrict_name')[0].selectize.destroy()
            $('#subdistrict_name').selectize({ options: result, create: false });

        });
    },
    "click #printcm"() {
        if (Session.get('zoneViewProfileCM')) {
            $('#cmprofile').modal('hide');
            setTimeout(() => {
                Router.go('/printprofilecm')
            }, 1000);
        } else {
            toastr.error("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", "ไม่สำเร็จ");
        }
    },
    'click #editcm'() {
        // $('#cmprofile').modal('hide');
        Session.set('hpcEditCmDetail2', this.CID);
        setTimeout(() => {
            Router.go('/hpceditcm')
        }, 500);


    },
    "click #viewcm"() {
        var cid = this._id

        Meteor.call('getLoginUserCM', cid, function (error, result) {
            Session.set('zoneViewProfileCM', result);

        });
    },
    "change #companyName"() {
        Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (error, result) {
            Session.set('HOSPCODENameWorkCMByZone', result)
            Session.set('districtNameWorkCMByZone', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
        });
    },
    "click #edittambon"() {
        $('#myModal').modal();
        Session.set('edittambonCMByZONE', this);
        Session.set('districtNameWorkCMByZone', null)
        var cid = this.CID
        Meteor.call('getUserCM', cid, function (error, result) {
            Session.set('zoneViewProfileCM', result);

        });

    },
    "click #saveTambon"() {
        //console.log(Session.get('HOSPCODENameWorkCMByZone'))
        if (Session.get('HOSPCODENameWorkCMByZone')) {
            CM_REGISTER.update({
                "_id": Session.get('edittambonCMByZONE')._id
            }, {
                    $set: {
                        "HOSPCODE": Session.get('HOSPCODENameWorkCMByZone').hospcode,
                        "zone": Session.get('HOSPCODENameWorkCMByZone').zone,
                        "D_UPDATE": new Date()
                    }
                });
            if (Session.get('listZoneViewCMStateCode') == "-") {
                Meteor.call('getCMlistStateAll', Session.get('user').ZONE, function (error, result) {
                    //console.log(result)
                    Session.set('getCMlistStateByZone', result)
                    toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                    $('#myModal').modal('hide');
                    $('#myModal').on('hidden.bs.modal', function (e) {
                        $(this)
                            .find("input,textarea,select")
                            .val('')
                            .end()
                            .find("input[type=checkbox], input[type=radio]")
                            .prop("checked", "")
                            .end()
                            .find("img")
                            .removeAttr('src')
                            .end();
                    })
                });
            } else {
                Meteor.call('getCMlistState', Session.get('user').ZONE, Session.get('listZoneViewCMStateCode'), function (error, result) {
                    Session.set('getCMlistStateByZone', result)
                    toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                    $('#myModal').modal('hide');
                    $('#myModal').on('hidden.bs.modal', function (e) {
                        $(this)
                            .find("input,textarea,select")
                            .val('')
                            .end()
                            .find("input[type=checkbox], input[type=radio]")
                            .prop("checked", "")
                            .end()
                            .find("img")
                            .removeAttr('src')
                            .end();
                    })
                });
            }
        } else {
            $('#myModal').modal('hide');
            toastr.error("โปรดเลือดตำบลใหม่อีกครัครั้ง", "ไม่สำเร็จ");
        }
    },
    "click #editstate"() {
        $('#myModal2').modal();

        Session.set('editstateCMByZone', this);

    },

    "click #saveState"() {
        CM_REGISTER.update({
            "_id": Session.get('editstateCMByZone')._id
        }, {
                $set: {
                    "STATE_ACTIVE": $('#stateActive').val(),
                    "D_UPDATE": new Date()
                }
            });
        if (Session.get('listZoneViewCMStateCode') == "-") {
            Meteor.call('getCMlistStateAll', Session.get('user').ZONE, function (error, result) {
                Session.set('getCMlistStateByZone', result)
                toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                $('#myModal2').modal('hide');
                $('#myModal2').on('hidden.bs.modal', function (e) {
                    $(this)
                        .find("input,textarea,select")
                        .val('')
                        .end()
                        .find("input[type=checkbox], input[type=radio]")
                        .prop("checked", "")
                        .end()
                        .find("img")
                        .removeAttr('src')
                        .end();
                })
            });
        } else {
            Meteor.call('getCMlistState', Session.get('user').ZONE, Session.get('listZoneViewCMStateCode'), function (error, result) {
                Session.set('getCMlistStateByZone', result)
                toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                $('#myModal2').modal('hide');
                $('#myModal2').on('hidden.bs.modal', function (e) {
                    $(this)
                        .find("input,textarea,select")
                        .val('')
                        .end()
                        .find("input[type=checkbox], input[type=radio]")
                        .prop("checked", "")
                        .end()
                        .find("img")
                        .removeAttr('src')
                        .end();
                })
            });
        }
    },
    "click #removeCM"() {
        if (confirm("ต้องการลบข้อมูลหรือไม่")) {
            CM_REGISTER.remove({ _id: this._id });
            Meteor.call('removeUserLogin', this.CID, function (err, result) {

            });
            if (Session.get('listZoneViewCMStateCode') == "-") {
                Meteor.call('getCMlistStateAll', Session.get('user').ZONE, function (error, result) {
                    //console.log(result)
                    Session.set('getCMlistStateByZone', result)
                    toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                    $('#myModal').modal('hide');
                    $('#myModal').on('hidden.bs.modal', function (e) {
                        $(this)
                            .find("input,textarea,select")
                            .val('')
                            .end()
                            .find("input[type=checkbox], input[type=radio]")
                            .prop("checked", "")
                            .end()
                            .find("img")
                            .removeAttr('src')
                            .end();
                    })

                });
            } else {
                Meteor.call('getCMlistState', Session.get('user').ZONE, Session.get('listZoneViewCMStateCode'), function (error, result) {
                    Session.set('getCMlistStateByZone', result)
                    toastr.success("อัพเดทข้อมูลเรียบร้อย", "สำเร็จ");
                    $('#myModal').modal('hide');
                    $('#myModal').on('hidden.bs.modal', function (e) {
                        $(this)
                            .find("input,textarea,select")
                            .val('')
                            .end()
                            .find("input[type=checkbox], input[type=radio]")
                            .prop("checked", "")
                            .end()
                            .find("img")
                            .removeAttr('src')
                            .end();
                    })

                });
            }
        }
    },
    'click #download': function () {
        if (Session.get('HPCFindCMbyStatus')) {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlshpccm/' + Session.get('find') + '/' + Session.get('user').ZONE + '/' + Session.get('HPCFindCMbyStatus'));
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlshpccm/-' + '/' + Session.get('user').ZONE + '/' + Session.get('HPCFindCMbyStatus'));
            }
        } else {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlshpccmall/' + Session.get('find') + '/' + Session.get('user').ZONE);
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlshpccmall/-' + '/' + Session.get('user').ZONE);
            }
        }
    },
});
