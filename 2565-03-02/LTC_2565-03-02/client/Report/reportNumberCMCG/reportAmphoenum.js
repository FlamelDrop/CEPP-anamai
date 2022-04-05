_ = lodash


Template.reportamphoenum.onRendered(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    clearTimeout(Session.get('PrintTime'))
    //*************************************************************
    Meteor.call('getCMAmphoeByZone_HOSP', Session.get('ZoneFindAmphoeCMCG'), function (error, result) {

        var newData = []
        result = _.filter(result, function (num) { return num._id.amphoe != ""; });
        _.each(result, function (x) {
            newData.push({ amphoe: x._id.amphoe, num_cm_hosp: parseInt(x.num_cm_hosp) ,num_cm_dla:0 })
        })

        Session.set('CountHospCM', newData)
        Meteor.call('getCMAmphoeByZone_DLA', Session.get('ZoneFindAmphoeCMCG'), function (error, result) {
            var newData = []
            result = _.filter(result, function (num) { return num._id.amphoe != ""; });
            _.each(result, function (x) {
                if (x._id.amphoe.includes('อ.'))
                    newData.push({ amphoe: x._id.amphoe.split('อ.')[1], num_cm_dla: parseInt(x.num_cm_dla),num_cm_hosp:0 })
                else
                    newData.push({ amphoe: x._id.amphoe, num_cm_dla: parseInt(x.num_cm_dla),num_cm_hosp:0 })
            })

            var f_cmdla = [], f_cmhosp = [], f_cmamphoe = [], newArr = [];
            var arr1 = newData
            var arr2 = Session.get('CountHospCM')
            // var arr3 = arr2.reduce((arr, e) => {
            //     arr.push(Object.assign({}, e, arr1.find(a => a.amphoe == e.amphoe)))
            //     return arr;
            // }, [])
            var conarr = _.concat(arr1, arr2);

            var arr3 = _.chain(conarr).groupBy('amphoe').map(function (value, key) {
                return {
                    amphoe: key,
                    num_cm_dla: _.reduce(_.map(value, 'num_cm_dla'), function (memo, num) {
                        return parseInt(memo) + parseInt(num) || 0;
                    }, 0),
                    num_cm_hosp: _.reduce(_.map(value, 'num_cm_hosp'), function (memo, num) {
                        return parseInt(memo) + parseInt(num) || 0;
                    }, 0),

                }
            }).value();

            _.each(arr3, function (x) {

                f_cmamphoe.push(x.hasOwnProperty("amphoe") ? x.amphoe : null);
                f_cmhosp.push(x.hasOwnProperty("num_cm_hosp") ? x.num_cm_hosp : 0);
                f_cmdla.push(x.hasOwnProperty("num_cm_dla") ? x.num_cm_dla : 0);
                newArr.push({
                    amphoe: x.hasOwnProperty("amphoe") ? x.amphoe : null,
                    num_cm_hosp: x.hasOwnProperty("num_cm_hosp") ? x.num_cm_hosp : 0,
                    num_cm_dla: x.hasOwnProperty("num_cm_dla") ? x.num_cm_dla : 0
                })
            })
            Session.set('finalCMamphoeRep', newArr)
            var ctx = document.getElementById("zonecm").getContext("2d");
            // f_cmamphoe = f_cmamphoe.sort()
            var cdata = {
                labels: f_cmamphoe,
                datasets: [{
                    label: "CM หน่วยบริการ",
                    backgroundColor: "#3C9CDC",
                    data: f_cmhosp
                }, {
                    label: "CM อปท",
                    backgroundColor: "#2F4F4F",
                    data: f_cmdla
                },]
            };
            var myBarChart = new Chart(ctx, {
                type: 'bar',
                data: cdata
            });

            Meteor.call('getCGAmphoeByZone_HOSP', Session.get('ZoneFindAmphoeCMCG'), function (error, result) {
                var newData = []

                result = _.filter(result, function (num) { return num._id.amphoe != ""; });
                _.each(result, function (x) {
                    newData.push({ amphoe: x._id.amphoe, num_cg_hosp: parseInt(x.num_cg_hosp), num_cg_dla: 0 })
                })

                Session.set('CountHospCG', newData)
                Meteor.call('getCGAmphoeByZone_DLA', Session.get('ZoneFindAmphoeCMCG'), function (error, result) {
                    var newData = []
                    // console.log(result)
                    result = _.filter(result, function (num) { return num._id.amphoe != ""; });
                    _.each(result, function (x) {
                        if (x._id.amphoe.includes('อ.'))
                            newData.push({ amphoe: x._id.amphoe.split('อ.')[1], num_cg_hosp: 0, num_cg_dla: parseInt(x.num_cg_dla) })
                        else
                            newData.push({ amphoe: x._id.ampho, num_cg_hosp: 0, num_cg_dla: parseInt(x.num_cg_dla) })
                    })

                    var g_dla_cg = _.chain(newData).groupBy('amphoe').map(function (value, key) {
                        return {
                            amphoe: key,
                            num_cg_dla: _.reduce(_.map(value, 'num_cg_dla'), function (memo, num) {
                                return parseInt(memo) + parseInt(num) || 0;
                            }),
                            num_cg_hosp: 0
                        }
                    }).value();

                    var conarr = g_dla_cg.concat(Session.get('CountHospCG'))

                    var gnewarr = _.chain(conarr).groupBy('amphoe').map(function (value, key) {
                        return {
                            amphoe: key,
                            num_cg_dla: _.reduce(_.map(value, 'num_cg_dla'), function (memo, num) {
                                return parseInt(memo) + parseInt(num) || 0;
                            }, 0),
                            num_cg_hosp: _.reduce(_.map(value, 'num_cg_hosp'), function (memo, num) {
                                return parseInt(memo) + parseInt(num) || 0;
                            }, 0),

                        }
                    }).value();

                    var f_cgdla = [], f_cghosp = [], f_cgamphoe = [], newArr = [];
                    var arr3 = gnewarr
                    //  console.log(arr3)
                    _.each(arr3, function (x) {

                        f_cgamphoe.push(x.hasOwnProperty("amphoe") ? x.amphoe : null);
                        f_cghosp.push(x.hasOwnProperty("num_cg_hosp") ? x.num_cg_hosp : 0);
                        f_cgdla.push(x.hasOwnProperty("num_cg_dla") ? x.num_cg_dla : 0);
                        newArr.push({
                            amphoe: x.hasOwnProperty("amphoe") ? x.amphoe : null,
                            num_cg_hosp: x.hasOwnProperty("num_cg_hosp") ? x.num_cg_hosp : 0,
                            num_cg_dla: x.hasOwnProperty("num_cg_dla") ? x.num_cg_dla : 0
                        })
                    })
                    Session.set('finalCGamphoeRep', newArr)
                    //console.log(newArr)
                    var ctx = document.getElementById("zonecg").getContext("2d");
                    var cdata = {
                        labels: f_cgamphoe,
                        datasets: [{
                            label: "CG หน่วยบริการ",
                            backgroundColor: "#F98141",
                            data: f_cghosp
                        }, {
                            label: "CG อปท",
                            backgroundColor: "#2F4F4F",
                            data: f_cgdla
                        },]
                    };
                    var myBarChart = new Chart(ctx, {
                        type: 'bar',
                        data: cdata
                    });

                    var final = []
                    var totalcm = Session.get('finalCMamphoeRep')
                    var totalcg = newArr
                    var concatArr = _.concat(totalcm, totalcg)
                    var output = [];//output array
                    var temp = {};//temp object
                    for (var o of concatArr) {
                        if (Object.keys(temp).indexOf(o.amphoe) == -1) {
                            temp[o.amphoe] = {}
                            o.num_cg_dla ? temp[o.amphoe].num_cg_dla = o.num_cg_dla : temp[o.amphoe].num_cg_dla = 0
                            o.num_cg_hosp ? temp[o.amphoe].num_cg_hosp = o.num_cg_hosp : temp[o.amphoe].num_cg_hosp = 0
                            o.num_cm_dla ? temp[o.amphoe].num_cm_dla = o.num_cm_dla : temp[o.amphoe].num_cm_dla = 0
                            o.num_cm_hosp ? temp[o.amphoe].num_cm_hosp = o.num_cm_hosp : temp[o.amphoe].num_cm_hosp = 0
                        } else {
                            o.num_cg_dla ? temp[o.amphoe].num_cg_dla = temp[o.amphoe].num_cg_dla + o.num_cg_dla : temp[o.amphoe].num_cg_dla
                            o.num_cg_hosp ? temp[o.amphoe].num_cg_hosp = temp[o.amphoe].num_cg_hosp + o.num_cg_hosp : temp[o.amphoe].num_cg_hosp
                            o.num_cm_dla ? temp[o.amphoe].num_cm_dla = temp[o.amphoe].num_cm_dla + o.num_cm_dla : temp[o.amphoe].num_cm_dla
                            o.num_cm_hosp ? temp[o.amphoe].num_cm_hosp = temp[o.amphoe].num_cm_hosp + o.num_cm_hosp : temp[o.amphoe].num_cm_hosp
                        }
                    }
                    for (var key of Object.keys(temp)) {
                        output.push({
                            amphoe: key,
                            num_cg_dla: temp[key].num_cg_dla,
                            num_cg_hosp: temp[key].num_cg_hosp,
                            num_cm_dla: temp[key].num_cm_dla,
                            num_cm_hosp: temp[key].num_cm_hosp
                        })
                    }
                    _.each(output, function (x) {
                        final.push({
                            sum: "sum",
                            amphoe: x.hasOwnProperty("amphoe") ? x.amphoe : null,
                            num_cm_hosp: x.hasOwnProperty("num_cm_hosp") ? x.num_cm_hosp : 0,
                            num_cm_dla: x.hasOwnProperty("num_cm_dla") ? x.num_cm_dla : 0,
                            num_cg_hosp: x.hasOwnProperty("num_cg_hosp") ? x.num_cg_hosp : 0,
                            num_cg_dla: x.hasOwnProperty("num_cg_dla") ? x.num_cg_dla : 0,
                        })
                    })
                    Session.set('finalamphoeNumCmCG', final)

                });

            });


        });





    });


});

