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
import { setInterval } from 'timers';

Template.temp_vender_code.onCreated(function () {
    $("#VENDERCODE").selectize();
    Meteor.call('listVenderCode', function (error, result) {
        // $('#companyName')[0].selectize.destroy()
        $('#VENDERCODE').selectize({ options: result, create: false });
    });
});

Template.elder.onCreated(function () {
    Session.set('backToElder_r', true)
    Session.set('backToElder_n', false)
    $('#kkk').show();
    // if (Session.get('backToElder_r')) {

    // } else {
    //     Session.set('backToElder_r', true)
    //     Session.set('backToElder_n', false)
    // }

});

Template.elder.onRendered(function helloOnCreated() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $("meta[name='viewport']").attr('content', 'width=device-width, initial-scale=1.0');

    } else {

    }
    //init
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts)
    dt_print(window, $);
    //end
    if ($.cookie('showDialog1') == "true") {
        // $('#dialog1').modal();
    }
    $('#myModal3').on('hidden.bs.modal', function (e) {
        $(this)
            .find("input")
            .val('')
            .end();
        Session.set('idElder', null);
    })
    $('#privilege').selectize({
        plugins: ['remove_button'],
        delimiter: ',',
        create: function (input) {
            return { value: input, text: input };
        },
        persist: false,
        sortField: 'text'
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
    $("#BIRTHDATE").datetimepicker({
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
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
    $('body').prepend(elem);
    Session.set('isNhsoElderTab', false)
    Meteor.call('getUserCM', Session.get('cmid'), function (error, result) {
        var data = result
        // Session.set('getProfileCM', data)
        if (data) {

            if (data[0].SWITCHING.status) {
                // data[0].HOSPCODE ? data[0].HOSPCODE.CODE = data[0].SWITCHING.code : data[0].DLACODE.CODE = data[0].SWITCHING.code
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

                        Meteor.call('LISTELDERLY', result2.hospcode, "01", function (error, result1) {
                            // console.log(result1);
                            var data = listElder(result1)

                            Meteor.call('listCpHistoryMulti', data, function (error, res) {
                                // console.log(res);

                                for (let i = 0; i < result1.length; i++) {
                                    res.push(result1[i])
                                }

                                var elder = listCareplan(res)
                                // console.log(elder);

                                Session.set('LISTELDERLY', elder)

                                setTimeout(function () {
                                    $('#mytable').DataTable({
                                        "ordering": false,
                                        responsive: true,
                                        dom: '<"html5buttons"B>lTfgitp',
                                        lengthChange: false,
                                        "info": false,
                                        buttons: [{
                                            className: 'fa fa-file-excel-o',
                                            extend: 'excel',
                                            text: " ดาวน์โหลด",
                                            title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                            exportOptions: {
                                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                            },
                                            messageTop: null
                                        },
                                        {
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
                                            exportOptions: {
                                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                            }
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

                        Meteor.call('LISTELDERLY', result2.DLA_CODE, "01", function (error, result1) {
                            // console.log(result1);
                            let data = listElder(result1)
                            // console.log(data);
                            Meteor.call('listCpHistoryMulti', data, function (error, res) {

                                for (let i = 0; i < result1.length; i++) {
                                    res.push(result1[i])
                                }

                                var elder = listCareplan(res)
                                // console.log(elder);

                                Session.set('LISTELDERLY', elder)

                                setTimeout(function () {
                                    $('#showpic').css("height", $(document).height())
                                    $('#mytable').DataTable({
                                        // "ordering": false
                                        responsive: true,
                                        dom: '<"html5buttons"B>lTfgitp',
                                        lengthChange: false,
                                        "info": false,
                                        buttons: [{
                                            className: 'fa fa-file-excel-o',
                                            extend: 'excel',
                                            text: " ดาวน์โหลด",
                                            title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                            exportOptions: {
                                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                            },
                                            messageTop: null
                                        },
                                        {
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
                                            exportOptions: {
                                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                            }
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

                            //   var workplace = Session.get('getProfileCM')[0].HOSPCODE || Session.get('getProfileCM')[0].DLACODE

                        });

                    });
                    $('#changeComp').val(data[0].SWITCHING.code)

                }

            } else {
                var sedata = data[0].HOSPCODE ? data[0].HOSPCODE.CODE = data[0].HOSPCODE.CODE : data[0].DLACODE.CODE

                Meteor.call('LISTELDERLY', sedata, "01", function (error, result1) {

                    let data = listElder(result1)

                    Meteor.call('listCpHistoryMulti', data, function (error, res) {

                        for (let i = 0; i < result1.length; i++) {
                            res.push(result1[i])
                        }

                        var elder = listCareplan(res)
                        // console.log(elder);

                        Session.set('LISTELDERLY', elder)

                        setTimeout(function () {
                            $('#showpic').css("height", $(document).height())
                            $('#mytable').DataTable({
                                // "ordering": false
                                responsive: true,
                                dom: '<"html5buttons"B>lTfgitp',
                                lengthChange: false,
                                "info": false,
                                buttons: [{
                                    className: 'fa fa-file-excel-o',
                                    extend: 'excel',
                                    text: " ดาวน์โหลด",
                                    title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    },
                                    messageTop: null
                                },
                                {
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
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    }
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

                    //   var workplace = Session.get('getProfileCM')[0].HOSPCODE || Session.get('getProfileCM')[0].DLACODE

                });

            }
            //var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
            //console.log(service_center)

        }
    });

});

Template.elder.helpers({
    // checkcp() {
    //     // CHECKED_CAREPLAN

    //     Meteor.call('CHECKED_CAREPLAN', this.CID, function (err, res) {
    //         Session.set('CHECKED_CAREPLAN', res);
    //     })

    //     return Session.get('CHECKED_CAREPLAN').length == 0
    // },
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
        // console.log(Session.get('LISTELDERLY'))
        return Session.get('LISTELDERLY');
    },
    countElder() {
        if (Session.get('LISTELDERLY'))
            return Session.get('LISTELDERLY').length;
    },
    countAllElder() {
        if (Session.get('getProfileCM'))
            var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        Meteor.call('countAll_ELDER', service_center, function (err, result) {
            Session.set('_countAll_ELDER', result);
        })
        return Session.get('_countAll_ELDER');
    },
    countSumElder() {
        if (Session.get('_countAll_ELDER'))

            var obj = Session.get('_countAll_ELDER')
        const sum = obj.reduce((a, b) => +a + +b.numelder, 0);
        return sum
    },
    nameCen() {

        return Session.get('nameCen');
    },
    syncdate() {
        if (Session.get('LISTELDERLY')) {
            return Session.get('LISTELDERLY')[0].D_UPDATE;
        } else {
            return "-"
        }
    },
    backToElder_n() {
        if (Session.get('backToElder_n')) {
            return 'active'
        } else {
            return ''
        }
    },
    backToElder_r() {
        if (Session.get('backToElder_r')) {
            return 'active'
        } else {
            return ''
        }
    },
    isNHSO(a) {
        return !a
    },
    isTabNhso() {
        return Session.get('isNhsoElderTab')
    },
    TAI_G34() {
        return Session.get('TAI_G34')
    }
});

Template.elder.events({
    'click #iselder'() {
        Session.set('backToElder_r', true)
        Session.set('backToElder_n', false)
    },
    'click #isnhso'() {
        Session.set('backToElder_n', true)
        Session.set('backToElder_r', false)
    },
    'click li'(events) {
        Session.set('isNhsoElderTab', $(events.target).attr('href') == '#tab1primary' ? false : true)

    },
    'click #cdialog1'() {
        $.cookie('showDialog1', false);
    },
    'click #option'() {
        $("#myModal").modal("show");
    },
    'change #CID'(events) {
        Meteor.call('elderbycid', events.target.value, function (err, result) {

            Session.set('checkElderID', result)
        });

        Session.set('EPID', checkID($('#CID').val()));
    },
    'change #TAI'() {
        if ($('#TAI').val() == "I1" || $('#TAI').val() == "I2") {
            $('#GROUPID').val('4')
        } else if ($('#TAI').val() == "I3") {
            $('#GROUPID').val('3')
        } else if ($('#TAI').val() == "C2" || $('#TAI').val() == "C3" || $('#TAI').val() == "C4") {
            $('#GROUPID').val('2')
        } else {
            $('#GROUPID').val('1')
        }
    },
    'change #ADL'(events) {
        if (parseInt(events.target.value) >= 0 && parseInt(events.target.value) <= 4) {
            Session.set('TAI_G34', true)
        } else {
            Session.set('TAI_G34', false)
        }
    },
    'click #Esave'() {
        var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        var check_dup = Session.get('checkElderID') ? Session.get('checkElderID').length == 0 : Session.get('checkElderID');
        // && $("#VENDERCODE").val()
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
        //&& $("#PHONE").val() && $("#ADDRESS").val()
        $('body').prepend(elem);
        if (check_dup && checkID($('#CID').val()) && $("#NAME").val() && $("#LNAME").val() && $("#ADL").val() && $("#TAI").val() && $("#GROUPID").val() && $("#BIRTHDATE").val() && $('#privilege').val()) {
            var bdateString = $("#BIRTHDATE").val().split("/");
            var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0);

            Meteor.call('insertELDERLYREGISTER', $("#CID").val(), $("#PRENAME").val(), $("#NAME").val(), $("#LNAME").val(), Session.get('getProfileCM')[0], null, $("#ADL").val(), $("#TAI").val(), $("#GROUPID").val(), $("#PHONE").val(), $("#ADDRESS").val(), bdate, $('#privilege').val(), function (error, result) {
                toastr.success("บันทึกข้อมูลเรียบร้อย", "สำเร็จ");
                Session.set('EPID', null);
                Session.set('checkElderID', null)
                if (Session.get('getProfileCM')[0].HOSPCODE) {
                    Meteor.call('LISTELDERLY', service_center, "01", function (error, result) {
                        let data = listElder(result)

                        Meteor.call('listCpHistoryMulti', data, function (error, res) {

                            for (let i = 0; i < result.length; i++) {
                                res.push(result[i])
                            }

                            var elder = listCareplan(res)
                            // console.log(elder);

                            Session.set('LISTELDERLY', elder)
                            $('#mytable').DataTable().destroy();
                            setTimeout(function () {
                                $('#showpic').css("height", $(document).height())
                                $('#mytable').DataTable({
                                    // "ordering": false
                                    responsive: true,
                                    dom: '<"html5buttons"B>lTfgitp',
                                    lengthChange: false,
                                    "info": false,
                                    buttons: [{
                                        className: 'fa fa-file-excel-o',
                                        extend: 'excel',
                                        text: " ดาวน์โหลด",
                                        title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                        exportOptions: {
                                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                        },
                                        messageTop: null
                                    },
                                    {
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
                                        exportOptions: {
                                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                        }
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
                    })
                } else {
                    Meteor.call('LISTELDERLY', service_center, "01", function (error, result) {
                        let data = listElder(result)

                        Meteor.call('listCpHistoryMulti', data, function (error, res) {

                            for (let i = 0; i < result.length; i++) {
                                res.push(result[i])
                            }

                            var elder = listCareplan(res)
                            // console.log(elder);

                            Session.set('LISTELDERLY', elder)
                            $('#mytable').DataTable().destroy();
                            setTimeout(function () {
                                $('#showpic').css("height", $(document).height())
                                $('#mytable').DataTable({
                                    // "ordering": false
                                    responsive: true,
                                    dom: '<"html5buttons"B>lTfgitp',
                                    lengthChange: false,
                                    "info": false,
                                    buttons: [{
                                        className: 'fa fa-file-excel-o',
                                        extend: 'excel',
                                        text: " ดาวน์โหลด",
                                        title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                        exportOptions: {
                                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                        },
                                        messageTop: null
                                    },
                                    {
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
                                        exportOptions: {
                                            columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                        }
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
                    })
                }
                $('#myModal3').modal('hide');
                setTimeout(function () {
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }, 500)

            });

        } else {
            toastr.warning("เกิดข้อผิดพลาดกรุณาตรวจสอบอีกครั้ง", "ไม่สำเร็จ");
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        }
    },
    'click #remove'() {
        var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        console.log(service_center);
        console.log(this);

        if (confirm('ต้องการลบใช่หรือใหม่')) {

            Meteor.call('elderbyRemove', this.CID, function (error, result) {

                Meteor.call('LISTELDERLY', service_center, "01", function (error, result) {
                    let data = listElder(result)

                    Meteor.call('listCpHistoryMulti', data, function (error, res) {

                        for (let i = 0; i < result.length; i++) {
                            res.push(result[i])
                        }

                        var elder = listCareplan(res)

                        Session.set('LISTELDERLY', elder)

                        $('#mytable').DataTable().destroy();
                        setTimeout(function () {
                            $('#showpic').css("height", $(document).height())
                            $('#mytable').DataTable({
                                // "ordering": false
                                responsive: true,
                                dom: '<"html5buttons"B>lTfgitp',
                                lengthChange: false,
                                "info": false,
                                buttons: [{
                                    className: 'fa fa-file-excel-o',
                                    extend: 'excel',
                                    text: " ดาวน์โหลด",
                                    title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    },
                                    messageTop: null
                                },
                                {
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
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    }
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
                })
            })

        }

    },
    'click #edit'() {
        // console.log(this);

        Session.set('EPID', true);
        var dm = moment(this.BIRTHDATE).format('MM/DD/')
        var y = parseInt(moment(this.BIRTHDATE).format('YYYY')) + 543;
        Session.set('getEditVenderCode', this.VENDERCODE)
        Session.set('idElder', this.CID);
        Router.go('/editelder');
        // $('#myModal3').modal('show');
        // $("#ELDERLYID").val(this.ELDERLYID);
        // $("#CID").val(this.CID);
        // $("#PRENAME").val(this.PRENAME);
        // $("#NAME").val(this.NAME);
        // $("#LNAME").val(this.LNAME);
        // $("#HOSPCODE").val(this.HOSPCODE);
        // $("#VENDERCODE").val(this.VENDERCODE);
        // $("#ADL").val(this.ADL);
        // $("#TAI").val(this.TAI);
        // $("#GROUPID").val(this.GROUPID);
        // $("#PHONE").val(this.PHONE);
        // $("#ADDRESS").val(this.ADDRESS);
        // $("#BIRTHDATE").val(dm + y);

    },
    'click #add'() {
        $('#HOSPCODE').val(Session.get('getProfileCM')[0].HOSPCODE || Session.get('getProfileCM')[0].DLACODE);
        $('#myModal3').modal('show');

    },
    'click #tocp'() {
        Session.set('elderID', this);
        Router.go('/careplanhistory');
    },
    'change #statusElder'(events) {
        if (confirm("ท่านกำลังเปลี่ยนสถานะของ " + this.PRENAME + "" + this.NAME + " " + this.LNAME + " ต้องการดำเนินการต่อหรือไม่")) {
            let stat = event.target.value.toString()
            Meteor.call('updateStatusElder', this.CID, stat, function (error, result1) {
                var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
                Meteor.call('LISTELDERLY', service_center, "01", function (error, result1) {
                    let data = listElder(result1)

                    Meteor.call('listCpHistoryMulti', data, function (error, res) {

                        for (let i = 0; i < result1.length; i++) {
                            res.push(result1[i])
                        }

                        var elder = listCareplan(res)
                        // console.log(elder);

                        Session.set('LISTELDERLY', elder)
                        $('#mytable').DataTable().destroy();
                        setTimeout(function () {
                            $('#showpic').css("height", $(document).height())
                            $('#mytable').DataTable({
                                // "ordering": false
                                responsive: true,
                                dom: '<"html5buttons"B>lTfgitp',
                                lengthChange: false,
                                "info": false,
                                buttons: [{
                                    className: 'fa fa-file-excel-o',
                                    extend: 'excel',
                                    text: " ดาวน์โหลด",
                                    title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    },
                                    messageTop: null
                                },
                                {
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
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4, 5, 6, 7]
                                    }
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
                        toastr.success("แก้ไขข้อมูลสถานะผู้สูงอายุเรียบร้อย", "สำเร็จ");
                    });
                });
            });


        }
    }
});

function checkID(id) {
    if (id.length != 13) return false;
    for (i = 0, sum = 0; i < 12; i++)
        sum += parseFloat(id.charAt(i)) * (13 - i);
    if ((11 - sum % 11) % 10 != parseFloat(id.charAt(12)))
        return false;
    return true;
}

function listCareplan(x) {
    var output = []; //output array
    var temp = {}; //temp object

    for (var o of x) {
        if (Object.keys(temp).indexOf(o.CID) == -1) {
            temp[o.CID] = {}
            o.CAREPLANID ? temp[o.CID].CAREPLANID = o.CAREPLANID : temp[o.CID].CAREPLANID = ""
            o.PRENAME ? temp[o.CID].PRENAME = o.PRENAME : temp[o.CID].PRENAME = ""
            o.NAME ? temp[o.CID].NAME = o.NAME : temp[o.CID].NAME = ""
            o.LNAME ? temp[o.CID].LNAME = o.LNAME : temp[o.CID].LNAME = ""
            o.MAIN ? temp[o.CID].MAIN = o.MAIN : temp[o.CID].MAIN = ""
            o.HOSPCODE ? temp[o.CID].HOSPCODE = o.HOSPCODE : temp[o.CID].HOSPCODE = ""
            o.VENDERCODE ? temp[o.CID].VENDERCODE = o.VENDERCODE : temp[o.CID].VENDERCODE = ""
            o.ADL ? temp[o.CID].ADL = o.ADL : temp[o.CID].ADL = ""
            o.TAI ? temp[o.CID].TAI = o.TAI : temp[o.CID].TAI = ""
            o.GROUPID ? temp[o.CID].GROUPID = o.GROUPID : temp[o.CID].GROUPID = ""
            o.MAININSC ? temp[o.CID].MAININSC = o.MAININSC : temp[o.CID].MAININSC = ""
            o.CONFIRM ? temp[o.CID].CONFIRM = o.CONFIRM : temp[o.CID].CONFIRM = ""
            o.CREATEDATE ? temp[o.CID].CREATEDATE = o.CREATEDATE : temp[o.CID].CREATEDATE = ""
            o.D_UPDATE ? temp[o.CID].D_UPDATE = o.D_UPDATE : temp[o.CID].D_UPDATE = ""
            o.PHONE ? temp[o.CID].PHONE = o.PHONE : temp[o.CID].PHONE = ""
            o.ADDRESS ? temp[o.CID].ADDRESS = o.ADDRESS : temp[o.CID].ADDRESS = ""
            o.BIRTHDATE ? temp[o.CID].BIRTHDATE = o.BIRTHDATE : temp[o.CID].BIRTHDATE = ""
            o.STATUS ? temp[o.CID].STATUS = o.STATUS : temp[o.CID].STATUS = ""
            o.ZONE ? temp[o.CID].ZONE = o.ZONE : temp[o.CID].ZONE = ""
            o.BUDGETYEAR ? temp[o.CID].BUDGETYEAR = o.BUDGETYEAR : temp[o.CID].BUDGETYEAR = ""
            o.PRIVILEGE ? temp[o.CID].PRIVILEGE = o.PRIVILEGE : temp[o.CID].PRIVILEGE = ""
        } else {
            o.CAREPLANID ? temp[o.CID].CAREPLANID = temp[o.CID].CAREPLANID + o.CAREPLANID : temp[o.CID].CAREPLANID
            o.PRENAME ? temp[o.CID].PRENAME = temp[o.CID].PRENAME + o.PRENAME : temp[o.CID].PRENAME
            o.NAME ? temp[o.CID].NAME = temp[o.CID].NAME + o.NAME : temp[o.CID].NAME
            o.LNAME ? temp[o.CID].LNAME = temp[o.CID].LNAME + o.LNAME : temp[o.CID].LNAME
            o.MAIN ? temp[o.CID].MAIN = temp[o.CID].MAIN + o.MAIN : temp[o.CID].MAIN
            o.HOSPCODE ? temp[o.CID].HOSPCODE = o.HOSPCODE : temp[o.CID].HOSPCODE
            o.VENDERCODE ? temp[o.CID].VENDERCODE = o.VENDERCODE : temp[o.CID].VENDERCODE
            o.ADL ? temp[o.CID].ADL = o.ADL : temp[o.CID].ADL
            o.TAI ? temp[o.CID].TAI = o.TAI : temp[o.CID].TAI
            o.GROUPID ? temp[o.CID].GROUPID = o.GROUPID : temp[o.CID].GROUPID
            o.MAININSC ? temp[o.CID].MAININSC = o.MAININSC : temp[o.CID].MAININSC
            o.CONFIRM ? temp[o.CID].CONFIRM = o.CONFIRM : temp[o.CID].CONFIRM
            o.CREATEDATE ? temp[o.CID].CREATEDATE = o.CREATEDATE : temp[o.CID].CREATEDATE
            o.D_UPDATE ? temp[o.CID].D_UPDATE = o.D_UPDATE : temp[o.CID].D_UPDATE
            o.PHONE ? temp[o.CID].PHONE = o.PHONE : temp[o.CID].PHONE
            o.ADDRESS ? temp[o.CID].ADDRESS = o.ADDRESS : temp[o.CID].ADDRESS
            o.BIRTHDATE ? temp[o.CID].BIRTHDATE = o.BIRTHDATE : temp[o.CID].BIRTHDATE
            o.STATUS ? temp[o.CID].STATUS = o.STATUS : temp[o.CID].STATUS
            o.ZONE ? temp[o.CID].ZONE = o.ZONE : temp[o.CID].ZONE
            o.BUDGETYEAR ? temp[o.CID].BUDGETYEAR = o.BUDGETYEAR : temp[o.CID].BUDGETYEAR
            o.PRIVILEGE ? temp[o.CID].PRIVILEGE = o.PRIVILEGE : temp[o.CID].PRIVILEGE
        }
    }

    for (var key of Object.keys(temp)) {
        output.push({
            CAREPLANID: temp[key].CAREPLANID,
            CID: key,
            PRENAME: temp[key].PRENAME,
            NAME: temp[key].NAME,
            LNAME: temp[key].LNAME,
            MAIN: temp[key].MAIN,
            HOSPCODE: temp[key].HOSPCODE,
            VENDERCODE: temp[key].VENDERCODE,
            ADL: temp[key].ADL,
            TAI: temp[key].TAI,
            GROUPID: temp[key].GROUPID,
            MAININSC: temp[key].MAININSC,
            CONFIRM: temp[key].CONFIRM,
            CREATEDATE: temp[key].CREATEDATE,
            D_UPDATE: temp[key].D_UPDATE,
            PHONE: temp[key].PHONE,
            ADDRESS: temp[key].ADDRESS,
            BIRTHDATE: temp[key].BIRTHDATE,
            STATUS: temp[key].STATUS,
            ZONE: temp[key].ZONE,
            BUDGETYEAR: temp[key].BUDGETYEAR,
            PRIVILEGE: temp[key].PRIVILEGE
        })
    }
    return output;
}

function listElder(x) {
    var data = []
    for (let i = 0; i < x.length; i++) {
        const e = x[i];
        data.push(e.CID)
    }
    return data;
}