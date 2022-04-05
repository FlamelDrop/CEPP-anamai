Template.admineditelder.onCreated(function () {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})

Template.admineditelder.onRendered(function () {
    Session.set('HOSPCODE', null)
    Session.set('switchCompany', null)
    Session.set('elderDataByCid', null)
    

    $('#privilege').selectize({
        plugins: ['remove_button'],
        delimiter: ',',
        create: function (input) {
            return { value: input, text: input };
        },
        persist: false,
        sortField: 'text'
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
    $("#BIRTHDATE").datetimepicker({
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

        Meteor.call('elderby_id', Session.get('idElder'), function (err, result) {
            console.log(result);

            if (result) {

                Session.set('HOSPCODE', result[0].HOSPCODE);
                Session.set('elderDataByCid', result[0]);
                var dm = moment(result[0].BIRTHDATE).format('MM/DD/')
                var y = parseInt(moment(result[0].BIRTHDATE).format('YYYY')) + 543;
                $("#CID").val(result[0].CID);
                $("#PRENAME").val(result[0].PRENAME);
                $("#NAME").val(result[0].NAME);
                $("#LNAME").val(result[0].LNAME);
                $("#ADL").val(result[0].ADL);
                $("#TAI").val(result[0].TAI);
                $("#GROUPID").val(result[0].GROUPID);
                $("#PHONE").val(result[0].PHONE);
                $("#ADDRESS").val(result[0].ADDRESS);
                $("#BIRTHDATE").val(dm + y);
                var selectField = $('#privilege')[0].selectize;
                selectField.addItem(result[0].PRIVILEGE, true);

                if(result[0].HOSPCODE.length == 5){
                    console.log('AAAA');
                    $("#radio_company").attr('checked', 'checked');
                    Session.set('switchCompany', true)
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                }else{
                    Session.set('switchCompany', false)
                    $("#radio_dla").attr('checked', 'checked');
                    console.log('B');
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');

                }
            }
        });
 
    } else {
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
    }

})

Template.admineditelder.helpers({
    switchCompany() {

        console.log(Session.get('switchCompany'));
        console.log(Session.get('HOSPCODE'));
        console.log(Session.get('HOSPCODE').length);

            if (Session.get('switchCompany')) {
                if (Session.get('HOSPCODE').length == 5) {
                    Meteor.call('getAllServiceCenter', function (error, result) {
                        console.log(result);
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                        var $select = $("#companyName").selectize();
                        var selectize = $select[0].selectize;
                        selectize.setValue(selectize.search(Session.get('HOSPCODE')).query);
                        Meteor.call('getAllServiceCenterDistrict', Session.get('HOSPCODE'), function (error, result) {
                            Session.set('getEditedZoneCMbyHOSPCODE', result)
                            console.log(result);
                            $('.circle_companyName').css('display' , 'none');
                            $('.admin_companyName').removeClass('admin_companyName');
                        });
                    });
                    return true
                } else {
                    Meteor.call('getAllServiceCenter', function (error, result) {
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                        $('.circle_companyName').css('display' , 'none');
                        $('.admin_companyName').removeClass('admin_companyName');
                    });
                    return true
                }
            } else {
                console.log(Session.get('HOSPCODE'));
                
                if (Session.get('HOSPCODE').length == 7) {
                    Meteor.call('getDLA_NAME', Session.get('HOSPCODE'), function (error, result) {
                        console.log(result);

                        if (result) {
                            Session.set('getDLA_Detail', result);
                            Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                                console.log(result);
                                Session.set('getZoneByDLA', result);
                                Meteor.call('getAllDLA_CODE', function (error, result) {
                                    $('#dla')[0].selectize.destroy()
                                    $('#dla').selectize({ options: result, create: false });
                                    var $select = $("#dla").selectize();
                                    var selectize = $select[0].selectize;
                                    selectize.setValue(selectize.search(Session.get('HOSPCODE')).query);
                                    $('.circle_dla').css('display' , 'none');
                                    $('.admin_dla').removeClass('admin_dla');
                                });
                            })
                        }

                    });
        
                    return false
                } else {
                    console.log('B');
                    
                    Meteor.call('getAllDLA_CODE', function (error, result) {
                        $('#dla')[0].selectize.destroy()
                        $('#dla').selectize({ options: result, create: false });
                        $('.circle_dla').css('display' , 'none');
                        $('.admin_dla').removeClass('admin_dla');
                    });
                    return false
                }
            }
    },
})

Template.admineditelder.events({
    "change #companyName"() {
        Session.set('HOSPCODE', $('#companyName').val())
        console.log($('#companyName').val());
    },
    "change #dla"(event) {
        Session.set('HOSPCODE', $('#dla').val())
        console.log($('#dla').val());
        
        Meteor.call('getDLA_NAME', $('#dla').val(), function (error, result) {
            if (result) {
                Session.set('getDLA_Detail', result);
                Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                    Session.set('getZoneByDLA', result);
                })
            }
        });
    },
    'click #save'() {

        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);

        var check_service = Session.get('getDLA_Detail') || Session.get('getEditedZoneCMbyHOSPCODE')
        console.log(check_service);

        if (check_service && $("#NAME").val() && $("#LNAME").val()  && $("#ADL").val() && $("#TAI").val() && $("#GROUPID").val() && $("#PHONE").val() && $("#ADDRESS").val() && $("#BIRTHDATE").val()) {
            var bdateString = $("#BIRTHDATE").val().split("/");
            var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0);

            if(Session.get('switchCompany')){
                var data = Session.get('getEditedZoneCMbyHOSPCODE');
                console.log(data);
    
                var hospcode = data.hospcode
                var name = data.name
                var code = data.hospcode
                var province = data.province.slice(3);
                var amphoe = data.amphoe.slice(3);
                var district = data.district.slice(3);
                var zone = data.zone;
                console.log(zone);

                Meteor.call('upDateADMINELDERLY', Session.get('idElder'), $("#CID").val(), $("#PRENAME").val(), $("#NAME").val(), $("#LNAME").val(), $("#VENDERCODE").val(), $("#ADL").val(), $("#TAI").val(), $("#GROUPID").val(), $("#PHONE").val(), $("#ADDRESS").val(), bdate,$('#privilege').val(), hospcode, name, code, province, amphoe, district, zone, function (error, result) {
                    console.log('upDateADMINELDERLY');

                    Meteor.call('elderby_multicid', Session.get('arr_elder'), function (error, result) {
                        //console.log(result);
                        Session.set('list_adminelder', result)
                        toastr.success("บันทึกข้อมูลเรียบร้อย", "สำเร็จ");
                        Session.set('active', "4");
                        Router.go('/admin')

                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    });
             
                });
            }else{
                var data = Session.get('getDLA_Detail');
                console.log(data);
    
                var hospcode = data.DLA_CODE
                var name = data.DLA_NAME
                var code = data.DLA_CODE
                var province = data.PROVINCE;
                var amphoe = data.TAMBON;
                var district = data.DISTRICT;
                var zone = Session.get('getZoneByDLA');
                // var zone = hpcid(province)
                console.log(zone);
    
                Meteor.call('upDateADMINELDERLY', Session.get('idElder'), $("#CID").val(), $("#PRENAME").val(), $("#NAME").val(), $("#LNAME").val(), $("#VENDERCODE").val(), $("#ADL").val(), $("#TAI").val(), $("#GROUPID").val(), $("#PHONE").val(), $("#ADDRESS").val(), bdate,$('#privilege').val(), hospcode, name, code, province, amphoe, district, zone, function (error, result) {
                    console.log('upDateADMINELDERLY');

                    Meteor.call('elderby_multicid', Session.get('arr_elder'), function (error, result) {
                        //console.log(result);
                        Session.set('list_adminelder', result)
                        toastr.success("บันทึกข้อมูลเรียบร้อย", "สำเร็จ");
                        Session.set('active', "4");
                        Router.go('/admin')

                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                    });

                });
            }
            
        } else {
            console.log('else');
            toastr.warning("กรุณากรอกข้อมูลให้ครบถ้วน", "ไม่สำเร็จ");
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        }
    },
    'change #TAI'() {
        if ($('#TAI').val() == "I1" || $('#TAI').val() == "I2") {
            $('#GROUPID').val('4')
        } else if ($('#TAI').val() == "I3") {
            $('#GROUPID').val('3')
        } else if ($('#TAI').val() == "C2" || $('#TAI').val() == "C3" || $('#TAI').val() == "C4") {
            $('#GROUPID').val('2')
        } else {
            $('#GROUPID').val('1')
        }
    },
    "click  #radio_company"() {
        Session.set('switchCompany', true)
        Session.set('getDLA_Detail', "");
    },
    "click  #radio_dla"() {
        Session.set('switchCompany', false)
        Session.set('getEditedZoneCMbyHOSPCODE', "")
    },
    "click #return"() {
        Session.set('active', "4");
        Router.go('/admin')
    },
})

Template.select_company_hpc_admin.onRendered(function init() {
    $('#companyName').selectize();
    Meteor.call('getAllServiceCenter', function (error, result) {
        // $('#companyName')[0].selectize.destroy()
        $('#companyName').selectize({ options: result, create: false });
    });
});

Template.select_dla_hpc_admin.onRendered(function init() {
    $('#dla').selectize();
    Meteor.call('getAllDLA_CODE', function (error, result) {
        //$('#dla')[0].selectize.destroy()
        $('#dla').selectize({ options: result, create: false });
    });
});