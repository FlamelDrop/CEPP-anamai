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
import { log } from 'util';
Template.hpcapprovecm.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.hpcapprovecmex.onRendered(function() {
    Session.set('zoneViewProfileCM', null)
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

    $("#dateex").datetimepicker({
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

    $("#dateexall").datetimepicker({
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


    Session.set('personEX', null);
    Session.set('zoneselect', null);
    Session.set('provinceselect', null);
    Session.set('amphoeselect', null);
    Session.set('getZonelistApproveCMex', null)
    Session.set("specialisation", null)
    $('#yearselect').val(new Date().getFullYear() + 543)

    // console.log($('#yearselect').val(), Session.get('user').ZONE);
    Meteor.call('getZonelistApproveCMex', parseInt($('#yearselect').val()) - 543, Session.get('user').ZONE.toString(), function(error, result) {
        // console.log(result);
        Session.set('getZonelistApproveCMex', result)
        reloadmytable();
    });
    Meteor.call('getAllProvinceByZoneReport', Session.get('user').ZONE, function(error, success) {
        if (error) {
            console.log('error', error);
        }
        if (success) {
            var xx = [];
            for (let index = 0; index < success.length; index++) {
                xx.push({ province: success[index]._id.province })
            }
            Session.set('zoneselect', xx);

        }
    });

});

Template.hpcapprovecmex.helpers({
    user() {
        return Session.get('user').NAME
    },
    list() {
        return Session.get('getZonelistApproveCMex')
    },
    count() {
        if (Session.get('getZonelistApproveCMex')) {
            return Session.get('getZonelistApproveCMex').length;
        }
    },
    profile() {
        if (Session.get('zoneApproveViewProfileCM')) {
            return Session.get('zoneApproveViewProfileCM')[0];
        }
    },
    listprovince() {
        return Session.get('zoneselect')
    },
    listamphoe() {
        return Session.get('provinceselect')
    },
    listdistric() {
        return Session.get('amphoeselect')
    },
    personEX() {
        return Session.get('personEX')
    },
    specialisationcount() {
        if (Session.get('specialisation')) {
            return Session.get('specialisation').length;
        }
    },
})

Template.hpcapprovecmex.events({
    'change #yearselect' () {
        // $('#mytable').DataTable().destroy();
    },
    // 'click #reload' () {

    //     Meteor.call('getZonelistApproveCMex', Session.get('user').ZONE, $('#yearselect').val(), function(error, result) {
    //         Session.set('getZonelistCMapprove', result)
    //         reloadmytable();
    //     });
    // },
    "click #viewcm" () {
        var cid = this._id
        Meteor.call('getLoginUserCM', cid, function(error, result) {
            Session.set('zoneApproveViewProfileCM', result);
            // reloadmytable();

        });
    },
    "click #printcm" () {
        if (Session.get('zoneApproveViewProfileCM')) {
            Session.set('zoneViewProfileCM', Session.get('zoneApproveViewProfileCM'))
            $('#cmprofile').modal('hide');
            setTimeout(() => {
                Router.go('/printprofilecm')
            }, 500);
        } else {
            toastr.error("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", "ไม่สำเร็จ");
        }
    },
    'change #provinceselect' () {
        Session.set('provinceselect', null);
        Session.set('amphoeselect', null);
        Meteor.call('getAllAmphoeByProvinceReport', $('#provinceselect').val(), function(error, success) {
            if (error) {
                console.log('error', error);
            }
            if (success) {
                var xx = [];
                for (let index = 0; index < success.length; index++) {
                    xx.push({ amphoe: success[index]._id.amphoe })
                }
                Session.set('provinceselect', xx);
            }
        });
    },
    'change #amphoeselect' () {
        Session.set('amphoeselect', null);
        Meteor.call('getAllDistrictByAmphoeReport', $('#amphoeselect').val(), function(error, success) {
            if (error) {
                console.log('error', error);
            }
            if (success) {
                var xx = [];
                for (let index = 0; index < success.length; index++) {
                    xx.push({ district: success[index]._id.district })
                }
                Session.set('amphoeselect', xx);
            }
        });
    },
    "click #find" () {
        $('#mytable').DataTable().destroy();
        var year = parseInt($('#yearselect').val()) - 543;
        var zone = Session.get('user').ZONE
        var province = $('#provinceselect').val()
        var amphoe = $('#amphoeselect').val()
        var tambon = $('#districtselect').val()
        Meteor.call('getZonelistApproveCMex', year, zone, province, amphoe, tambon, function(error, success) {
            if (error) {
                console.log('error', error);
            }
            if (success) {
                Session.set('getZonelistApproveCMex', success)
                reloadmytable();
            }
        });
    },
    "click #EX" () {

        $('#myModalEX').modal('show');
    },
    "click #list" () {
        Session.set('personEX', this);
    },
    "click #save" () {
        var bdateString = $("#dateex").val().split("/");
        if (bdateString[0] != "__") {
            var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
            var edate = new Date(parseInt(bdateString[2] - 539), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
            CM_REGISTER.update({
                _id: Session.get('personEX')._id
            }, {
                $set: {
                    "EXPIREDATE": edate,
                    "D_UPDATE": new Date()
                },
                $push: {
                    "EXPIREDATEHISTORY": {
                        "DATE": bdate,
                        "TRAINING_CENTER_ID": $('#trainingBy').val()
                    }
                }
            })
            $('#mytable').DataTable().destroy();
            var year = parseInt($('#yearselect').val()) - 543;
            var zone = Session.get('user').ZONE
            var province = $('#provinceselect').val()
            var amphoe = $('#amphoeselect').val()
            var tambon = $('#districtselect').val()
            Meteor.call('getZonelistApproveCMex', year, zone, province, amphoe, tambon, function(error, success) {
                if (error) {
                    console.log('error', error);
                }
                if (success) {
                    Session.set('getZonelistApproveCMex', success)
                    reloadmytable();
                    $('#myModalEX').modal('hide');
                }
            });
        }
        // console.log($('#dateex').val(), $('#trainingBy').val());


    },
    "click #confirmall" () {
        var bdateString = $("#dateexall").val().split("/");
        var specialisation = Session.get('specialisation');
        if (specialisation) {
            if (bdateString[0] != "__") {
                var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
                var edate = new Date(parseInt(bdateString[2] - 539), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
                var list = Session.get('specialisation');
                for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    CM_REGISTER.update({
                        _id: element
                    }, {
                        $set: {
                            "EXPIREDATE": edate,
                            "D_UPDATE": new Date()
                        },
                        $push: {
                            "EXPIREDATEHISTORY": {
                                "DATE": bdate,
                                "TRAINING_CENTER_ID": $('#trainingByall').val()
                            }
                        }
                    })

                }
                $('#mytable').DataTable().destroy();
                var year = parseInt($('#yearselect').val()) - 543;
                var zone = Session.get('user').ZONE
                var province = $('#provinceselect').val()
                var amphoe = $('#amphoeselect').val()
                var tambon = $('#districtselect').val()
                Meteor.call('getZonelistApproveCMex', year, zone, province, amphoe, tambon, function(error, success) {
                    if (error) {
                        console.log('error', error);
                    }
                    if (success) {
                        Session.set('getZonelistApproveCMex', success)
                        $('#myModalallconfirm').modal('hide');
                        Session.set("specialisation", null)
                        reloadmytable();
                        Session.set("specialisation", null);
                    }
                });
            }
        } else {
            alert("เลือก CM อย่างน้อย 1 รายการ")
        }

    },
    'change [name="specialisation"]': function(event, template) {
        let specialisation = $('input[name="specialisation"]:checked').map(function() {
            return $(this).val();
        }).get();
        Session.set("specialisation", specialisation);
    },
    'change [name="slectall"]': function(event, template) {
        var check = $('input[name="slectall"]').prop("checked");
        if (check) {
            $('input[name="specialisation"]').prop('checked', true);
            let specialisation = $('input[name="specialisation"]:checked').map(function() {
                return $(this).val();
            }).get();
            Session.set("specialisation", specialisation);
        } else {
            $('input[name="specialisation"]').prop('checked', false);
            Session.set("specialisation", null);
        }
    },
})

function reloadmytable() {
    setTimeout(function() {
        $('#mytable').DataTable({
            "ordering": false,
            dom: '<"html5buttons"B>lTfgitp',
            lengthChange: false,
            "info": false,
            columnDefs: [{
                "targets": [1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23],
                "visible": false,
            }],
            buttons: [{
                    className: 'fa fa-file-excel-o',
                    extend: 'excel',
                    text: " ดาวน์โหลด",
                    title: "รายชื่่อ CM รอนุมัติเขต" + Session.get('user').ZONE + "_" + moment().format('DD-MM-YY') + "",
                    exportOptions: {
                        columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
                    },
                    messageTop: null
                },
                {
                    className: 'fa fa-print',
                    text: " พิมพ์",
                    title: "",
                    extend: 'print',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
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
    }, 100)
}