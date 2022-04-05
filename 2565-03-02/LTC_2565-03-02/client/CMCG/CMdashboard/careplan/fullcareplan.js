Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

Template.fullcareplan.onRendered(function () {
    Session.set('act', []);
    if (Session.get('datacpElder').fullcp) {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
        $('body').prepend(elem);
        setTimeout(() => {
            var fcpData = Session.get('datacpElder')
            var sz_option = {
                plugins: ['remove_button'],
                delimiter: ',',
                persist: false,
                create: function (input) {
                    return { value: input, text: input };
                },
                sortField: 'text'
            }
            // $('#thinkelder').val(fcpData.IDEAELDER)
            var $thinkelder = $("#thinkelder").selectize(sz_option);
            var thinkelder_sz = $thinkelder[0].selectize;
            _.each(fcpData.IDEAELDER, function (x) { thinkelder_sz.addOption({ text: x, value: x }); thinkelder_sz.addItem(x); thinkelder_sz.refreshItems(); })
            // $('#thinkrelative').val(fcpData.IDEARELATIVE)
            var $thinkrelative = $("#thinkrelative").selectize(sz_option);
            var thinkrelative_sz = $thinkrelative[0].selectize;
            _.each(fcpData.IDEARELATIVE, function (x) { thinkrelative_sz.addOption({ text: x, value: x }); thinkrelative_sz.addItem(x); thinkrelative_sz.refreshItems(); })
            // $('#otherservice').val(fcpData.OTHERSERVICE)
            var $otherservice = $("#otherservice").selectize(sz_option);
            var otherservice_sz = $otherservice[0].selectize;
            _.each(fcpData.OTHERSERVICE, function (x) { otherservice_sz.addOption({ text: x, value: x }); otherservice_sz.addItem(x); otherservice_sz.refreshItems(); })
            //$('#otherphysic').val(fcpData.OTHERPHYSIC)
            var $otherphysic = $("#otherphysic").selectize(sz_option);
            var otherphysic_sz = $otherphysic[0].selectize;
            _.each(fcpData.OTHERPHYSIC, function (x) { otherphysic_sz.addOption({ text: x, value: x }); otherphysic_sz.addItem(x); otherphysic_sz.refreshItems(); })
            // $('#otherdoctor').val(fcpData.MEDICALEQUIPMENT)
            var $otherdoctor = $("#otherdoctor").selectize(sz_option);
            var otherdoctor_sz = $otherdoctor[0].selectize;
            _.each(fcpData.MEDICALEQUIPMENT, function (x) { otherdoctor_sz.addOption({ text: x, value: x }); otherdoctor_sz.addItem(x); otherdoctor_sz.refreshItems(); })

            var $activitybase = $("#activitybase").selectize(sz_option);
            var activitybase_sz = $activitybase[0].selectize;
            _.each(fcpData.ACTIVITYBASE, function (x) { activitybase_sz.addOption({ text: x, value: x }); activitybase_sz.addItem(x); activitybase_sz.refreshItems(); })

            $('#activitybase').val(fcpData.ACTIVITYBASE)
            $('#cgworkhour').val(fcpData.CGWORKHOUR)
            $('#cgworkmin').val(fcpData.CGWORKMIN)
            $('#cgworkfreq').val(fcpData.CGWORKFREQ)

            Meteor.call('listcareACTIVITY', Session.get('initialCPId'), function (error, result) {
                Session.set('listcareACTIVITY', result);
                // for (var i = 0; i < result.length; i++) {
                //     arr.push(result[i])
                // }
                Session.set('act', result);
            });
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        }, 1500);
    }
    if (Session.get('getProfileCM')) {
        var service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.CODE : Session.get('getProfileCM')[0].DLACODE.CODE
        Meteor.call('getALLCGByHOSP', service_center, function (error, result) {
            Session.set('getCGForCareplan', result);
        });
        Session.set('act', []);
        $('#person').selectize({
            create: function (input) {
                return { value: input, text: input };
            },
        })
        $('#activitybase').selectize({
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: function (input) {
                return { value: input, text: input };
            },
        })
        //arr = [];
    }
});

