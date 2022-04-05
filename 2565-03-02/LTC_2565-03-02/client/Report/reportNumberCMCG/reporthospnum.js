_ = lodash


Template.reporthospnum.onRendered(function () {
    $('.dropdown-submenu a.test').on("click", function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    clearTimeout(Session.get('PrintTimeTambon'))
    //*************************************************************
   
    Meteor.call('getCMHospByZone_HOSP', Session.get('ZoneFindTambonCMCG'),Session.get('ZoneFindHospCMCG'), function (error, result) {
       
        var newData = []
        result = _.filter(result, function (num) { return num._id.hospname != ""; });
        _.each(result, function (x) {
            newData.push({ hospname: x._id.hospname, num_cm_hosp: parseInt(x.num_cm_hosp), num_cm_dla: 0 })
        })

        Session.set('CountHospCMTambon', newData)
        Meteor.call('getCMHospByZone_DLA', Session.get('ZoneFindTambonCMCG'),Session.get('ZoneFindHospCMCG'), function (error, result) {
           
            var newData = []
            result = _.filter(result, function (num) { return num._id.hospname != ""; });
            _.each(result, function (x) {

                newData.push({ hospname: x._id.hospname, num_cm_dla: parseInt(x.num_cm_dla), num_cm_hosp: 0 })
            })

            var f_cmdla = [], f_cmhosp = [], f_cmtambon = [], newArr = [];
            // var arr1 = newData
            // var arr2 = Session.get('CountHospCMTambon')
            // var arr3 = arr2.reduce((arr, e) => {
            //     arr.push(Object.assign({}, e, arr1.find(a => a.hospname == e.hospname)))
            //     return arr;
            // }, [])
            var conarr = _.concat(Session.get('CountHospCMTambon'), newData);

            var arr3 = _.chain(conarr).groupBy('hospname').map(function (value, key) {
                return {
                    hospname: key,
                    num_cm_dla: _.reduce(_.map(value, 'num_cm_dla'), function (memo, num) {
                        return parseInt(memo) + parseInt(num) || 0;
                    }, 0),
                    num_cm_hosp: _.reduce(_.map(value, 'num_cm_hosp'), function (memo, num) {
                        return parseInt(memo) + parseInt(num) || 0;
                    }, 0),

                }
            }).value();

            _.each(arr3, function (x) {

                f_cmtambon.push(x.hasOwnProperty("hospname") ? x.hospname : null);
                f_cmhosp.push(x.hasOwnProperty("num_cm_hosp") ? x.num_cm_hosp : 0);
                f_cmdla.push(x.hasOwnProperty("num_cm_dla") ? x.num_cm_dla : 0);
                newArr.push({
                    hospname: x.hasOwnProperty("hospname") ? x.hospname : null,
                    num_cm_hosp: x.hasOwnProperty("num_cm_hosp") ? x.num_cm_hosp : 0,
                    num_cm_dla: x.hasOwnProperty("num_cm_dla") ? x.num_cm_dla : 0
                })
            })
            Session.set('finalCMHospRep', newArr)
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

            Meteor.call('getCGHospByZone_HOSP', Session.get('ZoneFindTambonCMCG'),Session.get('ZoneFindHospCMCG'), function (error, result) {
                var newData = []

                result = _.filter(result, function (num) { return num._id.hospname != ""; });
                _.each(result, function (x) {
                    newData.push({ hospname: x._id.hospname, num_cg_hosp: parseInt(x.num_cg_hosp), num_cg_dla: 0 })
                })
                Session.set('CountHospCGTambon', newData)
                Meteor.call('getCGHospByZone_DLA', Session.get('ZoneFindTambonCMCG'),Session.get('ZoneFindHospCMCG'), function (error, result) {
                    var newData = []
                    // console.log(result)
                    result = _.filter(result, function (num) { return num._id.hospname != ""; });
                    _.each(result, function (x) {

                        newData.push({ hospname: x._id.hospname, num_cg_hosp: 0, num_cg_dla: parseInt(x.num_cg_dla) })
                    })

                    var g_dla_cg = _.chain(newData).groupBy('hospname').map(function (value, key) {
                        return {
                            hospname: key,
                            num_cg_dla: _.reduce(_.map(value, 'num_cg_dla'), function (memo, num) {
                                return parseInt(memo) + parseInt(num) || 0;
                            }),
                            num_cg_hosp: 0
                        }
                    }).value();

                    var conarr = _.concat(Session.get('CountHospCGTambon'), g_dla_cg);

                    var gnewarr = _.chain(conarr).groupBy('hospname').map(function (value, key) {
                        return {
                            hospname: key,
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

                        f_cgtambon.push(x.hasOwnProperty("hospname") ? x.hospname : null);
                        f_cghosp.push(x.hasOwnProperty("num_cg_hosp") ? x.num_cg_hosp : 0);
                        f_cgdla.push(x.hasOwnProperty("num_cg_dla") ? x.num_cg_dla : 0);
                        newArr.push({
                            hospname: x.hasOwnProperty("hospname") ? x.hospname : null,
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
                    var totalcm = Session.get('finalCMHospRep')
                    var totalcg = newArr
                    var concatArr = _.concat(totalcm, totalcg)
                    var output = [];//output array
                    var temp = {};//temp object
                    for (var o of concatArr) {
                        if (Object.keys(temp).indexOf(o.hospname) == -1) {
                            temp[o.hospname] = {}
                            o.num_cg_dla ? temp[o.hospname].num_cg_dla = o.num_cg_dla : temp[o.hospname].num_cg_dla = 0
                            o.num_cg_hosp ? temp[o.hospname].num_cg_hosp = o.num_cg_hosp : temp[o.hospname].num_cg_hosp = 0
                            o.num_cm_dla ? temp[o.hospname].num_cm_dla = o.num_cm_dla : temp[o.hospname].num_cm_dla = 0
                            o.num_cm_hosp ? temp[o.hospname].num_cm_hosp = o.num_cm_hosp : temp[o.hospname].num_cm_hosp = 0
                        } else {
                            o.num_cg_dla ? temp[o.hospname].num_cg_dla = temp[o.hospname].num_cg_dla + o.num_cg_dla : temp[o.hospname].num_cg_dla
                            o.num_cg_hosp ? temp[o.hospname].num_cg_hosp = temp[o.hospname].num_cg_hosp + o.num_cg_hosp : temp[o.hospname].num_cg_hosp
                            o.num_cm_dla ? temp[o.hospname].num_cm_dla = temp[o.hospname].num_cm_dla + o.num_cm_dla : temp[o.hospname].num_cm_dla
                            o.num_cm_hosp ? temp[o.hospname].num_cm_hosp = temp[o.hospname].num_cm_hosp + o.num_cm_hosp : temp[o.hospname].num_cm_hosp
                        }
                    }
                    for (var key of Object.keys(temp)) {
                        output.push({
                            hospname: key,
                            num_cg_dla: temp[key].num_cg_dla,
                            num_cg_hosp: temp[key].num_cg_hosp,
                            num_cm_dla: temp[key].num_cm_dla,
                            num_cm_hosp: temp[key].num_cm_hosp
                        })
                    }

                    _.each(output, function (x) {
                        final.push({
                            sum: "sum",
                            hospname: x.hasOwnProperty("hospname") ? x.hospname : null,
                            num_cm_hosp: x.hasOwnProperty("num_cm_hosp") ? x.num_cm_hosp : 0,
                            num_cm_dla: x.hasOwnProperty("num_cm_dla") ? x.num_cm_dla : 0,
                            num_cg_hosp: x.hasOwnProperty("num_cg_hosp") ? x.num_cg_hosp : 0,
                            num_cg_dla: x.hasOwnProperty("num_cg_dla") ? x.num_cg_dla : 0,
                        })
                    })
                    Session.set('finalHospNumCmCG', final)

                });

            });


        });





    });


});

Template.reporthospnum.helpers({
    zonerep1() {
        return Session.get('finalHospNumCmCG').sort();
    },
    sumCMCG() {
        var sum = Session.get('finalHospNumCmCG')

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
        return Session.get('ZoneFindHospCMCG')
    }
});

Template.reporthospnum.events({
    'click #printrep'() {
        Session.set('sendToNumHospReport', Session.get('finalHospNumCmCG'))
        Router.go('/printHospnum')
    },
    // 'click #viewTambon'() {
    //     var data = this.hospname
    //     Session.set('ZoneFindTambonCMCG', data);
    //     Router.go('/reporthospnum')
    // },
})