Template.reportamphoenum.helpers({
    zonerep1() {
        return Session.get('finalamphoeNumCmCG').sort();
    },
    sumCMCG() {
        var sum = Session.get('finalamphoeNumCmCG')

        var groupData = _.chain(sum).groupBy('sum').map(function (value, key) {
            return {
                zone: key,
                num_cm_hosp: _.reduce(_.map(value, 'num_cm_hosp'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                num_cm_dla: _.reduce(_.map(value, 'num_cm_dla'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                num_cg_hosp: _.reduce(_.map(value, 'num_cg_hosp'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
                num_cg_dla: _.reduce(_.map(value, 'num_cg_dla'), function (memo, num) {
                    return parseInt(memo) + parseInt(num) || 0;
                }),
            }
        }).value();
        //  console.log(sum)
        return groupData
    },
    province() {
        return Session.get('ZoneFindAmphoeCMCG')
    }
});

Template.reportamphoenum.events({
    'click #printrep'() {
        Session.set('sendToNumAmphoeReport', Session.get('finalamphoeNumCmCG'))
        Router.go('/printamphoenum')
    },
    'click #viewTambon'() {
        var data = this.amphoe
        Session.set('ZoneFindTambonCMCG', data);
        Router.go('/reportamphoenum')
    },
})


