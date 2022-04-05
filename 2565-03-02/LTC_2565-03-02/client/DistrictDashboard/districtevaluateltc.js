

Template.districtevaluateltc.onRendered(function () {
    var subdistrictSet = [];
    Session.set('evadis_this_province', Session.get('user').PROVINCE)
    Session.set('this_district', Session.get('user').DISTRICT)
    Session.set('isDistrictFind', null)
    Meteor.call('getSUBDISTRICTbyIdDISTRICT', Session.get('evadis_this_province'), Session.get('this_district'), function (error, result) {

        Session.set('DistEvaData', null);
        var objs_all = [];


        Session.set('DistData_ALLProvince', result);
        // $("#DistrictSelector").empty();
        // $("#DistrictSelector").append("<option value='0'>[เลือกทุกอำเภอ]</option>");
        // for (i = 0; i < objs_all.length; i++) {
        //     if (tes == null || tes != objs_all[i].district_name) {
        //         tes = objs_all[i].district_name;
        //         $("#DistrictSelector").append("<option value='" + objs_all[i].district_name + "'>" + objs_all[i].district_name + "</option>");
        //     }
        // }

        //var ID = Session.get('user').ZONE;
        Session.set('skip_district', 0)
        Session.set('selectedProvinceEva', Session.get('user').PROVINCE)
        Session.set('selectedDistrictEva', Session.get('user').DISTRICT)

        Session.set('AmphoeSetbyProvince', subdistrictSet)

        Meteor.call('getSUBDISTRICT', subdistrictSet, Session.get('skip_district'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
            Session.set('DistEvaData', result);
            Session.set('getEvaDISTRICT_COUNT', subdistrictSet.length)
        });

    });
})

Template.districtevaluateltc.helpers({
    page() {
        return parseInt(Session.get('skip_district') / 10) + 1
    },
    pagecount() {

        return Math.ceil(parseFloat(Session.get('getEvaDISTRICT_COUNT') / 10))


    },
    "getDistDetail"() {
        if (Session.get('DistEvaData'))
            return Session.get('DistEvaData');
    },
    user() {
        if (Session.get('user')) {
            return Session.get('user').NAME
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
                if (data[i].Evaluate.join == true) {
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
                if (data[i].Evaluate.c1 == true && data[i].Evaluate.c2 == true && data[i].Evaluate.c3 == true && data[i].Evaluate.c4 == true ) {
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
                if (data[i].Evaluate.join == true) {
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
                if (data[i].Evaluate.join == true) {
                    count_1++;
                }
                if (data[i].Evaluate.c1 == true && data[i].Evaluate.c2 == true && data[i].Evaluate.c3 == true && data[i].Evaluate.c4 == true) {
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
                if (data[i].Evaluate.c1 == true && data[i].Evaluate.c2 == true && data[i].Evaluate.c3 == true && data[i].Evaluate.c4 == true) {
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

Template.districtevaluateltc.events({
    'click #download'() {
        window.location.assign('http://ltc.anamai.moph.go.th/xlsdisevaluate/' + Session.get('evadis_this_province') + '/' + Session.get('this_district'));
    },
    "change .passyear"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = '#passyear_' + fullcode;
        var year = $('#passyear_' + fullcode).val() != 'ไม่ระบุ' ? $('#passyear_' + fullcode).val() : null
        Meteor.call('updateDISTRICTbyPassYear', ID, fullcode, year, function (error, result1) {

        })
        refreshData(false, Session.get('isDistrictFind'))
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
    // "change #DistrictSelector"() {
    //     var data = Session.get('DistEvaDataFULL');
    //     var tes = null;
    //     var objs = [];
    //     var district = $('#DistrictSelector').val() == 0 ? null : $('#DistrictSelector').val();
    //     Session.set('skip_district', 0)
    //     var this_data = [];
    //     for (i = 0; i < data.length; i++) {
    //         if (data[i].district_name == district) {
    //             objs.push({
    //                 "_id": data[i]._id,
    //                 "fullcode": data[i].fullcode,
    //                 "subdistrict_name": data[i].subdistrict_name,
    //                 "district_code": data[i].district_code,
    //                 "district_name": data[i].district_name,
    //                 "join_year": data[i].join_year,
    //                 "join": data[i].join,
    //                 "criterio": data[i].criterio,
    //                 "remark": data[i].remark,
    //                 "zone": data[i].zone
    //             });
    //             this_data[i] = data[i].subdistrict_name;
    //         }
    //     }
    //     // Session.set('AmphoeSetbyProvince',null)
    //     Meteor.call('getSUBDISTRICT', this_data, Session.get('skip_district'), 10, Session.get('selectedProvinceEva'), district, function (error, result) {
    //         Session.set('DistEvaData', result);
    //     });
    //     Meteor.call('getSUBDISTRICT_COUNT', this_data, Session.get('selectedProvinceEva'), district, function (error, result) {
    //         Session.set('getEvaDISTRICT_COUNT', result)
    //     });
    //     Session.set('isDistrictSelector', district)
    //     Session.set('isDistrictFind', null)
    // },

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
            Meteor.call('clearDISTRICTEva', fullcode, function (err, res) {

            })
        }

        refreshData(false, Session.get('isDistrictFind'))

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
        Meteor.call('getSUBDISTRICTbyIdDISTRICT', Session.get('evadis_this_province'), Session.get('this_district'), function (error, result) {
            Session.set('DistData_ALLProvince', result)
        });
        refreshData(false, Session.get('isDistrictFind'))
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
        refreshData(false, Session.get('isDistrictFind'))
        // Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), Session.get('skip_district'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
        //     Session.set('DistEvaData', result)
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
        refreshData(false, Session.get('isDistrictFind'))
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
        refreshData(false, Session.get('isDistrictFind'))
    },
    "change .criterio_check4"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var name = 'criterio4_' + fullcode;
        var criterio = $('input[name=' + name + ']:checked').val();

        if (criterio == 'true') {
            Meteor.call('updateCriterio4', ID, this.fullcode, true, function (error, result) {
            });
        } else {
            Meteor.call('updateCriterio4', ID, this.fullcode, false, function (error, result) {
            });
        }
        refreshData(false, Session.get('isDistrictFind'))
    },

    "keyup .remark"() {
        var ID = this._id;
        var fullcode = this.fullcode;
        var text = $('#remark_' + fullcode).val();
        Meteor.call('updateDISTRICTbyRemark', ID, this.fullcode, text, function (error, result) {
        });
        refreshData(false, Session.get('isDistrictFind'))
    },

    'click #next': function () {
        var next = parseInt(Session.get('skip_district') + 10);
        if (next < parseInt(Session.get('getEvaDISTRICT_COUNT'))) {
            Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), next, 10, Session.get('selectedProvinceEva'), Session.get('isDistrictSelector'), function (error, result) {
                Session.set('skip_district', next);
                Session.set('DistEvaData', result)
            })
        }

    },
    'click #prev': function () {

        if (parseInt(Session.get('skip_district')) > 0) {
            var next = parseInt(Session.get('skip_district') - 10);
            Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), next, 10, Session.get('selectedProvinceEva'), Session.get('isDistrictSelector'), function (error, result) {
                Session.set('skip_district', next);
                Session.set('DistEvaData', result)
            })
        }


    },
    'click #first': function () {
        Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), 0, 10, Session.get('selectedProvinceEva'), Session.get('isDistrictSelector'), function (error, result) {
            Session.set('skip_district', 0);
            Session.set('DistEvaData', result)
        })


    },
    'click #last': function () {

        var next = Math.ceil(parseFloat(Session.get('getEvaDISTRICT_COUNT') - 10))
        Meteor.call('getSUBDISTRICT', Session.get('AmphoeSetbyProvince'), next, 10, Session.get('selectedProvinceEva'), Session.get('isDistrictSelector'), function (error, result) {
            Session.set('skip_district', next);
            Session.set('DistEvaData', result)
        })


    },
    'change #find'() {
        // var ID = Session.get('user').ZONE;
        Session.set('skip_district', 0);
        var search = $('#find').val()
        var provinceSet = Session.get('selectedProvinceEva')
        var district = Session.get('selectedDistrictEva')
        var obj = { p: provinceSet, d: district, s: search }
        Meteor.call('DISTRICTSearchEvaLTC', provinceSet, district, Session.get('skip_district'), 10, search, function (err, result) {
            Session.set('DistEvaData', result);
            Session.set('skip_district', 0)
        })
        Meteor.call('DISTRICTSearchEvaLTC_COUNT', provinceSet, district, search, function (err, result) {
            // console.log(result)
            Session.set('getEvaDISTRICT_COUNT', result)
        })
        Session.set('isDistrictSelector', null)
        Session.set('isDistrictFind', obj)
    },
})


