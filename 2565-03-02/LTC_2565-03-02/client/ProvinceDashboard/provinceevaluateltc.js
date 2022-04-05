

Template.provinceevaluateltc.onRendered(function () {
    var subdistrictSet = [];
    Session.set('checkmark1', null)
    Session.set('checkmark2', null)
    Session.set('checkmark3', null)
    Session.set('checkmark4', null)
    Session.set('setid', null)
    Session.set('fullcode', null)
    Session.set('this_province', Session.get('user').PROVINCENAME)
    Meteor.call('getDISTRICTbyIdProvince', Session.get('this_province'), function (error, result) {
        Session.set('DistDataFULL', result);
        Session.set('DistData', null);
        var objs_all = [];
        var tes = null
        for (j = 0; j < result.length; j++) {
            objs_all.push({
                "_id": result[j]._id,
                "fullcode": result[j].fullcode,
                "subdistrict_name": result[j].subdistrict_name,
                "district_code": result[j].district_code,
                "district_name": result[j].district_name,
                "join_year": result[j].Evaluate.join_year,
                "join": result[j].Evaluate.join,
                "criterio": {
                    c1: result[j].Evaluate.c1,
                    c2: result[j].Evaluate.c2,
                    c3: result[j].Evaluate.c3,
                    c4: result[j].Evaluate.c4,
                },
                "remark": result[j].Evaluate.remark,
                "pass_year": result[j].Evaluate.pass_year,
                "zone": result[j].zone
            });
            subdistrictSet.push(result[j].district_name);
        }
        Session.set('DistData_ALLProvince', objs_all);
        $("#DistrictSelector").empty();
        $("#DistrictSelector").append("<option value='0'>[เลือกทุกอำเภอ]</option>");
        for (i = 0; i < objs_all.length; i++) {
            if (tes == null || tes != objs_all[i].district_name) {
                tes = objs_all[i].district_name;
                $("#DistrictSelector").append("<option value='" + objs_all[i].district_name + "'>" + objs_all[i].district_name + "</option>");
            }
        }

        //var ID = Session.get('user').ZONE;
        Session.set('skip_pro', 0)
        Session.set('selectedProvinceEva', Session.get('user').PROVINCENAME)
        Session.set('selectedDistrictEva', null)

        Session.set('AmphoeSetbyProvince', subdistrictSet)

        Meteor.call('getSUBDISTRICT', subdistrictSet, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
            Session.set('DistData', result);
            Session.set('getDISTRICT_COUNT', subdistrictSet.length)
        });

    });
})

