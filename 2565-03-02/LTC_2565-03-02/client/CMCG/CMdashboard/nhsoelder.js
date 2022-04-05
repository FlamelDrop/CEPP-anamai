Template.temp_nhso_elder.onRendered(function () {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
    $('body').prepend(elem);
    Meteor.call('getUserCM', Session.get('cmid'), function (error, result) {
        var data = result
        // Session.set('getProfileCM', data)
        if (data) {
            if (data[0].SWITCHING.status) {

                //data[0].HOSPCODE ? data[0].HOSPCODE.CODE = data[0].SWITCHING.code : data[0].DLACODE.CODE = data[0].SWITCHING.code
                if (data[0].SWITCHING.code.length == 5) {
                    console.log('A');
                    
                    data[0].HOSPCODE = {}
                    data[0].DLACODE = null
                    data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                    Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function (error, result2) {
                        // data[0].HOSPCODE.CODE = result2.hospcode
                        data[0].HOSPCODE.NAME = result2.name
                        data[0].HOSPCODE.DISTRICT = result2.district
                        data[0].HOSPCODE.AMPHOE = result2.amphoe
                        data[0].HOSPCODE.PROVINCE = result2.province
                        Session.set('getProfileCM', data);
                        Session.set('nameCen', result2.name);
                        Session.set('nameProvince', result2.province[0] + result2.province[1]);


                        Meteor.call('LISTELDERLYNHSO', result2.hospcode, "01", function (error, result1) {
                            console.log(result1);

                            let data = listElder(result1)

                            Meteor.call('listCpHistoryMulti', data, function (error, res) {
                                
                                for (let i = 0; i < result1.length; i++) {
                                    res.push(result1[i])
                                }

                                var eldernhso = listCareplan(res)

                                Session.set('LISTELDERLYNHSO', eldernhso)

                                setTimeout(function () {
                                    $('#showpic').css("height", $(document).height())
                                    $('#mytablenhso').DataTable({
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
                                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
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
                                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
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

                            //   var workplace = Session.get('getProfileCM')[0].HOSPCODE || Session.get('getProfileCM')[0].DLACODE

                        });

                    });
                    $('#changeComp').val(data[0].SWITCHING.code)

                } else {
                    console.log('B');
                    data[0].DLACODE = {}
                    data[0].HOSPCODE = null
                    data[0].DLACODE.CODE = data[0].SWITCHING.code
                    //console.log(data[0].SWITCHING.code)

                    Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function (error, result2) {
                        // data[0].DLACODE.CODE = result2.DLA_CODE
                        data[0].DLACODE.NAME = result2.NAME
                        data[0].DLACODE.DISTRICT = result2.DISTRICT
                        data[0].DLACODE.PROVINCE = result2.PROVINCE

                        Session.set('getProfileCM', data);
                        Session.set('nameCen', result2.DLA_NAME);
                        Session.set('nameProvince', result2.DLA_CODE[1] + result2.DLA_CODE[2]);

                        Meteor.call('LISTELDERLYNHSO', result2.DLA_CODE, "01", function (error, result1) {

                            let data = listElder(result1)

                            Meteor.call('listCpHistoryMulti', data, function (error, res) {
                                
                                for (let i = 0; i < result1.length; i++) {
                                    res.push(result1[i])
                                }

                                var eldernhso = listCareplan(res)
                                // console.log(eldernhso)

                                Session.set('LISTELDERLYNHSO', eldernhso)

                                setTimeout(function () {
                                    $('#showpic').css("height", $(document).height())
                                    $('#mytablenhso').DataTable({
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
                                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
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
                                                columns: [0, 1, 2, 3, 4, 5, 6, 7]
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




                            //   var workplace = Session.get('getProfileCM')[0].HOSPCODE || Session.get('getProfileCM')[0].DLACODE

                        });

                    });
                    $('#changeComp').val(data[0].SWITCHING.code)

                }

            } else {
                console.log('C');
                var sedata = data[0].HOSPCODE ? data[0].HOSPCODE.CODE = data[0].HOSPCODE.CODE : data[0].DLACODE.CODE

                Meteor.call('LISTELDERLYNHSO', sedata, "01", function (error, result1) {

                    let data = listElder(result1)

                    Meteor.call('listCpHistoryMulti', data, function (error, res) {

                        for (let i = 0; i < result1.length; i++) {
                            res.push(result1[i])
                        }

                        var eldernhso = listCareplan(res)
                        // console.log(eldernhso)

                        Session.set('LISTELDERLYNHSO', eldernhso)

                        setTimeout(function () {
                            $('#showpic').css("height", $(document).height())
                            $('#mytablenhso').DataTable({
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
                                        columns: [0, 1, 2, 3, 4, 5, 6, 7]
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
                                        columns: [0, 1, 2, 3, 4, 5, 6, 7]
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

                    //   var workplace = Session.get('getProfileCM')[0].HOSPCODE || Session.get('getProfileCM')[0].DLACODE

                });

            }
            // var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
            //console.log(service_center)

        }
    });
})

Template.temp_nhso_elder.helpers({
    checkcp() {
        // CHECKED_CAREPLAN

        Meteor.call('CHECKED_CAREPLAN', this.CID, function (err, res) {
            Session.set('CHECKED_CAREPLAN', res);
        })

        return Session.get('CHECKED_CAREPLAN').length == 0
    },
    profile() {

        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }
    },
    EPID() {
        if (Session.get('checkElderID')) {
            if (Session.get('checkElderID').length != 0) {
                return Spacebars.SafeString('<label style="color:red;">รหัสบัตรประชาชนนี้ถูกใช้ลงทะเบียนแล้ว</label>');
            } else if (Session.get('EPID')) {
                return Spacebars.SafeString('<span style="color: green;" class="glyphicon glyphicon-ok"></span>');
            } else {
                return Spacebars.SafeString('<span style="color: red;" class="glyphicon glyphicon-remove"></span>');
            }
        }

    },
    listelder() {
        return Session.get('LISTELDERLYNHSO');
    },
    budyear() {
        var year = []
        for (var i = 2561; i < 2580; i++) {
            year.push({ year: i })
        }
        return year;
    },
    countElder_nhso() {
        if (Session.get('LISTELDERLYNHSO'))
            var myobj = Session.get('LISTELDERLYNHSO').length
        return myobj;
    },
    nameCen() {

        return Session.get('nameCen');
    },
    syncdate() {
        if (Session.get('LISTELDERLYNHSO')) {
            return Session.get('LISTELDERLYNHSO')[0].D_UPDATE;
        } else {
            return "-"
        }
    },
    isNHSO(a) {
        return !a
    }
});

Template.temp_nhso_elder.events({
    'change #budgetyear'(events) {
        
        Session.set('findByBUDGETYEARElder', events.target.value)
        var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        $('#mytablenhso').DataTable().destroy();
        if (events.target.value != "") {
            Meteor.call('LISTELDERLYNHSO', service_center, "01", function (error, result1) {
                
                var filter = _.filter(result1, function (num) { return num.BUDGETYEAR == Session.get('findByBUDGETYEARElder'); });
                // console.log(filter);
                
                let data = listElder(filter)
                // console.log(data);
                
                Meteor.call('listCpHistoryMulti', data, function (error, res) {
                    // console.log(res);
                    
                    for (let i = 0; i < filter.length; i++) {
                        res.push(filter[i])
                    }

                    var eldernhso = listCareplan(res)
                    // console.log(eldernhso)

                    Session.set('LISTELDERLYNHSO', eldernhso)

                    dTable_elder();
                });
            });

        } else {
            Meteor.call('LISTELDERLYNHSO', service_center, "01", function (error, result1) {

                let data = listElder(result1)
                Meteor.call('listCpHistoryMulti', data, function (error, res) {

                    for (let i = 0; i < result1.length; i++) {
                        res.push(result1[i])
                    }

                    var eldernhso = listCareplan(res)

                    Session.set('LISTELDERLYNHSO', eldernhso)

                    dTable_elder();
                });

            });
        }


    },
    // 'click #removenhso'() {
    //     var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
    //     if (confirm('ต้องการลบใช่หรือใหม่')) {
    //         Meteor.call('elderbyRemove', this.CID, function (error, result) {
    //             Meteor.call('LISTELDERLYNHSO', service_center, "01", function (error, result) {
    //                 let data = listElder(result)
    
    //                 Meteor.call('listCpHistoryMulti', data, function (error, res) {
                    
    //                     for (let i = 0; i < result.length; i++) {
    //                         res.push(result[i])
    //                     }
    
    //                     var eldernhso = listCareplan(res)
    
    //                     Session.set('LISTELDERLYNHSO', eldernhso)
    //                     $('#mytablenhso').DataTable().destroy();
    //                     dTable_elder();
    //                 });
    //             })
    //         })

    //     }
    // },
    'click #sync'() {
        var year
        let service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
        $('body').prepend(elem);
        $('#mytablenhso').DataTable().destroy();
        NProgress.start();
        if (year != "") {
            year = $('#budgetyear').val()
        } else {
            year = parseInt(moment().format('YYYY')) + 543
        }
        Meteor.call('getElderDataByHospcode', service_center, year, function (error, result) {
            if (result) {
                Meteor.call('upsertELDERLYREGISTER', result.data, function (error, result) {
                    Meteor.call('LISTELDERLYNHSO', service_center, function (error, result1) {
                        var filter = _.filter(result1, function (num) { return num.BUDGETYEAR == Session.get('findByBUDGETYEARElder'); });
                        
                        let data = listElder(filter)

                        Meteor.call('listCpHistoryMulti', data, function (error, res) {
                            for (let i = 0; i < filter.length; i++) {
                                res.push(filter[i])
                            }

                            var eldernhso = listCareplan(res)

                            Session.set('LISTELDERLYNHSO', eldernhso)
                            dTable_elder();
                        });

                    });

                });
            } else {

                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                alert('ไม่พบข้อมูลที่ค้นหา')

            }

        });
    },
    'click #tocp'() {
        Session.set('elderID', this);
        Router.go('/careplanhistory');
    },
    'change #statusElder'(events) {
        if (confirm("ท่านกำลังเปลี่ยนสถานะของ " + this.PRENAME + "" + this.NAME + " " + this.LNAME + " ต้องการดำเนินการต่อหรือไม่")) {

            ELDERLYREGISTER.update({
                "_id": this._id
            }, {
                $set: {
                    STATUS: event.target.value.toString(),
                }

            })
            var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
            Meteor.call('LISTELDERLYNHSO', service_center, "01", function (error, result1) {
                let data = listElder(result1)

                Meteor.call('listCpHistoryMulti', data, function (error, res) {

                    for (let i = 0; i < result1.length; i++) {
                        res.push(result1[i])
                    }

                    var eldernhso = listCareplan(res)

                    Session.set('LISTELDERLYNHSO', eldernhso)
                    dTable_elder();
                });
            });
            toastr.success("แก้ไขข้อมูลสถานะผู้สูงอายุเรียบร้อย", "สำเร็จ");
        }
    }
});

function dTable_elder() {
    setTimeout(function () {
        $('#showpic').css("height", $(document).height())
        $('#mytablenhso').DataTable({
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
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
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
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
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
        NProgress.done();
    }, 500)
}

function listCareplan(x) {
    var output = []; //output array
    var temp = {}; //temp object

    for (var o of x) {
        if (Object.keys(temp).indexOf(o.CID) == -1) {
            temp[o.CID] = {}
            o.CAREPLANID ? temp[o.CID].CAREPLANID = o.CAREPLANID : temp[o.CID].CAREPLANID = ""
            o.PRENAME ? temp[o.CID].PRENAME = o.PRENAME : temp[o.CID].PRENAME = ""
            o.NAME ? temp[o.CID].NAME = o.NAME : temp[o.CID].NAME = ""
            o.LNAME ? temp[o.CID].LNAME = o.LNAME : temp[o.CID].LNAME = ""
            o.MAIN ? temp[o.CID].MAIN = o.MAIN : temp[o.CID].MAIN = ""
            o.HOSPCODE ? temp[o.CID].HOSPCODE = o.HOSPCODE : temp[o.CID].HOSPCODE = ""
            o.VENDERCODE ? temp[o.CID].VENDERCODE = o.VENDERCODE : temp[o.CID].VENDERCODE = ""
            o.ADL ? temp[o.CID].ADL = o.ADL : temp[o.CID].ADL = ""
            o.TAI ? temp[o.CID].TAI = o.TAI : temp[o.CID].TAI = ""
            o.GROUPID ? temp[o.CID].GROUPID = o.GROUPID : temp[o.CID].GROUPID = ""
            o.MAININSC ? temp[o.CID].MAININSC = o.MAININSC : temp[o.CID].MAININSC = ""
            o.CONFIRM ? temp[o.CID].CONFIRM = o.CONFIRM : temp[o.CID].CONFIRM = ""
            o.CREATEDATE ? temp[o.CID].CREATEDATE = o.CREATEDATE : temp[o.CID].CREATEDATE = ""
            o.D_UPDATE ? temp[o.CID].D_UPDATE = o.D_UPDATE : temp[o.CID].D_UPDATE = ""
            o.PHONE ? temp[o.CID].PHONE = o.PHONE : temp[o.CID].PHONE = ""
            o.ADDRESS ? temp[o.CID].ADDRESS = o.ADDRESS : temp[o.CID].ADDRESS = ""
            o.BIRTHDATE ? temp[o.CID].BIRTHDATE = o.BIRTHDATE : temp[o.CID].BIRTHDATE = ""
            o.STATUS ? temp[o.CID].STATUS = o.STATUS : temp[o.CID].STATUS = ""
            o.ZONE ? temp[o.CID].ZONE = o.ZONE : temp[o.CID].ZONE = ""
            o.BUDGETYEAR ? temp[o.CID].BUDGETYEAR = o.BUDGETYEAR : temp[o.CID].BUDGETYEAR = ""
            o.PRIVILEGE ?temp[o.CID].PRIVILEGE = o.PRIVILEGE : temp[o.CID].PRIVILEGE = ""
            o.NHSO ?temp[o.CID].NHSO = o.NHSO : temp[o.CID].NHSO = ""
        } else {
            o.CAREPLANID ? temp[o.CID].CAREPLANID = temp[o.CID].CAREPLANID + o.CAREPLANID : temp[o.CID].CAREPLANID
            o.PRENAME ? temp[o.CID].PRENAME = temp[o.CID].PRENAME + o.PRENAME : temp[o.CID].PRENAME
            o.NAME ? temp[o.CID].NAME = temp[o.CID].NAME + o.NAME : temp[o.CID].NAME
            o.LNAME ? temp[o.CID].LNAME = temp[o.CID].LNAME + o.LNAME : temp[o.CID].LNAME
            o.MAIN ? temp[o.CID].MAIN = temp[o.CID].MAIN + o.MAIN : temp[o.CID].MAIN
            o.HOSPCODE ? temp[o.CID].HOSPCODE = o.HOSPCODE : temp[o.CID].HOSPCODE
            o.VENDERCODE ? temp[o.CID].VENDERCODE = o.VENDERCODE : temp[o.CID].VENDERCODE
            o.ADL ? temp[o.CID].ADL = o.ADL : temp[o.CID].ADL
            o.TAI ? temp[o.CID].TAI = o.TAI : temp[o.CID].TAI
            o.GROUPID ? temp[o.CID].GROUPID = o.GROUPID : temp[o.CID].GROUPID
            o.MAININSC ? temp[o.CID].MAININSC = o.MAININSC : temp[o.CID].MAININSC
            o.CONFIRM ? temp[o.CID].CONFIRM = o.CONFIRM : temp[o.CID].CONFIRM
            o.CREATEDATE ? temp[o.CID].CREATEDATE = o.CREATEDATE : temp[o.CID].CREATEDATE
            o.D_UPDATE ? temp[o.CID].D_UPDATE = o.D_UPDATE : temp[o.CID].D_UPDATE
            o.PHONE ? temp[o.CID].PHONE = o.PHONE : temp[o.CID].PHONE
            o.ADDRESS ? temp[o.CID].ADDRESS = o.ADDRESS : temp[o.CID].ADDRESS
            o.BIRTHDATE ? temp[o.CID].BIRTHDATE = o.BIRTHDATE : temp[o.CID].BIRTHDATE
            o.STATUS ? temp[o.CID].STATUS = o.STATUS : temp[o.CID].STATUS
            o.ZONE ? temp[o.CID].ZONE = o.ZONE : temp[o.CID].ZONE
            o.BUDGETYEAR ? temp[o.CID].BUDGETYEAR = o.BUDGETYEAR : temp[o.CID].BUDGETYEAR
            o.PRIVILEGE ? temp[o.CID].PRIVILEGE = o.PRIVILEGE : temp[o.CID].PRIVILEGE
            o.NHSO ? temp[o.CID].NHSO = o.NHSO : temp[o.CID].NHSO
        }
    }

    for (var key of Object.keys(temp)) {
        output.push({
            CAREPLANID: temp[key].CAREPLANID,
            CID: key,
            PRENAME: temp[key].PRENAME,
            NAME: temp[key].NAME,
            LNAME: temp[key].LNAME,
            MAIN: temp[key].MAIN,
            HOSPCODE: temp[key].HOSPCODE,
            VENDERCODE: temp[key].VENDERCODE,
            ADL: temp[key].ADL,
            TAI: temp[key].TAI,
            GROUPID: temp[key].GROUPID,
            MAININSC: temp[key].MAININSC,
            CONFIRM: temp[key].CONFIRM,
            CREATEDATE: temp[key].CREATEDATE,
            D_UPDATE: temp[key].D_UPDATE,
            PHONE: temp[key].PHONE,
            ADDRESS: temp[key].ADDRESS,
            BIRTHDATE: temp[key].BIRTHDATE,
            STATUS: temp[key].STATUS,
            ZONE: temp[key].ZONE,
            BUDGETYEAR: temp[key].BUDGETYEAR,
            PRIVILEGE: temp[key].PRIVILEGE,
            NHSO: temp[key].NHSO
        })
    }
    return output;
}

function listElder(x) {
    var data = []
    for (let i = 0; i < x.length; i++) {
        const e = x[i];
        data.push(e.CID)
    }
    return data;
}