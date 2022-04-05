Template.careplanhistory.onCreated(function () {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
    $('body').prepend(elem);
})
Template.careplanhistory.onRendered(function () {

    Session.set('budgetYear', null)
    Session.set('initialCPId', null)
    Session.set('SHOTTERM', null)
    Session.set('printsimple', null);
    Session.set('datacpElder', null);
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

    if (Session.get('elderID')) {
        Meteor.call('listCpHistory', Session.get('elderID').CID, function (error, result) {
            // console.log(result);
            Session.set('listCpHistory', result);
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        });
    }

});

Template.careplanhistory.helpers({
    showname() {
        return Session.get("cmname");
    },
    profile() {
        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }
    },
    nameelder() {
        if (Session.get('elderID')) {
            var data = Session.get('elderID');
            return data.PRENAME + data.NAME + " " + data.LNAME;
        }
    },
    listCpHistory() {
        return Session.get('listCpHistory');
    },
    copyFrom() {
        let str = this.COPYFROM;
        return str.substring(str.indexOf('('), 1 + str.indexOf(')'));
    }
})

Template.careplanhistory.events({
    'click #search'() {
        Meteor.call('elderbycid', $('#cidinput').val(), function (error, result) {
            Session.set('eldercp', result);
        });
    },
    'click #nowaddressbtn'() {
        $('#nowaddress').val(Session.get('eldercp')[0].ADDRESS)
    },
    'click .create'() {
        $('#m_budgetYear').modal('show')

        // Session.set('datacpElder', {})
        // Router.go('/searchelder');
    },
    'click #next'() {
        $('#m_budgetYear').modal('hide')
        setTimeout(function () {
            Session.set('budgetYear', $("#byear").val())
            Session.set('datacpElder', {})
            Router.go('/searchelder');
        }, 500);

    },
    'click #printsimple'() {
        Session.set('printsimple', this);
        setTimeout(function () {
            Router.go('/previewprintcpsimple');
        }, 500);

    },
    'click #printfull'() {
        Session.set('printsimple', this);
        setTimeout(function () {
            Router.go('/previewprintfull');
        }, 500);
    },
    'click #remove'() {
        if (confirm('ต้องการลบข้อมูลแผนการดูแลฉบับนี้ใช่หรือไม่')) {
            Meteor.call('removecareplan', this._id, function (error, result) {
                if (Session.get('elderID')) {
                    Meteor.call('listCpHistory', Session.get('elderID').CID, function (error, result) {
                        Session.set('listCpHistory', result);
                    });
                }
            });
        }
    },
    'click #edit'() {
        var obj = this
        obj.checkEdit = true;
        Session.set('initialCPId', this._id);
        Session.set('datacpElder', obj)
        Router.go('/searchelder');
    },
    'click #editdate'() {
        $('#e_datecp').modal('show')
        Session.set('setEditCreateDateCp', this.CREATEDATE)
        setTimeout(function () {
            $("#cpdate").datetimepicker({
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

            var dm = moment(Session.get('setEditCreateDateCp')).format('DD/MM/')
            var y = parseInt(moment(Session.get('setEditCreateDateCp')).format('YYYY')) + 543;
            $("#cpdate").val(dm + y)
        }, 1000)
        Session.set('getCpCAREPLANIDUpdateDate', this.CAREPLANID)
        Session.set('getCpIdUpdateDate', this._id)
        Session.set('getCpCidUpdateDate', this.CID)
        Session.set('getCpHcodeUpdateDate', this.HOSPCODE)
    },
    'click #s_cpdate'() {
        var bdateString = $("#cpdate").val().split("/");
        var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
        //console.log(Session.get('eldercp'))
        var careid = Session.get('getCpCAREPLANIDUpdateDate');
        Meteor.call('editCpCreateDate', Session.get('getCpIdUpdateDate'), bdate, careid, Session.get('getCpCidUpdateDate'), Session.get('getCpHcodeUpdateDate'), function (err, res) {
            $('body').addClass('waitMe_body');
            var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
            $('body').prepend(elem);
            Meteor.call('listCpHistory', Session.get('elderID').CID, function (error, result) {
                Session.set('listCpHistory', result);
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                $('#e_datecp').modal('hide')
            });
        });
    },
    'click #addfull'() {
        Session.set('datacpElder', this)
        Session.set('initialCPId', this._id);
        Router.go('/fullcareplan');
    },
    'click input[name=b1_1]'(eve, template) {
        // console.log(eve.target.value)
        var idcheck = '#' + eve.target.value
        if ($(idcheck).hasClass("imChecked")) {
            $(idcheck).removeClass("imChecked");
            $(idcheck).prop('checked', false);
        } else {
            $(idcheck).prop('checked', true);
            $(idcheck).addClass("imChecked");
        }
    },
    'click #copy_cp'(event, template) {
        var selected = template.findAll("input[name=b1_1]:checked");
        if ($(selected).val()) {
            $('body').addClass('waitMe_body');
            var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
            $('body').prepend(elem);
            Meteor.call('COPYCAREPLAN', $(selected).val(), function () {
                Meteor.call('listCpHistory', Session.get('elderID').CID, function (error, result) {
                    Session.set('listCpHistory', result);
                    $(selected).removeAttr('checked');
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                });
            })
        } else {
            toastr.warning("กรุณาเลือก careplan ที่จะทำการคัดลอก", "ไม่สำเร็จ");
        }
    }
})