function refreshData(isSelected, isFind) {
    if (isSelected) {
        Meteor.call('getSUBDISTRICT', null, Session.get('skip_district'), 10, Session.get('selectedProvinceEva'), isSelected, function (error, result) {

            Session.set('DistEvaData', result);
        });
        Meteor.call('getSUBDISTRICT_COUNT', null, Session.get('selectedProvinceEva'), isSelected, function (error, result) {
            Session.set('getEvaDISTRICT_COUNT', result)
        });
        Meteor.call('getSUBDISTRICTbyIdDISTRICT', Session.get('evadis_this_province'), Session.get('this_district'), function (error, result) {
            Session.set('DistData_ALLProvince', result)
        });
    } else if (isFind) {

        Meteor.call('DISTRICTSearchEvaLTC', isFind.p, isFind.d, Session.set('skip_district'), 10, isFind.s, function (err, result) {
            Session.set('DistEvaData', result);
            Session.set('skip_district', 0)
        })
        Meteor.call('DISTRICTSearchEvaLTC_COUNT', isFind.p, isFind.d, isFind.s, function (err, result) {
            Session.set('getEvaDISTRICT_COUNT', result)
        })
        Meteor.call('getSUBDISTRICTbyIdDISTRICT', Session.get('evadis_this_province'), Session.get('this_district'), function (error, result) {
            Session.set('DistData_ALLProvince', result)
        });
    } else {

        Meteor.call('getSUBDISTRICT', null, Session.get('skip_district'), 10, Session.get('selectedProvinceEva'), Session.get('selectedDistrictEva'), function (error, result) {
            Session.set('DistEvaData', result);
        });
        Meteor.call('getSUBDISTRICTbyIdDISTRICT', Session.get('evadis_this_province'), Session.get('this_district'), function (error, result) {
            Session.set('DistData_ALLProvince', result)
        });
    }

}