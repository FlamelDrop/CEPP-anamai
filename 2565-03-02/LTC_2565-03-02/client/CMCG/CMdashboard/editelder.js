// client\CMCG\CMdashboard\editelder.js
Template.editelder.onCreated(function () {
    $('body').addClass('waitMe_body');
    var elem = $(
        '<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>'
    );
    $('body').prepend(elem);
});

Template.editelder.onRendered(function () {
    $('#privilege').selectize({
        plugins: ['remove_button'],
        delimiter: ',',
        create: function (input) {
            return { value: input, text: input };
        },
        persist: false,
        sortField: 'text',
    });
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        onclick: null,
        showDuration: '300',
        hideDuration: '1000',
        timeOut: '5000',
        extendedTimeOut: '1000',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
    };
    $('#BIRTHDATE').datetimepicker({
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

    console.log(Session.get('idElder'));

    if (Session.get('idElder')) {
        Meteor.call(
            'elderby_cid',
            Session.get('idElder'),
            function (err, result) {
                console.log(result);

                if (result) {
                    Session.set('elderDataByCid', result[0]);
                    Session.set('getEditVenderCode', result[0].VENDERCODE);
                    var dm = moment(result[0].BIRTHDATE).format('MM/DD/');
                    var y =
                        parseInt(moment(result[0].BIRTHDATE).format('YYYY')) +
                        543;
                    $('#CID').val(result[0].CID);
                    $('#PRENAME').val(result[0].PRENAME);
                    $('#NAME').val(result[0].NAME);
                    $('#LNAME').val(result[0].LNAME);
                    $('#HOSPCODE').val(result[0].HOSPCODE);
                    $('#ADL').val(result[0].ADL);
                    $('#TAI').val(result[0].TAI);
                    $('#GROUPID').val(result[0].GROUPID);
                    $('#PHONE').val(result[0].PHONE);
                    $('#ADDRESS').val(result[0].ADDRESS);
                    $('#BIRTHDATE').val(dm + y);
                    var selectField = $('#privilege')[0].selectize;
                    selectField.addItem(result[0].PRIVILEGE, true);
                }
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body')
                    .find('.waitMe_container:not([data-waitme_id])')
                    .remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            }
        );
        //    if(result[0]){

        //    }
    } else {
    }
});

Template.editelder.helpers({
    showname() {
        if (Session.get('getEditVenderCode')) {
            Meteor.call('listVenderCode', function (error, result) {
                // $('#VENDERCODE')[0].selectize.destroy()
                $('#VENDERCODE').selectize({ options: result, create: false });
                var $select = $('#VENDERCODE').selectize();
                var selectize = $select[0].selectize;
                selectize.setValue(
                    selectize
                        .search(Session.get('getEditVenderCode'))
                        .query.toUpperCase()
                );
            });
        }
        return Session.get('cmname');
    },
});

Template.editelder.events({
    'click #save'() {
        //&& $("#VENDERCODE").val()
        if (
            $('#NAME').val() &&
            $('#LNAME').val() &&
            $('#ADL').val() &&
            $('#TAI').val() &&
            $('#GROUPID').val() &&
            $('#PHONE').val() &&
            $('#ADDRESS').val() &&
            $('#BIRTHDATE').val()
        ) {
            var bdateString = $('#BIRTHDATE').val().split('/');
            var bdate = new Date(
                parseInt(bdateString[2] - 543),
                parseInt(bdateString[1] - 1),
                parseInt(bdateString[0]),
                0,
                0,
                0,
                0
            );
            let data = {
                CID: $('#CID').val(),
                PRENAME: $('#PRENAME').val(),
                NAME: $('#NAME').val(),
                LNAME: $('#LNAME').val(),
                VENDERCODE: $('#VENDERCODE').val(),
                ADL: $('#ADL').val(),
                TAI: $('#TAI').val(),
                GROUPID: $('#GROUPID').val(),
                D_UPDATE: new Date(),
                PHONE: $('#PHONE').val(),
                ADDRESS: $('#ADDRESS').val(),
                BIRTHDATE: bdate,
                PRIVILEGE: $('#privilege').val(),
            };
            Meteor.call(
                'upDateELDERLYREGISTER_v2',
                data,
                function (error, result) {
                    toastr.success('บันทึกข้อมูลเรียบร้อย', 'สำเร็จ');
                    $('#myModal3').modal('hide');
                    Session.set('EPID', null);
                    Session.set('checkElderID', null);
                    Router.go('/CMdashboard');
                }
            );
        } else {
            toastr.warning('กรุณากรอกข้อมูลให้ครบถ้วน', 'ไม่สำเร็จ');
        }
    },
    'change #TAI'() {
        if ($('#TAI').val() == 'I1' || $('#TAI').val() == 'I2') {
            $('#GROUPID').val('4');
        } else if ($('#TAI').val() == 'I3') {
            $('#GROUPID').val('3');
        } else if (
            $('#TAI').val() == 'C2' ||
            $('#TAI').val() == 'C3' ||
            $('#TAI').val() == 'C4'
        ) {
            $('#GROUPID').val('2');
        } else {
            $('#GROUPID').val('1');
        }
    },
});
