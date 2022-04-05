import datatables from 'datatables.net';
import datatables_bs from 'datatables.net-bs';
import jszip from 'jszip';
import datatables_buttons from 'datatables.net-buttons';
import dt_html5 from 'datatables.net-buttons/js/buttons.html5.min.js';
import dt_boostrap from 'datatables.net-buttons/js/buttons.boostrap.min.js';
import pdfmake from 'datatables.net-buttons/js/pdfmake.min.js';
import vfonts from 'datatables.net-buttons/js/vfs_fonts.js';
import dt_print from 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-bs/css/dataTables.bootstrap.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import { UploadFS } from 'meteor/jalik:ufs';
import { GridFSStore } from 'meteor/jalik:ufs-gridfs';

var logindata = Meteor.subscribe('getAllLogin');

Template.CMdashboard.onCreated(function init() {
    console.log('clientCMCGCMdashboarddashboard.js ====> onCreated.');
    $('body').addClass('waitMe_body');
    var elem = $(
        '<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>'
    );
    $('body').prepend(elem);
});
Template.CMdashboard.onRendered(function () {
    console.log('clientCMCGCMdashboarddashboard.js ====> onRendered.');
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts);
    dt_print(window, $);
    $('#kkk').show();

    Meteor.call('getUserCM', Session.get('cmid'), function (error, result) {
        var data = result;
        Session.set('getProfileCM', data);
        var selecCompany = [];
        var mainComp = [
            {
                CODE: data[0].HOSPCODE
                    ? data[0].HOSPCODE.CODE
                    : data[0].DLACODE.CODE,
                NAME: data[0].HOSPCODE
                    ? data[0].HOSPCODE.NAME
                    : data[0].DLACODE.NAME,
                approve: '1',
            },
        ];
        Session.set('MainCompany', mainComp);
        if (data[0].SECONDARY_COMP.length != 0) {
            var secondComp = data[0].SECONDARY_COMP;
            Session.set('SecondaryCompany', secondComp);
        }

        if (data[0].SWITCHING.status) {
            // data[0].HOSPCODE ? data[0].HOSPCODE.CODE = data[0].SWITCHING.code : data[0].DLACODE.CODE = data[0].SWITCHING.code

            if (data[0].SWITCHING.code.length == 5) {
                data[0].HOSPCODE = {};
                data[0].DLACODE = null;
                data[0].HOSPCODE.CODE = data[0].SWITCHING.code;
                Meteor.call(
                    'getAllServiceCenterDistrict',
                    data[0].HOSPCODE.CODE,
                    function (error, result2) {
                        console.log('getAllServiceCenterDistrict', result2);
                        // data[0].HOSPCODE.CODE = result2.hospcode
                        data[0].HOSPCODE.NAME = result2.name;
                        data[0].HOSPCODE.DISTRICT = result2.district;
                        data[0].HOSPCODE.AMPHOE = result2.amphoe;
                        data[0].HOSPCODE.PROVINCE = result2.province;
                        Session.set('getProfileCM', data);
                        Session.set('nameCen', result2.name);
                        Session.set(
                            'nameProvince',
                            result2.province[0] + result2.province[1]
                        );
                    }
                );
                setTimeout(() => {
                    $(
                        '#changeComp option[value=' +
                            data[0].SWITCHING.code +
                            ']'
                    ).attr('selected', 'selected');
                }, 500);
            } else {
                data[0].DLACODE = {};
                data[0].HOSPCODE = null;
                data[0].DLACODE.CODE = data[0].SWITCHING.code;
                //console.log(data[0].SWITCHING.code)

                Meteor.call(
                    'getDLA_NAME',
                    data[0].DLACODE.CODE,
                    function (error, result2) {
                        // data[0].DLACODE.CODE = result2.DLA_CODE
                        data[0].DLACODE.NAME = result2.NAME;
                        data[0].DLACODE.DISTRICT = result2.DISTRICT;
                        data[0].DLACODE.PROVINCE = result2.PROVINCE;

                        Session.set('getProfileCM', data);
                        Session.set('nameCen', result2.DLA_NAME);
                        Session.set(
                            'nameProvince',
                            result2.DLA_CODE[1] + result2.DLA_CODE[2]
                        );
                    }
                );
                setTimeout(() => {
                    $(
                        '#changeComp option[value=' +
                            data[0].SWITCHING.code +
                            ']'
                    ).attr('selected', 'selected');
                }, 500);
            }
        } else {
            var sedata = data[0].HOSPCODE
                ? (data[0].HOSPCODE.CODE = data[0].HOSPCODE.CODE)
                : data[0].DLACODE.CODE;

            setTimeout(() => {
                $('#changeComp option[value=' + sedata + ']').attr(
                    'selected',
                    'selected'
                );
            }, 500);
            Session.set('getProfileCM', data);
        }

        // if (Session.get('getProfileCM')[0].DLACODE) {
        //     Meteor.call('getDLA_NAME', Session.get('getProfileCM')[0].DLACODE.CODE, function (error, result2) {
        //         Session.set('nameCen', result2.DLA_NAME);
        //         Session.set('nameProvince', result2.DLA_CODE[1] + result2.DLA_CODE[2]);

        //     });
        // } else {
        //     Meteor.call('getAllServiceCenterDistrict', Session.get('getProfileCM')[0].HOSPCODE.CODE, function (error, result2) {
        //         Session.set('nameCen', result2.name);
        //         Session.set('nameProvince', result2.province[0] + result2.province[1]);

        //     });
        // }
        $('body.waitMe_body').addClass('hideMe');
        $('body.waitMe_body')
            .find('.waitMe_container:not([data-waitme_id])')
            .remove();
        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    });

    Session.set('unit', 'หน่วยบริการ');
    Session.set('removephotoCG', null);

    $('#district_name').selectize();
    $('#subdistrict_name').selectize();
});
Template.cmLeftMenu.helpers({
    showname() {
        return Session.get('cmname');
    },
});
Template.CMdashboard.helpers({
    viewProfile() {
        return Session.get('viewProfile');
    },
    viewCG() {
        return Session.get('viewCG');
    },
    viewElder() {
        return Session.get('viewElder');
    },
    viewBetterElder() {
        return Session.get('viewBetterElder');
    },
    viewDeathElder() {
        return Session.get('viewDeathElder');
    },
    viewCmEvaluate() {
        return Session.get('viewCmEvaluate');
    },
    showname() {
        return Session.get('cmname');
    },
    profile() {
        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }
    },
    profilecm() {
        if (Session.get('showcg')) {
            return Session.get('showcg');
        }
    },
    check() {
        if (logindata.ready()) {
            // $('#companyName').selectize();
        }
        if (Session.get('unit') == 'หน่วยบริการ') {
            return true;
        } else if (Session.get('unit') == 'อปท') {
            return false;
        }
    },
    showimgCG() {
        return Session.get('showimgCG');
    },
    showaddress() {
        if (Session.get('districtName')) {
            var data = Session.get('districtName')[0];
            return (
                'อ.' + data.district + ' จ.' + data.province + '  ' + data.zone
            );
        }
    },
    listCompany() {
        if (Session.get('MainCompany')) {
            return Session.get('MainCompany');
        }
    },
    listSecondCompany() {
        if (Session.get('SecondaryCompany')) {
            return Session.get('SecondaryCompany');
        }
    },
});

