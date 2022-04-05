Template.hpcevaluateltc.onRendered(function () {
    var ID = Session.get('user').ZONE;
    Session.set('checked_val', "null")
    Session.set('skip_eva', 0)
    Session.set('checkmark1', null)
    Session.set('checkmark2', null)
    Session.set('checkmark3', null)
    Session.set('checkmark4', null)
    Session.set('setid', null)
    Session.set('fullcode', null)
    Session.set('selectedProvinceEva', null)
    Session.set('selectedDistrictEva', null)
    var provinceSet = hpcprovince(ID)
    Session.set('provinceSetbyHpc', provinceSet)
    $('#des').tooltip();
    $('#des').attr('title', 'ดูรายละเอียด')
    $("#chooseProvince").empty();
    $("#chooseProvince").append("<option value='0'>[เลือกจังหวัด]</option>");
    for (i = 0; i < provinceSet.length; i++) {
        $("#chooseProvince").append("<option value='" + provinceSet[i] + "'>" + provinceSet[i] + "</option>");
    }
    Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
        Session.set('DistData_ALL', result);
        Session.set('DistDataFULL', result);
    });
    Meteor.call('getDISTRICT', provinceSet, Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {

        Session.set('HpcDistData', result);
        Meteor.call('getDISTRICT_COUNT', provinceSet, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
            Session.set('getDISTRICT_COUNT', result)
        });

    });


})

Template.hpcevaluateltc.helpers({
    page() {
        return parseInt(Session.get('skip_eva') / 10) + 1
    },
    pagecount() {
        return Math.ceil(parseFloat(Session.get('getDISTRICT_COUNT') / 10))
    },
    "getDistDetail"() {
        if (Session.get('HpcDistData')) {
            return Session.get('HpcDistData');
        }
    },
    user() {
        if (Session.get('user'))
            return Session.get('user').NAME
    },
    znum() {
        if (Session.get('user'))
            return Session.get('user').ZONE
    },
    "getYear"() {
        var obj = [];
        for (i = 2558; i < 2566; i++) {
            obj.push({
                "year": i
            });
        }
        return obj;
    },
    "getDistDataALL_all"() {
        if (Session.get('DistData_ALL')) {
            return Session.get('DistData_ALL').length;
        }
    },
    "getDistDataALL_joinAll"() {
        if (Session.get('DistData_ALL')) {
            var data = Session.get('DistData_ALL');
            var count = 0;
            for (i = 0; i < data.length; i++) {

                if (data[i].Evaluate.join) {
                    count++;
                }
            }
            return count;
        }
    },
    "getDistDataALL_CriterioTrue"() {
        if (Session.get('DistData_ALL')) {
            var data = Session.get('DistData_ALL');
            // console.log(data);getDistDataALL_CriterioTrue
            var count = 0;
            for (i = 0; i < data.length; i++) {
                if (data[i].Evaluate.c1 == true && data[i].Evaluate.c2 == true && data[i].Evaluate.c3 == true && data[i].Evaluate.c4 == true && data[i].Evaluate.c4_1 == true && data[i].Evaluate.c4_2 == true && data[i].Evaluate.c4_3 == true && data[i].Evaluate.c4_4 == true) {
                    count++;
                }
            }
            return count;
        }
    },
    "getDistDataALL_joinPerSubdist"() {
        if (Session.get('DistData_ALL')) {
            var data = Session.get('DistData_ALL');
            var count_1 = 0;
            var count_2 = 0;
            for (i = 0; i < data.length; i++) {
                count_1++;
                if (data[i].Evaluate.join) {
                    count_2++;
                }
            }
            var result = (count_2 / count_1) * 100;
            if (!isFinite(result)) {
                return "0";
            } else if ((result.toFixed(2) * 100) % 100 == 0) {
                return result;
            } else {
                return result.toFixed(2);
            }
        }
    },
    "getDistDataALL_CriterioTruePerJoin"() {
        if (Session.get('DistData_ALL')) {
            var data = Session.get('DistData_ALL');
            var count_1 = 0;
            var count_2 = 0;
            for (i = 0; i < data.length; i++) {
                if (data[i].Evaluate.join == true) {
                    count_1++;
                }
                if (data[i].Evaluate.c1 == true && data[i].Evaluate.c2 == true && data[i].Evaluate.c3 == true && data[i].Evaluate.c4 == true && data[i].Evaluate.c4_1 == true && data[i].Evaluate.c4_2 == true && data[i].Evaluate.c4_3 == true && data[i].Evaluate.c4_4 == true) {
                    console.log('getDistDataALL_CriterioTruePerJoin');
                    count_2++;
                }
            }
            var result = (count_2 / count_1) * 100;
            //console.log()
            if (!isFinite(result)) {
                return "0";
            } else if ((result.toFixed(2) * 100) % 100 == 0) {
                return result;
            } else {
                return result.toFixed(2);
            }
        }

    },
    "getDistDataALL_CriterioTruePerSubdist"() {
        if (Session.get('DistData_ALL')) {
            var data = Session.get('DistData_ALL');
            var count_1 = 0;
            var count_2 = 0;
            for (i = 0; i < data.length; i++) {
                count_1++;
                if (data[i].Evaluate.c1 == true && data[i].Evaluate.c2 == true && data[i].Evaluate.c3 == true && data[i].Evaluate.c4 == true && data[i].Evaluate.c4_1 == true && data[i].Evaluate.c4_1 == true && data[i].Evaluate.c4_2 == true && data[i].Evaluate.c4_3 == true && data[i].Evaluate.c4_4 == true) {
                    count_2++;
                }
            }

            var result = (count_2 / count_1) * 100;
            if (!isFinite(result)) {
                return "0";
            } else if ((result.toFixed(2) * 100) % 100 == 0) {
                return result;
            } else {
                return result.toFixed(2);
            }
        }
    },
})

