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

Template.reportnumelder_host.onCreated(function () {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
});

Template.reportnumelder_host.onRendered(function () {
    datatables(window, $);
    datatables_bs(window, $);
    datatables_buttons(window, $);
    dt_html5(window, $, jszip, pdfmake, vfonts);
    dt_boostrap(window, $, jszip, pdfmake, vfonts);
    dt_print(window, $);

    $("#chooseDist").attr('disabled', true);
    Session.set('REPOR_RESULT', null)
    Session.set('REPOR_RESULT_SUM', null)
    Session.set('data_all', 0)
    Session.set('page_current', 1)
    Session.set('page_all', 1)

    var myArr = []
    Session.set('ElderCPHospDetail', null)
    Session.set('HospElderAllCp_J', myArr)
    Session.set('CheckTable', null)
    Session.set('tableHeader_cp', 'เขต')
    Session.set('retire', false)

    let year = $('#budgetyear').val()
    let zone = $('#zone').val()
    let province = $('#chooseProvince').val()
    let district = $('#chooseDist').val()

    let db = $("input[type=radio][name=database]:checked").val();
    let permission = $("input[type=radio][name=healty]:checked").val();
    let _type = $("input[type=radio][name=typeOf]:checked").val();
    let sex = $("input[type=radio][name=sex]:checked").val();

    let search = $('#search_input').val()

    let type
    if (_type == '01') {
        type = ['01']
    } else {
        type = ['01', '03']
    }

    $('body.waitMe_body').addClass('hideMe');
    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
    $('body.waitMe_body').removeClass('waitMe_body hideMe');
})

Template.reportnumelder_host.helpers({
    year() {
        var year = []
        for (var i = 2561; i < 2580; i++) {
            year.push({ byear: i })
        }
        return year
    },
    getDetail() {
        return Session.get('ElderCPHospDetail')
    },
    tableHeader_cp() {
        return Session.get('tableHeader_cp')
    },
    zonerep1() {
        return _.sortBy(Session.get('HospElderAllCp_J'), o => o._id)

    },
    sumCMCG() {
        var data = Session.get('HospElderAllCp_J')
        var groupData = _.chain(data).groupBy('sum').map(function (value, key) {
            return {
                zone: key,
                numcp: _.reduce(_.map(value, 'totalcp'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }, 0),
                numelder: _.reduce(_.map(value, 'totalelder'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }, 0),
            }
        }).value();

        return groupData
    },
    retire() {
        return Session.get('retire')
    },
    REPOR_RESULT() {
        return Session.get('REPOR_RESULT')
    },
    data_all() {
        return Session.get('data_all')
    },
    page_current() {
        return Session.get('page_current')
    },
    page_all() {
        return Session.get('page_all')
    },
    REPOR_RESULT_SUM() {
        return Session.get('REPOR_RESULT_SUM')[0]
    },
})



