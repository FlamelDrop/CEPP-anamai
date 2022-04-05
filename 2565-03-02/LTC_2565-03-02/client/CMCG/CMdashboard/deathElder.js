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

Template.deathElder.onCreated(function helloOnCreated() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
});
Template.deathElder.onRendered(function helloOnCreated() {
    $('#kkk').show();
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts);
    dt_print(window, $);
    var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
    Meteor.call('LISTELDERLY_DEATH', service_center, "03", function (error, result1) {
        Session.set('LISTDEATHELDER', result1);
        setTimeout(function () {
            $('#showpic').css("height", $(document).height())
            $('#mytable').DataTable({
                // "ordering": false
                dom: '<"html5buttons"B>lTfgitp',
                lengthChange: false,
                "info": false,
                buttons: [{
                    className: 'fa fa-file-excel-o',
                    extend: 'excel',
                    text: " ดาวน์โหลด",
                    title: "รายชื่้อผู้สูงอายุ" + " (ข้อมูลวันที่ " + moment().format('DD-MM-YY') + ")",
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
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
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
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

        //   var workplace = Session.get('getProfileCM')[0].HOSPCODE || Session.get('getProfileCM')[0].DLACODE

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

});
Template.deathElder.helpers({
    profile() {

        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }
    },
    listelder() {
        return Session.get('LISTDEATHELDER');
    },
    nameCen() {

        return Session.get('nameCen');
    },
    coutElder() {
        return Session.get('LISTDEATHELDER') ? Session.get('LISTDEATHELDER').length : 0;
    }
});

Template.deathElder.events({

    'click #remove'() {
        if (confirm('ต้องการลบใช่หรือใหม่')) {
            ELDERLYREGISTER.remove({
                _id: this._id
            })
            if (Session.get('getProfileCM')[0].HOSPCODE) {
                Meteor.call('LISTELDERLY_DEATH', Session.get('getProfileCM')[0].HOSPCODE.CODE, function (error, result) {
                    Session.set('LISTDEATHELDER', result);
                })
            } else {
                Meteor.call('LISTELDERLY_DEATH', Session.get('getProfileCM')[0].DLACODE.CODE, function (error, result) {
                    Session.set('LISTDEATHELDER', result);
                })
            }
        }

    },
    'click #edit'() {
        Session.set('EPID', true);
        var dm = moment(this.BIRTHDATE).format('MM/DD/')
        var y = parseInt(moment(this.BIRTHDATE).format('YYYY')) + 543;
        Session.set('getEditVenderCode', this.VENDERCODE)
        Session.set('idElder', this._id);
        Router.go('/editelder');

    },
    'click #tocp'() {
        Session.set('elderID', this);
        Router.go('/careplanhistory');
    },
    'change #statusElder'(events) {
        if (confirm("ท่านกำลังเปลี่ยนสถานะของ " + this.PRENAME + "" + this.NAME + " " + this.LNAME + " ต้องการดำเนินการต่อหรือไม่")) {

            // ELDERLYREGISTER.update({
            //     "_id": this._id
            // }, {
            //         $set: {
            //             STATUS: event.target.value.toString(),
            //         }

            //     })
            let stat = event.target.value.toString()
            Meteor.call('updateStatusElder', this.CID, stat, function (error, result1) {
                var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
                Meteor.call('LISTELDERLY_DEATH', service_center, "03", function (error, result1) {
                    Session.set('LISTDEATHELDER', result1);
                });
                toastr.success("แก้ไขข้อมูลสถานะผู้สูงอายุเรียบร้อย", "สำเร็จ");
            });
        }
    }
});
