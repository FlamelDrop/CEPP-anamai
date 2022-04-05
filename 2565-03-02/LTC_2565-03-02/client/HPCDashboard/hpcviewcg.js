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
Template.hpcviewcg.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.hpcviewcg.onRendered(function () {
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts);
    dt_print(window, $);
    Session.set('HPCSEARCH', false)
    Session.set('skip', 0);
    Session.set('find', null);
    $("#se_date").datetimepicker({
        timepicker: false,
        format: 'Y', // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000
        lang: 'th', // แสดงภาษาไทย
        mask: true,
        onChangeMonth: thaiYear,
        yearStart: 1800,
        onShow: thaiYear,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });
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
    if (Session.get('IsHpcSearchCG')) {
        if (Session.get('listZoneViewCGName') == "ทั้งหมด") {
            Session.set('listZoneViewCGNameCode', "-");
            find = "-";
        } else if (Session.get('listZoneViewCGName') == "ดูแลผู้สูงอายุตาม Care Plan") {
            Session.set('listZoneViewCGNameCode', "01");
            find = "01";
        } else if (Session.get('listZoneViewCGName') == "ยังไม่มีผู้สูงอายุในความดูแล") {
            Session.set('listZoneViewCGNameCode', "02");
            find = "02";
        } else if (Session.get('listZoneViewCGName') == "ลาออก") {
            Session.set('listZoneViewCGNameCode', "04");
            find = "04";
        } else if (Session.get('listZoneViewCGName') == "ต้องได้รับการฟื้นฟูศักยภาพ") {
            Session.set('listZoneViewCGNameCode', "03");
            find = "03";
        } else if (Session.get('listZoneViewCGName') == "เสียชีวิต") {
            Session.set('listZoneViewCGNameCode', "05");
            find = "05";
        }
        if (find == "-") {
            NProgress.start();
            Session.set('HPCFindCGbyStatus', null)
            Meteor.call('getZoneCGlistStateAll', Session.get('user').ZONE, Session.get('skip'), 10, function (error, result) {
                Session.set('getZoneCGlistState', result)
                $('#district_name').selectize();
                $('#subdistrict_name').selectize();
                $('#province_name').selectize();
                Session.set("removephoto", null);
                Meteor.call('getRegProvince_name', function (error, result) {
                    $('#province_name')[0].selectize.destroy()
                    $('#province_name').selectize({ options: result, create: false });
                });
                Meteor.call('getZoneCGlistStateAll_COUNT', Session.get('user').ZONE, Session.get('find'), function (error, result) {
                    //console.log(result)
                    Session.set('getZoneCGlistStateAll_COUNT', result)
                });
                setTimeout(function () {
                    $('#mytable').DataTable({
                        "ordering": false,
                        dom: '<"html5buttons"B>lTfgitp',
                        lengthChange: false,
                        "info": false,
                        columnDefs: [
                            {
                                "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 18, 19, 23, 24, 25, 26],
                                "visible": false,

                            },
                            {
                                "targets": [7, 20], "searchable": false
                            }
                        ],
                        buttons: [
                            {

                                className: 'fa fa-file-excel-o',
                                extend: 'excel',
                                text: " ดาวน์โหลด",
                                title: "สถานะทั้งหมดของ CG เขต" + Session.get('user').ZONE + "_" + moment().format('DD-MM-YY') + "",
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26]
                                },
                                messageTop: null
                            },
                            {

                                extend: 'print', exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26]
                                },
                                className: 'fa fa-print',
                                extend: 'print',
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
                    NProgress.done();
                }, 500)
            });
        } else {
            Session.set('HPCFindCGbyStatus', find)
            Meteor.call('getZoneCGlistState', Session.get('user').ZONE, find, Session.get('skip'), 10, Session.get('find'), function (error, result) {
                $('#district_name').selectize();
                $('#subdistrict_name').selectize();
                $('#province_name').selectize();
                Session.set("removephoto", null);
                Meteor.call('getRegProvince_name', function (error, result) {
                    $('#province_name')[0].selectize.destroy()
                    $('#province_name').selectize({ options: result, create: false });
                });
                Session.set('getZoneCGlistState', result)
                Meteor.call('getZoneCGlistState_COUNT', Session.get('user').ZONE, find, Session.get('find'), function (error, result) {
                    Session.set('getZoneCGlistState_COUNT', result)
                })
                setTimeout(function () {
                    $('#mytable').DataTable({
                        "ordering": false,
                        dom: '<"html5buttons"B>lTfgitp',
                        lengthChange: false,
                        "info": false,
                        columnDefs: [
                            {
                                "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 18, 19, 23, 24, 25, 26],
                                "visible": false,

                            },
                            {
                                "targets": [7, 20], "searchable": false
                            }
                        ],
                        buttons: [
                            {
                                className: 'fa fa-file-excel-o',
                                extend: 'excel',
                                text: " ดาวน์โหลด",
                                title: "รายชื่อ CG ที่มีสถานะ" + Session.get('listZoneViewCGName') + "เขต" + Session.get('user').ZONE + "_" + moment().format('DD-MM-YY') + "",
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26]
                                },
                                messageTop: null
                            },
                            {
                                extend: 'print', exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26]
                                },
                                className: 'fa fa-print',
                                extend: 'print',
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
                            "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 18, 19, 23, 24, 25, 26],
                            "visible": false,
                        },
                        {
                            "targets": [7, 20], "searchable": false
                        }
                    ],
                    buttons: [
                        {
                            className: 'fa fa-file-excel-o',
                            extend: 'excel',
                            text: " ดาวน์โหลด",
                            title: "สถานะทั้งหมดของ CG เขต" + Session.get('user').ZONE + "_" + moment().format('DD-MM-YY') + "",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26]
                            },
                            messageTop: null
                        },
                        {
                            extend: 'print', exportOptions: {
                                columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26]
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

});
Template.hpcviewcg.helpers({
    page() {
        return parseInt(Session.get('skip') / 10) + 1
    },
    pagecount() {
        if (Session.get('HPCFindCGbyStatus')) {
            return Math.ceil(parseFloat(Session.get('getZoneCGlistState_COUNT') / 10))
        } else {
            return Math.ceil(parseFloat(Session.get('getZoneCGlistStateAll_COUNT') / 10))
        }

    },
    se_year() {
        var year = []
        for (var i = 0; i < 40; i++) {
            year.push({ year: 2015 + i, thyear: 2558 + i })
        }
        return year
    },
    status() {
        return Session.get('listZoneViewCGName') == "ทั้งหมด"
    },
    user() {
        return Session.get('user').ZONE
    },
    list() {
        return Session.get('getZoneCGlistState')
    },
    countType() {
        if (Session.get('HPCFindCGbyStatus')) {
            return Session.get('getZoneCGlistState_COUNT')
        } else {
            return Session.get('getZoneCGlistStateAll_COUNT')
        }

    },
    listViewCGName() {
        return Session.get('listZoneViewCGName')
    },
    districtNameWork() {
        return Session.get('districtNameWork')
    },
    dlaName() {
        Meteor.call('getDLA_NAME', Session.get('provinceSelectedCG')[0].DLACODE, function (error, result) {
            if (result) {
                Session.set('dlaName', result)
            }

        });
        if (Session.get('dlaName')) {
            return Session.get('dlaName').DLA_NAME + " " + Session.get('dlaName').DISTRICT + " จ. " + Session.get('dlaName').PROVINCE
        }

    },
    profilecg() {
        if (Session.get('provinceSelectedCG')) {
            return Session.get('provinceSelectedCG')[0];
        }
    },
});
Template.hpcviewcg.events({
    'click #next': function () {
        if (Session.get('HPCFindCGbyStatus')) {
            if (!Session.get('HPCSEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getZoneCGlistState_COUNT'))) {
                    Meteor.call('getZoneCGlistState', Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), next, 10, Session.get('find'), function (error, result) {
                        Session.set('skip', next);
                        Session.set('getZoneCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getZoneCGlistState_COUNT'))) {
                    Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getZoneCGlistState', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('HPCSEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getZoneCGlistStateAll_COUNT'))) {
                    Meteor.call('getZoneCGlistStateAll', Session.get('user').ZONE, next, 10, Session.get('find'), function (error, result) {
                        Session.set('skip', next);
                        Session.set('getZoneCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getZoneCGlistStateAll_COUNT'))) {
                    Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getZoneCGlistState', res)
                        }
                    })
                }
            }
        }
    },
    'click #prev': function () {
        if (Session.get('HPCFindCGbyStatus')) {
            if (!Session.get('HPCSEARCH')) {
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('getZoneCGlistState', Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), next, 10, Session.get('find'), function (error, result) {
                        Session.set('skip', next);
                        Session.set('getZoneCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getZoneCGlistState', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('HPCSEARCH')) {
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('getZoneCGlistStateAll', Session.get('user').ZONE, next, 10, Session.get('find'), function (error, result) {
                        Session.set('skip', next);
                        Session.set('getZoneCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getZoneCGlistState', res)
                        }
                    })
                }
            }
        }
    },
    'click #first': function () {
        if (Session.get('HPCFindCGbyStatus')) {
            if (!Session.get('HPCSEARCH')) {
                Meteor.call('getZoneCGlistState', Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), 0, 10, Session.get('find'), function (error, result) {
                    Session.set('skip', 0);
                    Session.set('getZoneCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), 0, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('getZoneCGlistState', res)
                    }
                })

            }
        } else {
            if (!Session.get('HPCSEARCH')) {
                Meteor.call('getZoneCGlistStateAll', Session.get('user').ZONE, 0, 10, Session.get('find'), function (error, result) {
                    Session.set('skip', 0);
                    Session.set('getZoneCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""

                Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), 0, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('getZoneCGlistState', res)
                    }
                })

            }
        }
    },
    'click #last': function () {
        if (Session.get('HPCFindCGbyStatus')) {
            if (!Session.get('HPCSEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('getZoneCGlistState_COUNT') - 10))
                Meteor.call('getZoneCGlistState', Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), next, 10, Session.get('find'), function (error, result) {
                    Session.set('skip', next);
                    Session.set('getZoneCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = Math.ceil(parseFloat(Session.get('getZoneCGlistState_COUNT') - 10))
                Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), next, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('getZoneCGlistState', res)
                    }
                })

            }
        } else {
            if (!Session.get('HPCSEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('getZoneCGlistStateAll_COUNT') - 10))
                Meteor.call('getZoneCGlistStateAll', Session.get('user').ZONE, next, 10, Session.get('find'), function (error, result) {
                    Session.set('skip', next);
                    Session.set('getZoneCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = Math.ceil(parseFloat(Session.get('getZoneCGlistStateAll_COUNT') - 10))
                Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), next, 10, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('getZoneCGlistState', res)
                    }
                })

            }
        }
    },
    'change #find': function () {
        if (Session.get('HPCFindCGbyStatus')) {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('getZoneCGlistState', Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), 0, 10, Session.get('find'), function (error, result) {
                Session.set('getZoneCGlistState', result)
            })
            Meteor.call('getZoneCGlistState_COUNT', Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), Session.get('find'), function (error, result) {
                Session.set('getZoneCGlistState_COUNT', result)
            })
        } else {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('getZoneCGlistStateAll', Session.get('user').ZONE, 0, 10, Session.get('find'), function (error, result) {
                Session.set('getZoneCGlistState', result)
            })
            Meteor.call('getZoneCGlistStateAll_COUNT', Session.get('user').ZONE, Session.get('find'), function (error, result) {
                Session.set('getZoneCGlistStateAll_COUNT', result)
            })
        }
    },
    "click #search_cg"() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
        var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
        var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
        $('#mytable').DataTable().destroy();
        if (Session.get('HPCFindCGbyStatus')) {
            Session.set('IsHpcSearchCG', false)
            Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('HPCSEARCH', true)
                    Session.set('getZoneCGlistState', res)
                    setTimeout(function () {
                        $('#mytable').DataTable({
                            "ordering": false,
                            dom: '<"html5buttons"B>lTfgitp',
                            lengthChange: false,
                            "info": false,
                            columnDefs: [
                                {
                                    "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 18, 19, 23, 24, 25, 26],
                                    "visible": false,
                                },
                                {
                                    "targets": [7, 20], "searchable": false
                                }
                            ],
                            buttons: [
                                {
                                    className: 'fa fa-file-excel-o',
                                    extend: 'excel',
                                    text: " ดาวน์โหลด",
                                    title: "สถานะทั้งหมดของ CG เขต" + Session.get('user').ZONE + "_" + moment().format('DD-MM-YY') + "",
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26]
                                    },
                                    messageTop: null
                                },
                                {
                                    extend: 'print', exportOptions: {
                                        columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26]
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
            Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), function (err, res) {
                if (res) {
                    Session.set('getZoneCGlistState_COUNT', res.length)
                }
            })
        } else {
            Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('HPCSEARCH', true)
                    Session.set('getZoneCGlistState', res)
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }
            })
            Meteor.call('HPC_SEARCH_CG', province, district, subdis, Session.get('user').ZONE, Session.get('HPCFindCGbyStatus'), function (err, res) {
                if (res) {
                    Session.set('getZoneCGlistStateAll_COUNT', res.length)
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
    "click #viewcg"() {
        var cid = this.CID
        var tambon = this.TAMBON
        Meteor.call('viewEachCGProvince', cid, tambon, function (error, result) {
            Session.set('provinceSelectedCG', result);

        });
    },
    "change #se_year"() {

    },
    "click #removeCG"() {
        if (confirm("ต้องการลบข้อมูลหรือไม่")) {
            CG_REGISTER.remove({ _id: this._id });

            if (Session.get('listZoneViewCGNameCode') == "-") {
                Meteor.call('getZoneCGlistStateAll', Session.get('user').ZONE, function (error, result) {
                    Session.set('getZoneCGlistState', result)
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
                Meteor.call('getZoneCGlistState', Session.get('user').ZONE, Session.get('listZoneViewCGNameCode'), function (error, result) {
                    Session.set('getZoneCGlistState', result)
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
        }
    },
    "click #printcg"() {
        if (Session.get('provinceSelectedCG')) {
            $('#cgprofile').modal('hide');
            setTimeout(() => {
                Router.go('/printprofilecg')
            }, 1000);

        } else {
            toastr.error("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", "ไม่สำเร็จ");
        }
    },

    "click #editcg"() {

        Router.go('/hpceditcg')
        Session.set('ZoneEditCGDetail', this);

    },
    'click #download': function () {
        if (Session.get('HPCFindCGbyStatus')) {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlshpccg/' + Session.get('find')+'/'+Session.get('user').ZONE+'/'+Session.get('HPCFindCGbyStatus'));
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlshpccg/-'+'/'+Session.get('user').ZONE+'/'+Session.get('HPCFindCGbyStatus'));
            }
        } else {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlshpccgall/' + Session.get('find')+'/'+Session.get('user').ZONE);
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlshpccgall/-'+'/'+Session.get('user').ZONE);
            }
        }
    },
});
