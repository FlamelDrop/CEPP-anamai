Template.simplecareplan.onRendered(function () {
    $('#cpdate').datetimepicker({
        timepicker: false,
        format: 'd/m/Y', // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000
        lang: 'th', // แสดงภาษาไทย
        mask: true,
        onChangeMonth: thaiYear,
        yearStart: 1800,
        onShow: thaiYear,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });
    var dm = moment().format('DD/MM/');
    var y = parseInt(moment().format('YYYY')) + 543;
    $('#cpdate').val(dm + y);

    if (Session.get('datacpElder').hasOwnProperty('checkEdit')) {
        if (Session.get('datacpElder')) {
            $('body').addClass('waitMe_body');
            var elem = $(
                '<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>'
            );
            $('body').prepend(elem);

            setTimeout(() => {
                var cpData = Session.get('datacpElder');
                var sz_option = {
                    plugins: ['remove_button'],
                    delimiter: ',',
                    persist: false,
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text',
                };
                $('#ADL').val(cpData.ADL);
                $('#TAI').val(cpData.TAI);
                $('#adlgroup').val(cpData.GRUOP);
                $('#healelder').val(cpData.HEALTH);
                $('#moneysubport').val(cpData.RERHEADPAY);
                $('#shortProblem').val(cpData.SHOTTERMNEED);
                $('#numtarget').val(cpData.SHOTTERMNEEDNUM);
                $('#tpyetarget').val(cpData.SHOTTERMNEEDDATE);
                var dm = moment(cpData.CREATEDATE).format('DD/MM/');
                var y =
                    parseInt(moment(cpData.CREATEDATE).format('YYYY')) + 543;
                $('#cpdate').val(dm + y);

                //$('#patient').val(cpData.PATIENT)
                var $patient = $('#patient').selectize(sz_option);
                var patient_sz = $patient[0].selectize;
                _.each(cpData.PATIENT, function (x) {
                    patient_sz.addOption({ text: x, value: x });
                    patient_sz.addItem(x);
                    patient_sz.refreshItems();
                });

                //$('#longProblem').val(cpData.LONGTERMNEED)
                var $longProblem = $('#longProblem').selectize(sz_option);
                var longProblem_sz = $longProblem[0].selectize;
                _.each(cpData.LONGTERMNEED, function (x) {
                    longProblem_sz.addOption({ text: x, value: x });
                    longProblem_sz.addItem(x);
                    longProblem_sz.refreshItems();
                });

                // $('#care1').val(cpData.GeneralNursingCare)
                var $care1 = $('#care1').selectize(sz_option);
                var care1_sz = $care1[0].selectize;
                _.each(cpData.GeneralNursingCare, function (x) {
                    care1_sz.addOption({ text: x, value: x });
                    care1_sz.addItem(x);
                    care1_sz.refreshItems();
                });
                //$('#care2').val(cpData.SpecialNursingCare)
                var $care2 = $('#care2').selectize(sz_option);
                var care2_sz = $care2[0].selectize;
                _.each(cpData.SpecialNursingCare, function (x) {
                    care2_sz.addOption({ text: x, value: x });
                    care2_sz.addItem(x);
                    care2_sz.refreshItems();
                });
                // $('#care3').val(cpData.SocialNursingCare)
                var $care3 = $('#care3').selectize(sz_option);
                var care3_sz = $care3[0].selectize;
                _.each(cpData.SocialNursingCare, function (x) {
                    care3_sz.addOption({ text: x, value: x });
                    care3_sz.addItem(x);
                    care3_sz.refreshItems();
                });
                //$('#care4').val(cpData.EnvironmentalNursingCare)
                var $care4 = $('#care4').selectize(sz_option);
                var care4_sz = $care4[0].selectize;
                _.each(cpData.EnvironmentalNursingCare, function (x) {
                    care4_sz.addOption({ text: x, value: x });
                    care4_sz.addItem(x);
                    care4_sz.refreshItems();
                });

                // $('#warnningService').val(cpData.CAUTION)
                var $warnningService =
                    $('#warnningService').selectize(sz_option);
                var warnningService_sz = $warnningService[0].selectize;
                _.each(cpData.CAUTION, function (x) {
                    warnningService_sz.addOption({ text: x, value: x });
                    warnningService_sz.addItem(x);
                    warnningService_sz.refreshItems();
                });

                $('#moneysupport_detail').val(cpData.moneysupport_detail);

                Session.set('SHOTTERM', cpData.SHOTTERMNEED);
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body')
                    .find('.waitMe_container:not([data-waitme_id])')
                    .remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            }, 1500);
        }
    } else {
        $('#ADL').val(Session.get('elderID').ADL);
        $('#TAI').val(Session.get('elderID').TAI);
        $('#adlgroup').val(Session.get('elderID').GROUPID);
    }
});

