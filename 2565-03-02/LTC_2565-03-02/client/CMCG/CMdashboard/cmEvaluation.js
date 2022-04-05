Template.cmEvaluation.onCreated(function init() {
    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.cmEvaluation.onRendered(function helloOnCreated() {
    Session.set('getDLA_Detail', null)
    Session.set('getEditedZoneCMbyHOSPCODE', null)
    Session.set('checkmark1', null)
    Session.set('checkmark2', null)
    Session.set('checkmark3', null)
    Session.set('checkmark4', null)
    Session.set('setid', null)
    Session.set('fullcode', null)
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

    Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
        var pro, dis, subdis
        let data = result

        if (data.length != 0) {
            if (data[0].SWITCHING.status) {
                if (data[0].SWITCHING.code.length == 5) {
                    data[0].HOSPCODE = {}
                    data[0].DLACODE = null
                    data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                    Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                        if (result2) {
                            let hops_name = result2.name.split('-')[1]
                            let hosp_amp = result2.amphoe.split('-')[1]
                            let hosp_dis = result2.district.split('-')[1]
                            let hosp_pro = result2.province.split('-')[1]
                            data[0].HOSPCODE.NAME = hops_name
                            data[0].HOSPCODE.DISTRICT = hosp_dis
                            data[0].HOSPCODE.AMPHOE = hosp_amp
                            data[0].HOSPCODE.PROVINCE = hosp_pro

                            Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                console.log(result)
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');

                            });
                        }

                    });
                } else {
                    data[0].DLACODE = {}
                    data[0].HOSPCODE = null
                    data[0].DLACODE.CODE = data[0].SWITCHING.code
                    Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                        // data[0].DLACODE.CODE = result2.DLA_CODE
                        data[0].DLACODE.NAME = result2.NAME
                        data[0].DLACODE.DISTRICT = result2.DISTRICT
                        data[0].DLACODE.PROVINCE = result2.PROVINCE
                        data[0].DLACODE.TAMBON = result2.TAMBON
                        Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                            Session.set('DistDataCMFULL', result);
                            Session.set('DistDataCM', null);
                            $('body.waitMe_body').addClass('hideMe');
                            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                            $('body.waitMe_body').removeClass('waitMe_body hideMe');
                        });
                    });
                }

            } else {
                if (data[0].HOSPCODE) {
                    pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                    dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                    subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                } else {
                    pro = data[0].DLACODE.PROVINCE
                    dis = data[0].DLACODE.DISTRICT
                    subdis = data[0].DLACODE.TAMBON
                }
                Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                    Session.set('DistDataCMFULL', result);
                    Session.set('DistDataCM', null);
                    $('body.waitMe_body').addClass('hideMe');
                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                    $('body.waitMe_body').removeClass('waitMe_body hideMe');

                });
            }

        }






    });


    $('#district_name').selectize();
    $('#subdistrict_name').selectize();
    $('#province_name').selectize();


});

Template.cmEvaluation.helpers({
    getDistDetail() {
        return Session.get('DistDataCMFULL')
    },
    getYear() {
        var obj = [];
        for (i = 2558; i < 2566; i++) {
            obj.push({
                "year": i
            });
        }
        return obj;
    },
})

