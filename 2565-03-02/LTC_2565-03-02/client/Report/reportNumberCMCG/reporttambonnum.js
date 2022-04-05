_ = lodash


Template.reporttambonnum.onRendered(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    clearTimeout(Session.get('PrintTimeTambon'))
    //*************************************************************
    Meteor.call('getCMTambonByZone_HOSP', Session.get('ZoneFindTambonCMCG'), function (error, result) {

        var newData = []
        result = _.filter(result, function (num) { return num._id.tambon != ""; });
        _.each(result, function (x) {
            newData.push({ tambon: x._id.tambon, num_cm_hosp: parseInt(x.num_cm_hosp), num_cm_dla: 0 })
        })

        Session.set('CountHospCMTambon', newData)
        Meteor.call('getCMTambonByZone_DLA', Session.get('ZoneFindTambonCMCG'), function (error, result) {
            var newData = []
            result = _.filter(result, function (num) { return num._id.tambon != ""; });
            _.each(result, function (x) {

                newData.push({ tambon: x._id.tambon, num_cm_dla: parseInt(x.num_cm_dla), num_cm_hosp: 0 })
            })

            var f_cmdla = [], f_cmhosp = [], f_cmtambon = [], newArr = [];
            // var arr1 = newData
            // var arr2 = Session.get('CountHospCMTambon')
            // var arr3 = arr2.reduce((arr, e) => {
            //     arr.push(Object.assign({}, e, arr1.find(a => a.tambon == e.tambon)))
            //     return arr;
            // }, [])
            var conarr = _.concat(Session.get('CountHospCMTambon'), newData);

            var arr3 = _.chain(conarr).groupBy('tambon').map(function (value, key) {
                return {
                    tambon: key,
                    num_cm_dla: _.reduce(_.map(value, 'num_cm_dla'), function (memo, num) {
                        return parseInt(memo) + parseInt(num) || 0;
                    }, 0),
                    num_cm_hosp: _.reduce(_.map(value, 'num_cm_hosp'), function (memo, num) {
                        return parseInt(memo) + parseInt(num) || 0;
                    }, 0),

                }
            }).value();

            _.each(arr3, function (x) {

                f_cmtambon.push(x.hasOwnProperty("tambon") ? x.tambon : null);
                f_cmhosp.push(x.hasOwnProperty("num_cm_hosp") ? x.num_cm_hosp : 0);
                f_cmdla.push(x.hasOwnProperty("num_cm_dla") ? x.num_cm_dla : 0);
                newArr.push({
                    tambon: x.hasOwnProperty("tambon") ? x.tambon : null,
                    num_cm_hosp: x.hasOwnProperty("num_cm_hosp") ? x.num_cm_hosp : 0,
                    num_cm_dla: x.hasOwnProperty("num_cm_dla") ? x.num_cm_dla : 0
                })
            })
            Session.set('finalCMtambonRep', newArr)
            var ctx = document.getElementById("zonecm").getContext("2d");
            // f_cmtambon = f_cmtambon.sort()
            var cdata = {
                labels: f_cmtambon,
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

            Meteor.call('getCGTambonByZone_HOSP', Session.get('ZoneFindTambonCMCG'), function (error, result) {
                var newData = []

                result = _.filter(result, function (num) { return num._id.tambon != ""; });
                _.each(result, function (x) {
                    newData.push({ tambon: x._id.tambon, num_cg_hosp: parseInt(x.num_cg_hosp), num_cg_dla: 0 })
                })
                Session.set('CountHospCGTambon', newData)
                Meteor.call('getCGTambonByZone_DLA', Session.get('ZoneFindTambonCMCG'), function (error, result) {
                    var newData = []
                    // console.log(result)
                    result = _.filter(result, function (num) { return num._id.tambon != ""; });
                    _.each(result, function (x) {

                        newData.push({ tambon: x._id.tambon, num_cg_hosp: 0, num_cg_dla: parseInt(x.num_cg_dla) })
                    })

                    var g_dla_cg = _.chain(newData).groupBy('tambon').map(function (value, key) {
                        return {
                            tambon: key,
                            num_cg_dla: _.reduce(_.map(value, 'num_cg_dla'), function (memo, num) {
                                return parseInt(memo) + parseInt(num) || 0;
                            }),
                            num_cg_hosp: 0
                        }
                    }).value();

                    var conarr = _.concat(Session.get('CountHospCGTambon'), g_dla_cg);

                    var gnewarr = _.chain(conarr).groupBy('tambon').map(function (value, key) {
                        return {
                            tambon: key,
                            num_cg_dla: _.reduce(_.map(value, 'num_cg_dla'), function (memo, num) {
                                return parseInt(memo) + parseInt(num) || 0;
                            }, 0),
                            num_cg_hosp: _.reduce(_.map(value, 'num_cg_hosp'), function (memo, num) {
                                return parseInt(memo) + parseInt(num) || 0;
                            }, 0),

                        }
                    }).value();

                    var f_cgdla = [], f_cghosp = [], f_cgtambon = [], newArr = [];
                    var arr3 = gnewarr
                    //  console.log(arr3)
                    _.each(arr3, function (x) {

                        f_cgtambon.push(x.hasOwnProperty("tambon") ? x.tambon : null);
                        f_cghosp.push(x.hasOwnProperty("num_cg_hosp") ? x.num_cg_hosp : 0);
                        f_cgdla.push(x.hasOwnProperty("num_cg_dla") ? x.num_cg_dla : 0);
                        newArr.push({
                            tambon: x.hasOwnProperty("tambon") ? x.tambon : null,
                            num_cg_hosp: x.hasOwnProperty("num_cg_hosp") ? x.num_cg_hosp : 0,
                            num_cg_dla: x.hasOwnProperty("num_cg_dla") ? x.num_cg_dla : 0
                        })
                    })
                    Session.set('finalCGtambonRep', newArr)
                    //console.log(newArr)
                    var ctx = document.getElementById("zonecg").getContext("2d");
                    var cdata = {
                        labels: f_cgtambon,
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
                    var totalcm = Session.get('finalCMtambonRep')
                    var totalcg = newArr
                    var concatArr = _.concat(totalcm, totalcg)
                    var output = [];//output array
                    var temp = {};//temp object
                    for (var o of concatArr) {
                        if (Object.keys(temp).indexOf(o.tambon) == -1) {
                            temp[o.tambon] = {}
                            o.num_cg_dla ? temp[o.tambon].num_cg_dla = o.num_cg_dla : temp[o.tambon].num_cg_dla = 0
                            o.num_cg_hosp ? temp[o.tambon].num_cg_hosp = o.num_cg_hosp : temp[o.tambon].num_cg_hosp = 0
                            o.num_cm_dla ? temp[o.tambon].num_cm_dla = o.num_cm_dla : temp[o.tambon].num_cm_dla = 0
                            o.num_cm_hosp ? temp[o.tambon].num_cm_hosp = o.num_cm_hosp : temp[o.tambon].num_cm_hosp = 0
                        } else {
                            o.num_cg_dla ? temp[o.tambon].num_cg_dla = temp[o.tambon].num_cg_dla + o.num_cg_dla : temp[o.tambon].num_cg_dla
                            o.num_cg_hosp ? temp[o.tambon].num_cg_hosp = temp[o.tambon].num_cg_hosp + o.num_cg_hosp : temp[o.tambon].num_cg_hosp
                            o.num_cm_dla ? temp[o.tambon].num_cm_dla = temp[o.tambon].num_cm_dla + o.num_cm_dla : temp[o.tambon].num_cm_dla
                            o.num_cm_hosp ? temp[o.tambon].num_cm_hosp = temp[o.tambon].num_cm_hosp + o.num_cm_hosp : temp[o.tambon].num_cm_hosp
                        }
                    }
                    for (var key of Object.keys(temp)) {
                        output.push({
                            tambon: key,
                            num_cg_dla: temp[key].num_cg_dla,
                            num_cg_hosp: temp[key].num_cg_hosp,
                            num_cm_dla: temp[key].num_cm_dla,
                            num_cm_hosp: temp[key].num_cm_hosp
                        })
                    }

                    _.each(output, function (x) {
                        final.push({
                            sum: "sum",
                            tambon: x.hasOwnProperty("tambon") ? x.tambon : null,
                            num_cm_hosp: x.hasOwnProperty("num_cm_hosp") ? x.num_cm_hosp : 0,
                            num_cm_dla: x.hasOwnProperty("num_cm_dla") ? x.num_cm_dla : 0,
                            num_cg_hosp: x.hasOwnProperty("num_cg_hosp") ? x.num_cg_hosp : 0,
                            num_cg_dla: x.hasOwnProperty("num_cg_dla") ? x.num_cg_dla : 0,
                        })
                    })
                    Session.set('finaltambonNumCmCG', final)

                });

            });


        });





    });


});

Template.reporttambonnum.helpers({
    zonerep1() {
        return Session.get('finaltambonNumCmCG').sort();
    },
    sumCMCG() {
        var sum = Session.get('finaltambonNumCmCG')

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
        return Session.get('ZoneFindTambonCMCG')
    }
});

Template.reporttambonnum.events({
    'click #printrep'() {
        Session.set('sendToNumTambonReport', Session.get('finaltambonNumCmCG'))
        Router.go('/printtambonnum')
    },
    'click #viewTambon'() {
        var data = this.tambon
        Session.set('ZoneFindHospCMCG', data);
        Router.go('/reporthospnum')
    },
})


