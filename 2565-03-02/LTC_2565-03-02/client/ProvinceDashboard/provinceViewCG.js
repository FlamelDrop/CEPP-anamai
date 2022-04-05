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
Template.provinceViewCG.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.provinceViewCG.onRendered(function () {
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts);
    dt_print(window, $);

    Session.set('getCMlistState', null)
    Session.set('PROVINCESEARCH', false)
    Session.set('skip', 0);
    Session.set('find', null);
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
    if (Session.get('IsProvinceSearchCG')) {
        if (Session.get('listViewCGName') == "ทั้งหมด") {
            Session.set('listViewCGNameCode', "-");
            find = "-";
        } else if (Session.get('listViewCGName') == "ดูแลผู้สูงอายุตาม Care Plan") {
            Session.set('listViewCGNameCode', "01");
            find = "01";
        } else if (Session.get('listViewCGName') == "ยังไม่มีผู้สูงอายุในความดูแล") {
            Session.set('listViewCGNameCode', "02");
            find = "02";
        } else if (Session.get('listViewCGName') == "ต้องได้รับการฟื้นฟูศักยภาพ") {
            Session.set('listViewCGNameCode', "03");
            find = "03";
        } else if (Session.get('listViewCGName') == "ลาออก") {
            Session.set('listViewCGNameCode', "04");
            find = "04";
        } else if (Session.get('listViewCGName') == "เสียชีวิต") {
            Session.set('listViewCGNameCode', "05");
            find = "05";
        }
        if (find == "-") {
            Session.set('ProvinceFindCGbyStatus', null)
            Meteor.call('getCGlistStateAll', Session.get('user').PROVINCENAME, Session.get('skip'), 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('getCGlistState', result)
                $('#district_name').selectize();
                $('#subdistrict_name').selectize();
                $('#province_name').selectize();
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
                                "targets": [1, 2, 3, 5, 6, 7, 9, 10, 16, 18, 19, 23, 24, 25, 26],
                                "visible": false,

                            },
                            {
                                "targets": [7, 20], "searchable": false
                            }
                        ],
                        buttons: [
                            {
                                extend: 'excel',
                                className: 'fa fa-file-excel-o',
                                text: " ดาวน์โหลด",
                                title: "รายชื่้อ CG ทั้งหมดในจังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
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
                        }
                    });
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }, 500)
            });
            Meteor.call('getCGlistStateAll_COUNT', Session.get('user').PROVINCENAME, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                //console.log(result)
                Session.set('getCGlistStateAll_COUNT', result)
            });
        } else {
            Session.set('ProvinceFindCGbyStatus', find)
            Meteor.call('getCGlistState', Session.get('user').PROVINCENAME, find, Session.get('skip'), 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('getCGlistState', result)
                $('#district_name').selectize();
                $('#subdistrict_name').selectize();
                $('#province_name').selectize();
                Meteor.call('getRegProvince_name', function (error, result) {
                    $('#province_name')[0].selectize.destroy()
                    $('#province_name').selectize({ options: result, create: false });
                });
                setTimeout(function () {
                    $('#mytable').DataTable({
                        "ordering": false,
                        dom: '<"html5buttons"B>lTfgitp',
                        iDisplayLength: 5,
                        PageSize: 5,
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
                                extend: 'excel',
                                className: 'fa fa-file-excel-o',
                                text: " ดาวน์โหลด",
                                title: "รายชื่้อ CG " + Session.get('listViewCGName') + " จังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26]
                                },
                                messageTop: null
                            },
                            {
                                extend: 'print',
                                exportOptions: {
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
                        }
                    });
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }, 500)
            });
            Meteor.call('getCGlistState_COUNT', Session.get('user').PROVINCENAME, find, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('getCGlistState_COUNT', result)
            });
        }
    } else {
        $('#district_name').selectize();
        $('#subdistrict_name').selectize();
        $('#province_name').selectize();
        Meteor.call('getRegProvince_name', function (error, result) {
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
                            extend: 'excel',
                            className: 'fa fa-file-excel-o',
                            text: " ดาวน์โหลด",
                            title: "รายชื่้อ CG ทั้งหมดในจังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
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
Template.provinceViewCG.helpers({
    page() {
        return parseInt(Session.get('skip') / 10) + 1
    },
    pagecount() {
        if (Session.get('ProvinceFindCGbyStatus')) {
            return Math.ceil(parseFloat(Session.get('getCGlistState_COUNT') / 10))
        } else {
            return Math.ceil(parseFloat(Session.get('getCGlistStateAll_COUNT') / 10))
        }

    },
    user() {
        return Session.get('user').PROVINCENAME
    },
    list() {
        return Session.get('getCGlistState')
    },
    countType() {

        if (Session.get('ProvinceFindCGbyStatus')) {
            return Session.get('getCGlistState_COUNT')
        } else {
            return Session.get('getCGlistStateAll_COUNT')
        }
    },
    listViewCGName() {
        return Session.get('listViewCGName')
    },
    edittambon() {
        return Session.get('edittambon')
    },
    districtNameWork() {
        return Session.get('districtNameWork')
    },
    profilecg() {
        if (Session.get('provinceSelectedCG')) {
            return Session.get('provinceSelectedCG')[0];
        }
    },
});
Template.provinceViewCG.events({
    'click #next': function () {
        var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getCGlistState_COUNT'))) {
                    Meteor.call('getCGlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('getCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getCGlistState_COUNT'))) {
                    
                    Meteor.call('PROVINCE_SEARCH_CG', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('user').ZONE, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getCGlistState', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                var next = parseInt(Session.get('skip') + 10);
                if (next < parseInt(Session.get('getCGlistStateAll_COUNT'))) {
                    Meteor.call('getCGlistStateAll', Session.get('user').PROVINCENAME, next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('getCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = parseInt(Session.get('skip') + 10);
                
                if (next < parseInt(Session.get('getCGlistStateAll_COUNT'))) {
                    
                    Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').PROVINCENAME, district, subdis, Session.get('user').ZONE, Session.get('ProvinceFindCGbyStatus'), next, 10, function (err, res) {
                        console.log(res)
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getCGlistState', res)
                        }
                    })
                }
            }
        }
    },
    'click #prev': function () {
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('getCGlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('getCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('PROVINCE_SEARCH_CG',  Session.get('user').PROVINCENAME, district, subdis, Session.get('user').ZONE, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('user').ZONE, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getCGlistState', res)
                        }
                    })
                }
            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
              
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('getCGlistStateAll', Session.get('user').PROVINCENAME, next, 10, Session.get('find'),Session.get('user').ZONE, function (error, result) {
                        Session.set('skip', next);
                        Session.set('getCGlistState', result)
                    })
                }
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                if (parseInt(Session.get('skip')) > 0) {
                    var next = parseInt(Session.get('skip') - 10);
                    Meteor.call('PROVINCE_SEARCH_CG', Session.get('user').PROVINCENAME, district, subdis, Session.get('user').ZONE, Session.get('ProvinceFindCGbyStatus'), next, 10, function (err, res) {
                        if (res) {
                            Session.set('skip', next);
                            Session.set('getCGlistState', res)
                        }
                    })
                }
            }
        }
    },
    'click #first': function () {
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                Meteor.call('getCGlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', 0);
                    Session.set('getCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                Meteor.call('PROVINCE_SEARCH_CG', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), 0, 10, Session.get('user').ZONE, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('getCGlistState', res)
                    }
                })

            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                Meteor.call('getCGlistStateAll', Session.get('user').PROVINCENAME, 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', 0);
                    Session.set('getCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""

                Meteor.call('PROVINCE_SEARCH_CG', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), 0, 10, Session.get('user').ZONE, function (err, res) {
                    if (res) {
                        Session.set('skip', 0);
                        Session.set('getCGlistState', res)
                    }
                })

            }
        }
    },
    'click #last': function () {
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (!Session.get('PROVINCESEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('getCGlistState_COUNT') - 10))
                Meteor.call('getCGlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', next);
                    Session.set('getCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = Math.ceil(parseFloat(Session.get('getCGlistState_COUNT') - 10))
                Meteor.call('PROVINCE_SEARCH_CG', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('user').ZONE, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('getCGlistState', res)
                    }
                })

            }
        } else {
            if (!Session.get('PROVINCESEARCH')) {
                var next = Math.ceil(parseFloat(Session.get('getCGlistStateAll_COUNT') - 10))
                Meteor.call('getCGlistStateAll', Session.get('user').PROVINCENAME, next, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                    Session.set('skip', next);
                    Session.set('getCGlistState', result)
                })
            } else {
                var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
                var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
                var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
                var next = Math.ceil(parseFloat(Session.get('getCGlistStateAll_COUNT') - 10))
                Meteor.call('PROVINCE_SEARCH_CG', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), next, 10, Session.get('user').ZONE, function (err, res) {
                    if (res) {
                        Session.set('skip', next);
                        Session.set('getCGlistState', res)
                    }
                })

            }
        }
    },
    'change #find': function () {
        if (Session.get('ProvinceFindCGbyStatus')) {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('getCGlistState', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('getCGlistState', result)
            })
            Meteor.call('getCGlistState_COUNT', Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('getCGlistState_COUNT', result)
            })
        } else {
            Session.set('find', $('#find').val())
            Session.set('skip', 0);
            Meteor.call('getCGlistStateAll', Session.get('user').PROVINCENAME, 0, 10, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('getCGlistState', result)
            })
            Meteor.call('getCGlistStateAll_COUNT', Session.get('user').PROVINCENAME, Session.get('find'), Session.get('user').ZONE, function (error, result) {
                Session.set('getCGlistStateAll_COUNT', result)
            })
        }
    },
    "click #search_cg"() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        //var province = $('#province_name').val() ? $('#province_name').val().split('-')[1] : ""
        var province = Session.get('user').PROVINCENAME
        var district = $('#district_name').val() ? $('#district_name').val().split('-')[1] : ""
        var subdis = $('#subdistrict_name').val() ? $('#subdistrict_name').val().split('-')[1] : ""
        $('#mytable').DataTable().destroy();
        Session.set('IsProvinceSearchCG', false)
        if (Session.get('ProvinceFindCGbyStatus')) {
            Meteor.call('PROVINCE_SEARCH_CG', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('PROVINCESEARCH', true)
                    Session.set('getCGlistState', res)
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
                                    title: "รายชื่้อ CG ทั้งหมดในจังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
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
            Meteor.call('PROVINCE_SEARCH_CG', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), function (err, res) {
                if (res) {
                    Session.set('getCGlistState_COUNT', res.length)
                }
            })
        } else {
            Meteor.call('PROVINCE_SEARCH_CG', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), 0, 10, function (err, res) {
                if (res) {
                    Session.set('skip', 0);
                    Session.set('PROVINCESEARCH', true)
                    Session.set('getCGlistState', res)
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
            Meteor.call('PROVINCE_SEARCH_CG', province, district, subdis, Session.get('user').PROVINCENAME, Session.get('ProvinceFindCGbyStatus'), function (err, res) {
                if (res) {
                    Session.set('getCGlistStateAll_COUNT', res.length)
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
        Meteor.call('viewEachCGProvince', cid, function (error, result) {
            Session.set('provinceSelectedCG', result);

        });
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
    'click #removeCG'() {
        if (confirm("ต้องการลบข้อมูลหรือไม่")) {
            CG_REGISTER.remove({ _id: this._id });

            if (Session.get('listViewCGNameCode') == "-") {
                Meteor.call('getCGlistStateAll', Session.get('user').PROVINCENAME, function (error, result) {
                    Session.set('getCGlistState', result)
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
                Meteor.call('getCGlistState', Session.get('user').PROVINCENAME, Session.get('listViewCGNameCode'), function (error, result) {
                    Session.set('getCGlistState', result)
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
    "click #edittambon"() {
        $('#myModal').modal();
        Session.set('edittambon', this);
        Session.set('districtNameWork', null)
    },
    "click #saveTambon"() {
        if (Session.get('districtNameWork')) {
            CG_REGISTER.upsert({
                "_id": Session.get('edittambon')._id
            }, {
                    $set: {
                        "TAMBON": Session.get('districtNameWork'),
                        "D_UPDATE": new Date()
                    }
                });
            if (Session.get('listViewCGNameCode') == "-") {
                Meteor.call('getCGlistStateAll', Session.get('user').PROVINCENAME, function (error, result) {
                    Session.set('getCGlistState', result)
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
                Meteor.call('getCGlistState', Session.get('user').PROVINCENAME, Session.get('listViewCGNameCode'), function (error, result) {
                    Session.set('getCGlistState', result)
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
        Session.set('editstate', this);

    },
    "click #editAll"() {
        Session.set('ProvinceEditCGDetail', this.CID);
        setTimeout(() => {
            Router.go('/provinceeditcg')
        }, 500);

    },
    "click #saveState"() {
        CG_REGISTER.upsert({
            "_id": Session.get('editstate')._id
        }, {
                $set: {
                    "STATE_ACTIVE": $('#stateActive').val(),
                    "D_UPDATE": new Date()
                }
            });
        if (Session.get('listViewCGNameCode') == "-") {
            Meteor.call('getCGlistStateAll', Session.get('user').PROVINCENAME, function (error, result) {
                Session.set('getCMlistState', result)
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
            Meteor.call('getCGlistState', Session.get('user').PROVINCENAME, Session.get('listViewCGNameCode'), function (error, result) {
                Session.set('getCGlistState', result)
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
        if (Session.get('ProvinceFindCGbyStatus')) {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsprocg/' + Session.get('find') + '/' + Session.get('user').ZONE + '/' + Session.get('ProvinceFindCGbyStatus')+'/'+Session.get('user').PROVINCENAME);
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsprocg/-' + '/' + Session.get('user').ZONE + '/' + Session.get('ProvinceFindCGbyStatus')+'/'+Session.get('user').PROVINCENAME);
            }
        } else {
            if (Session.get('find')) {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsprocgall/' + Session.get('find') + '/' + Session.get('user').ZONE+'/'+Session.get('user').PROVINCENAME);
            } else {
                window.location.assign('http://ltc.anamai.moph.go.th/xlsprocgall/-' + '/' + Session.get('user').ZONE+'/'+Session.get('user').PROVINCENAME);
            }
        }
    },
});