Template.simplecareplan.helpers({
    showname() {
        return Session.get('cmname');
    },
    profile() {
        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }
    },
    eldercp() {
        return Session.get('eldercp')[0];
    },
    display() {
        return Session.get('eldercp');
    },
    D() {
        Meteor.call('getCareCode', 'D', function (error, result) {
            Session.set('D', result);
            setTimeout(function () {
                $('#patient').selectize({
                    plugins: ['remove_button'],
                    delimiter: ',',
                    persist: false,
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text',
                });
            }, 500);
        });
        return Session.get('D');
    },
    E() {
        Meteor.call('getCareCode', 'E', function (error, result) {
            Session.set('E', result);
        });
        return Session.get('E');
    },
    F() {
        Meteor.call('getCareCode', 'F', function (error, result) {
            Session.set('F', result);
            setTimeout(function () {
                $('#shortProblem').selectize({
                    create: true,
                    sortField: 'text',
                });
            }, 500);
        });
        return Session.get('F');
    },
    B() {
        Meteor.call('getCareCode', 'B', function (error, result) {
            Session.set('B', result);
            setTimeout(function () {
                $('#longProblem').selectize({
                    plugins: ['remove_button'],
                    delimiter: ',',
                    persist: false,
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text',
                });
            }, 500);
        });
        return Session.get('B');
    },
    C() {
        Meteor.call('getCareCode', 'C', function (error, result) {
            Session.set('C', result);
            setTimeout(function () {
                $('#warnningService').selectize({
                    plugins: ['remove_button'],
                    delimiter: ',',
                    persist: false,
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text',
                });
            }, 500);
        });
        return Session.get('C');
    },
    care1() {
        Meteor.call(
            'getCareType',
            'General Nursing Care',
            function (error, result) {
                Session.set('care1', result);
                setTimeout(function () {
                    $('#care1').selectize({
                        plugins: ['remove_button'],
                        delimiter: ',',
                        persist: false,
                        create: function (input) {
                            return { value: input, text: input };
                        },
                        sortField: 'text',
                    });
                }, 500);
            }
        );
        return Session.get('care1');
    },
    care2() {
        Meteor.call(
            'getCareType',
            'Special Nursing Care',
            function (error, result) {
                Session.set('care2', result);
                setTimeout(function () {
                    $('#care2').selectize({
                        plugins: ['remove_button'],
                        delimiter: ',',
                        persist: false,
                        create: function (input) {
                            return { value: input, text: input };
                        },
                        sortField: 'text',
                    });
                }, 500);
            }
        );
        return Session.get('care2');
    },
    care3() {
        Meteor.call(
            'getCareType',
            'Social Support Care',
            function (error, result) {
                Session.set('care3', result);
                setTimeout(function () {
                    $('#care3').selectize({
                        plugins: ['remove_button'],
                        delimiter: ',',
                        persist: false,
                        create: function (input) {
                            return { value: input, text: input };
                        },
                        sortField: 'text',
                    });
                }, 500);
            }
        );
        return Session.get('care3');
    },
    care4() {
        Meteor.call(
            'getCareType',
            'Environmental Support Care',
            function (error, result) {
                Session.set('care4', result);
                setTimeout(function () {
                    $('#care4').selectize({
                        plugins: ['remove_button'],
                        delimiter: ',',
                        persist: false,
                        create: function (input) {
                            return { value: input, text: input };
                        },
                        sortField: 'text',
                    });
                }, 500);
            }
        );
        return Session.get('care4');
    },
    shorttarget() {
        return Session.get('SHOTTERM');
    },
});