Template.provinceevaluateltc.helpers({
    page() {
        return parseInt(Session.get('skip_pro') / 10) + 1
    },
    pagecount() {
        return Math.ceil(parseFloat(Session.get('getDISTRICT_COUNT') / 10))
    },
    "getDistDetail"() {
        if (Session.get('DistData'))
            console.log(Session.get('DistData'));
            return Session.get('DistData');
    },
    user() {
        if (Session.get('user')) {
            return Session.get('user').PROVINCENAME
        }
    },
    znum() {
        if (Session.get('user')) {
            return Session.get('user').ZONE
        }
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
        if (Session.get('DistData_ALLProvince')) {
            return Session.get('DistData_ALLProvince').length;
        }
    },
    "getDistDataALL_joinAll"() {
        if (Session.get('DistData_ALLProvince')) {
            var data = Session.get('DistData_ALLProvince');
            
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
        if (Session.get('DistData_ALLProvince')) {
            var data = Session.get('DistData_ALLProvince');
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
        if (Session.get('DistData_ALLProvince')) {
            var data = Session.get('DistData_ALLProvince');
            var count_1 = 0;
            var count_2 = 0;
            for (i = 0; i < data.length; i++) {
                count_1++;
                if (data[i].Evaluate.join) {
                    count_2++;
                }
            }
            var result = (count_2 / count_1) * 100;
            if ((result.toFixed(2) * 100) % 100 == 0) {
                return result;
            } else {
                return result.toFixed(2);
            }
        }
    },
    "getDistDataALL_CriterioTruePerJoin"() {
        if (Session.get('DistData_ALLProvince')) {
            var data = Session.get('DistData_ALLProvince');
            var count_1 = 0;
            var count_2 = 0;
            for (i = 0; i < data.length; i++) {
                if (data[i].Evaluate.join) {
                    count_1++;
                }
                if (data[i].Evaluate.c1 == true && data[i].Evaluate.c2 == true && data[i].Evaluate.c3 == true && data[i].Evaluate.c4 == true && data[i].Evaluate.c4_1 == true && data[i].Evaluate.c4_2 == true && data[i].Evaluate.c4_3 == true && data[i].Evaluate.c4_4 == true) {
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
    "getDistDataALL_CriterioTruePerSubdist"() {
        if (Session.get('DistData_ALLProvince')) {
            var data = Session.get('DistData_ALLProvince');
            var count_1 = 0;
            var count_2 = 0;
            for (i = 0; i < data.length; i++) {
                count_1++;
                if (data[i].Evaluate.c1 == true && data[i].Evaluate.c2 == true && data[i].Evaluate.c3 == true && data[i].Evaluate.c4 == true && data[i].Evaluate.c4_1 == true && data[i].Evaluate.c4_2 == true && data[i].Evaluate.c4_3 == true && data[i].Evaluate.c4_4 == true) {
                    count_2++;
                }
            }
            var result = (count_2 / count_1) * 100;
            if ((result.toFixed(2) * 100) % 100 == 0) {
                return result;
            } else {
                return result.toFixed(2);
            }
        }
    },
})

Template.provinceevaluateltc.events({
    'click #download'() {
        window.location.assign('http://ltc.anamai.moph.go.th/xlsproevaluate/' + Session.get('this_province'));
    },
    "change .passyear"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = '#passyear_' + fullcode;
        var year = $('#passyear_' + fullcode).val() != 'ไม่ระบุ' ? $('#passyear_' + fullcode).val() : null
        Meteor.call('updateDISTRICTbyPassYear', ID, fullcode, year, function (error, result1) {

        })
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
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
        Meteor.call('getDISTRICTbyIdProvince', Session.get('AmphoeSetbyProvince'), function (error, result) {
            Session.set('DistData_ALLProvince', result);
        });
    },
    "change #DistrictSelector"() {
        var data = Session.get('DistDataFULL');
        var tes = null;
        var objs = [];
        var district = $('#DistrictSelector').val() == 0 ? null : $('#DistrictSelector').val();
        Session.set('skip_pro', 0)
        var this_data = [];
        for (i = 0; i < data.length; i++) {
            if (data[i].district_name == district) {
                objs.push({
                    "_id": data[i]._id,
                    "fullcode": data[i].fullcode,
                    "subdistrict_name": data[i].subdistrict_name,
                    "district_code": data[i].district_code,
                    "district_name": data[i].district_name,
                    "join_year": data[i].join_year,
                    "join": data[i].join,
                    "criterio": data[i].criterio,
                    "remark": data[i].remark,
                    "zone": data[i].zone
                });
                this_data[i] = data[i].subdistrict_name;
            }
        }
        // Session.set('AmphoeSetbyProvince',null)
        Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('DistData', result);
        });
        Meteor.call('getSUBDISTRICT_COUNT', this_data, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('getDISTRICT_COUNT', result)
        });
        Session.set('isDistrictSelector', district)
        Session.set('isDistrictFind', null)
    },
    "change .join"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var wait_radio = '#wait_' + fullcode;
        var year = this.join_year;
        var join_radio = '#join_' + fullcode;
        var joinyear_select = '#joinyear_' + fullcode;

        var data;
        if ($(join_radio).is(':checked')) {
            Meteor.call('updateDISTRICTbyJoin', ID, fullcode, true, year, false, function (error, result1) {
            })
        } else {
            var criterio_c1 = 'input[name=' + 'criterio1_' + fullcode; + ']';
            var criterio_c2 = 'input[name=' + 'criterio2_' + fullcode; + ']';
            var criterio_c3 = 'input[name=' + 'criterio3_' + fullcode; + ']';
            var criterio_c4 = 'input[name=' + 'criterio4_' + fullcode; + ']';
            var criterio_c4_1 = 'input[name="criterio_c4_1"]';
            var criterio_c4_2 = 'input[name="criterio_c4_2"]';
            var criterio_c4_3 = 'input[name="criterio_c4_3"]';
            var criterio_c4_4 = 'input[name="criterio_c4_4"]';

            var passyear_select = '#passyear_' + fullcode;
            var remark_ = '#remark_' + fullcode;
            $(join_radio).removeAttr("checked");
            $(joinyear_select).get(0).selectedIndex = 0
            $(passyear_select).get(0).selectedIndex = 0
            $(criterio_c1).removeAttr("checked");
            $(criterio_c2).removeAttr("checked");
            $(criterio_c3).removeAttr("checked");
            $(criterio_c4).removeAttr("checked");
            $(criterio_c4_1).removeAttr("checked");
            $(criterio_c4_2).removeAttr("checked");
            $(criterio_c4_3).removeAttr("checked");
            $(criterio_c4_4).removeAttr("checked");
            $(remark_).val("")
            Meteor.call('clearDISTRICTEva', fullcode, function (err, res) {

            })
        }

        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))

    },
    "change .joinyear"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = '#joinyear_' + fullcode;
        var year = $('#joinyear_' + fullcode).val();
        Meteor.call('getDISTRICTbyId', this.fullcode, function (error, result) {
            var join = result[0].join;
            if (join == true) {
                Meteor.call('updateDISTRICTbyJoinYear', ID, fullcode, year, function (error, result1) {
                    // console.log(year)
                })
            }
        });
        Meteor.call('getDISTRICTbyIdProvince', Session.get('this_province'), function (error, result) {
            Session.set('DistData_ALLProvince', result)
        });
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
    },
    "change .criterio_check1"() {
        Session.set('invokeSession', Math.random())
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio1_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio1', ID, this.fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio1', ID, this.fullcode, false, function (error, result) {
            });
        }

        var this_data = [];
        var district = Session.set('isDistrictSelector')
        Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('DistData', result);
        });

        // Session.set('skip_pro', 0)
        // Session.set('selectedProvinceEva', Session.get('user').PROVINCENAME)
        // Session.set('selectedDistrictEva', null)

        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistData', result);
        // });
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistData', result)
        // })
    },
    "change .criterio_check2"() {
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

        var this_data = [];
        var district = Session.set('isDistrictSelector')
        Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('DistData', result);
        });
        // Session.set('skip_pro', 0)
        // Session.set('selectedProvinceEva', Session.get('user').PROVINCENAME)
        // Session.set('selectedDistrictEva', null)

        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistData', result);
        // });
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
    },
    "change .criterio_check3"() {
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

        var this_data = [];
        var district = Session.set('isDistrictSelector')
        Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('DistData', result);
        });
        // Session.set('skip_pro', 0)
        // Session.set('selectedProvinceEva', Session.get('user').PROVINCENAME)
        // Session.set('selectedDistrictEva', null)

        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistData', result);
        // });
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
    },
    "change .criterio_check4"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio4_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();
        Session.set('setid', ID);
        Session.set('fullcode', fullcode);

        if (criterio == 'true') {
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

        var this_data = [];
        var district = Session.set('isDistrictSelector')
        Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('DistData', result);
        });
        // Session.set('skip_pro', 0)
        // Session.set('selectedProvinceEva', Session.get('user').PROVINCENAME)
        // Session.set('selectedDistrictEva', null)

        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistData', result);
        // });
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
    },
    'change .criterio_check4_CH1'(){
        console.log('A');
        
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

        var this_data = [];
        var district = Session.set('isDistrictSelector')
        Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('DistData', result);
        });
        // Session.set('skip_pro', 0)
        // Session.set('selectedProvinceEva', Session.get('user').PROVINCENAME)
        // Session.set('selectedDistrictEva', null)

        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistData', result);
        // });
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))


    },
    'change .criterio_check4_CH2'(){
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

        var this_data = [];
        var district = Session.set('isDistrictSelector')
        Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('DistData', result);
        });
        // Session.set('skip_pro', 0)
        // Session.set('selectedProvinceEva', Session.get('user').PROVINCENAME)
        // Session.set('selectedDistrictEva', null)

        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistData', result);
        // });
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
    },
    'change .criterio_check4_CH3'(){
        var checkmark3 = $('input[name="criterio4_3"]:checked').val() == 'true' ? true : false
        Session.set('checkmark3', checkmark3)

        Session.set('invokeSession', Math.random())
        var ID = Session.get('setid');
        var fullcode = Session.get('fullcode');
        var criterio = $('input[name="criterio4_3"]:checked').val();
        console.log(criterio);
        
        if (criterio == 'true') {
            Meteor.call('updateCriterio4_3', ID, fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio4_3', ID, fullcode, false, function (error, result) {
            });
        }

        var this_data = [];
        var district = Session.set('isDistrictSelector')
        Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('DistData', result);
        });
        // Session.set('skip_pro', 0)
        // Session.set('selectedProvinceEva', Session.get('user').PROVINCENAME)
        // Session.set('selectedDistrictEva', null)

        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistData', result);
        // });
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
    },
    'change .criterio_check4_CH4'(){
        var checkmark4 = $('input[name="criterio4_4"]:checked').val() == 'true' ? true : false
        Session.set('checkmark4', checkmark4)
        console.log(checkmark4);

        Session.set('invokeSession', Math.random())
        var ID = Session.get('setid');
        var fullcode = Session.get('fullcode');
        var criterio = $('input[name="criterio4_4"]:checked').val();
        console.log(criterio);
        
        if (criterio == 'true') {
            Meteor.call('updateCriterio4_4', ID, fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio4_4', ID, fullcode, false, function (error, result) {
            });
        }
        
        var this_data = [];
        var district = Session.set('isDistrictSelector')
        Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
            Session.set('DistData', result);
        });
        // Session.set('skip_pro', 0)
        // Session.set('selectedProvinceEva', Session.get('user').PROVINCENAME)
        // Session.set('selectedDistrictEva', null)

        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistData', result);
        // });

        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
    },
    "keyup .remark"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var text = $('#remark_' + fullcode).val();
        Meteor.call('updateDISTRICTbyRemark', ID, this.fullcode, text, function (error, result) {
        });
        refreshData(Session.get('isDistrictSelector'), Session.get('isDistrictFind'))
    },
    'click #next': function () {
        var next = parseInt(Session.get('skip_pro') + 10);
        if (next < parseInt(Session.get('getDISTRICT_COUNT'))) {
            Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), next, 10, Session.get('selectedProvinceEva'), Session.get('isDistrictSelector'), function (error, result) {
                Session.set('skip_pro', next);
                Session.set('DistData', result)
            })
        }

    },
    'click #prev': function () {

        if (parseInt(Session.get('skip_pro')) > 0) {
            var next = parseInt(Session.get('skip_pro') - 10);
            Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), next, 10, Session.get('selectedProvinceEva'), Session.get('isDistrictSelector'), function (error, result) {
                Session.set('skip_pro', next);
                Session.set('DistData', result)
            })
        }


    },
    'click #first': function () {
        Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), 0, 10, Session.get('selectedProvinceEva'), Session.get('isDistrictSelector'), function (error, result) {
            Session.set('skip_pro', 0);
            Session.set('DistData', result)
        })


    },
    'click #last': function () {

        var next = Math.ceil(parseFloat(Session.get('getDISTRICT_COUNT') - 10))
        Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), next, 10, Session.get('selectedProvinceEva'), Session.get('isDistrictSelector'), function (error, result) {
            Session.set('skip_pro', next);
            Session.set('DistData', result)
        })


    },
    'change #find'() {
        // var ID = Session.get('user').ZONE;
        Session.set('skip_pro', 0);
        var search = $('#find').val()
        var provinceSet = Session.get('selectedProvinceEva')
        var obj = { p: provinceSet, s: search }
        Meteor.call('SUBDISTRICTSearchEvaLTC', provinceSet, Session.get('skip_pro'), 10, search, function (err, result) {
            Session.set('DistData', result);
            Session.set('skip_pro', 0)
        })
        Meteor.call('SUBDISTRICTSearchEvaLTC_COUNT', provinceSet, search, function (err, result) {
            Session.set('getDISTRICT_COUNT', result)
        })
        Session.set('isDistrictSelector', null)
        Session.set('isDistrictFind', obj)
    },
})

