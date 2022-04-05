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
Template.provinceViewCM.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.provinceViewCM.onRendered(function () {
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts);
    dt_print(window, $);
    Session.set('PROVINCESEARCH', false)
    Session.set('skip', 0);
    Session.set('find', null);
    //Session.set('provinceGetCMlistState', null)

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
    if (Session.get('IsProvinceSearchCM')) {
        if (Session.get('listViewCMName') == "ทั้งหมด") {
            Session.set('listViewCMNameCode', "-");
            find = "-";
        } else if (Session.get('listViewCMName') == "CM ปฏิบัติการ") {
            Session.set('listViewCMNameCode', "01");
            find = "01";
        } else if (Session.get('listViewCMName') == "CM บริหาร") {
            Session.set('listViewCMNameCode', "02");
            find = "02";
        } else if (Session.get('listViewCMName') == "ต้องได้รับการฟื้นฟูศักยภาพ") {
            Session.set('listViewCMNameCode', "03");
            find = "03";
        } else if (Session.get('listViewCMName') == "เกษียณอายุการทำงาน") {
            Session.set('listViewCMNameCode', "04");
            find = "04";
        } else if (Session.get('listViewCMName') == "ลาออก") {
            Session.set('listViewCMNameCode', "05");
            find = "05";
        } else if (Session.get('listViewCMName') == "เสียชีวิต") {
            Session.set('listViewCMNameCode', "06");
            find = "06";
        }else if (Session.get('listViewCMName') == "เปลี่ยนงาน / ย้ายงาน") {
            Session.set('listViewCMNameCode', "07");
            find = "07";
        }
        if (find == "-") {
            Session.set('ProvinceFindCMbyStatus', null)
            Meteor.call('provinceGetCMStateAll', Session.get('user').PROVINCENAME, Session.get('skip'), 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('provinceGetCMlistState', result)
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
                        buttons: [{
                            className: 'fa fa-file-excel-o',
                            extend: 'excel',
                            text: " ดาวน์โหลด",
                            title: "รายชื่้อ CM ทั้งหมดในจังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                            },
                            messageTop: null
                        },
                        {
                            extend: 'print',
                            exportOptions: {
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
            })
            Meteor.call('provinceGetCMStateAll_COUNT', Session.get('user').PROVINCENAME, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                //console.log(result)
                Session.set('provinceGetCMStateAll_COUNT', result)
            });
        } else {
            Session.set('ProvinceFindCMbyStatus', find)
            Meteor.call('provinceGetCMlistState', Session.get('user').PROVINCENAME, find, Session.get('skip'), 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('provinceGetCMlistState', result)
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
                        buttons: [{
                            className: 'fa fa-file-excel-o',
                            extend: 'excel',
                            text: " ดาวน์โหลด",
                            title: "รายชื่้อ CM " + Session.get('listViewCMName') + " จังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
                            exportOptions: {
                                columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                            },
                            messageTop: null
                        },
                        {
                            extend: 'print',
                            exportOptions: {
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
            Meteor.call('provinceGetCMlistState_COUNT', Session.get('user').PROVINCENAME, find, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                console.log(result)
                Session.set('provinceGetCMlistState_COUNT', result)
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
                            "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 14, 18, 19, 20, 21, 22, 23],
                            "visible": false,
                        },
                        {
                            "targets": [7, 18], "searchable": false
                        }
                    ],
                    buttons: [{
                        className: 'fa fa-file-excel-o',
                        extend: 'excel',
                        text: " ดาวน์โหลด",
                        title: "รายชื่้อ CM " + Session.get('listViewCMName') + " จังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
                        exportOptions: {
                            columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                        },
                        messageTop: null
                    },
                    {
                        extend: 'print',
                        exportOptions: {
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
    }
    Meteor.call('getRegProvinceLogin', Session.get('user').PROVINCENAME, function (err, result) {
        //Session.set('getProvinceCode',result)
        Meteor.call('getRegDistrict_name', result, function (error, result) {
            $('#district_name')[0].selectize.destroy()
            $('#district_name').selectize({ options: result, create: false });
        });
    })
});
Template.provinceViewCM.helpers({
    page() {
        return parseInt(Session.get('skip') / 10) + 1
    },
    pagecount() {
        if (Session.get('ProvinceFindCMbyStatus')) {
            return Math.ceil(parseFloat(Session.get('provinceGetCMlistState_COUNT') / 10))
        } else {
            return Math.ceil(parseFloat(Session.get('provinceGetCMStateAll_COUNT') / 10))
        }

    },
    status() {
        return Session.get('listViewCMName') == "ทั้งหมด"
    },
    user() {
        return Session.get('user').PROVINCENAME
    },
    list() {
        return Session.get('provinceGetCMlistState')
    },
    countType() {
        if (Session.get('ProvinceFindCMbyStatus')) {
            return Session.get('provinceGetCMlistState_COUNT')
        } else {
            return Session.get('provinceGetCMStateAll_COUNT')
        }

    },
    listViewCMName() {
        return Session.get('listViewCMName')
    },
    edittambon() {
        return Session.get('edittambon')
    },
    districtNameWork() {
        return Session.get('districtNameWork')
    },
    profile() {
        if (Session.get('provinceSelectedCM')) {
            return Session.get('provinceSelectedCM')[0];
        }
    },
    hospAdd() {
        if (Session.get('zoneViewhospAddCM')) {
            return Session.get('zoneViewhospAddCM');
        }
    },
});
Template.provinceViewCM.events({
    'click #next': function () {
        if (Session.get('ProvinceFindCMbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('provinceGetCMlistState_COUNT'))) {
                    Meteor.call('provinceGetCMlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('provinceGetCMlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('provinceGetCMlistState_COUNT'))) {
                    Meteor.call('PROVINCE_SEARCH_CM', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), next, 10, Session.get('user').ZONE, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('provinceGetCMlistState', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('provinceGetCMStateAll_COUNT'))) {
                    Meteor.call('provinceGetCMStateAll', Session.get('user').PROVINCENAME, next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('provinceGetCMlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('provinceGetCMStateAll_COUNT'))) {
                    Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), next, 10, Session.get('user').ZONE, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('provinceGetCMlistState', res)
                        }
                    })
                }
            }
        }
    },
    'click #prev': function () {
        if (Session.get('ProvinceFindCMbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('provinceGetCMlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('provinceGetCMlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), next, 10, Session.get('user').ZONE, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('provinceGetCMlistState', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('provinceGetCMStateAll', Session.get('user').PROVINCENAME, next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('provinceGetCMlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('provinceGetCMlistState', res)
                        }
                    })
                }
            }
        }
    },
    'click #first': function () {
        if (Session.get('ProvinceFindCMbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                Meteor.call('provinceGetCMlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', 0);
                    Session.set('provinceGetCMlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), 0, 10, Session.get('user').ZONE, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('provinceGetCMlistState', res)
                    }
                })

            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                Meteor.call('provinceGetCMStateAll', Session.get('user').PROVINCENAME, 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', 0);
                    Session.set('provinceGetCMlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""

                Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), 0, 10, Session.get('user').ZONE, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('provinceGetCMlistState', res)
                    }
                })

            }
        }
    },
    'click #last': function () {
        if (Session.get('ProvinceFindCMbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('provinceGetCMlistState_COUNT') - 10))
                Meteor.call('provinceGetCMlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', next);
                    Session.set('provinceGetCMlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = Math.ceil(parseFloat(Session.get('provinceGetCMlistState_COUNT') - 10))
                Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), next, 10, Session.get('user').ZONE, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('provinceGetCMlistState', res)
                    }
                })

            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('provinceGetCMStateAll_COUNT') - 10))
                Meteor.call('provinceGetCMStateAll', Session.get('user').PROVINCENAME, next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', next);
                    Session.set('provinceGetCMlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = Math.ceil(parseFloat(Session.get('provinceGetCMStateAll_COUNT') - 10))
                Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), next, 10, Session.get('user').ZONE, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('provinceGetCMlistState', res)
                    }
                })

            }
        }
    },
    'change #find': function () {
        if (Session.get('ProvinceFindCMbyStatus')) {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('provinceGetCMlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('provinceGetCMlistState', result)
            })
            Meteor.call('provinceGetCMlistState_COUNT', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('provinceGetCMlistState_COUNT', result)
            })
        } else {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('provinceGetCMStateAll', Session.get('user').PROVINCENAME, 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('provinceGetCMlistState', result)
            })
            Meteor.call('provinceGetCMStateAll_COUNT', Session.get('user').PROVINCENAME, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('provinceGetCMStateAll_COUNT', result)
            })
        }
    },
    "click #search_cm"() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        //var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
        var province = Session.get('user').PROVINCENAME
        var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
        var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
        $('#mytable').DataTable().destroy();
        Session.set('IsProvinceSearchCM', false)

        if (Session.get('ProvinceFindCMbyStatus')) {
            Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('PROVINCESEARCH', true)
                    Session.set('provinceGetCMlistState', res)
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
                            buttons: [{
                                className: 'fa fa-file-excel-o',
                                extend: 'excel',
                                text: " ดาวน์โหลด",
                                title: "รายชื่้อ CM " + Session.get('listViewCMName') + " จังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                },
                                messageTop: null
                            },
                            {
                                extend: 'print',
                                exportOptions: {
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
                }
            })
            Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), function (err, res) {
                if (res) {
                    Session.set('provinceGetCMlistState_COUNT', res.length)
                }
            })
        } else {
            Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('PROVINCESEARCH', true)
                    Session.set('provinceGetCMlistState', res)
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
                            buttons: [{
                                className: 'fa fa-file-excel-o',
                                extend: 'excel',
                                text: " ดาวน์โหลด",
                                title: "รายชื่้อ CM " + Session.get('listViewCMName') + " จังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                                },
                                messageTop: null
                            },
                            {
                                extend: 'print',
                                exportOptions: {
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
                }
            })
            Meteor.call('PROVINCE_SEARCH_CM',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCMbyStatus'), function (err, res) {
                if (res) {
                    Session.set('provinceGetCMStateAll_COUNT', res.length)
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
    "click #viewcm"() {
        var cid = this.CID
        Meteor.call('viewEachCMProvince', cid, function (error, result) {
            Session.set('provinceSelectedCM', result);

        });
    },
    "click #printCM"() {
        if (Session.get('provinceSelectedCM')) {
            $('#CMprofile').modal('hide');
            setTimeout(() => {
                Router.go('/printprofileCM')
            }, 1000);

        } else {
            toastr.error("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", "ไม่สำเร็จ");
        }
    },
    "click #edittambon"() {
        $('#myModal').modal();
        Session.set('edittambon', this);
        Session.set('districtNameWork', null)
    },
    'click #removeCM'() {
        if (confirm("ต้องการลบข้อมูลหรือไม่")) {
            CM_REGISTER.remove({ _id: this._id });
            Meteor.call('removeUserLogin', this.CID, function (err, result) {

            });
            if (Session.get('listViewCMNameCode') == "-") {
                Meteor.call('provinceGetCMStateAll', Session.get('user').PROVINCENAME, function (error, result) {
                    //console.log(result)
                    Session.set('provinceGetCMlistState', result)
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
                Meteor.call('provinceGetCMlistState', Session.get('user').PROVINCENAME, Session.get('listViewCMNameCode'), function (error, result) {
                    Session.set('provinceGetCMlistState', result)
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
    "click #saveTambon"() {
        if (Session.get('districtNameWork')) {
            CM_REGISTER.upsert({
                "_id": Session.get('edittambon')._id
            }, {
                    $set: {
                        "TAMBON": Session.get('districtNameWork'),
                        "D_UPDATE": new Date()
                    }
                });
            if (Session.get('listViewCMNameCode') == "-") {
                Meteor.call('provinceGetCMStateAll', Session.get('user').PROVINCENAME, function (error, result) {
                    Session.set('provinceGetCMlistState', result)
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
                Meteor.call('provinceGetCMlistState', Session.get('user').PROVINCENAME, Session.get('listViewCMNameCode'), function (error, result) {
                    Session.set('provinceGetCMlistState', result)
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
    "click #editcm"() {
        Session.set('ProvinceEditCMDetail', this.CID);
        setTimeout(() => {
            Router.go('/provinceeditcm')
        }, 500);

    },
    "click #saveState"() {
        CM_REGISTER.upsert({
            "_id": Session.get('editstate')._id
        }, {
                $set: {
                    "STATE_ACTIVE": $('#stateActive').val(),
                    "D_UPDATE": new Date()
                }
            });
        if (Session.get('listViewCMNameCode') == "-") {
            Meteor.call('provinceGetCMStateAll', Session.get('user').PROVINCENAME, function (error, result) {
                Session.set('provinceGetCMlistState', result)
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
            Meteor.call('provinceGetCMlistState', Session.get('user').PROVINCENAME, Session.get('listViewCMNameCode'), function (error, result) {
                Session.set('provinceGetCMlistState', result)
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
    'click #download': function () {
        if (Session.get('ProvinceFindCMbyStatus')) {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsprocm/' + Session.get('find') + '/' + Session.get('user').ZONE + '/' + Session.get('ProvinceFindCMbyStatus') + '/' + Session.get('user').PROVINCENAME);
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsprocm/-' + '/' + Session.get('user').ZONE + '/' + Session.get('ProvinceFindCMbyStatus') + '/' + Session.get('user').PROVINCENAME);
            }
        } else {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsprocmall/' + Session.get('find') + '/' + Session.get('user').ZONE + '/' + Session.get('user').PROVINCENAME);
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsprocmall/-' + '/' + Session.get('user').ZONE + '/' + Session.get('user').PROVINCENAME);
            }
        }
    },
});