Template.CMdashboard.events({
    'click #viewProfile': function (event, template) {
        Session.set('viewProfile', true);
        Session.set('viewCG', false);
        Session.set('viewElder', false);
        Session.set('viewBetterElder', false);
        Session.set('viewDeathElder', false);
        Session.set('viewCmEvaluate', false);
        Router.go('/CMDashboard');
    },
    'click #cmevaluate': function (event, template) {
        Session.set('viewProfile', false);
        Session.set('viewCmEvaluate', true);
        Session.set('viewCG', false);
        Session.set('viewElder', false);
        Session.set('viewBetterElder', false);
        Session.set('viewDeathElder', false);
    },
    'change #changeComp'(event, template) {
        var temp = Session.get('getProfileCM');
        var CODE = temp[0].HOSPCODE
            ? temp[0].HOSPCODE.CODE
            : temp[0].DLACODE.CODE;
        var sw = {};
        //  console.log($("#changeComp"))
        if (CODE == event.target.value) {
            sw = { status: false, code: event.target.value };
            // console.log(sw)
            Meteor.call(
                'upDateSwitching2',
                temp[0]._id,
                sw,
                function (err, result) {
                    if (err) throw err;
                    window.location.reload();
                }
            );
        } else {
            sw = { status: true, code: event.target.value };
            Meteor.call(
                'upDateSwitching2',
                temp[0]._id,
                sw,
                function (err, result) {
                    if (err) throw err;
                    window.location.reload();
                }
            );
            // temp[0].HOSPCODE ? temp[0].HOSPCODE.CODE = event.target.value : temp[0].DLACODE.CODE = event.target.value
            // Session.set('getProfileCM', temp)
        }
    },
    'click #viewCG': function (event, template) {
        Session.set('viewProfile', false);
        Session.set('viewCG', true);
        Session.set('viewElder', false);
        Session.set('viewBetterElder', false);
        Session.set('viewDeathElder', false);
        Session.set('viewCmEvaluate', false);
    },
    'click #viewElder': function (event, template) {
        Session.set('viewProfile', false);
        Session.set('viewCG', false);
        Session.set('viewElder', true);
        Session.set('viewBetterElder', false);
        Session.set('viewDeathElder', false);
        Session.set('viewCmEvaluate', false);
    },
    'click #viewBetterElder': function (event, template) {
        Session.set('viewProfile', false);
        Session.set('viewCG', false);
        Session.set('viewElder', false);
        Session.set('viewBetterElder', true);
        Session.set('viewDeathElder', false);
        Session.set('viewCmEvaluate', false);
    },
    'click #viewDeathElder': function (event, template) {
        Session.set('viewProfile', false);
        Session.set('viewCG', false);
        Session.set('viewElder', false);
        Session.set('viewBetterElder', false);
        Session.set('viewDeathElder', true);
        Session.set('viewCmEvaluate', false);
    },
});

Template.registerHelper('CHECK_APPROVE_STATUS', function (data) {
    if (data == '1') {
        return '';
    } else {
        return 'disabled';
    }
});