Template.fullcareplan.helpers({
    showname() {
        return Session.get("cmname");
    },
    profile() {
        if (Session.get('getProfileCM')) {
            return Session.get('getProfileCM')[0];
        }
    },
    A1() {
        Meteor.call('getCareCode', "A", function (error, result) {
            var obj = [];
            for (var i = result.length - 1; i >= 0; i--) {

                if (result[i].CARECODE[1] == "1") {
                    obj.push(result[i])
                }
            }
            Session.set('A', obj);
            setInterval(function () {
                $('#thinkelder').selectize({
                    plugins: ['remove_button'],
                    delimiter: ',',
                    persist: false,
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text'
                });
            }, 500);
        });
        return Session.get('A');
    },
    A2() {
        Meteor.call('getCareCode', "A", function (error, result) {
            var obj = [];
            for (var i = result.length - 1; i >= 0; i--) {

                if (result[i].CARECODE[1] == "2") {
                    obj.push(result[i])
                }
            }
            Session.set('A2', obj);
            setInterval(function () {
                $('#thinkrelative').selectize({
                    plugins: ['remove_button'],
                    delimiter: ',',
                    persist: false,
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text'
                });
            }, 500);
        });
        return Session.get('A2');
    },
    G1() {
        Meteor.call('getCareCode', "G", function (error, result) {
            var obj = [];
            for (var i = result.length - 1; i >= 0; i--) {

                if (result[i].CARECODE[1] != "2" && result[i].CARECODE[1] != "3") {
                    obj.push(result[i])
                }
            }
            Session.set('G1', obj);
            setInterval(function () {
                $('#otherservice').selectize({
                    plugins: ['remove_button'],
                    delimiter: ',',
                    persist: false,
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text'
                });
            }, 500);
        });
        return Session.get('G1');
    },
    G2() {
        Meteor.call('getCareCode', "G", function (error, result) {
            var obj = [];
            for (var i = result.length - 1; i >= 0; i--) {

                if (result[i].CARECODE[1] == "2") {
                    obj.push(result[i])
                }
            }
            Session.set('G2', obj);
            setInterval(function () {
                $('#otherphysic').selectize({
                    plugins: ['remove_button'],
                    delimiter: ',',
                    persist: false,
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text'
                });
            }, 500);
        });
        return Session.get('G2');
    },
    G3() {
        Meteor.call('getCareCode', "G", function (error, result) {
            var obj = [];
            for (var i = result.length - 1; i >= 0; i--) {

                if (result[i].CARECODE[1] == "3") {
                    obj.push(result[i])
                }
            }
            Session.set('G3', obj);
            setInterval(function () {
                $('#otherdoctor').selectize({
                    plugins: ['remove_button'],
                    delimiter: ',',
                    persist: false,
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text'
                });
            }, 500);
        });
        return Session.get('G3');
    },
    Ac11() {
        Meteor.call('getCareCode', "11", function (error, result) {
            Session.set('Ac11', result);


        });
        return Session.get('Ac11');
    },
    Ac12() {
        Meteor.call('getCareCode', "12", function (error, result) {
            Session.set('Ac12', result);
        });
        return Session.get('Ac12');
    },
    Ac13() {
        Meteor.call('getCareCode', "13", function (error, result) {
            Session.set('Ac13', result);

        });
        return Session.get('Ac13');
    },
    Ac14() {
        Meteor.call('getCareCode', "14", function (error, result) {
            Session.set('Ac14', result);

        });
        return Session.get('Ac14');
    },
    Ac15() {
        Meteor.call('getCareCode', "15", function (error, result) {
            Session.set('Ac15', result);

        });
        return Session.get('Ac15');
    },
    Ac16() {
        Meteor.call('getCareCode', "16", function (error, result) {
            Session.set('Ac16', result);

        });
        return Session.get('Ac16');
    },
    Ac25() {
        Meteor.call('getCareCode', "25", function (error, result) {
            Session.set('Ac26', result);
            setInterval(function () {
                $('#activity').selectize({
                    create: function (input) {
                        return { value: input, text: input };
                    }
                });
            }, 500);
        });
        return Session.get('Ac25');
    },
    Ac26() {
        Meteor.call('getCareCode', "26", function (error, result) {
            Session.set('Ac26', result);
        });
        return Session.get('Ac26');
    },
    Ac27() {
        Meteor.call('getCareCode', "27", function (error, result) {
            Session.set('Ac27', result);
        });
        return Session.get('Ac27');
    },
    Ac28() {
        Meteor.call('getCareCode', "28", function (error, result) {
            Session.set('Ac28', result);
        });
        return Session.get('Ac28');
    },
    Ac29() {
        Meteor.call('getCareCode', "29", function (error, result) {
            Session.set('Ac29', result);

        });
        return Session.get('Ac29');
    },
    Ac34() {
        Meteor.call('getCareCode', "34", function (error, result) {
            Session.set('Ac34', result);

        });
        return Session.get('Ac34');
    },
    Ac35() {
        Meteor.call('getCareCode', "35", function (error, result) {
            Session.set('Ac35', result);

        });
        return Session.get('Ac35');
    },
    Ac41() {
        Meteor.call('getCareCode', "41", function (error, result) {
            Session.set('Ac41', result);
            setInterval(function () {
                $('#activity').selectize({
                    create: function (input) {
                        return { value: input, text: input };
                    },
                    sortField: 'text'
                });
            }, 500);
        });
        return Session.get('Ac41');
    },
    listAdmincode() {
        Meteor.call('getAllAdmincode', function (error, result) {
            Session.set('getAllAdmincode', result);
            setTimeout(function () {
                $('#admincode').selectize({
                    create: function (input) {
                        return { value: input, text: input };
                    },
                });
            }, 500);
        });
        return Session.get('getAllAdmincode');
    },
    cglist() {
        //

        return Session.get('getCGForCareplan');
    },
    listCompany() {
        if (Session.get('getProfileCM')) {
            service_center = Session.get('getProfileCM')[0].HOSPCODE ? Session.get('getProfileCM')[0].HOSPCODE.NAME : Session.get('getProfileCM')[0].DLACODE.NAME
            return service_center
        }
    },
    cgname() {
        return {
            CGNAME: Session.get('datacpElder').CGNAME,
            CGID: Session.get('datacpElder').CGID
        }
    },
    listcare() {
        return Session.get('act')
    },
    checkEdit() {
        return Session.get('datacpElder').fullcp
    }
})
Template.fullcareplan.events({
    'click #edit'() {

        $('#edit_act').selectize({
            create: function (input) {
                return { value: input, text: input };
            }
        });

        var $select_act = $("#edit_act").selectize();
        var se_act = $select_act[0].selectize;
        se_act.addOption({ text: this.ACTIVITY, value: this.ACTIVITY });
        se_act.addItem(this.ACTIVITY);
        se_act.refreshItems();

        //     se_act.setValue(se_act.search(this.ACTIVITY).query.toUpperCase());



        $('#edit_acode').selectize({
            create: function (input) {
                return { value: input, text: input };
            }
        });
        var $select_code = $("#edit_acode").selectize();
        var se_code = $select_code[0].selectize;
        // se_code.setValue(se_code.search(this.ADMIN).query.toUpperCase());
        se_code.addOption({ text: this.ADMIN, value: this.ADMIN });
        se_code.addItem(this.ADMIN);
        se_code.refreshItems();

        $('#edit_acode').selectize({
            create: function (input) {
                return { value: input, text: input };
            }
        });
        var $select_cg = $("#edit_person").selectize();
        var se_cg = $select_cg[0].selectize;
        se_cg.setValue(se_cg.search(this.CAREGIVER).query.toUpperCase());

        $('#e_mon').prop('checked', this.MON);
        $('#e_tue').prop('checked', this.TUE);
        $('#e_wed').prop('checked', this.WED);
        $('#e_thu').prop('checked', this.THU);
        $('#e_fri').prop('checked', this.FRI);
        $('#e_sat').prop('checked', this.SAT);
        $('#e_sun').prop('checked', this.SUN);
        Session.set('UpdateActivityCP', this._id)

    },
    'click #edit_activity'() {
        if (Session.get('datacpElder').fullcp) {
            if (Session.get('UpdateActivityCP')) {
                $('body').addClass('waitMe_body');
                var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
                $('body').prepend(elem);
                var objdata = {
                    "ACTIVITY": $('#edit_act').val(),
                    "ADMIN": $('#edit_acode').val(),
                    "MON": $('#e_mon').is(':checked'),
                    "TUE": $('#e_tue').is(':checked'),
                    "WED": $('#e_wed').is(':checked'),
                    "THU": $('#e_thu').is(':checked'),
                    "FRI": $('#e_fri').is(':checked'),
                    "SAT": $('#e_sat').is(':checked'),
                    "SUN": $('#e_sun').is(':checked'),
                    "CAREGIVER": $('#edit_person').val()
                };
                Meteor.call('UpdateActivityCP', Session.get('UpdateActivityCP'), objdata, function (err, res) {
                    Session.set('act', []);
                    Session.set('listcareACTIVITY', []);
                    Meteor.call('listcareACTIVITY', Session.get('initialCPId'), function (error, result) {
                        Session.set('listcareACTIVITY', result);
                        // for (var i = 0; i < result.length; i++) {
                        //     arr.push(result[i])
                        // }
                        Session.set('act', result);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
                        $('#editactivity').modal('hide')
                    });
                })
            } else {
                toastr.error('อัพเดทข้อมูลไม่สำเร็จกรุณาลองใหม่อีกครั้ง')
            }
        } else {
            if (Session.get('act').length != 0) {
                var arr = Session.get('act')
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]._id === Session.get('UpdateActivityCP')) {
                        arr[i].ACTIVITY = $('#edit_act').val()
                        arr[i].ADMIN = $('#edit_acode').val()
                        arr[i].MON = $('#e_mon').is(':checked')
                        arr[i].TUE = $('#e_tue').is(':checked')
                        arr[i].WED = $('#e_wed').is(':checked')
                        arr[i].THU = $('#e_thu').is(':checked')
                        arr[i].FRI = $('#e_fri').is(':checked')
                        arr[i].SAT = $('#e_sat').is(':checked')
                        arr[i].SUN = $('#e_sun').is(':checked')
                        arr[i].CAREGIVER = $('#edit_person').val()
                    }
                }
                $('#editactivity').modal('hide')
                Session.set('act', arr)

            }

        }

    },
    'click .back'() {
        Router.go('/CMdashboard')
    },
    'click .next'() {
        Router.go('/CMdashboard')
    },
    'click #add'() {
        var checkobj = Session.get('datacpElder');
        if (Session.get('initialCPId')) {
            var oldarr = Session.get('act')
            var obj = {
                "_id": makeid(),
                "CAREPLANID": Session.get('initialCPId'), //Session.get('datacpElder').CAREPLANID,
                "ACTIVITY": $('#activity').val(),
                "ADMIN": $('#admincode').val(),
                "MON": $('#mon').is(':checked'),
                "TUE": $('#tue').is(':checked'),
                "WED": $('#wed').is(':checked'),
                "THU": $('#thu').is(':checked'),
                "FRI": $('#fri').is(':checked'),
                "SAT": $('#sat').is(':checked'),
                "SUN": $('#sun').is(':checked'),
                "CAREGIVER": $('#person').val()
            };
            //arr.push(obj)
            oldarr.push(obj)
            Session.set('act', oldarr);
        } else {
            alert('เกิดข้อผิดพลาดกรุณาลองทำ Care plan ใหม่ดูอีกครั้ง')
            checkobj.checkEdit = false;
            Router.go('/careplanhistory')
        }

    },
    'click #finish'() {
        $('body').addClass('waitMe_body');
        var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>')
        $('body').prepend(elem);
        NProgress.start();
        Meteor.call('getCGName', $('#cg').val(), function (error, result) {

            var obj = Session.get('datacpElder');
            obj.IDEAELDER = $('#thinkelder').val();
            obj.IDEARELATIVE = $('#thinkrelative').val();
            obj.OTHERSERVICE = $('#otherservice').val();
            obj.OTHERPHYSIC = $('#otherphysic').val();
            obj.MEDICALEQUIPMENT = $('#otherdoctor').val();
            obj.CGID = $('#cg').val();
            obj.CGNAME = result ? result : "";
            obj.ACTIVITYBASE = $('#activitybase').val();
            obj.CGWORKHOUR = $('#cgworkhour').val();
            obj.CGWORKMIN = $('#cgworkmin').val();
            obj.CGWORKFREQ = $('#cgworkfreq').val();
            obj.fullcp = true;
            if (navigator.onLine && !_.isEmpty(obj)) {
                if (Session.get('initialCPId')) {
                    if (obj.checkEdit) {
                        // CAREPLAN_DETAIL.update({ _id: Session.get('initialCPId') }, { $set: obj });

                        Meteor.call('UPDATE_CAREPLAN', Session.get('initialCPId'), obj, function (error, result) {

                            Meteor.call('upDateCareplanActivity', Session.get('initialCPId'), function (error, result) {
                                var cda = Session.get('act');
                                if (cda) {
                                    for (var i = cda.length - 1; i >= 0; i--) {
                                        CAREPLAN_DETAIL_ACTIVITY.insert(cda[i]);
                                        if (i == 0) {
                                            Meteor.call('AddCPActivity', obj.CAREPLANID, function (error, result) {
                                                Session.set('act', []);
                                            });
                                        }
                                    }
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                                    NProgress.done();
                                    Router.go('/careplanhistory')
                                } else {
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
                                    NProgress.done();
                                    Router.go('/careplanhistory')
                                }
                                obj.checkEdit = false;
                            });
                        })
                    } else {
                        //CAREPLAN_DETAIL.update({ _id: Session.get('initialCPId') }, { $set: obj })
                        var cda = Session.get('act');
                        if (cda) {
                            Meteor.call('UPDATE_CAREPLAN', Session.get('initialCPId'), obj, function (error, result) {

                                for (var i = cda.length - 1; i >= 0; i--) {
                                    CAREPLAN_DETAIL_ACTIVITY.insert(cda[i]);
                                    if (i == 0) {
                                        Meteor.call('AddCPActivity', obj.CAREPLANID, function (error, result) {
                                            Session.set('act', []);
                                        });
                                    }
                                }
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                                NProgress.done();
                                Router.go('/careplanhistory')
                            });
                        } else {
                            $('body.waitMe_body').addClass('hideMe');
                            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                            $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            NProgress.done();
                            Router.go('/careplanhistory')
                        }
                    }


                } else {
                    toastr.error('เกิดข้อผิดพลาดกรุณาทำรายการใหม่อีกครั้ง')
                    obj.checkEdit = false;
                    Router.go('/careplanhistory')
                }
            } else {
                $('body.waitMe_body').addClass('hideMe');
                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                NProgress.done();
                toastr.error('บันทึกข้อมูลไม่สำเร็จกรุณาเช็คการเชื่อมต่อกับอินเทอร์เน็ตหรือทำรายการใหม่อีกครั้ง')
            }
            // Meteor.call('editCareplan', obj, function (error, result1) {
            //     toastr.success("บันทึกเรียบร้อยเรียบร้อย", "สำเร็จ");
            // });



        });
    },
    'click #remove'() {
        var arr = Session.get('act')
        if (Session.get('editcareplan')) {
            for (var i = arr.length - 1; i >= 0; --i) {
                if (arr[i]._id == this._id) {
                    arr.splice(i, 1);
                }
            }
            Session.set('act', arr);
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (JSON.stringify(this) == JSON.stringify(arr[i])) {
                    arr.splice(i, 1);
                }
            }
            Session.set('act', arr);
        }
    }

})

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


