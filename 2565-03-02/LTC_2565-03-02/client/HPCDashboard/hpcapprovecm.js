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
Template.hpcapprovecm.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.hpcapprovecm.onRendered(function() {
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
    Meteor.call('getZonelistApproveCM', Session.get('user').ZONE, function(error, result) {
        Session.set('getZonelistCMapprove', result)
        setTimeout(function() {
            $('#mytable').DataTable({

                "ordering": false,
                dom: '<"html5buttons"B>lTfgitp',
                lengthChange: false,
                "info": false,
                columnDefs: [{
                        "targets": [1, 2, 3, 5, 6, 7, 9, 11, 16, 14, 18, 19, 20, 21, 22, 23],
                        "visible": false,
                    },
                    {
                        "targets": [7, 18],
                        "searchable": false
                    }
                ],
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
        }, 500)

    });
});

Template.hpcapprovecm.helpers({
    user() {
        return Session.get('user').NAME
    },
    list() {
        return Session.get('getZonelistCMapprove')
    },
    count() {
        if (Session.get('getZonelistCMapprove')) {
            return Session.get('getZonelistCMapprove').length;
        }
    },
    profile() {
        if (Session.get('zoneApproveViewProfileCM')) {
            return Session.get('zoneApproveViewProfileCM')[0];
        }
    }
})

Template.hpcapprovecm.events({
    'click #cancel' () {
        var r = confirm("ต้องการลบข้อมูล " + this.PRENAME + this.NAME + " " + this.LNAME + " หรือไม่");
        if (r == true) {
            CM_REGISTER.remove({
                _id: this._id
            });
            toastr.warning("ลบข้อมูล " + this.PRENAME + this.NAME + " " + this.LNAME + " เรียบร้อย", "สำเร็จ");
            Session.set('invokeHelpers', Math.random())
            Meteor.call('getZonelistApproveCM', Session.get('user').ZONE, function(error, result) {
                Session.set('getZonelistCMapprove', result)
            });

        }

    },
    'click #check' () {
        Session.set('getZoneNameByCode', this)
        CM_REGISTER.update({
            "_id": this._id
        }, {
            $set: {
                confirm: true
            }
        });
        toastr.success("ยืนยัน " + this.PRENAME + this.NAME + " " + this.LNAME + " เรียบร้อย", "สำเร็จ");
        Meteor.call('sendApproveCM', this.NAME + " " + this.LNAME, this.CID, "", this.EMAIL, function(error, result) {

        });
        Meteor.call('getZonelistApproveCM', Session.get('user').ZONE, function(error, result) {
            Session.set('getZonelistCMapprove', result)
        });


    },
    'click #reload' () {
        Meteor.call('getZonelistApproveCM', Session.get('user').ZONE, function(error, result) {
            Session.set('getZonelistCMapprove', result)
        });
    },
    "click #viewcm" () {
        var cid = this._id
        Meteor.call('getLoginUserCM', cid, function(error, result) {
            Session.set('zoneApproveViewProfileCM', result);

        });
    },
    "click #printcm" () {
        if (Session.get('zoneApproveViewProfileCM')) {
            Session.set('zoneViewProfileCM', Session.get('zoneApproveViewProfileCM'))
            $('#cmprofile').modal('hide');
            setTimeout(() => {
                Router.go('/printprofilecm')
            }, 1000);
        } else {
            toastr.error("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", "ไม่สำเร็จ");
        }
    },
})