Template.cmEvaluation.events({

    "change .passyear" () {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = '#passyear_' + fullcode;
        var year = $('#passyear_' + fullcode).val() != 'ไม่ระบุ' ? $('#passyear_' + fullcode).val() : null
        Meteor.call('updateDISTRICTbyPassYear', ID, fullcode, year, function(error, result1) {

        })
    },
    "click #cancel" () {
        var fullcode = this.fullcode;
        var join_radio = '#join_' + fullcode;
        var joinyear_select = '#joinyear_' + fullcode;
        var passyear_select = '#passyear_' + fullcode;
        var criterio_c1 = 'input[name=' + 'criterio1_' + fullcode; + ']';
        var criterio_c2 = 'input[name=' + 'criterio2_' + fullcode; + ']';
        var criterio_c3 = 'input[name=' + 'criterio3_' + fullcode; + ']';
        var criterio_c4 = 'input[name=' + 'criterio4_' + fullcode; + ']';
        var remark_ = '#remark_' + fullcode;
        $(join_radio).removeAttr("checked");
        $(joinyear_select).get(0).selectedIndex = 0
        $(passyear_select).get(0).selectedIndex = 0
        $(criterio_c1).removeAttr("checked");
        $(criterio_c2).removeAttr("checked");
        $(criterio_c3).removeAttr("checked");
        $(criterio_c4).removeAttr("checked");
        $(remark_).val("")
        Meteor.call('clearDISTRICTEva', fullcode, function(err, res) {

        })

    },

    "change .join" () {
        var ID = this._id;
        var fullcode = this.fullcode;
        var wait_radio = '#wait_' + fullcode;
        var year = this.join_year;
        var join_radio = '#join_' + fullcode;
        var joinyear_select = '#joinyear_' + fullcode;

        var data;
        if ($(join_radio).is(':checked')) {
            Meteor.call('updateDISTRICTbyJoin', ID, fullcode, true, year, false, function(error, result1) {})
        } else {
            var criterio_c1 = 'input[name=' + 'criterio1_' + fullcode; + ']';
            var criterio_c2 = 'input[name=' + 'criterio2_' + fullcode; + ']';
            var criterio_c3 = 'input[name=' + 'criterio3_' + fullcode; + ']';
            var criterio_c4 = 'input[name=' + 'criterio4_' + fullcode; + ']';
            var passyear_select = '#passyear_' + fullcode;
            var remark_ = '#remark_' + fullcode;
            $(join_radio).removeAttr("checked");
            $(joinyear_select).get(0).selectedIndex = 0
            $(passyear_select).get(0).selectedIndex = 0
            $(criterio_c1).removeAttr("checked");
            $(criterio_c2).removeAttr("checked");
            $(criterio_c3).removeAttr("checked");
            $(criterio_c4).removeAttr("checked");
            $(remark_).val("")
            Meteor.call('clearDISTRICTEva', fullcode, function(err, res) {

            })
        }

        Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            var pro, dis, subdis
            let data = result
    
            if (data.length != 0) {
                if (data[0].SWITCHING.status) {
                    if (data[0].SWITCHING.code.length == 5) {
                        data[0].HOSPCODE = {}
                        data[0].DLACODE = null
                        data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                            if (result2) {
                                let hops_name = result2.name.split('-')[1]
                                let hosp_amp = result2.amphoe.split('-')[1]
                                let hosp_dis = result2.district.split('-')[1]
                                let hosp_pro = result2.province.split('-')[1]
                                data[0].HOSPCODE.NAME = hops_name
                                data[0].HOSPCODE.DISTRICT = hosp_dis
                                data[0].HOSPCODE.AMPHOE = hosp_amp
                                data[0].HOSPCODE.PROVINCE = hosp_pro
    
                                Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                    console.log(result)
                                    Session.set('DistDataCMFULL', result);
                                    Session.set('DistDataCM', null);
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                                });
                            }
    
                        });
                    } else {
                        data[0].DLACODE = {}
                        data[0].HOSPCODE = null
                        data[0].DLACODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                            // data[0].DLACODE.CODE = result2.DLA_CODE
                            data[0].DLACODE.NAME = result2.NAME
                            data[0].DLACODE.DISTRICT = result2.DISTRICT
                            data[0].DLACODE.PROVINCE = result2.PROVINCE
                            data[0].DLACODE.TAMBON = result2.TAMBON
                            Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                } else {
                    if (data[0].HOSPCODE) {
                        pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                        dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                        subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                    } else {
                        pro = data[0].DLACODE.PROVINCE
                        dis = data[0].DLACODE.DISTRICT
                        subdis = data[0].DLACODE.TAMBON
                    }
                    Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                        Session.set('DistDataCMFULL', result);
                        Session.set('DistDataCM', null);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                    });
                }
    
            }
        });

    },

    "change .joinyear" () {
        var ID = this._id;
        var fullcode = this.fullcode;
        var join_radio = '#join_' + fullcode;
        var joinyear_select = '#joinyear_' + fullcode;
        var year = $('#joinyear_' + fullcode).val();
        if ($(join_radio).is(':checked')) {
            Meteor.call('updateDISTRICTbyJoinYear', ID, fullcode, year, function(error, result1) {

            })
        } else {
            $(joinyear_select).get(0).selectedIndex = 0
            alert('ยังไม่เข้าร่วมกองทุน LTC')
        }


    },

    "change .criterio_check1" () {
        Session.set('invokeSession', Math.random())
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio1_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio1', ID, this.fullcode, true, function(error, result) {});
        } else {
            Meteor.call('updateCriterio1', ID, this.fullcode, false, function(error, result) {});
        }

        Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            var pro, dis, subdis
            let data = result
    
            if (data.length != 0) {
                if (data[0].SWITCHING.status) {
                    if (data[0].SWITCHING.code.length == 5) {
                        data[0].HOSPCODE = {}
                        data[0].DLACODE = null
                        data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                            if (result2) {
                                let hops_name = result2.name.split('-')[1]
                                let hosp_amp = result2.amphoe.split('-')[1]
                                let hosp_dis = result2.district.split('-')[1]
                                let hosp_pro = result2.province.split('-')[1]
                                data[0].HOSPCODE.NAME = hops_name
                                data[0].HOSPCODE.DISTRICT = hosp_dis
                                data[0].HOSPCODE.AMPHOE = hosp_amp
                                data[0].HOSPCODE.PROVINCE = hosp_pro
    
                                Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                    console.log(result)
                                    Session.set('DistDataCMFULL', result);
                                    Session.set('DistDataCM', null);
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                                });
                            }
    
                        });
                    } else {
                        data[0].DLACODE = {}
                        data[0].HOSPCODE = null
                        data[0].DLACODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                            // data[0].DLACODE.CODE = result2.DLA_CODE
                            data[0].DLACODE.NAME = result2.NAME
                            data[0].DLACODE.DISTRICT = result2.DISTRICT
                            data[0].DLACODE.PROVINCE = result2.PROVINCE
                            data[0].DLACODE.TAMBON = result2.TAMBON
                            Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                } else {
                    if (data[0].HOSPCODE) {
                        pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                        dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                        subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                    } else {
                        pro = data[0].DLACODE.PROVINCE
                        dis = data[0].DLACODE.DISTRICT
                        subdis = data[0].DLACODE.TAMBON
                    }
                    Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                        Session.set('DistDataCMFULL', result);
                        Session.set('DistDataCM', null);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                    });
                }
    
            }
        });

    },
    "change .criterio_check2" () {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio2_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio2', ID, this.fullcode, true, function(error, result) {});
        } else {
            Meteor.call('updateCriterio2', ID, this.fullcode, false, function(error, result) {});
        }

        Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            var pro, dis, subdis
            let data = result
    
            if (data.length != 0) {
                if (data[0].SWITCHING.status) {
                    if (data[0].SWITCHING.code.length == 5) {
                        data[0].HOSPCODE = {}
                        data[0].DLACODE = null
                        data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                            if (result2) {
                                let hops_name = result2.name.split('-')[1]
                                let hosp_amp = result2.amphoe.split('-')[1]
                                let hosp_dis = result2.district.split('-')[1]
                                let hosp_pro = result2.province.split('-')[1]
                                data[0].HOSPCODE.NAME = hops_name
                                data[0].HOSPCODE.DISTRICT = hosp_dis
                                data[0].HOSPCODE.AMPHOE = hosp_amp
                                data[0].HOSPCODE.PROVINCE = hosp_pro
    
                                Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                    console.log(result)
                                    Session.set('DistDataCMFULL', result);
                                    Session.set('DistDataCM', null);
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                                });
                            }
    
                        });
                    } else {
                        data[0].DLACODE = {}
                        data[0].HOSPCODE = null
                        data[0].DLACODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                            // data[0].DLACODE.CODE = result2.DLA_CODE
                            data[0].DLACODE.NAME = result2.NAME
                            data[0].DLACODE.DISTRICT = result2.DISTRICT
                            data[0].DLACODE.PROVINCE = result2.PROVINCE
                            data[0].DLACODE.TAMBON = result2.TAMBON
                            Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                } else {
                    if (data[0].HOSPCODE) {
                        pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                        dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                        subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                    } else {
                        pro = data[0].DLACODE.PROVINCE
                        dis = data[0].DLACODE.DISTRICT
                        subdis = data[0].DLACODE.TAMBON
                    }
                    Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                        Session.set('DistDataCMFULL', result);
                        Session.set('DistDataCM', null);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                    });
                }
    
            }
        });

    },
    "change .criterio_check3" () {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio3_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio3', ID, this.fullcode, true, function(error, result) {});
        } else {
            Meteor.call('updateCriterio3', ID, this.fullcode, false, function(error, result) {});
        }

        Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            var pro, dis, subdis
            let data = result
    
            if (data.length != 0) {
                if (data[0].SWITCHING.status) {
                    if (data[0].SWITCHING.code.length == 5) {
                        data[0].HOSPCODE = {}
                        data[0].DLACODE = null
                        data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                            if (result2) {
                                let hops_name = result2.name.split('-')[1]
                                let hosp_amp = result2.amphoe.split('-')[1]
                                let hosp_dis = result2.district.split('-')[1]
                                let hosp_pro = result2.province.split('-')[1]
                                data[0].HOSPCODE.NAME = hops_name
                                data[0].HOSPCODE.DISTRICT = hosp_dis
                                data[0].HOSPCODE.AMPHOE = hosp_amp
                                data[0].HOSPCODE.PROVINCE = hosp_pro
    
                                Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                    console.log(result)
                                    Session.set('DistDataCMFULL', result);
                                    Session.set('DistDataCM', null);
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                                });
                            }
    
                        });
                    } else {
                        data[0].DLACODE = {}
                        data[0].HOSPCODE = null
                        data[0].DLACODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                            // data[0].DLACODE.CODE = result2.DLA_CODE
                            data[0].DLACODE.NAME = result2.NAME
                            data[0].DLACODE.DISTRICT = result2.DISTRICT
                            data[0].DLACODE.PROVINCE = result2.PROVINCE
                            data[0].DLACODE.TAMBON = result2.TAMBON
                            Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                } else {
                    if (data[0].HOSPCODE) {
                        pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                        dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                        subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                    } else {
                        pro = data[0].DLACODE.PROVINCE
                        dis = data[0].DLACODE.DISTRICT
                        subdis = data[0].DLACODE.TAMBON
                    }
                    Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                        Session.set('DistDataCMFULL', result);
                        Session.set('DistDataCM', null);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                    });
                }
    
            }
        });
    },
    "change .criterio_check4" () {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio4_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();
        Session.set('setid', ID);
        Session.set('fullcode', fullcode);

        if (criterio == 'true') {
            Meteor.call('updateCriterio4', ID, this.fullcode, true, function(error, result) {});
            $('.criterio_check4_CH1').attr('checked', false)
            $('.criterio_check4_CH2').attr('checked', false)
            $('.criterio_check4_CH3').attr('checked', false)
            $('.criterio_check4_CH4').attr('checked', false)
        } else {
            Meteor.call('updateCriterio4', ID, this.fullcode, false, function(error, result) {});
            $('.criterio_check4_CH1').attr('checked', false)
            $('.criterio_check4_CH2').attr('checked', false)
            $('.criterio_check4_CH3').attr('checked', false)
            $('.criterio_check4_CH4').attr('checked', false)
        }

        Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            var pro, dis, subdis
            let data = result
    
            if (data.length != 0) {
                if (data[0].SWITCHING.status) {
                    if (data[0].SWITCHING.code.length == 5) {
                        data[0].HOSPCODE = {}
                        data[0].DLACODE = null
                        data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                            if (result2) {
                                let hops_name = result2.name.split('-')[1]
                                let hosp_amp = result2.amphoe.split('-')[1]
                                let hosp_dis = result2.district.split('-')[1]
                                let hosp_pro = result2.province.split('-')[1]
                                data[0].HOSPCODE.NAME = hops_name
                                data[0].HOSPCODE.DISTRICT = hosp_dis
                                data[0].HOSPCODE.AMPHOE = hosp_amp
                                data[0].HOSPCODE.PROVINCE = hosp_pro
    
                                Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                    console.log(result)
                                    Session.set('DistDataCMFULL', result);
                                    Session.set('DistDataCM', null);
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                                });
                            }
    
                        });
                    } else {
                        data[0].DLACODE = {}
                        data[0].HOSPCODE = null
                        data[0].DLACODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                            // data[0].DLACODE.CODE = result2.DLA_CODE
                            data[0].DLACODE.NAME = result2.NAME
                            data[0].DLACODE.DISTRICT = result2.DISTRICT
                            data[0].DLACODE.PROVINCE = result2.PROVINCE
                            data[0].DLACODE.TAMBON = result2.TAMBON
                            Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                } else {
                    if (data[0].HOSPCODE) {
                        pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                        dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                        subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                    } else {
                        pro = data[0].DLACODE.PROVINCE
                        dis = data[0].DLACODE.DISTRICT
                        subdis = data[0].DLACODE.TAMBON
                    }
                    Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                        Session.set('DistDataCMFULL', result);
                        Session.set('DistDataCM', null);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                    });
                }
    
            }
        });
    },
    'change .criterio_check4_CH1'(){
        var checkmark1 = $('input[name="criterio4_1"]:checked').val() == 'true' ? true : false
        Session.set('checkmark1', checkmark1)

        var ID = Session.get('setid');
        var fullcode = Session.get('fullcode');
        var criterio = $('input[name="criterio4_1"]:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio4_1', ID, fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio4_1', ID, fullcode, false, function (error, result) {
            });
        }

        Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            var pro, dis, subdis
            let data = result
    
            if (data.length != 0) {
                if (data[0].SWITCHING.status) {
                    if (data[0].SWITCHING.code.length == 5) {
                        data[0].HOSPCODE = {}
                        data[0].DLACODE = null
                        data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                            if (result2) {
                                let hops_name = result2.name.split('-')[1]
                                let hosp_amp = result2.amphoe.split('-')[1]
                                let hosp_dis = result2.district.split('-')[1]
                                let hosp_pro = result2.province.split('-')[1]
                                data[0].HOSPCODE.NAME = hops_name
                                data[0].HOSPCODE.DISTRICT = hosp_dis
                                data[0].HOSPCODE.AMPHOE = hosp_amp
                                data[0].HOSPCODE.PROVINCE = hosp_pro
    
                                Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                    console.log(result)
                                    Session.set('DistDataCMFULL', result);
                                    Session.set('DistDataCM', null);
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                                });
                            }
    
                        });
                    } else {
                        data[0].DLACODE = {}
                        data[0].HOSPCODE = null
                        data[0].DLACODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                            // data[0].DLACODE.CODE = result2.DLA_CODE
                            data[0].DLACODE.NAME = result2.NAME
                            data[0].DLACODE.DISTRICT = result2.DISTRICT
                            data[0].DLACODE.PROVINCE = result2.PROVINCE
                            data[0].DLACODE.TAMBON = result2.TAMBON
                            Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                } else {
                    if (data[0].HOSPCODE) {
                        pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                        dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                        subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                    } else {
                        pro = data[0].DLACODE.PROVINCE
                        dis = data[0].DLACODE.DISTRICT
                        subdis = data[0].DLACODE.TAMBON
                    }
                    Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                        Session.set('DistDataCMFULL', result);
                        Session.set('DistDataCM', null);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                    });
                }
    
            }
        });
    },
    'change .criterio_check4_CH2'(){
        var checkmark2 = $('input[name="criterio4_2"]:checked').val() == 'true' ? true : false
        Session.set('checkmark2', checkmark2)

        var ID = Session.get('setid');
        var fullcode = Session.get('fullcode');
        var criterio = $('input[name="criterio4_2"]:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio4_2', ID, fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio4_2', ID, fullcode, false, function (error, result) {
            });
        }

        Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            var pro, dis, subdis
            let data = result
    
            if (data.length != 0) {
                if (data[0].SWITCHING.status) {
                    if (data[0].SWITCHING.code.length == 5) {
                        data[0].HOSPCODE = {}
                        data[0].DLACODE = null
                        data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                            if (result2) {
                                let hops_name = result2.name.split('-')[1]
                                let hosp_amp = result2.amphoe.split('-')[1]
                                let hosp_dis = result2.district.split('-')[1]
                                let hosp_pro = result2.province.split('-')[1]
                                data[0].HOSPCODE.NAME = hops_name
                                data[0].HOSPCODE.DISTRICT = hosp_dis
                                data[0].HOSPCODE.AMPHOE = hosp_amp
                                data[0].HOSPCODE.PROVINCE = hosp_pro
    
                                Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                    console.log(result)
                                    Session.set('DistDataCMFULL', result);
                                    Session.set('DistDataCM', null);
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                                });
                            }
    
                        });
                    } else {
                        data[0].DLACODE = {}
                        data[0].HOSPCODE = null
                        data[0].DLACODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                            // data[0].DLACODE.CODE = result2.DLA_CODE
                            data[0].DLACODE.NAME = result2.NAME
                            data[0].DLACODE.DISTRICT = result2.DISTRICT
                            data[0].DLACODE.PROVINCE = result2.PROVINCE
                            data[0].DLACODE.TAMBON = result2.TAMBON
                            Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                } else {
                    if (data[0].HOSPCODE) {
                        pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                        dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                        subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                    } else {
                        pro = data[0].DLACODE.PROVINCE
                        dis = data[0].DLACODE.DISTRICT
                        subdis = data[0].DLACODE.TAMBON
                    }
                    Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                        Session.set('DistDataCMFULL', result);
                        Session.set('DistDataCM', null);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                    });
                }
    
            }
        });
    },
    'change .criterio_check4_CH3'(){
        var checkmark3 = $('input[name="criterio4_3"]:checked').val() == 'true' ? true : false
        Session.set('checkmark3', checkmark3)

        var ID = Session.get('setid');
        var fullcode = Session.get('fullcode');
        var criterio = $('input[name="criterio4_3"]:checked').val();
        console.log(criterio);
        
        if (criterio == 'true') {
            console.log('A');
            Meteor.call('updateCriterio4_3', ID, fullcode, true, function (error, result) {
            });
        } else {
            console.log('B');
            Meteor.call('updateCriterio4_3', ID, fullcode, false, function (error, result) {
            });
        }

        Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            var pro, dis, subdis
            let data = result
    
            if (data.length != 0) {
                if (data[0].SWITCHING.status) {
                    if (data[0].SWITCHING.code.length == 5) {
                        data[0].HOSPCODE = {}
                        data[0].DLACODE = null
                        data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                            if (result2) {
                                let hops_name = result2.name.split('-')[1]
                                let hosp_amp = result2.amphoe.split('-')[1]
                                let hosp_dis = result2.district.split('-')[1]
                                let hosp_pro = result2.province.split('-')[1]
                                data[0].HOSPCODE.NAME = hops_name
                                data[0].HOSPCODE.DISTRICT = hosp_dis
                                data[0].HOSPCODE.AMPHOE = hosp_amp
                                data[0].HOSPCODE.PROVINCE = hosp_pro
    
                                Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                    console.log(result)
                                    Session.set('DistDataCMFULL', result);
                                    Session.set('DistDataCM', null);
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                                });
                            }
    
                        });
                    } else {
                        data[0].DLACODE = {}
                        data[0].HOSPCODE = null
                        data[0].DLACODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                            // data[0].DLACODE.CODE = result2.DLA_CODE
                            data[0].DLACODE.NAME = result2.NAME
                            data[0].DLACODE.DISTRICT = result2.DISTRICT
                            data[0].DLACODE.PROVINCE = result2.PROVINCE
                            data[0].DLACODE.TAMBON = result2.TAMBON
                            Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                } else {
                    if (data[0].HOSPCODE) {
                        pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                        dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                        subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                    } else {
                        pro = data[0].DLACODE.PROVINCE
                        dis = data[0].DLACODE.DISTRICT
                        subdis = data[0].DLACODE.TAMBON
                    }
                    Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                        Session.set('DistDataCMFULL', result);
                        Session.set('DistDataCM', null);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                    });
                }
    
            }
        });
    },
    'change .criterio_check4_CH4'(){
        var checkmark4 = $('input[name="criterio4_4"]:checked').val() == 'true' ? true : false
        Session.set('checkmark4', checkmark4)

        var ID = Session.get('setid');
        var fullcode = Session.get('fullcode');
        var criterio = $('input[name="criterio4_4"]:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio4_4', ID, fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio4_4', ID, fullcode, false, function (error, result) {
            });
        }

        Meteor.call('getUserCM', Session.get('cmid'), function(error, result) {
            var pro, dis, subdis
            let data = result
    
            if (data.length != 0) {
                if (data[0].SWITCHING.status) {
                    if (data[0].SWITCHING.code.length == 5) {
                        data[0].HOSPCODE = {}
                        data[0].DLACODE = null
                        data[0].HOSPCODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getAllServiceCenterDistrict', data[0].HOSPCODE.CODE, function(error, result2) {
                            if (result2) {
                                let hops_name = result2.name.split('-')[1]
                                let hosp_amp = result2.amphoe.split('-')[1]
                                let hosp_dis = result2.district.split('-')[1]
                                let hosp_pro = result2.province.split('-')[1]
                                data[0].HOSPCODE.NAME = hops_name
                                data[0].HOSPCODE.DISTRICT = hosp_dis
                                data[0].HOSPCODE.AMPHOE = hosp_amp
                                data[0].HOSPCODE.PROVINCE = hosp_pro
    
                                Meteor.call('getSUBDISTRICTbyCM', hosp_pro, hosp_amp, hosp_dis, function(error, result) {
                                    console.log(result)
                                    Session.set('DistDataCMFULL', result);
                                    Session.set('DistDataCM', null);
                                    $('body.waitMe_body').addClass('hideMe');
                                    $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                    $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                                });
                            }
    
                        });
                    } else {
                        data[0].DLACODE = {}
                        data[0].HOSPCODE = null
                        data[0].DLACODE.CODE = data[0].SWITCHING.code
                        Meteor.call('getDLA_NAME', data[0].DLACODE.CODE, function(error, result2) {
                            // data[0].DLACODE.CODE = result2.DLA_CODE
                            data[0].DLACODE.NAME = result2.NAME
                            data[0].DLACODE.DISTRICT = result2.DISTRICT
                            data[0].DLACODE.PROVINCE = result2.PROVINCE
                            data[0].DLACODE.TAMBON = result2.TAMBON
                            Meteor.call('getSUBDISTRICTbyCM', result2.PROVINCE, result2.DISTRICT, result2.TAMBON, function(error, result) {
                                Session.set('DistDataCMFULL', result);
                                Session.set('DistDataCM', null);
                                $('body.waitMe_body').addClass('hideMe');
                                $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                                $('body.waitMe_body').removeClass('waitMe_body hideMe');
                            });
                        });
                    }
    
                } else {
                    if (data[0].HOSPCODE) {
                        pro = data[0].HOSPCODE.PROVINCE.split('-')[1]
                        dis = data[0].HOSPCODE.AMPHOE.split('-')[1]
                        subdis = data[0].HOSPCODE.DISTRICT.split('-')[1]
                    } else {
                        pro = data[0].DLACODE.PROVINCE
                        dis = data[0].DLACODE.DISTRICT
                        subdis = data[0].DLACODE.TAMBON
                    }
                    Meteor.call('getSUBDISTRICTbyCM', pro, dis, subdis, function(error, result) {
                        Session.set('DistDataCMFULL', result);
                        Session.set('DistDataCM', null);
                        $('body.waitMe_body').addClass('hideMe');
                        $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
                        $('body.waitMe_body').removeClass('waitMe_body hideMe');
    
                    });
                }
    
            }
        });
    },
    "keyup .remark" () {
        var ID = this._id;
        var fullcode = this.fullcode;
        var text = $('#remark_' + fullcode).val();
        Meteor.call('updateDISTRICTbyRemark', ID, this.fullcode, text, function(error, result) {});
    },

});