Template.reportnumelder_host.events({
    'click #download'() {
        var heading = true; // Optional, defaults to true
        var delimiter = ","; // Optional, defaults to ",";

        var nameFile = 'รายงาน CP' + '-' + moment().format("MM-YYYY") + '.csv';
        // var blob = new Blob(["\ufeff",exportcsv.exportToCSV(datacsv, heading, delimiter)], {encoding:"UTF-8",type:"text/plain;charset=UTF-8"});
        var blob = new Blob(["\ufeff", exportcsv.exportToCSV(Session.get('HospElderAllCp_J'), heading, delimiter)]);
        saveAs(blob, nameFile);
    },
    'change #zone'(event) {
        $("#chooseDist").attr('disabled', true);
        $("#chooseDist").empty();
        $("#chooseDist").append("<option value=''>[เลือกอำเภอ]</option>");
        if (event.target.value != 'ทั้งหมด') {
            var provinceSet = hpcprovince(event.target.value)
            Session.set('provinceSetbyHpc_repHosp', provinceSet)
            $("#chooseProvince").empty();
            $("#chooseProvince").append("<option value=''>[เลือกจังหวัด]</option>");
            for (i = 0; i < provinceSet.length; i++) {
                $("#chooseProvince").append("<option value='" + provinceSet[i] + "'>" + provinceSet[i] + "</option>");
            }
            Meteor.call('getDISTRICTEvaAll', hpcprovince(event.target.value), function (error, result) {
                Session.set('getAllAmphoe', result);
            });
        } else {

        }

    },
    'change #chooseProvince'() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        Meteor.call('findDistrict', $('#chooseProvince').val(), function (error, result) {
            if (result.length > 1) {
                $("#chooseDist").empty();
                $("#chooseDist").append("<option value=''>[เลือกอำเภอ]</option>");
                for (i = 0; i < result.length; i++) {
                    $("#chooseDist").append("<option value='" + result[i]._id + "'>" + result[i]._id + "</option>");
                }
                $("#chooseDist").attr('disabled', false);
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            } else {
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            }
        });
    },
    "click .healty"() {
        let radio = $("input[name='healty']:checked").val()
        if (radio == 'H3') {
            Session.set('retire', true)
            $("input[name='retire'][value='R3']").prop('checked', true);
        } else {
            Session.set('retire', false)
            $("input[name='retire'][value='R3']").prop('checked', false);
        }
    },
    'click #submit'() {
        console.log($.fn.dataTable.isDataTable("#mytable")); // Returns true
        if ($.fn.dataTable.isDataTable("#mytable")) {
            $('#mytable').DataTable().destroy();
        }
        let year = $('#budgetyear').val()
        let zone = $('#zone').val()
        let province = $('#chooseProvince').val()
        let district = $('#chooseDist').val()

        let db = $("input[type=radio][name=database]:checked").val();
        let permission = $("input[type=radio][name=healty]:checked").val();
        let _type = $("input[type=radio][name=typeOf]:checked").val();
        let sex = $("input[type=radio][name=sex]:checked").val();

        let search = $('#search_input').val()

        let type
        if (_type == '01') {
            type = ['01']
        } else {
            type = ['01', '03']
        }

        if (zone != '') {
            if (province != '') {
                if (district != '') {
                    console.log("เขต " + zone + " จังหวัด" + province + " อำเภอ" + district)
                    $('body').addClass('waitMe_body');
                    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
                    $('body').prepend(elem);
                    Meteor.call('findElderyRegisterGroup', year, zone, province, district, db, permission, type, sex, search, function (error, result) {
                        if (result.length > 1) {
                            Session.set('REPOR_RESULT', result)
                            Session.set('REPOR_RESULT_SUM', sumResult(result))
                            setTimeout(function () {
                                $('#mytable').DataTable({
                                    "ordering": false,
                                    dom: '<"html5buttons"B>lTfgitp',
                                    lengthChange: false,
                                    "info": false,
                                    "pageLength": 20,
                                    buttons: [{
                                        className: 'fa fa-file-excel-o',
                                        extend: 'excel',
                                        text: " ดาวน์โหลด",
                                        title: "รายงาน Care Plan ทั้งหมด" + "_" + moment().format('DD-MM-YY') + "",
                                        exportOptions: {
                                            columns: [0, 1, 2, 3, 4]
                                        },
                                        messageTop: null
                                    },
                                    {
                                        className: 'fa fa-print',
                                        text: " พิมพ์",
                                        title: "",
                                        extend: 'print',
                                        exportOptions: {
                                            columns: [0, 1, 2, 3, 4]
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
                        } else {
                            Session.set('REPOR_RESULT', null)
                            $('body.waitMe_body').addClass('hideMe');
                            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                            $('body.waitMe_body').removeClass('waitMe_body hideMe');
                        }
                    });
                } else {
                    console.log("เขต " + zone + " จังหวัด" + province + " ทุกอำเภอ")
                    $('body').addClass('waitMe_body');
                    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
                    $('body').prepend(elem);
                    Meteor.call('findElderyRegisterGroupByAllDistrict', year, zone, province, district, db, permission, type, sex, search, function (error, result) {
                        if (result.length > 1) {
                            Session.set('REPOR_RESULT', result)
                            Session.set('REPOR_RESULT_SUM', sumResult(result))
                            setTimeout(function () {
                                $('#mytable').DataTable({
                                    "ordering": false,
                                    dom: '<"html5buttons"B>lTfgitp',
                                    lengthChange: false,
                                    "info": false,
                                    "pageLength": 20,
                                    buttons: [{
                                        className: 'fa fa-file-excel-o',
                                        extend: 'excel',
                                        text: " ดาวน์โหลด",
                                        title: "รายงาน Care Plan ทั้งหมด" + "_" + moment().format('DD-MM-YY') + "",
                                        exportOptions: {
                                            columns: [0, 1, 2, 3, 4]
                                        },
                                        messageTop: null
                                    },
                                    {
                                        className: 'fa fa-print',
                                        text: " พิมพ์",
                                        title: "",
                                        extend: 'print',
                                        exportOptions: {
                                            columns: [0, 1, 2, 3, 4]
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
                        } else {
                            Session.set('REPOR_RESULT', null)
                            $('body.waitMe_body').addClass('hideMe');
                            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                            $('body.waitMe_body').removeClass('waitMe_body hideMe');
                        }
                    });
                }
            } else {
                console.log("เขต " + zone + " ทุกจังหวัด")
                $('body').addClass('waitMe_body');
                var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
                $('body').prepend(elem);
                Meteor.call('findElderyRegisterGroupByAllProvince', year, zone, province, district, db, permission, type, sex, search, function (error, result) {
                    if (result.length > 1) {
                        Session.set('REPOR_RESULT', result)
                        Session.set('REPOR_RESULT_SUM', sumResult(result))
                        setTimeout(function () {
                            $('#mytable').DataTable({
                                "ordering": false,
                                dom: '<"html5buttons"B>lTfgitp',
                                lengthChange: false,
                                "info": false,
                                "pageLength": 20,
                                buttons: [{
                                    className: 'fa fa-file-excel-o',
                                    extend: 'excel',
                                    text: " ดาวน์โหลด",
                                    title: "รายงาน Care Plan ทั้งหมด" + "_" + moment().format('DD-MM-YY') + "",
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4]
                                    },
                                    messageTop: null
                                },
                                {
                                    className: 'fa fa-print',
                                    text: " พิมพ์",
                                    title: "",
                                    extend: 'print',
                                    exportOptions: {
                                        columns: [0, 1, 2, 3, 4]
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
                    } else {
                        Session.set('REPOR_RESULT', null)
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    }
                });
            }
        } else {
            console.log("ทุกเขต")
            $('body').addClass('waitMe_body');
            var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
            $('body').prepend(elem);
            Meteor.call('findElderyRegisterGroupByAllZone', year, zone, province, district, db, permission, type, sex, search, function (error, result) {
                if (result.length > 1) {
                    Session.set('REPOR_RESULT', result)
                    Session.set('REPOR_RESULT_SUM', sumResult(result))
                    setTimeout(function () {
                        $('#mytable').DataTable({
                            "ordering": false,
                            dom: '<"html5buttons"B>lTfgitp',
                            lengthChange: false,
                            "info": false,
                            "pageLength": 20,
                            buttons: [{
                                className: 'fa fa-file-excel-o',
                                extend: 'excel',
                                text: " ดาวน์โหลด",
                                title: "รายงาน Care Plan ทั้งหมด" + "_" + moment().format('DD-MM-YY') + "",
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 4]
                                },
                                messageTop: null
                            },
                            {
                                className: 'fa fa-print',
                                text: " พิมพ์",
                                title: "",
                                extend: 'print',
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 4]
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
                } else {
                    Session.set('REPOR_RESULT', null)
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }
            });
        }


        // $('body').addClass('waitMe_body');
        // var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        // $('body').prepend(elem);

        // if(sex == 'ชาย'){
        //     gender = ['เด็กชาย', 'นาย']
        // }else if(sex == 'ชาย'){
        //     gender = ['เด็กหญิง', 'นางสาว', 'นาง']
        // }else{
        //     gender = []
        // }

        // Meteor.call('findDataAll', year, zone, province, district, db, permission, type, sex, search, function(error, result) {
        //     if (result) {
        //         Session.set('data_all', result)
        //         Session.set('page_current', 1)
        //         Session.set('page_all', setPageAll(result))
        //     }
        // });

        // Meteor.call('findElderyRegister', year, zone, province, district, db, permission, type, sex, search, function(error, result) {
        //     if (result.length > 1) {
        //         Session.set('REPOR_RESULT', result)
        //         $('body.waitMe_body').addClass('hideMe');
        //         $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
        //         $('body.waitMe_body').removeClass('waitMe_body hideMe');
        //     }
        // });

    }
})

const listElderCareplan = function (zone, province, amp, year, filterpro, database, healty, retire, typeOf, sex) {
    //console.log(zone);
    //console.log(province);
    //console.log(amp);
    //console.log(year);
    //console.log(filterpro);
    //console.log(database);
    //console.log(healty);
    //console.log(retire);
    //console.log(typeOf);
    //console.log(sex);

    Meteor.call('countAllCP_Hosp', zone, province, amp, year, filterpro, database, healty, retire, typeOf, sex, function (error, result2) {
        //console.log(result2);

        Session.set('countAllCpHosp', result2)
        Meteor.call('countAllElderCP_Hosp', zone, province, amp, year, filterpro, database, healty, retire, typeOf, sex, function (error, result) {
            //console.log(result);

            var concatArr = _.concat(Session.get('countAllCpHosp'), result)
            //console.log(concatArr);

            var output = []; //output array
            var temp = {}; //temp object

            for (var o of concatArr) {
                if (Object.keys(temp).indexOf(o._id) == -1) {
                    temp[o._id] = {}
                    o.totalcp ? temp[o._id].totalcp = o.totalcp : temp[o._id].totalcp = 0
                    o.totalelder ? temp[o._id].totalelder = o.totalelder : temp[o._id].totalelder = 0
                } else {
                    o.totalcp ? temp[o._id].totalcp = temp[o._id].totalcp + o.totalcp : temp[o._id].totalcp
                    o.totalelder ? temp[o._id].totalelder = temp[o._id].totalelder + o.totalelder : temp[o._id].totalelder
                }
            }
            for (var key of Object.keys(temp)) {
                output.push({
                    _id: key,
                    totalcp: temp[key].totalcp,
                    totalelder: temp[key].totalelder,
                    sum: "sum"
                })
            }

            ////console.log(output);

            var soutput = _.sortBy(output, o => o._id)
            var datacp = [],
                dataelder = [],
                zone = []
            _.each(soutput, function (x) {
                zone.push("ต. " + x._id);
                datacp.push(parseInt(x.totalcp));
                dataelder.push(parseInt(x.totalelder));
            });

            Meteor.call('Replace_ServiceCenterCode', output, function (error, result2) {
                //console.log(result2);

                // var soutput = _.sortBy(result2, o => o._id)
                // var datacp = [],
                //     dataelder = [],
                //     zone = []
                // _.each(soutput, function(x) {
                //     zone.push("" + x._id);
                //     datacp.push(parseInt(x.totalcp));
                //     dataelder.push(parseInt(x.totalelder));
                // });

                // var ctx = document.getElementById("graphcp").getContext("2d");
                // var data = {
                //     labels: zone,
                //     datasets: [{
                //         label: "Care Plan",
                //         backgroundColor: "#3C9CDC",
                //         data: datacp
                //     }, {
                //         label: "ผู้สูงอายุที่มีภาวะพึงพิง",
                //         backgroundColor: "#999da3",
                //         data: dataelder
                //     }]
                // };

                // var myBarChart = new Chart(ctx, {
                //     type: 'bar',
                //     data: data,
                //     options: {
                //         scales: {
                //             xAxes: [{
                //                 ticks: {
                //                     min: 0,
                //                     beginAtZero: true
                //                 },

                //             }],
                //             yAxes: [{
                //                 ticks: {
                //                     min: 0,
                //                     beginAtZero: true
                //                 },

                //             }],
                //         }
                //     }
                //});


                var newArray = result2.filter(function (el) {
                    return el.totalelder >= el.totalcp && typeof el._id !== "undefined" && el._id != 'null' && el._id != 'undefined' && el._id != ''
                });

                //console.log(newArray);
                //console.log(newArray.length);

                //console.log(Session.get('HospElderAllCp_J'));
                //console.log(typeof Session.get('HospElderAllCp_J'));
                //console.log(Session.get('HospElderAllCp_J').length);

                if (typeof Session.get('HospElderAllCp_J') !== 'undefined' && Session.get('HospElderAllCp_J').length > 0) {
                    //console.log('HospElderAllCp_J is empty');

                }

                if (typeof newArray !== 'undefined' && newArray.length > 0) {
                    //console.log('newArray is empty');
                    reloadmytable()
                }

                Session.set('HospElderAllCp_J', _.sortBy(newArray, o => o._id))
                //console.log(Session.get('HospElderAllCp_J'));

                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
            });

        });
    });
}

function reloadmytable() {
    setTimeout(function () {
        $('#mytable').DataTable({
            "ordering": false,
            dom: '<"html5buttons"B>lTfgitp',
            lengthChange: false,
            "info": false,
            "pageLength": 20,
            buttons: [{
                className: 'fa fa-file-excel-o',
                extend: 'excel',
                text: " ดาวน์โหลด",
                title: "รายงาน Care Plan ทั้งหมด" + "_" + moment().format('DD-MM-YY') + "",
                exportOptions: {
                    columns: [0, 1, 2, 3, 4]
                },
                messageTop: null
            },
            {
                className: 'fa fa-print',
                text: " พิมพ์",
                title: "",
                extend: 'print',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4]
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
}

function hpcprovince(ID) {
    var provinceSet;
    if (ID == "01") {
        provinceSet = ['เชียงราย', 'เชียงใหม่', 'น่าน', 'พะเยา', 'แพร่', 'แม่ฮ่องสอน', 'ลำปาง', 'ลำพูน'];
    } else if (ID == "02") {
        provinceSet = ['ตาก', 'พิษณุโลก', 'เพชรบูรณ์', 'สุโขทัย', 'อุตรดิตถ์'];
    } else if (ID == "03") {
        provinceSet = ['กำแพงเพชร', 'ชัยนาท', 'นครสวรรค์', 'พิจิตร', 'อุทัยธานี'];
    } else if (ID == "04") {
        provinceSet = ['นนทบุรี', 'นครนายก', 'ปทุมธานี', 'พระนครศรีอยุธยา', 'ลพบุรี', 'สระบุรี', 'สิงห์บุรี', 'อ่างทอง'];
    } else if (ID == "05") {
        provinceSet = ['กาญจนบุรี', 'นครปฐม', 'เพชรบุรี', 'ประจวบคีรีขันธ์', 'ราชบุรี', 'สมุทรสาคร', 'สมุทรสงคราม', 'สุพรรณบุรี'];
    } else if (ID == "06") {
        provinceSet = ['จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ตราด', 'ปราจีนบุรี', 'ระยอง', 'สระแก้ว', 'สมุทรปราการ'];
    } else if (ID == "07") {
        provinceSet = ['กาฬสินธุ์', 'ขอนแก่น', 'มหาสารคาม', 'ร้อยเอ็ด'];
    } else if (ID == "08") {
        provinceSet = ['นครพนม', 'บึงกาฬ', 'เลย', 'สกลนคร', 'หนองคาย', 'หนองบัวลำภู', 'อุดรธานี'];
    } else if (ID == "09") {
        provinceSet = ['ชัยภูมิ', 'นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์'];
    } else if (ID == "10") {
        provinceSet = ['มุกดาหาร', 'ยโสธร', 'ศรีสะเกษ', 'อุบลราชธานี', 'อำนาจเจริญ'];
    } else if (ID == "11") {
        provinceSet = ['กระบี่', 'ชุมพร', 'นครศรีธรรมราช', 'พังงา', 'ภูเก็ต', 'ระนอง', 'สุราษฎร์ธานี'];
    } else if (ID == "12") {
        provinceSet = ['ตรัง', 'นราธิวาส', 'ปัตตานี', 'พัทลุง', 'ยะลา', 'สงขลา', 'สตูล'];
    } else {
        provinceSet = []
    }

    return provinceSet
}

function sumResult(obj) {
    let result = []
    let group1 = 0
    let group2 = 0
    let group3 = 0
    let group4 = 0
    for (i = 0; i < obj.length; i++) {
        group1 += obj[i].GROUP1
        group2 += obj[i].GROUP2
        group3 += obj[i].GROUP3
        group4 += obj[i].GROUP4
        if (i == (obj.length - 1)) {
            result.push({
                HOSPCODE: "",
                NAME: "รวม",
                GROUP1: group1,
                GROUP2: group2,
                GROUP3: group3,
                GROUP4: group4
            })
            return result
        }
    }
}

function setPageAll(x) {
    let _part = parseInt(x) % 10
    return ((parseInt(x) - _part) / 10) + 1
}

Template.registerHelper('getPercent', function (x, y) {
    if (y != 0) {
        let result = (parseInt(x) * 100) / parseInt(y)
        return parseFloat(result).toFixed(2) + ' %'
    } else {
        return '-'
    }

});