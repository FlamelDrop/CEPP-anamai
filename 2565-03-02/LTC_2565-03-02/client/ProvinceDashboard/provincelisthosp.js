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
Template.provincelisthosp.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.provincelisthosp.onRendered(function () {
    Session.set('zoneViewProfileCM', null)
    datatables(window, $);
    datatables_bs(window, $);
    // datatables_buttons(window, $);
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
    refreshfunc(Session.get('user').PROVINCENAME)

});

Template.provincelisthosp.helpers({
    user() {
        return Session.get('user').NAME
    },
    list() {
        //console.log(Session.get('provincelisthosp'))
        return Session.get('provincelisthosp')
    },
    count() {
        if (Session.get('provincelisthosp')) {
            return Session.get('provincelisthosp').length;
        }
    },
    profile() {
        if (Session.get('provinceListViewProfileCM')) {
            return Session.get('provinceListViewProfileCM')[0];
        }
    },
    listCompany() {
        if (Session.get('getListSecondaryHosp')) {
            return Session.get('getListSecondaryHosp')
        }
    }
})

Template.provincelisthosp.events({
    'click #cancel'() {
        var arr = Session.get('getListSecondaryHosp')
        if (arr.length != 0) {
            for (var i = 0; i < arr.length; i++) {
                if (JSON.stringify(this) == JSON.stringify(arr[i])) {
                    arr[i].approve = '2'
                    arr[i].approveAt = new Date()
                }
            }
            Session.set('getListSecondaryHosp', arr)
        }
        // toastr.warning("ไม่อนุมัติเรียบร้อย", "สำเร็จ");
    },
    'click #check'() {

        var arr = Session.get('getListSecondaryHosp')
        if (arr.length != 0) {
            for (var i = 0; i < arr.length; i++) {
                if (JSON.stringify(this) == JSON.stringify(arr[i])) {
                    arr[i].approve = '1'
                    arr[i].approveAt = new Date()
                }
            }
            Session.set('getListSecondaryHosp', arr)
        }
        // Session.set('invokeHelpers', Math.random())
        // Meteor.call('getZonelistApproveCM', Session.get('user').PROVINCENAME, function (error, result) {
        //     Session.set('provincelisthosp', result)
        // });
        //  toastr.success("อนุมัติเรียบร้อย", "สำเร็จ");

    },
    'change .remark'() {
        var arr = Session.get('getListSecondaryHosp')
        var fullcode = this.CODE;
        var text = $('#remark_' + fullcode).val();
        if (arr.length != 0) {
            for (var i = 0; i < arr.length; i++) {
                if (JSON.stringify(this) == JSON.stringify(arr[i])) {
                    arr[i].remark = text

                }
            }
            Session.set('getListSecondaryHosp', arr)
        }
    },
    'click #remove'() {
        if (confirm('ต้องการลบข้อมูลหรือไม่')) {
            const sw = { status: false, code: "" }
            const comp = []
            Meteor.call('removeSecondaryHosp', this._id, comp, sw, function (err, res) {
                if (err) throw err;
                toastr.success("บึนทึกสำเร็จ");
                $('#mytable').DataTable().destroy();
                refreshfunc(Session.get('user').PROVINCENAME)
                $('#listapprove').modal('hide');
            })
        }

    },
    'click #save'() {

        if (Session.get('provinceListViewProfileCM')) {
            var idcm = Session.get('provinceListViewProfileCM')[0]._id
            var comp = Session.get('getListSecondaryHosp')
            sw = { status: false, code: "" }
            // Meteor.call('removeSecondaryHosp', idcm, sw, function (err, result) {
            //     if (err) throw err;
            // })
            Meteor.call('removeSecondaryHosp', idcm, comp, sw, function (err, res) {
                if (err) throw err;
                toastr.success("บึนทึกสำเร็จ");
                $('#mytable').DataTable().destroy();
                refreshfunc(Session.get('user').PROVINCENAME)
                $('#listapprove').modal('hide');
            })

        } else {
            toastr.error('เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง')
        }

    },
    'click #approveall'() {

        var arr = Session.get('getListSecondaryHosp')
        if (arr.length != 0) {
            _.each(arr, function (x) {
                x.approve = '1'
                x.approveAt = new Date()
            })
            Session.set('getListSecondaryHosp', arr)
        }

    },
    'click #rejectall'() {

        var arr = Session.get('getListSecondaryHosp')
        if (arr.length != 0) {
            _.each(arr, function (x) {
                x.approve = '2'
                x.approveAt = new Date()
            })
            Session.set('getListSecondaryHosp', arr)
        }

    },
    "click #viewcm"() {
        var cid = this._id
        Meteor.call('getLoginUserCM', cid, function (error, result) {
            Session.set('provinceListViewProfileCM', result);

        });
    },
    "click #approve"() {
        var cid = this._id
        Meteor.call('getLoginUserCM', cid, function (error, result) {
            Session.set('getListSecondaryHosp', result[0].SECONDARY_COMP);
            Session.set('provinceListViewProfileCM', result);

        });
    },
    "click #printcm"() {
        if (Session.get('provinceListViewProfileCM')) {
            Session.set('zoneViewProfileCM', Session.get('provinceListViewProfileCM'))
            $('#cmprofile').modal('hide');
            setTimeout(() => {
                Router.go('/printprofilecm')
            }, 1000);
        } else {
            toastr.error("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง", "ไม่สำเร็จ");
        }
    },
})


function refreshfunc(ZONE) {
    Meteor.call('getProvinceListSecondaryHosp', ZONE, function (error, result) {

        Session.set('provincelisthosp', result)
        setTimeout(function () {
            $('#mytable').DataTable({

                "ordering": false,
                dom: 'lTfgitp',
                lengthChange: false,
                "info": false,
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