Template.hpcevaluateltc.events({
    'click #download'() {
        window.location.assign('http://ltc.anamai.moph.go.th/xlshpcevaluate/' + Session.get('user').ZONE);
    },
    "click #cancel"() {
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
        Meteor.call('clearDISTRICTEva', fullcode, function (err, res) {

        })
        Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
            Session.set('DistData_ALL', result);
        });
    },
    "change #chooseProvince"() {
        var tes = null;
        var data = Session.get('DistDataFULL');
        var province = $('#chooseProvince').val();
        Session.set('isHpcEvaSearchTxtBox', null)
        $('#find').val('')
        if (province == '0') {
            var ID = Session.get('user').ZONE;
            $("#chooseDist").empty();
            $("#chooseDist").attr('disabled', 'disabled');
            $("#chooseDist").append("<option value='0'>[เลือกทุกอำเภอ]</option>");
            Session.set('provinceSetbyHpc', hpcprovince(ID))
            Session.set('selectedProvinceEva', null)
            Session.set('selectedDistrictEva', null)
            Session.set('skip_eva', 0)
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, null, null, function (err, result) {
                Session.set('HpcDistData', result);
            })
            Meteor.call('getDISTRICT_COUNT', Session.get('provinceSetbyHpc'), null, null, function (error, result) {
                console.log(result)
                Session.set('getDISTRICT_COUNT', result)
            });


        } else {
            var dist = $('#chooseDist').val();
            $("#chooseDist").removeAttr('disabled');
            $("#chooseDist").empty();
            $("#chooseDist").append("<option value='0'>[เลือกทุกอำเภอ]</option>");
            Session.set('provinceSetbyHpc', null)
            Session.set('selectedDistrictEva', null)
            Session.set('selectedProvinceEva', province)
            Session.set('skip_eva', 0)
            for (i = 0; i < data.length; i++) {
                if (data[i].province_name == province) {
                    if (tes == null || tes != data[i].district_name) {
                        tes = data[i].district_name;
                        $("#chooseDist").append("<option value='" + data[i].district_name + "'>" + data[i].district_name + "</option>");
                    }
                }
            }
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (err, result) {
                Session.set('HpcDistData', result);
            })
            Meteor.call('getDISTRICT_COUNT', Session.get('provinceSetbyHpc'), Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                //console.log(result)
                Session.set('getDISTRICT_COUNT', result)
            });

        }

    },
    "change #chooseDist"() {
        Session.set('isHpcEvaSearchTxtBox', null)
        $('#find').val('')
        if ($('#chooseDist').val() == '0') {
            Session.set('selectedProvinceEva', $('#chooseProvince').val())
            Session.set('selectedDistrictEva', null)
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICT_COUNT', Session.get('provinceSetbyHpc'), Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                //console.log(result)
                Session.set('getDISTRICT_COUNT', result)
            });
        } else {
            Session.set('selectedProvinceEva', $('#chooseProvince').val())
            Session.set('selectedDistrictEva', $('#chooseDist').val())
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICT_COUNT', Session.get('provinceSetbyHpc'), Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                //console.log(result)
                Session.set('getDISTRICT_COUNT', result)
            });
        }
    },
    'click #next': function () {

        var next = parseInt(Session.get('skip_eva') + 10);
        if (next < parseInt(Session.get('getDISTRICT_COUNT'))) {
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), next, 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('skip_eva', next);
                Session.set('HpcDistData', result)
            })
        }

    },
    'click #prev': function () {

        if (parseInt(Session.get('skip_eva')) > 0) {
            var next = parseInt(Session.get('skip_eva') - 10);
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), next, 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('skip_eva', next);
                Session.set('HpcDistData', result)
            })
        }


    },
    'click #first': function () {
        Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), 0, 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
            Session.set('skip_eva', 0);
            Session.set('HpcDistData', result)
        })


    },
    'click #last': function () {

        var next = Math.ceil(parseFloat(Session.get('getDISTRICT_COUNT') - 10))
        Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), next, 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
            Session.set('skip_eva', next);
            Session.set('HpcDistData', result)
        })


    },
    'change #find'() {
        var ID = Session.get('user').ZONE;
        Session.set('skip_eva', 0);
        var search = $('#find').val()
        var provinceSet = hpcprovince(ID)
        Session.set('isHpcEvaSearchTxtBox', search)
        Meteor.call('hpcSearchEvaLTC', provinceSet, Session.set('skip_eva'), 10, search, function (err, result) {
            Session.set('HpcDistData', result);
            Session.set('skip_eva', 0)
        })
        Meteor.call('hpcSearchEvaLTC_COUNT', provinceSet, search, function (err, result) {
            Session.set('getDISTRICT_COUNT', result)
        })
    },
    "change .join"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var wait_radio = '#wait_' + fullcode;
        var year = this.join_year;
        var name = 'join_' + fullcode;
        var join_radio = '#join_' + fullcode;
        var joinyear_select = '#joinyear_' + fullcode;
        Session.set('idRadioJoinEVA', name)
        if ($(join_radio).is(':checked')) {
            Meteor.call('updateDISTRICTbyJoin', ID, fullcode, true, year, false, function (error, result1) {

            })
            $(wait_radio).removeAttr("checked");
        } else {

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
            Meteor.call('clearDISTRICTEva', fullcode, function (err, res) {

            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('HpcDistData', result)
            })

        }
        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        }

    },
    "change .passyear"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = '#passyear_' + fullcode;
        var year = $('#passyear_' + fullcode).val() != 'ไม่ระบุ' ? $('#passyear_' + fullcode).val() : null
        Meteor.call('updateDISTRICTbyPassYear', ID, fullcode, year, function (error, result1) {

        })
        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        }
    },
    "change .joinyear"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = '#joinyear_' + fullcode;
        var year = $('#joinyear_' + fullcode).val() != 'ไม่ระบุ' ? $('#joinyear_' + fullcode).val() : null
        Meteor.call('updateDISTRICTbyJoinYear', ID, fullcode, year, function (error, result1) {

        })
        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        }
    },
    "change .criterio_check1"() {
        console.log('A');
        Session.set('invokeSession', Math.random())
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio1_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();
        console.log(ID);
        console.log(fullcode);
        console.log(name);
        console.log(criterio);

        if (criterio == 'true') {
            Meteor.call('updateCriterio1', ID, this.fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio1', ID, this.fullcode, false, function (error, result) {
            });
        }
        var data = Session.get('HpcDistData') ? Session.get('HpcDistData') : {};
        assign(data[0], "REVOKE", Math.random())
        Session.set('HpcDistData', data)

        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('HpcDistData', result)
            })
        }
    },
    "change .criterio_check2"() {
        Session.set('invokeSession', Math.random())
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio2_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio2', ID, this.fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio2', ID, this.fullcode, false, function (error, result) {
            });
        }
        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('HpcDistData', result)
            })
        }

    },
    "change .criterio_check3"() {
        Session.set('invokeSession', Math.random())
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio3_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio3', ID, this.fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio3', ID, this.fullcode, false, function (error, result) {
            });
        }
        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('HpcDistData', result)
            })
        }

    },
    "change .criterio_check4"() {
        Session.set('invokeSession', Math.random())
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio4_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();
        Session.set('setid', ID);
        Session.set('fullcode', fullcode);

        if (criterio == 'true') {
            // console.log(Session.get('HpcDistData'));

            Meteor.call('updateCriterio4', ID, this.fullcode, true, function (error, result) {
            });
            $('.criterio_check4_CH1').attr('checked', false)
            $('.criterio_check4_CH2').attr('checked', false)
            $('.criterio_check4_CH3').attr('checked', false)
            $('.criterio_check4_CH4').attr('checked', false)
        } else {

            Meteor.call('updateCriterio4', ID, this.fullcode, false, function (error, result) {
            });
            $('.criterio_check4_CH1').attr('checked', false)
            $('.criterio_check4_CH2').attr('checked', false)
            $('.criterio_check4_CH3').attr('checked', false)
            $('.criterio_check4_CH4').attr('checked', false)
        }
        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('HpcDistData', result)
            })
        }

    },
    'change .criterio_check4_CH1'() {
        var checkmark1 = $('input[name="criterio4_1"]:checked').val() == 'true' ? true : false
        Session.set('checkmark1', checkmark1)

        Session.set('invokeSession', Math.random())
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
        var data = Session.get('HpcDistData') ? Session.get('HpcDistData') : {};
        assign(data[0], "REVOKE", Math.random())
        Session.set('HpcDistData', data)

        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('HpcDistData', result)
            })
        }

    },
    'change .criterio_check4_CH2'() {
        var checkmark2 = $('input[name="criterio4_2"]:checked').val() == 'true' ? true : false
        Session.set('checkmark2', checkmark2)

        Session.set('invokeSession', Math.random())
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
        var data = Session.get('HpcDistData') ? Session.get('HpcDistData') : {};
        assign(data[0], "REVOKE", Math.random())
        Session.set('HpcDistData', data)

        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('HpcDistData', result)
            })
        }
    },
    'change .criterio_check4_CH3'() {
        var checkmark3 = $('input[name="criterio4_3"]:checked').val() == 'true' ? true : false
        Session.set('checkmark3', checkmark3)

        Session.set('invokeSession', Math.random())
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
        var data = Session.get('HpcDistData') ? Session.get('HpcDistData') : {};
        assign(data[0], "REVOKE", Math.random())
        Session.set('HpcDistData', data)

        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('HpcDistData', result)
            })
        }
    },
    'change .criterio_check4_CH4'() {
        var checkmark4 = $('input[name="criterio4_4"]:checked').val() == 'true' ? true : false
        Session.set('checkmark4', checkmark4)

        Session.set('invokeSession', Math.random())
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
        var data = Session.get('HpcDistData') ? Session.get('HpcDistData') : {};
        assign(data[0], "REVOKE", Math.random())
        Session.set('HpcDistData', data)

        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
            Meteor.call('getDISTRICT', Session.get('provinceSetbyHpc'), Session.get('skip_eva'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
                Session.set('HpcDistData', result)
            })
        }
    },
    "change .remark"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var text = $('#remark_' + fullcode).val();
        Meteor.call('updateDISTRICTbyRemark', ID, this.fullcode, text, function (error, result) {
        });
        if (Session.get('isHpcEvaSearchTxtBox')) {
            Meteor.call('hpcSearchEvaLTC', hpcprovince(Session.get('user').ZONE), Session.set('skip_eva'), 10, Session.get('isHpcEvaSearchTxtBox'), function (err, result) {
                Session.set('HpcDistData', result);
                Session.set('skip_eva', 0)
            })
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });
        } else {
            Meteor.call('getDISTRICTEvaAll', hpcprovince(Session.get('user').ZONE), function (error, result) {
                Session.set('DistData_ALL', result);
            });

        }

    },

})

