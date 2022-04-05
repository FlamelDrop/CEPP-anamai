

// client\Report\reportNumberCMCG\reportprovincenum.js
_ = lodash;
Template.reportprovincenum.onCreated(function () {
    // 2565-03-02 filter suspicious province eg. ศรีษะเกษ
    let zoneID = Session.get('ZoneFindProvinceCMCG');
    Meteor.call('provincesInZone', zoneID, function (err, res) {
        let provincesInZone = res;
        // console.table(provincesInZone);
        Session.set('provincesInZone',provincesInZone);
    });
});
Template.reportprovincenum.onRendered(function () {
    $('.dropdown-submenu a.test').on('click', function (e) {
        $(this).next('ul').toggle();
        e.stopPropagation();
        e.preventDefault();
    });

    //*************************************************************
    Meteor.call('getCMProvinceByZone_HOSP', Session.get('ZoneFindProvinceCMCG'), function (error, result) {
            var newData = [];
            result = _.filter(result, function (num) {
                return num._id.province != '';
            });
            _.each(result, function (x) {
                newData.push({
                    province: x._id.province,
                    num_cm_hosp: parseInt(x.num_cm_hosp),
                    num_cm_dla: 0,
                });
            });
            Session.set('CountProvinceHospCM', newData);
            Meteor.call('getCMProvinceByZone_DLA', Session.get('ZoneFindProvinceCMCG'), function (error, result) {
                    var newData = [];
                    result = _.filter(result, function (num) {
                        return num._id.province != '';
                    });
                    _.each(result, function (x) {
                        newData.push({
                            province: x._id.province,
                            num_cm_dla: parseInt(x.num_cm_dla),
                            num_cm_hosp: 0,
                        });
                    });
                    var f_cmdla = [],
                        f_cmhosp = [],
                        f_cmprovince = [],
                        newArr = [];
                    var arr1 = newData;
                    var arr2 = Session.get('CountProvinceHospCM');
                    // var arr3 = arr2.reduce((arr, e) => {
                    //   arr.push(Object.assign({}, e, arr1.find(a => a.province == e.province)))
                    //   return arr;
                    // }, [])
                    var conarr = _.concat(arr1, arr2);

                    var arr3 = _.chain(conarr).groupBy('province').map(function (value, key) {
                            return {
                                province: key,
                                num_cm_dla: _.reduce(
                                    _.map(value, 'num_cm_dla'),
                                    function (memo, num) {
                                        return (
                                            parseInt(memo) + parseInt(num) || 0
                                        );
                                    },
                                    0
                                ),
                                num_cm_hosp: _.reduce(
                                    _.map(value, 'num_cm_hosp'),
                                    function (memo, num) {
                                        return (
                                            parseInt(memo) + parseInt(num) || 0
                                        );
                                    },
                                    0
                                ),
                            };
                        })
                        .value();
                    _.each(arr3, function (x) {
                        f_cmprovince.push(x.province);
                        f_cmhosp.push(x.num_cm_hosp);
                        f_cmdla.push(x.num_cm_dla);
                        newArr.push({
                            province: x.province,
                            num_cm_hosp: x.num_cm_hosp,
                            num_cm_dla: x.num_cm_dla,
                        });
                    });
                    //-----------------    2565-03-02  --------------------------
                    // remove unwanted province in case of mistake ie ศรีษะเกษ
                    let provincesInZone=Session.get('provincesInZone');
                    provincesInZone.map((item,index,self)=>{
                        let x = newArr.filter(ele => ele.province=== item.name);
                        x = x.pop();
                        self[index]={...item,...x};
                        delete self[index].name;
                    })
                    // console.table(provincesInZone)                    
                    newArr=provincesInZone;
                    // console.table(newArr);
                    f_cmprovince = provincesInZone.map(ele=> ele.province);
                    f_cmhosp = provincesInZone.map(ele=> ele.num_cm_hosp);
                    f_cmdla = provincesInZone.map(ele=> ele.num_cm_dla);
                    //---------------------------------------------------------
                    Session.set('finalCMProvinceRep', newArr);
                    var ctx = document
                        .getElementById('zonecm')
                        .getContext('2d');
                    // f_cmprovince = f_cmprovince.sort()
                    var cdata = {
                        labels: f_cmprovince,
                        datasets: [
                            {
                                label: 'CM หน่วยบริการ',
                                backgroundColor: '#3C9CDC',
                                data: f_cmhosp,
                            },
                            {
                                label: 'CM อปท',
                                backgroundColor: '#2F4F4F',
                                data: f_cmdla,
                            },
                        ],
                    };
                    var myBarChart = new Chart(ctx, {
                        type: 'bar',
                        data: cdata,
                    });

                    Meteor.call('getCGProvinceByZone_HOSP', Session.get('ZoneFindProvinceCMCG'), function (error, result) {
                            var newData = [];
                            result = _.filter(result, function (num) {
                                return num._id.province != '';
                            });
                            _.each(result, function (x) {
                                newData.push({
                                    province: x._id.province,
                                    num_cg_hosp: parseInt(x.num_cg_hosp),
                                    num_cg_dla: 0,
                                });
                            });
                            Session.set('CountProvinceHospCG', newData);

                            Meteor.call('getCGProvinceByZone_DLA', Session.get('ZoneFindProvinceCMCG'), function (error, result) {
                                    var newData = [];
                                    result = _.filter(result, function (num) {
                                        return num._id.province != '';
                                    });
                                    _.each(result, function (x) {
                                        newData.push({
                                            province: x._id.province,
                                            num_cg_hosp: 0,
                                            num_cg_dla: parseInt(x.num_cg_dla),
                                        });
                                    });
                                    var f_cgdla = [],
                                        f_cghosp = [],
                                        f_cgprovince = [],
                                        newArr = [];
                                    var arr1 = newData;
                                    var arr2 = Session.get(
                                        'CountProvinceHospCG'
                                    );
                                    var conarr = _.concat(arr1, arr2);

                                    var arr3 = _.chain(conarr)
                                        .groupBy('province')
                                        .map(function (value, key) {
                                            return {
                                                province: key,
                                                num_cg_dla: _.reduce(
                                                    _.map(value, 'num_cg_dla'),
                                                    function (memo, num) {
                                                        return (
                                                            parseInt(memo) +
                                                                parseInt(num) ||
                                                            0
                                                        );
                                                    },
                                                    0
                                                ),
                                                num_cg_hosp: _.reduce(
                                                    _.map(value, 'num_cg_hosp'),
                                                    function (memo, num) {
                                                        return (
                                                            parseInt(memo) +
                                                                parseInt(num) ||
                                                            0
                                                        );
                                                    },
                                                    0
                                                ),
                                            };
                                        })
                                        .value();

                                    _.each(arr3, function (x) {
                                        f_cgprovince.push(x.province);
                                        f_cghosp.push(x.num_cg_hosp);
                                        f_cgdla.push(x.num_cg_dla);
                                        newArr.push({
                                            province: x.province,
                                            cg_hosp: x.cg_hosp,
                                            num_cg_hosp: x.num_cg_hosp,
                                            cg_dla: x.cg_dla,
                                            num_cg_dla: x.num_cg_dla,
                                        });
                                    });
                                     //-----------------    2565-03-02  --------------------------
                                    // remove unwanted province in case of mistake ie ศรีษะเกษ
                                    let provincesInZone=Session.get('provincesInZone');
                                    provincesInZone.map((item,index,self)=>{
                                        let x = newArr.filter(ele => ele.province=== item.name);
                                        x = x.pop();
                                        self[index]={...item,...x};
                                        delete self[index].name;
                                    })
                                    // console.table(provincesInZone)                    
                                    newArr=provincesInZone;
                                    // console.table(newArr);
                                    f_cgprovince = provincesInZone.map(ele=> ele.province);
                                    f_cghosp = provincesInZone.map(ele=> ele.num_cg_hosp);
                                    f_cgdla = provincesInZone.map(ele=> ele.num_cg_dla);
                                    //---------------------------------------------------------
                                    Session.set('finalCGProvinceRep', newArr);

                                    var ctx = document
                                        .getElementById('zonecg')
                                        .getContext('2d');
                                    var cdata = {
                                        labels: f_cgprovince,
                                        datasets: [
                                            {
                                                label: 'CG หน่วยบริการ',
                                                backgroundColor: '#F98141',
                                                data: f_cghosp,
                                            },
                                            {
                                                label: 'CG อปท',
                                                backgroundColor: '#2F4F4F',
                                                data: f_cgdla,
                                            },
                                        ],
                                    };
                                    var myBarChart = new Chart(ctx, {
                                        type: 'bar',
                                        data: cdata,
                                    });

                                    var totalcm =
                                        Session.get('finalCMProvinceRep');
                                    var totalcg = newArr;
                                    var concatArr = _.concat(totalcm, totalcg);
                                    var output = []; //output array
                                    var temp = {}; //temp object
                                    for (var o of concatArr) {
                                        if (
                                            Object.keys(temp).indexOf(
                                                o.province
                                            ) == -1
                                        ) {
                                            temp[o.province] = {};
                                            o.num_cg_dla
                                                ? (temp[o.province].num_cg_dla =
                                                      o.num_cg_dla)
                                                : (temp[
                                                      o.province
                                                  ].num_cg_dla = 0);
                                            o.num_cg_hosp
                                                ? (temp[
                                                      o.province
                                                  ].num_cg_hosp = o.num_cg_hosp)
                                                : (temp[
                                                      o.province
                                                  ].num_cg_hosp = 0);
                                            o.num_cm_dla
                                                ? (temp[o.province].num_cm_dla =
                                                      o.num_cm_dla)
                                                : (temp[
                                                      o.province
                                                  ].num_cm_dla = 0);
                                            o.num_cm_hosp
                                                ? (temp[
                                                      o.province
                                                  ].num_cm_hosp = o.num_cm_hosp)
                                                : (temp[
                                                      o.province
                                                  ].num_cm_hosp = 0);
                                        } else {
                                            o.num_cg_dla
                                                ? (temp[o.province].num_cg_dla =
                                                      temp[o.province]
                                                          .num_cg_dla +
                                                      o.num_cg_dla)
                                                : temp[o.province].num_cg_dla;
                                            o.num_cg_hosp
                                                ? (temp[
                                                      o.province
                                                  ].num_cg_hosp =
                                                      temp[o.province]
                                                          .num_cg_hosp +
                                                      o.num_cg_hosp)
                                                : temp[o.province].num_cg_hosp;
                                            o.num_cm_dla
                                                ? (temp[o.province].num_cm_dla =
                                                      temp[o.province]
                                                          .num_cm_dla +
                                                      o.num_cm_dla)
                                                : temp[o.province].num_cm_dla;
                                            o.num_cm_hosp
                                                ? (temp[
                                                      o.province
                                                  ].num_cm_hosp =
                                                      temp[o.province]
                                                          .num_cm_hosp +
                                                      o.num_cm_hosp)
                                                : temp[o.province].num_cm_hosp;
                                        }
                                    }
                                    for (var key of Object.keys(temp)) {
                                        output.push({
                                            province: key,
                                            num_cg_dla: temp[key].num_cg_dla,
                                            num_cg_hosp: temp[key].num_cg_hosp,
                                            num_cm_dla: temp[key].num_cm_dla,
                                            num_cm_hosp: temp[key].num_cm_hosp,
                                        });
                                    }

                                    Session.set('finalProvinceNumCmCG', output);
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

Template.reportprovincenum.helpers({
    zonerep1() {
        return Session.get('finalProvinceNumCmCG');
    },
    sumCMCG() {
        var sum = Session.get('finalProvinceNumCmCG');
        var groupData = _.chain(sum)
            .groupBy('sum')
            .map(function (value, key) {
                return {
                    zone: key,
                    num_cm_hosp: _.reduce(
                        _.map(value, 'num_cm_hosp'),
                        function (memo, num) {
                            return parseInt(memo) + parseInt(num) || 0;
                        }
                    ),
                    num_cm_dla: _.reduce(
                        _.map(value, 'num_cm_dla'),
                        function (memo, num) {
                            return parseInt(memo) + parseInt(num) || 0;
                        }
                    ),
                    num_cg_hosp: _.reduce(
                        _.map(value, 'num_cg_hosp'),
                        function (memo, num) {
                            return parseInt(memo) + parseInt(num) || 0;
                        }
                    ),
                    num_cg_dla: _.reduce(
                        _.map(value, 'num_cg_dla'),
                        function (memo, num) {
                            return parseInt(memo) + parseInt(num) || 0;
                        }
                    ),
                };
            })
            .value();
        return groupData;
    },
});

Template.reportprovincenum.events({
    'click #printrep'() {
        Session.set('sendToPrintReport1', Session.get('finalProvinceNumCmCG'));
        Router.go('/printreport');
    },
    'click #viewAmphoe'() {
        var data = this.province;
        Session.set('ZoneFindAmphoeCMCG', data);
        Router.go('/reportprovincenum');
    },
});