Template.simplecareplan.events({
    'click #remove'() {
        var ARRSHOTTERMN = [];
        ARRSHOTTERMN = Session.get('SHOTTERM');
        for (var i = ARRSHOTTERMN.length - 1; i >= 0; --i) {
            if (ARRSHOTTERMN[i]._id == this._id) {
                ARRSHOTTERMN.splice(i, 1);
            }
        }
        Session.set('SHOTTERM', ARRSHOTTERMN);
    },
    'click #add'() {
        var obj = {
            _id: makeid(),
            SHOTTERMNEED: $('#shortProblem').val(),
            SHOTTERMNEEDNUM: $('#numtarget').val(),
            SHOTTERMNEEDDATE: $('#tpyetarget').val(),
        };
        if (Session.get('SHOTTERM')) {
            var ARRSHOTTERMN = [];
            ARRSHOTTERMN = Session.get('SHOTTERM');
            ARRSHOTTERMN.push(obj);
            Session.set('SHOTTERM', ARRSHOTTERMN);
        } else {
            var ARRSHOTTERMN = [];
            ARRSHOTTERMN.push(obj);
            Session.set('SHOTTERM', ARRSHOTTERMN);
        }
    },
    'click #search'() {
        Meteor.call(
            'elderbycid',
            $('#cidinput').val(),
            function (error, result) {
                Session.set('eldercp', result);
            }
        );
    },
    'click #nowaddressbtn'() {
        $('#nowaddress').val(Session.get('eldercp')[0].ADDRESS);
    },
    'click .next'() {
        // ยังไม่ทำ ต้องการทำ Care Plan เพื่อใช้ปฏิบัติงานทีหลัง
        var year = parseInt(parseInt(moment().format('YYYY')) + 543 - 2500);
        var obj2 = Session.get('datacpElder');
        $('body').addClass('waitMe_body');
        var elem = $(
            '<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>'
        );
        $('body').prepend(elem);
        NProgress.start();
        var bdateString = $('#cpdate').val().split('/');
        var bdate = new Date(
            parseInt(bdateString[2] - 543),
            parseInt(bdateString[1] - 1),
            parseInt(bdateString[0]),
            0,
            0,
            0,
            0
        );
        Meteor.call(
            'getNumidCP',
            obj2.CID,
            Session.get('eldercp')[0].HOSPCODE,
            bdate,
            Session.get('budgetYear'),
            function (error, result) {
                var cpid1 = Session.get('nameProvince')
                    ? Session.get('nameProvince')
                    : '';
                var cpid2 = Session.get('eldercp')[0].VENDERCODE
                    ? Session.get('eldercp')[0].VENDERCODE
                    : '';
                var careid =
                    cpid1 +
                    '-' +
                    cpid2 +
                    '-' +
                    Session.get('eldercp')[0].HOSPCODE +
                    '-' +
                    bdateString[2][2] +
                    bdateString[2][3] +
                    '/' +
                    result.count;
                var obj1 = {
                    ADL: $('#ADL').val(),
                    TAI: $('#TAI').val(),
                    GRUOP: $('#adlgroup').val(),
                    HEALTH: $('#healelder').val(),
                    RERHEADPAY: $('#moneysubport').val(),
                    PATIENT: $('#patient').val(),
                    SHOTTERMNEED: Session.get('SHOTTERM'),
                    LONGTERMNEED: $('#longProblem').val(),
                    GeneralNursingCare: $('#care1').val(),
                    SpecialNursingCare: $('#care2').val(),
                    SocialNursingCare: $('#care3').val(),
                    EnvironmentalNursingCare: $('#care4').val(),
                    CAUTION: $('#warnningService').val(),
                    CMID: Session.get('getProfileCM')[0].CID,
                    CREATEBYNAME:
                        Session.get('getProfileCM')[0].PRENAME +
                        Session.get('getProfileCM')[0].NAME +
                        ' ' +
                        Session.get('getProfileCM')[0].LNAME,
                    YEAR: result.copy.split('/')[1],
                    NAME:
                        Session.get('eldercp')[0].PRENAME +
                        Session.get('eldercp')[0].NAME +
                        ' ' +
                        Session.get('eldercp')[0].LNAME,
                    HOSPCODE: Session.get('eldercp')[0].HOSPCODE,
                    CAREPLANID: careid,
                    COPY: result.copy,
                    BIRTHDATE: Session.get('eldercp')[0].BIRTHDATE,
                    CREATEDATE: bdate,
                    REMOVE: false,
                    COPYFROM: null,
                    moneysupport_detail: $('#moneysupport_detail').val(),
                    SERVICE_CENTER_DETAIL: {
                        CODE:
                            Session.get('getProfileCM')[0].HOSPCODE != null
                                ? Session.get('getProfileCM')[0].HOSPCODE.CODE
                                : Session.get('getProfileCM')[0].DLACODE.CODE,
                        NAME:
                            Session.get('getProfileCM')[0].HOSPCODE != null
                                ? Session.get('getProfileCM')[0].HOSPCODE.NAME
                                : Session.get('getProfileCM')[0].DLACODE.NAME,
                        AMPHOE:
                            Session.get('getProfileCM')[0].HOSPCODE != null
                                ? Session.get(
                                      'getProfileCM'
                                  )[0].HOSPCODE.AMPHOE.split('-')[1]
                                : Session.get(
                                      'getProfileCM'
                                  )[0].DLACODE.DISTRICT.includes('อ.')
                                ? Session.get(
                                      'getProfileCM'
                                  )[0].DLACODE.DISTRICT.split('.')[1]
                                : Session.get('getProfileCM')[0].DLACODE
                                      .DISTRICT,
                        DISTRICT:
                            Session.get('getProfileCM')[0].HOSPCODE != null
                                ? Session.get(
                                      'getProfileCM'
                                  )[0].HOSPCODE.DISTRICT.split('-')[1]
                                : Session.get('getProfileCM')[0].DLACODE.TAMBON,
                        PROVINCE:
                            Session.get('getProfileCM')[0].HOSPCODE != null
                                ? Session.get(
                                      'getProfileCM'
                                  )[0].HOSPCODE.PROVINCE.split('-')[1]
                                : Session.get('getProfileCM')[0].DLACODE
                                      .PROVINCE,
                    },
                    ZONE: Session.get('getProfileCM')[0].zone,
                };
                var obj = Object.assign(obj1, obj2);
                if (navigator.onLine && !_.isEmpty(obj)) {
                    Meteor.call(
                        'INSERT_CAREPLAN',
                        obj,
                        function (error, result) {
                            if (result) {
                                Session.set('initialCPId', result);
                                $('#myModal').modal('hide');
                                setTimeout(function () {
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body')
                                        .find(
                                            '.waitMe_container:not([data-waitme_id])'
                                        )
                                        .remove();
                                    $('body.waitMe_body').removeClass(
                                        'waitMe_body hideMe'
                                    );
                                    NProgress.done();
                                    Router.go('/careplanhistory');
                                }, 500);
                            } else {
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body')
                                    .find(
                                        '.waitMe_container:not([data-waitme_id])'
                                    )
                                    .remove();
                                $('body.waitMe_body').removeClass(
                                    'waitMe_body hideMe'
                                );
                                NProgress.done();
                                toastr.error(
                                    'เกิดข้อผิดพลาดกรุณาทำรายการใหม่อีกครั้ง'
                                );
                            }
                        }
                    );
                } else {
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body')
                        .find('.waitMe_container:not([data-waitme_id])')
                        .remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    NProgress.done();
                    toastr.error(
                        'บันทึกข้อมูลไม่สำเร็จกรุณาเช็คการเชื่อมต่อกับอินเทอร์เน็ตหรือทำรายการใหม่อีกครั้ง'
                    );
                }
            }
        );
    },
    'click .gotofullcp'() {
        // ใช่ ต้องการทำ Care Plan เพื่อใช้ปฏิบัติงาน
        console.log('1');
        var year = parseInt(parseInt(moment().format('YYYY')) + 543 - 2500);
        var obj = Session.get('datacpElder');
        $('body').addClass('waitMe_body');
        var elem = $(
            '<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>'
        );
        $('body').prepend(elem);
        NProgress.start();
        var bdateString = $('#cpdate').val().split('/');
        var bdate = new Date(
            parseInt(bdateString[2] - 543),
            parseInt(bdateString[1] - 1),
            parseInt(bdateString[0]),
            0,
            0,
            0,
            0
        );
        console.log('2');
        Meteor.call(
            'getNumidCP',
            obj.CID,
            Session.get('eldercp')[0].HOSPCODE,
            bdate,
            Session.get('budgetYear'),
            function (error, result) {
                console.log('getNumidCP=>', result);
                var cpid1 = Session.get('nameProvince')
                    ? Session.get('nameProvince')
                    : '';
                var cpid2 = Session.get('eldercp')[0].VENDERCODE
                    ? Session.get('eldercp')[0].VENDERCODE
                    : '';
                var careid =
                    cpid1 +
                    '-' +
                    cpid2 +
                    '-' +
                    Session.get('eldercp')[0].HOSPCODE +
                    '-' +
                    bdateString[2][2] +
                    bdateString[2][3] +
                    '/' +
                    result.count;
                console.log('cpid1=>', cpid1);
                console.log('cpid2=>', cpid2);
                console.log('careid=>', careid);
                obj.ADL = $('#ADL').val();
                obj.TAI = $('#TAI').val();
                obj.GRUOP = $('#adlgroup').val();
                obj.HEALTH = $('#healelder').val();
                obj.RERHEADPAY = $('#moneysubport').val();
                obj.PATIENT = $('#patient').val();
                obj.SHOTTERMNEED = Session.get('SHOTTERM');
                obj.LONGTERMNEED = $('#longProblem').val();
                obj.GeneralNursingCare = $('#care1').val();
                obj.SpecialNursingCare = $('#care2').val();
                obj.SocialNursingCare = $('#care3').val();
                obj.EnvironmentalNursingCare = $('#care4').val();
                obj.CAUTION = $('#warnningService').val();
                obj.CMID = Session.get('getProfileCM')[0].CID;
                obj.CREATEBYNAME =
                    Session.get('getProfileCM')[0].PRENAME +
                    Session.get('getProfileCM')[0].NAME +
                    ' ' +
                    Session.get('getProfileCM')[0].LNAME;
                obj.YEAR = result.copy.split('/')[1];
                obj.NAME =
                    Session.get('eldercp')[0].PRENAME +
                    Session.get('eldercp')[0].NAME +
                    ' ' +
                    Session.get('eldercp')[0].LNAME;
                obj.HOSPCODE = Session.get('eldercp')[0].HOSPCODE;
                obj.CAREPLANID = careid;
                obj.COPY = result.copy; /////////////////////////////////////
                obj.BIRTHDATE = Session.get('eldercp')[0].BIRTHDATE;
                obj.CREATEDATE = bdate; /////////////////////////////////////
                obj.REMOVE = false;
                obj.moneysupport_detail = $('#moneysupport_detail').val();
                obj.budgetYear = Session.get('budgetYear');
                console.log('1obj-> ', obj);
                assign(
                    obj,
                    'SERVICE_CENTER_DETAIL.CODE',
                    Session.get('getProfileCM')[0].HOSPCODE != null
                        ? Session.get('getProfileCM')[0].HOSPCODE.CODE
                        : Session.get('getProfileCM')[0].DLACODE.CODE
                );
                console.log('2obj-> ', obj);
                assign(
                    obj,
                    'SERVICE_CENTER_DETAIL.NAME',
                    Session.get('getProfileCM')[0].HOSPCODE != null
                        ? Session.get('getProfileCM')[0].HOSPCODE.NAME
                        : Session.get('getProfileCM')[0].DLACODE.NAME
                );
                console.log('3obj-> ', obj);
                assign(
                    obj,
                    'SERVICE_CENTER_DETAIL.AMPHOE',
                    Session.get('getProfileCM')[0].HOSPCODE != null
                        ? Session.get('getProfileCM')[0].HOSPCODE.AMPHOE.split(
                              '-'
                          )[1]
                        : Session.get(
                              'getProfileCM'
                          )[0].DLACODE.DISTRICT.includes('อ.')
                        ? Session.get('getProfileCM')[0].DLACODE.DISTRICT.split(
                              '.'
                          )[1]
                        : Session.get('getProfileCM')[0].DLACODE.DISTRICT
                );
                console.log('4obj-> ', obj);
                assign(
                    obj,
                    'SERVICE_CENTER_DETAIL.DISTRICT',
                    Session.get('getProfileCM')[0].HOSPCODE != null
                        ? Session.get(
                              'getProfileCM'
                          )[0].HOSPCODE.DISTRICT.split('-')[1]
                        : Session.get('getProfileCM')[0].DLACODE.TAMBON
                );
                console.log('5obj-> ', obj);
                assign(
                    obj,
                    'SERVICE_CENTER_DETAIL.PROVINCE',
                    Session.get('getProfileCM')[0].HOSPCODE != null
                        ? Session.get(
                              'getProfileCM'
                          )[0].HOSPCODE.PROVINCE.split('-')[1]
                        : Session.get('getProfileCM')[0].DLACODE.PROVINCE
                );
                (obj.ZONE = Session.get('getProfileCM')[0].zone),
                    Session.set('datacpElder', obj);
                console.log('6obj-> ', obj);
                if (navigator.onLine && !_.isEmpty(obj)) {
                    Meteor.call(
                        'INSERT_CAREPLAN',
                        obj,
                        function (error, result) {
                            console.log('INSERT_CAREPLAN=>', result);
                            if (result) {
                                Session.set('initialCPId', result);
                                $('#myModal').modal('hide');
                                setTimeout(function () {
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body')
                                        .find(
                                            '.waitMe_container:not([data-waitme_id])'
                                        )
                                        .remove();
                                    $('body.waitMe_body').removeClass(
                                        'waitMe_body hideMe'
                                    );
                                    NProgress.done();
                                    Router.go('/fullcareplan');
                                }, 500);
                            } else {
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body')
                                    .find(
                                        '.waitMe_container:not([data-waitme_id])'
                                    )
                                    .remove();
                                $('body.waitMe_body').removeClass(
                                    'waitMe_body hideMe'
                                );
                                NProgress.done();
                                toastr.error(
                                    'เกิดข้อผิดพลาดกรุณาทำรายการใหม่อีกครั้ง'
                                );
                            }
                        }
                    );
                } else {
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body')
                        .find('.waitMe_container:not([data-waitme_id])')
                        .remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    NProgress.done();
                    toastr.error(
                        'บันทึกข้อมูลไม่สำเร็จกรุณาเช็คการเชื่อมต่อกับอินเทอร์เน็ตหรือทำรายการใหม่อีกครั้ง'
                    );
                }
            }
        );
        console.log('3');
    },
    'click .twostep'() {
        //คลิ๊กตอน edit careplan
        console.log('4');
        if (Session.get('datacpElder').checkEdit) {
            var bdateString = $('#cpdate').val().split('/');
            var bdate = new Date(
                parseInt(bdateString[2] - 543),
                parseInt(bdateString[1] - 1),
                parseInt(bdateString[0]),
                0,
                0,
                0,
                0
            );
            var obj = Session.get('datacpElder');
            obj.ADL = $('#ADL').val();
            obj.TAI = $('#TAI').val();
            obj.GRUOP = $('#adlgroup').val();
            obj.HEALTH = $('#healelder').val();
            obj.RERHEADPAY = $('#moneysubport').val();
            obj.PATIENT = $('#patient').val();
            obj.SHOTTERMNEED = Session.get('SHOTTERM');
            obj.LONGTERMNEED = $('#longProblem').val();
            obj.GeneralNursingCare = $('#care1').val();
            obj.SpecialNursingCare = $('#care2').val();
            obj.SocialNursingCare = $('#care3').val();
            obj.EnvironmentalNursingCare = $('#care4').val();
            obj.CAUTION = $('#warnningService').val();
            obj.CMID = Session.get('getProfileCM')[0].CID;
            obj.CREATEBYNAME =
                Session.get('getProfileCM')[0].PRENAME +
                Session.get('getProfileCM')[0].NAME +
                ' ' +
                Session.get('getProfileCM')[0].LNAME;
            obj.YEAR = Session.get('eldercp')[0].YEAR;
            obj.NAME =
                Session.get('eldercp')[0].PRENAME +
                Session.get('eldercp')[0].NAME +
                ' ' +
                Session.get('eldercp')[0].LNAME;
            obj.HOSPCODE = Session.get('eldercp')[0].HOSPCODE;
            obj.CAREPLANID = Session.get('datacpElder').CAREPLANID;
            obj.COPY = Session.get('datacpElder').COPY;
            obj.BIRTHDATE = Session.get('eldercp')[0].BIRTHDATE;
            obj.CREATEDATE = bdate;
            obj.REMOVE = Session.get('datacpElder').REMOVE;
            obj.moneysupport_detail = $('#moneysupport_detail').val();
            obj.budgetYear = Session.get('budgetYear');
            Session.set('datacpElder', obj);
            console.log("Router.go('/fullcareplan')");
            Router.go('/fullcareplan');
        } else {
            console.log('5');
            $('#myModal').modal('show');
        }
        console.log('6');
    },
});

function makeid() {
    var text = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function assign(obj, prop, value) {
    if (typeof prop === 'string') prop = prop.split('.');

    if (prop.length > 1) {
        var e = prop.shift();
        assign(
            (obj[e] =
                Object.prototype.toString.call(obj[e]) === '[object Object]'
                    ? obj[e]
                    : {}),
            prop,
            value
        );
    } else obj[prop[0]] = value;
}