Template.registerHelper('checkPassYear_helper', function (data) {
    if (data == 'ไม่ระบุ' || typeof data == "undefined" || data == null) {
        return 'ไม่ระบุ'
    } else {
        return data
    }
});

Template.registerHelper('checkPassYear_NO_helper', function (data) {
    if (data == 'ไม่ระบุ' || typeof data == "undefined") {
        return 'none'
    } else {
        return 'normal'
    }
});

Template.registerHelper('checkJoinYear_helper', function (data) {
    if (data == 'ไม่ระบุ' || typeof data == "undefined" || data == null) {
        return 'ไม่ระบุ'
    } else {
        return data
    }
});

Template.registerHelper('checkJoinYear_NO_helper', function (data) {
    if (data == 'ไม่ระบุ' || typeof data == "undefined") {
        return 'none'
    } else {
        return 'normal'
    }
});

Template.registerHelper('checkCriterio_TRUE_helper', function (data) {
    if (data == false) {
        return 'checked'
    } else if (data == true) {
        return 'checked'
    } else {
        return ''
    }
});

Template.registerHelper('checkCriterio_FALSE_helper', function (data) {
    if (data == false) {
        return 'checked'
    } else if (data == true) {
        return ''
    } else {
        return ''
    }
});

Template.registerHelper('checkCriterio', function (c1, c2, c3, c4, c4_1, c4_2, c4_3, c4_4) {
    if (c1 && c2 && c3 && c4) {

        var checktrue = [c4_1, c4_2, c4_3, c4_4].filter(v => v).length


        if (checktrue >= 2) {
            return Spacebars.SafeString("<label style='color:limegreen;font-weight:bold'>ผ่านเกณฑ์</label>");
        } else {
            return Spacebars.SafeString("<label style='color:red;font-weight:bol'>ไม่ผ่านเกณฑ์</label>");
        }
    } else {
        return false;
    }
});

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
    }

    return provinceSet
}

function assign(obj, prop, value) {
    if (typeof prop === "string")
        prop = prop.split(".");

    if (prop.length > 1) {
        var e = prop.shift();
        assign(obj[e] =
            Object.prototype.toString.call(obj[e]) === "[object Object]"
                ? obj[e]
                : {},
            prop,
            value);
    } else
        obj[prop[0]] = value;
}
