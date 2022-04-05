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

Template.tab2_CGdashboard.onRendered(function () {
    $('#kkk').show();
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts);
    dt_print(window, $);
    var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
    Meteor.call('getALLCGByHOSP', service_center, function (err, result) {
        Session.set('cmSelectedCG', result);
        setTimeout(function () {
            $('#mytableCG').DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                lengthChange: false,
                "info": false,
                columnDefs: [
                    {
                        "targets": [1, 2, 3, 5, 6, 7, 9, 10, 12, 13, 14, 16, 18, 19, 22, 23, 24, 25],
                        "visible": false,

                    },
                    {
                        "targets": [7, 19], "searchable": false
                    }
                ],
                buttons: [{
                    className: 'fa fa-file-excel-o',
                    extend: 'excel',
                    text: " ดาวน์โหลด",
                    title: "รายชื่้อ Caregiver" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                    exportOptions: {
                        columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 24, 25]
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
                        columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 24, 25]
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
        }, 1000)

    });

})

Template.tab2_CGdashboard.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
});

Template.tab2_CGdashboard.helpers({
    listCG() {
        if (Session.get('cmSelectedCG')) {
            return Session.get('cmSelectedCG');

        }
    },
    ownCG() {
        if (Session.get('cmSelectedCG')) {
            return Session.get('cmSelectedCG').length
        }
    },
    inactiveCG() {
        var data = []
        if (Session.get('cmSelectedCG')) {
            _.each(Session.get('cmSelectedCG'), function (x) {
                if (x.STATE_ACTIVE == "02") {
                    data.push(x)
                }
            })
            return data.length
        }
    },
    profilecg() {
        if (Session.get('ShowcmSelectedCG')) {
            return Session.get('ShowcmSelectedCG')[0];
        }
    },
    activeCG() {
        var data = []
        if (Session.get('cmSelectedCG')) {
            _.each(Session.get('cmSelectedCG'), function (x) {
                if (x.STATE_ACTIVE == "01") {
                    data.push(x)
                }
            })
            return data.length
        }
    },
    expireCG() {
        var data = []
        if (Session.get('cmSelectedCG')) {
            _.each(Session.get('cmSelectedCG'), function (x) {
                if (x.STATE_ACTIVE == "03") {
                    data.push(x)
                }
            })
            return data.length
        }
    },
    deathCG() {
        var data = []
        if (Session.get('cmSelectedCG')) {
            _.each(Session.get('cmSelectedCG'), function (x) {
                if (x.STATE_ACTIVE == "04") {
                    data.push(x)
                }
            })
            return data.length
        }
    },
})

Template.tab2_CGdashboard.events({
    "click #showcmd"() {
        var cid = this.CID
        Meteor.call('getEachCGByHOSP', cid, function (error, result) {
            Session.set('ShowcmSelectedCG', result);

        });
    },
    "click #printcg"() {
        if (Session.get('ShowcmSelectedCG')) {
            $('#cgprofile').modal('hide');
            setTimeout(() => {
                Router.go('/printprofilecg')
            }, 1000);

        } else {
            toastr.error("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", "ไม่สำเร็จ");
        }
    },
    "change #subdistrict_name"() {
        Session.set('districtNameWorkCG', $('#subdistrict_name').val())
    },
    "change #district_name"() {
        Meteor.call('getRegSubsistrict_name', $('#district_name').val(), function (error, result) {
            $('#subdistrict_name')[0].selectize.destroy()
            $('#subdistrict_name').selectize({ options: result, create: false });

        });
    },
    "change #province_name"() {
        Meteor.call('getRegDistrict_name', $('#province_name').val(), function (error, result) {
            $('#district_name')[0].selectize.destroy()
            $('#district_name').selectize({ options: result, create: false });

        });
    },
    "click #editcg"() {
        Router.go('/cmeditcg')
        Session.set('CMEditedDetailCG', this);
        // $('#myModal').modal();
        // Session.set('edittambonCG', this)
        // Session.set('districtNameWorkCG', null)
    },
    "click #saveTambon"() {
        if (Session.get('districtNameWorkCG')) {
            CG_REGISTER.update({
                "_id": Session.get('edittambonCG')._id
            }, {
                    $set: {
                        "TAMBON": Session.get('districtNameWorkCG'),
                        "D_UPDATE": new Date()
                    }
                });
            var tambon = Session.get('getProfileCM')[0].TAMBON
            Meteor.call('getCGlistStateAll', tambon, function (err, result) {
                Session.set('cmSelectedCG', result);
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
            $('#myModal').modal('hide');
            toastr.error("โปรดเลือดตำบลใหม่อีกครัครั้ง", "ไม่สำเร็จ");
        }
    },
    "click #editstate"() {
        $('#myModal2').modal();
        Session.set('editstateCG', this);
    },
    "click #saveState"() {
        CG_REGISTER.update({
            "_id": Session.get('editstateCG')._id
        }, {
                $set: {
                    "STATE_ACTIVE": $('#stateActive').val(),
                    "D_UPDATE": new Date()
                }
            });
        var tambon = Session.get('getProfileCM')[0].HOSPCODE
        Meteor.call('getALLCGByHOSP', tambon, function (error, result) {
            Session.set('cmSelectedCG', result)
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

    },
    
})