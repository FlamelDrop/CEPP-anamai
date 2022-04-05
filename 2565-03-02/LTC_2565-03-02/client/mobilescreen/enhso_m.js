
import datatables from 'datatables.net-responsive';
import datatables_bs from 'datatables.net-responsive-bs';
import jszip from 'jszip'
import datatables_buttons from 'datatables.net-buttons';
import dt_html5 from 'datatables.net-buttons/js/buttons.html5.min.js';
import dt_boostrap from 'datatables.net-buttons/js/buttons.boostrap.min.js';
import pdfmake from 'datatables.net-buttons/js/pdfmake.min.js';
import vfonts from 'datatables.net-buttons/js/vfs_fonts.js';
import dt_print from 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-responsive-bs/css/responsive.bootstrap.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
Template.enhso_m.onRendered(function () {
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts)
    dt_print(window, $);
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
    $('body').prepend(elem);
    Meteor.call('getUserCM', Session.get('cmid'), function (error, result) {
        var data = result
        // Session.set('getProfileCM', data)
        if (data) {

            if (data[0].SWITCHING.status) {

                //data[0].HOSPCODE ? data[0].HOSPCODE.CODE = data[0].SWITCHING.code : data[0].DLACODE.CODE = data[0].SWITCHING.code
                if (data[0].SWITCHING.code.length == 5) {
                    data[0].HOSPCODE = {}
                    data[0].DLACODE = null
                    data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                    Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function (error, result2) {
                        // data[0].HOSPCODE.CODE = result2.hospcode
                        data[0].HOSPCODE.NAME = result2.name
                        data[0].HOSPCODE.DISTRICT = result2.district
                        data[0].HOSPCODE.AMPHOE = result2.amphoe
                        data[0].HOSPCODE.PROVINCE = result2.province
                        Session.set('getProfileCM', data);
                        Session.set('nameCen', result2.name);
                        Session.set('nameProvince', result2.province[0] + result2.province[1]);

                        Meteor.call('LISTELDERLYNHSO', result2.hospcode, "01", function (error, result1) {
                            Session.set('LISTELDERLYNHSO', result1)
                            setTimeout(function () {
                                $('#showpic').css("height", $(document).height())
                                $('#mytablenhso').DataTable({
                                    // "ordering": false
                                    // dom: '<"html5buttons"B>lTfgitp',
                                    responsive: true,
                                    lengthChange: false,
                                    "info": false,
                                    // buttons: [{
                                    //     className: 'fa fa-file-excel-o',
                                    //     extend: 'excel',
                                    //     text: " ดาวน์โหลด",
                                    //     title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                    //     exportOptions: {
                                    //         columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    //     },
                                    //     messageTop: null
                                    // },
                                    // {
                                    //     className: 'fa fa-print',
                                    //     extend: 'print',
                                    //     text: " พิมพ์",
                                    //     title: "",
                                    //     customize: function (win) {
                                    //         $(win.document.body)
                                    //             .css('font-size', '10pt');


                                    //         $(win.document.body).find('table')
                                    //             .addClass('table')
                                    //             .css('font-size', 'inherit')
                                    //     },
                                    //     exportOptions: {
                                    //         columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    //     }
                                    // },
                                    // ],
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

                            }, 3000)

                            //   var workplace = Session.get('getProfileCM')[0].HOSPCODE || Session.get('getProfileCM')[0].DLACODE

                        });

                    });
                    $('#changeComp').val(data[0].SWITCHING.code)

                } else {

                    data[0].DLACODE = {}
                    data[0].HOSPCODE = null
                    data[0].DLACODE.CODE = data[0].SWITCHING.code
                    //console.log(data[0].SWITCHING.code)

                    Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function (error, result2) {
                        // data[0].DLACODE.CODE = result2.DLA_CODE
                        data[0].DLACODE.NAME = result2.NAME
                        data[0].DLACODE.DISTRICT = result2.DISTRICT
                        data[0].DLACODE.PROVINCE = result2.PROVINCE

                        Session.set('getProfileCM', data);
                        Session.set('nameCen', result2.DLA_NAME);
                        Session.set('nameProvince', result2.DLA_CODE[1] + result2.DLA_CODE[2]);

                        Meteor.call('LISTELDERLYNHSO', result2.DLA_CODE, "01", function (error, result1) {
                            Session.set('LISTELDERLYNHSO', result1)
                            setTimeout(function () {
                                $('#showpic').css("height", $(document).height())
                                $('#mytablenhso').DataTable({
                                    // "ordering": false
                                    // dom: '<"html5buttons"B>lTfgitp',
                                    responsive: true,
                                    lengthChange: false,
                                    "info": false,
                                    // buttons: [{
                                    //     className: 'fa fa-file-excel-o',
                                    //     extend: 'excel',
                                    //     text: " ดาวน์โหลด",
                                    //     title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                    //     exportOptions: {
                                    //         columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    //     },
                                    //     messageTop: null
                                    // },
                                    // {
                                    //     className: 'fa fa-print',
                                    //     extend: 'print',
                                    //     text: " พิมพ์",
                                    //     title: "",
                                    //     customize: function (win) {
                                    //         $(win.document.body)
                                    //             .css('font-size', '10pt');


                                    //         $(win.document.body).find('table')
                                    //             .addClass('table')
                                    //             .css('font-size', 'inherit')
                                    //     },
                                    //     exportOptions: {
                                    //         columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    //     }
                                    // },
                                    // ],
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

                            }, 3000)

                            //   var workplace = Session.get('getProfileCM')[0].HOSPCODE || Session.get('getProfileCM')[0].DLACODE

                        });

                    });
                    $('#changeComp').val(data[0].SWITCHING.code)

                }

            } else {
                Session.set('getProfileCM', data);
                var sedata = data[0].HOSPCODE ? data[0].HOSPCODE.CODE = data[0].HOSPCODE.CODE : data[0].DLACODE.CODE
                Meteor.call('LISTELDERLYNHSO', sedata, "01", function (error, result1) {
                    Session.set('LISTELDERLYNHSO', result1)
                    if (result1) {
                        setTimeout(function () {
                            $('#showpic').css("height", $(document).height())
                            $('#mytablenhso').DataTable({
                                // "ordering": false
                                // dom: '<"html5buttons"B>lTfgitp',
                                responsive: true,
                                lengthChange: false,
                                "info": false,
                                // buttons: [{
                                //     className: 'fa fa-file-excel-o',
                                //     extend: 'excel',
                                //     text: " ดาวน์โหลด",
                                //     title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                //     exportOptions: {
                                //         columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                //     },
                                //     messageTop: null
                                // },
                                // {
                                //     className: 'fa fa-print',
                                //     extend: 'print',
                                //     text: " พิมพ์",
                                //     title: "",
                                //     customize: function (win) {
                                //         $(win.document.body)
                                //             .css('font-size', '10pt');


                                //         $(win.document.body).find('table')
                                //             .addClass('table')
                                //             .css('font-size', 'inherit')
                                //     },
                                //     exportOptions: {
                                //         columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                //     }
                                // },
                                // ],
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

                        }, 3000)
                    }



                });

            }


        }
    });
})

Template.enhso_m.helpers({
    checkcp() {
        // CHECKED_CAREPLAN

        Meteor.call('CHECKED_CAREPLAN', this.CID, function (err, res) {
            Session.set('CHECKED_CAREPLAN', res);
        })

        return Session.get('CHECKED_CAREPLAN').length == 0
    },
    profile() {

        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }
    },
    EPID() {
        if (Session.get('checkElderID')) {
            if (Session.get('checkElderID').length != 0) {
                return Spacebars.SafeString('<label style="color:red;">รหัสบัตรประชาชนนี้ถูกใช้ลงทะเบียนแล้ว</label>');
            } else if (Session.get('EPID')) {
                return Spacebars.SafeString('<span style="color: green;" class="glyphicon glyphicon-ok"></span>');
            } else {
                return Spacebars.SafeString('<span style="color: red;" class="glyphicon glyphicon-remove"></span>');
            }
        }

    },
    listelder() {

        return Session.get('LISTELDERLYNHSO');
    },
    budyear() {
        var year = []
        for (var i = 2561; i < 2580; i++) {
            year.push({ year: i })
        }
        return year;
    },
    countElder_nhso() {
        if (Session.get('LISTELDERLYNHSO'))
            var myobj = Session.get('LISTELDERLYNHSO').length
        return myobj;
    },
    nameCen() {

        return Session.get('nameCen');
    },
    syncdate() {
        if (Session.get('LISTELDERLYNHSO')) {
            return Session.get('LISTELDERLYNHSO')[0].D_UPDATE;
        } else {
            return "-"
        }
    },
    isNHSO(a) {
        return !a
    }
});

Template.enhso_m.events({
    'change #budgetyear'(events) {
        Session.set('findByBUDGETYEARElder', events.target.value)
        var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        $('#mytablenhso').DataTable().destroy();
        if (events.target.value != "") {
            Meteor.call('LISTELDERLYNHSO', service_center, "01", function (error, result1) {
                var filter = _.filter(result1, function (num) { return num.BUDGETYEAR == Session.get('findByBUDGETYEARElder'); });
                Session.set('LISTELDERLYNHSO', filter)
                dTable_elder();
            });

        } else {
            Meteor.call('LISTELDERLYNHSO', service_center, "01", function (error, result1) {

                Session.set('LISTELDERLYNHSO', result1);
                dTable_elder();
            });
        }


    },
    'click #remove'() {
        var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        if (confirm('ต้องการลบใช่หรือใหม่')) {
            ELDERLYREGISTER.remove({
                _id: this._id
            })
            Meteor.call('LISTELDERLYNHSO', service_center, "01", function (error, result) {
                Session.set('LISTELDERLYNHSO', result);
            })

        }
    },
    'click #sync'() {
        var year
        let service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
        $('body').prepend(elem);
        $('#mytablenhso').DataTable().destroy();
        NProgress.start();
        if (year != "") {
            year = $('#budgetyear').val()
        } else {
            year = parseInt(moment().format('YYYY')) + 543
        }
        Meteor.call('getElderDataByHospcode', service_center, year, function (error, result) {
            if (result) {
                Meteor.call('upsertELDERLYREGISTER', result.data, function (error, result) {
                    Meteor.call('LISTELDERLYNHSO', service_center, function (error, result1) {
                        var filter = _.filter(result1, function (num) { return num.BUDGETYEAR == Session.get('findByBUDGETYEARElder'); });
                        Session.set('LISTELDERLYNHSO', filter)
                        dTable_elder();

                    });

                });
            } else {

                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                alert('ไม่พบข้อมูลที่ค้นหา')

            }

        });
    },
    'click #tocp'() {
        Session.set('elderID', this);
        Router.go('/adl_m');
    },
    'change #statusElder'(events) {
        if (confirm("ท่านกำลังเปลี่ยนสถานะของ " + this.PRENAME + "" + this.NAME + " " + this.LNAME + " ต้องการดำเนินการต่อหรือไม่")) {

            // ELDERLYREGISTER.update({
            //     "_id": this._id
            // }, {
            //     $set: {
            //         STATUS: event.target.value.toString(),
            //     }

            // })
            let stat = event.target.value.toString()
            Meteor.call('updateStatusElder', this.CID, stat, function (error, result1) {
                var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
                Meteor.call('LISTELDERLYNHSO', service_center, "01", function (error, result1) {
                    Session.set('LISTELDERLYNHSO', result1);
                });
                toastr.success("แก้ไขข้อมูลสถานะผู้สูงอายุเรียบร้อย", "สำเร็จ");
            });
        }
    }
});

function dTable_elder() {
    setTimeout(function () {
        $('#showpic').css("height", $(document).height())
        $('#mytablenhso').DataTable({
            // "ordering": false
            // dom: '<"html5buttons"B>lTfgitp',
            // lengthChange: false,
            responsive: true,
            "info": false,
            // buttons: [{
            //     className: 'fa fa-file-excel-o',
            //     extend: 'excel',
            //     text: " ดาวน์โหลด",
            //     title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
            //     exportOptions: {
            //         columns: [0, 1, 2, 3, 4, 5, 6, 7]
            //     },
            //     messageTop: null
            // },
            // {
            //     className: 'fa fa-print',
            //     extend: 'print',
            //     text: " พิมพ์",
            //     title: "",
            //     customize: function (win) {
            //         $(win.document.body)
            //             .css('font-size', '10pt');


            //         $(win.document.body).find('table')
            //             .addClass('table')
            //             .css('font-size', 'inherit')
            //     },
            //     exportOptions: {
            //         columns: [0, 1, 2, 3, 4, 5, 6, 7]
            //     }
            // },
            // ],
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
    }, 3000)
}