Template.registerHelper('checkCriterio_ltc', function (c1, c2, c3, c4, c4_1, c4_2, c4_3, c4_4) {
    if (c1 && c2 && c3 && c4) {
        console.log(c4_1);
        console.log(c4_2);
        console.log(c4_3);
        console.log(c4_4);
        var checktrue = [c4_1, c4_2, c4_3, c4_4].filter(v => v).length
        console.log(checktrue);
        
        if(checktrue >= 2){
            return Spacebars.SafeString("<label style='color:limegreen;font-weight:bold'>ผ่านเกณฑ์</label>");
        }else{
            return Spacebars.SafeString("<label style='color:red;font-weight:bol'>ไม่ผ่านเกณฑ์</label>");
        }
    } else {
        return Spacebars.SafeString("<label style='color:red;font-weight:bol'>ไม่ผ่านเกณฑ์</label>");
    }
});


function refreshData(isSelected, isFind) {
    if (isSelected) {
        Meteor.call('getSUBDISTRICT', null, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), isSelected, function (error, result) {
            Session.set('DistData', result);
        });
        Meteor.call('getSUBDISTRICT_COUNT', null, Session.get('selectedProvinceEva'), isSelected, function (error, result) {
            Session.set('getDISTRICT_COUNT', result)
        });
        Meteor.call('getDISTRICTbyIdProvince', Session.get('this_province'), function (error, result) {
            Session.set('DistData_ALLProvince', result)
        });
    } else if (isFind) {

        Meteor.call('SUBDISTRICTSearchEvaLTC', isFind.p, Session.set('skip_pro'), 10, isFind.s, function (err, result) {
            Session.set('DistData', result);
            Session.set('skip_pro', 0)
        })
        Meteor.call('SUBDISTRICTSearchEvaLTC_COUNT', isFind.p, isFind.s, function (err, result) {
            Session.set('getDISTRICT_COUNT', result)
        })
        Meteor.call('getDISTRICTbyIdProvince', Session.get('this_province'), function (error, result) {
            Session.set('DistData_ALLProvince', result)
        });
    } else {
        Meteor.call('getSUBDISTRICT', null, Session.get('skip_pro'), 10, Session.get('selectedProvinceEva'), null, function (error, result) {

            Session.set('DistData', result);
        });
        Meteor.call('getDISTRICTbyIdProvince', Session.get('this_province'), function (error, result) {
            Session.set('DistData_ALLProvince', result)
        });
    }

}