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
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
Template.approvecg.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.approvecg.onRendered(function () {
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
    Meteor.call('getlistcgapprove', Session.get('user').PROVINCENAME, function (error, result) {
        Session.set('getlistcgapprove', result)
        setTimeout(function () {
            $('#mytable').DataTable({
                "ordering": false,
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
                    extend: 'excel',
                    className: 'fa fa-file-excel-o',
                    text: " ดาวน์โหลด",
                    title: "รายชื่้อ CG รออนุมัติจังหวัด" + Session.get('user').PROVINCENAME + "" + moment().format('DD-MM-YY') + "",
                    exportOptions: { 
                        columns: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 23, 24, 25]
                    },
                    messageTop: null
                },
                {
                    extend: 'print',
                    className: 'fa fa-print',
                    text: " พิมพ์",
                    title: "",
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
        }, 500)

    });
});

Template.approvecg.helpers({
    user() {
        return Session.get('user').PROVINCENAME
    },
    list() {

        return Session.get('getlistcgapprove')
    },
    count() {
        return Session.get('getlistcgapprove').length;
    },
    profilecg() {
        if (Session.get('provinceSelectedCG')) {
            return Session.get('provinceSelectedCG')[0];
        }
    },
})

Template.approvecg.events({
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
    'click #cancel'() {
        var r = confirm("ต้องการลบข้อมูล " + this.PRENAME + this.NAME + " " + this.LNAME + " หรือไม่");
        if (r == true) {
            CG_REGISTER.remove({
                _id: this._id
            });
            toastr.warning("ลบข้อมูล " + this.PRENAME + this.NAME + " " + this.LNAME + " เรียบร้อย", "สำเร็จ");
            Meteor.call('getlistcgapprove', Session.get('user').PROVINCENAME, function (error, result) {
                Session.set('getlistcgapprove', result)
            });
        }

    },
    'click #check'() {
        Session.set('getProinceNameByCode', this)
        CG_REGISTER.update({
            "_id": this._id
        }, {
                $set: {
                    confirm: true
                }
            });
        toastr.success("ยืนยัน " + Session.get('getProinceNameByCode').PRENAME + Session.get('getProinceNameByCode').NAME + " " + Session.get('getProinceNameByCode').LNAME + " เรียบร้อย", "สำเร็จ");
        Meteor.call('getlistcgapprove', Session.get('user').PROVINCENAME, function (error, result) {
            Session.set('getlistcgapprove', result)
        });


    },
})